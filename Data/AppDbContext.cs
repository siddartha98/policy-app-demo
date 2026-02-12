
using Microsoft.EntityFrameworkCore;
using PolicyDemo.Domain;

namespace PolicyDemo.Data;

/// <summary>
/// EF Core DbContext containing the Policies DbSet.
/// Uses an in-memory provider in this demo to avoid external dependencies.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Exposes the Policies table as a DbSet for queries and persistence operations.
    public DbSet<Policy> Policies => Set<Policy>();

    /// <summary>
    /// Seeds the in-memory database with a few sample policies.
    /// This helper is idempotent and intended for demo/test scenarios only.
    /// </summary>
    public void Seed()
    {
        if (Policies.Any()) return;

        Policies.AddRange(
            new Policy { PolicyNumber = 1001, CustomerName = "Alice", StartDate = DateTime.UtcNow.AddMonths(-2), EndDate = DateTime.UtcNow.AddMonths(10) },
            new Policy { PolicyNumber = 1002, CustomerName = "Bob", StartDate = DateTime.UtcNow.AddMonths(-1), EndDate = DateTime.UtcNow.AddMonths(5) },
            new Policy { PolicyNumber = 1003, CustomerName = "Charlie", StartDate = DateTime.UtcNow.AddMonths(-6), EndDate = DateTime.UtcNow.AddMonths(-1) }
        );

        SaveChanges();
    }
}
