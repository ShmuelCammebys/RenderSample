using Microsoft.EntityFrameworkCore;
using RealEstateApi.Models;

namespace RealEstateApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Showing> Showings => Set<Showing>();
    public DbSet<VerificationToken> VerificationTokens => Set<VerificationToken>();
    public DbSet<OutreachEvent> OutreachEvents => Set<OutreachEvent>();
    public DbSet<BrokerOAuth> BrokerOAuths => Set<BrokerOAuth>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Showing>()
            .HasIndex(s => new { s.BrokerId, s.UnitId, s.CreatedAtUtc });

        modelBuilder.Entity<OutreachEvent>()
            .HasIndex(o => o.ShowingId);

        modelBuilder.Entity<VerificationToken>()
            .HasOne(v => v.Showing)
            .WithOne(s => s.Token)
            .HasForeignKey<VerificationToken>(v => v.ShowingId);

        modelBuilder.Entity<VerificationToken>()
            .Property(v => v.xmin)
            .IsRowVersion();

        base.OnModelCreating(modelBuilder);
    }
}
