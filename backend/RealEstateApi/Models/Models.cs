using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RealEstateApi.Models;

public class Unit
{
    public int Id { get; set; }
    public string BuildingName { get; set; } = string.Empty;
    public string UnitNumber { get; set; } = string.Empty;
    public bool IsEligible { get; set; } // Updated monthly via Admin upload
    public ICollection<Showing> Showings { get; set; } = new List<Showing>();
}

public class Showing
{
    public Guid Id { get; set; }
    public string BrokerId { get; set; } = string.Empty; // Mapped to Auth provider ID
    public int UnitId { get; set; }
    public Unit Unit { get; set; } = null!;
    public string ProspectEmail { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }

    // Status enum: Pending, Verified, Expired, Flagged
    public ShowingStatus Status { get; set; }

    public VerificationToken? Token { get; set; }
    public ICollection<OutreachEvent> OutreachEvents { get; set; } = new List<OutreachEvent>();
}

public class VerificationToken
{
    [Key]
    public Guid ShowingId { get; set; }
    public Showing Showing { get; set; } = null!;

    public string TokenHash { get; set; } = string.Empty; // Stored as SHA-256
    public DateTime ExpiresAtUtc { get; set; }
    public DateTime? UsedAtUtc { get; set; }

    public uint xmin { get; set; } // PostgreSQL system column for optimistic concurrency
}

public class OutreachEvent
{
    public Guid Id { get; set; }
    public Guid ShowingId { get; set; }
    public string EventType { get; set; } = string.Empty; // e.g., "MailtoClicked"
    public DateTime TimestampUtc { get; set; }

    [Column(TypeName = "jsonb")]
    public string TelemetryData { get; set; } = "{}"; // IP, UserAgent, etc.
}

public class BrokerOAuth
{
    [Key]
    public string BrokerId { get; set; } = string.Empty;
    public string Provider { get; set; } = string.Empty; // "Google" or "Microsoft"
    public string RefreshToken { get; set; } = string.Empty;
    public string BrokerEmail { get; set; } = string.Empty;
}
