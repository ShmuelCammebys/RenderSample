using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RealEstateApi.Data;
using RealEstateApi.DTOs;
using RealEstateApi.Models;
using RealEstateApi.Services;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public AuthController(IConfiguration config, AppDbContext db, ITokenService tokenService)
    {
        _config = config;
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _db.Users.AnyAsync(u => u.Username == req.Username))
            return BadRequest("Username already exists.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = req.Username,
            PasswordHash = _tokenService.HashToken(req.Password), // Using TokenService for consistency in demo
            Email = req.Email,
            FullName = req.FullName,
            CreatedAtUtc = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "User registered successfully" });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        // Check database first
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == req.Username);
        
        // Simple demo authentication fallback
        bool isAuthenticated = false;
        string username = req.Username;

        if (user != null && _tokenService.VerifyToken(req.Password, user.PasswordHash))
        {
            isAuthenticated = true;
            username = user.Username;
        }
        else if (req.Username == "broker" && req.Password == "password")
        {
            isAuthenticated = true;
            username = "broker";
        }

        if (!isAuthenticated)
            return Unauthorized();

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["JWT_SECRET"] ?? "a-very-long-and-secure-secret-key-for-jwt-tokens");
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] { 
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Email, user?.Email ?? "")
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return Ok(new AuthResponse(tokenHandler.WriteToken(token), username));
    }
}
