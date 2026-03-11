using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.DTOs;
using RealEstateApi.Models;
using RealEstateApi.Services;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VerificationController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;

    public VerificationController(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("verify")]
    [EnableRateLimiting("StrictVerificationPolicy")]
    public async Task<IActionResult> VerifyVisit([FromBody] VerifyRequest req)
    {
        var tokenRecord = await _db.VerificationTokens
            .Include(t => t.Showing)
            .FirstOrDefaultAsync(t => t.ShowingId == req.ShowingId);

        if (tokenRecord == null || tokenRecord.UsedAtUtc != null || tokenRecord.ExpiresAtUtc < DateTime.UtcNow)
            return BadRequest("Invalid or expired token.");

        // Verify hash
        if (!_tokenService.VerifyToken(req.Token, tokenRecord.TokenHash))
            return Unauthorized();

        try
        {
            tokenRecord.UsedAtUtc = DateTime.UtcNow;
            tokenRecord.Showing.Status = ShowingStatus.Verified;

            // Save telemetry
            _db.OutreachEvents.Add(new OutreachEvent {
                ShowingId = req.ShowingId,
                EventType = "Verified",
                TimestampUtc = DateTime.UtcNow,
                TelemetryData = JsonSerializer.Serialize(new {
                    IP = HttpContext.Connection.RemoteIpAddress?.ToString(),
                    UserAgent = Request.Headers["User-Agent"].ToString()
                })
            });

            await _db.SaveChangesAsync(); // RowVersion enforces concurrency here
            return Ok();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("This visit has already been verified.");
        }
    }
}
