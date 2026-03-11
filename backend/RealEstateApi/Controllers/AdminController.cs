using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.Models;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Simplified for demo, can be Roles = "Admin"
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var totalShowings = await _db.Showings.CountAsync();
        var verifiedShowings = await _db.Showings.CountAsync(s => s.Status == ShowingStatus.Verified);
        var flaggedShowings = await _db.Showings.CountAsync(s => s.Status == ShowingStatus.Flagged);

        return Ok(new { totalShowings, verifiedShowings, flaggedShowings });
    }

    [HttpPost("units/upload")]
    public async Task<IActionResult> UploadUnits([FromBody] List<Unit> units)
    {
        // Simple implementation for demo
        foreach (var unit in units)
        {
            var existing = await _db.Units.FirstOrDefaultAsync(u => u.BuildingName == unit.BuildingName && u.UnitNumber == unit.UnitNumber);
            if (existing != null)
            {
                existing.IsEligible = unit.IsEligible;
            }
            else
            {
                _db.Units.Add(unit);
            }
        }
        await _db.SaveChangesAsync();
        return Ok();
    }
}
