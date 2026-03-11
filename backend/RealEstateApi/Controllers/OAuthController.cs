using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.Models;
using System.Net;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OAuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public OAuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpGet("connect/{provider}")]
    public IActionResult Connect(string provider)
    {
        var brokerId = User.Identity?.Name ?? "test-broker";
        // In a real app, 'state' should be a cryptographically secure random string stored in a session/cache.
        // For this demo, we'll use a simple base64 of the brokerId to simulate the link.
        var state = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(brokerId));

        var redirectUri = Url.Action(nameof(Callback), "OAuth", new { provider }, Request.Scheme);
        string url = "";

        if (provider.ToLower() == "google")
        {
            var clientId = _config["Google:ClientId"];
            url = $"https://accounts.google.com/o/oauth2/v2/auth?client_id={clientId}&redirect_uri={WebUtility.UrlEncode(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/gmail.send%20email%20openid&access_type=offline&prompt=consent&state={state}";
        }
        else if (provider.ToLower() == "microsoft")
        {
            var clientId = _config["Microsoft:ClientId"];
            url = $"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&redirect_uri={WebUtility.UrlEncode(redirectUri)}&response_type=code&scope=https://graph.microsoft.com/Mail.Send%20https://graph.microsoft.com/User.Read%20offline_access&state={state}";
        }
        else
        {
            return BadRequest("Unsupported provider");
        }

        return Ok(new { url });
    }

    [HttpGet("callback/{provider}")]
    [AllowAnonymous]
    public async Task<IActionResult> Callback(string provider, [FromQuery] string code, [FromQuery] string state)
    {
        if (string.IsNullOrEmpty(state)) return BadRequest("Invalid state");
        var brokerId = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(state));

        var redirectUri = Url.Action(nameof(Callback), "OAuth", new { provider }, Request.Scheme);
        string refreshToken = "";
        string email = "";

        using var client = new HttpClient();
        if (provider.ToLower() == "google")
        {
            var response = await client.PostAsync("https://oauth2.googleapis.com/token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = _config["Google:ClientId"]!,
                ["client_secret"] = _config["Google:ClientSecret"]!,
                ["redirect_uri"] = redirectUri!,
                ["grant_type"] = "authorization_code"
            }));
            var json = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
            refreshToken = json.TryGetProperty("refresh_token", out var rt) ? rt.GetString() : null;

            // Get email
            var accessToken = json.GetProperty("access_token").GetString();
            var userResponse = await client.GetAsync($"https://www.googleapis.com/oauth2/v2/userinfo?access_token={accessToken}");
            var userJson = await userResponse.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
            email = userJson.GetProperty("email").GetString() ?? "";
        }
        else if (provider.ToLower() == "microsoft")
        {
            var response = await client.PostAsync("https://login.microsoftonline.com/common/oauth2/v2.0/token", new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = _config["Microsoft:ClientId"]!,
                ["client_secret"] = _config["Microsoft:ClientSecret"]!,
                ["redirect_uri"] = redirectUri!,
                ["grant_type"] = "authorization_code"
            }));
            var json = await response.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
            refreshToken = json.TryGetProperty("refresh_token", out var rt) ? rt.GetString() : null;

            // Get email
            var accessToken = json.GetProperty("access_token").GetString();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            var userResponse = await client.GetAsync("https://graph.microsoft.com/v1.0/me");
            var userJson = await userResponse.Content.ReadFromJsonAsync<System.Text.Json.JsonElement>();
            email = userJson.GetProperty("mail").GetString() ?? userJson.GetProperty("userPrincipalName").GetString() ?? "";
        }

        if (string.IsNullOrEmpty(refreshToken)) return BadRequest("Failed to get refresh token");

        var oauth = await _db.BrokerOAuths.FirstOrDefaultAsync(o => o.BrokerId == brokerId);
        if (oauth == null)
        {
            oauth = new BrokerOAuth { BrokerId = brokerId };
            _db.BrokerOAuths.Add(oauth);
        }

        oauth.Provider = provider;
        oauth.RefreshToken = refreshToken;
        oauth.BrokerEmail = email;

        await _db.SaveChangesAsync();

        return Content("Connected successfully! You can close this window.");
    }
}
