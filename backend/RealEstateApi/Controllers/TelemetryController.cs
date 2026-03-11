using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Data;
using RealEstateApi.DTOs;
using RealEstateApi.Models;

namespace RealEstateApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TelemetryController : ControllerBase
{
    private readonly AppDbContext _db;

    public TelemetryController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("outreach-clicked")]
    public async Task<IActionResult> OutreachClicked([FromBody] OutreachTelemetryRequest req)
    {
        var outreachEvent = new OutreachEvent
        {
            Id = Guid.NewGuid(),
            ShowingId = req.ShowingId,
            EventType = "MailtoClicked",
            TimestampUtc = DateTime.UtcNow,
            TelemetryData = JsonSerializer.Serialize(new
            {
                IP = HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = Request.Headers["User-Agent"].ToString()
            })
        };

        _db.OutreachEvents.Add(outreachEvent);
        await _db.SaveChangesAsync();

        return Ok();
    }
}
