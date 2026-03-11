using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using RealEstateApi.Data;
using RealEstateApi.Models;

namespace RealEstateApi.Services;

public class AnomalySweeperJob : IHostedService, IDisposable
{
    private readonly IServiceProvider _serviceProvider;
    private Timer? _timer;
    private readonly ILogger<AnomalySweeperJob> _logger;

    public AnomalySweeperJob(IServiceProvider serviceProvider, ILogger<AnomalySweeperJob> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Anomaly Sweeper Job is starting.");
        _timer = new Timer(DoWork, null, TimeSpan.Zero, TimeSpan.FromMinutes(15));
        return Task.CompletedTask;
    }

    private void DoWork(object? state)
    {
        _logger.LogInformation("Anomaly Sweeper Job is working.");
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var last24Hours = DateTime.UtcNow.AddDays(-1);
        var recentEvents = db.OutreachEvents
            .Where(e => e.TimestampUtc > last24Hours && e.EventType == "Verified")
            .ToList();

        var ipGroups = recentEvents
            .Select(e => new { e.ShowingId, IP = ExtractIp(e.TelemetryData) })
            .Where(x => x.IP != null)
            .GroupBy(x => x.IP)
            .Where(g => g.Select(x => x.ShowingId).Distinct().Count() > 3);

        foreach (var group in ipGroups)
        {
            _logger.LogWarning("Fraud detected for IP: {IP}", group.Key);
            var showingIds = group.Select(x => x.ShowingId).Distinct();
            var showingsToFlag = db.Showings.Where(s => showingIds.Contains(s.Id));

            foreach (var showing in showingsToFlag)
            {
                showing.Status = ShowingStatus.Flagged;
            }
        }

        db.SaveChanges();
    }

    private string? ExtractIp(string telemetryData)
    {
        try
        {
            var doc = JsonDocument.Parse(telemetryData);
            return doc.RootElement.GetProperty("IP").GetString();
        }
        catch { return null; }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Anomaly Sweeper Job is stopping.");
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}
