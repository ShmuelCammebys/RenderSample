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

    public ShowingsController(AppDbContext db, ITokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
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

        // In a real app, send email here with rawToken
        // Example: _emailService.SendVerification(req.ProspectEmail, showing.Id, rawToken);

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
