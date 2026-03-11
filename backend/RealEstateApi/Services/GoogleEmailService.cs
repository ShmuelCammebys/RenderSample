using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration;
using System.Text;

namespace RealEstateApi.Services;

public class GoogleEmailService : IEmailService
{
    private readonly IConfiguration _config;

    public GoogleEmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string to, string subject, string body, string refreshToken)
    {
        var clientId = _config["Google:ClientId"];
        var clientSecret = _config["Google:ClientSecret"];

        var flow = new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = clientId,
                ClientSecret = clientSecret
            }
        });

        var token = new TokenResponse { RefreshToken = refreshToken };
        var credential = new UserCredential(flow, "user", token);

        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "RealEstateApi"
        });

        var rawMessage = CreateRawMessage(to, subject, body);
        var message = new Message { Raw = rawMessage };

        await service.Users.Messages.Send(message, "me").ExecuteAsync();
    }

    private string CreateRawMessage(string to, string subject, string body)
    {
        var mailMessage = $"To: {to}\r\n" +
                          $"Subject: {subject}\r\n" +
                          "Content-Type: text/html; charset=utf-8\r\n\r\n" +
                          $"{body}";

        var bytes = Encoding.UTF8.GetBytes(mailMessage);
        return Convert.ToBase64String(bytes).Replace('+', '-').Replace('/', '_').Replace("=", "");
    }
}
