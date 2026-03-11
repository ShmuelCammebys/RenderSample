using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.DTOs;
using RealEstateApi.Models;
using RealEstateApi.Services;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ShowingsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ITokenService _tokenService;
    private readonly EmailServiceFactory _emailFactory;

    public ShowingsController(AppDbContext db, ITokenService tokenService, EmailServiceFactory emailFactory)
    {
        _db = db;
        _tokenService = tokenService;
        _emailFactory = emailFactory;
    }

    [HttpGet("units")]
    public async Task<ActionResult<IEnumerable<UnitDto>>> GetEligibleUnits()
    {
        return await _db.Units
            .Where(u => u.IsEligible)
            .Select(u => new UnitDto(u.Id, u.BuildingName, u.UnitNumber, u.IsEligible))
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult> CreateShowing([FromBody] CreateShowingRequest req)
    {
        var unit = await _db.Units.FindAsync(req.UnitId);
        if (unit == null || !unit.IsEligible) return BadRequest("Invalid or ineligible unit.");

        var brokerId = User.Identity?.Name ?? "test-broker"; // Default for now

        var (rawToken, tokenHash) = _tokenService.GenerateToken();

        var showing = new Showing
        {
            Id = Guid.NewGuid(),
            BrokerId = brokerId,
            UnitId = req.UnitId,
            ProspectEmail = req.ProspectEmail,
            CreatedAtUtc = DateTime.UtcNow,
            Status = ShowingStatus.Pending
        };

        var token = new VerificationToken
        {
            ShowingId = showing.Id,
            TokenHash = tokenHash,
            ExpiresAtUtc = DateTime.UtcNow.AddHours(24)
        };

        _db.Showings.Add(showing);
        _db.VerificationTokens.Add(token);
        await _db.SaveChangesAsync();

        var oauth = await _db.BrokerOAuths.FirstOrDefaultAsync(o => o.BrokerId == brokerId);
        if (oauth != null)
        {
            var emailService = _emailFactory.GetEmailService(oauth.Provider);
            var subject = "Action Required: Verify your visit";
            var body = $@"
                <p>Hello,</p>
                <p>Please verify your visit to the unit by clicking the link below:</p>
                <p><a href='https://real-estate-app.com/verify?id={showing.Id}&token={rawToken}'>Verify Visit</a></p>
                <p>Thank you!</p>";

            try
            {
                await emailService.SendEmailAsync(req.ProspectEmail, subject, body, oauth.RefreshToken);
            }
            catch (Exception ex)
            {
                // Log error but don't fail showing creation
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }

        return Ok(new { showingId = showing.Id, token = rawToken });
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShowingDto>>> GetMyShowings()
    {
        var brokerId = User.Identity?.Name ?? "test-broker";
        return await _db.Showings
            .Where(s => s.BrokerId == brokerId)
            .Select(s => new ShowingDto(s.Id, s.UnitId, s.ProspectEmail, s.Status.ToString(), s.CreatedAtUtc))
            .ToListAsync();
    }
}
