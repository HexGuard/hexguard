---
id: feature-dotnet-dbcontext
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.DbContext
---

# HexGuard.DbContext

## Summary

EF Core base class with built-in conventions — auto-set `CreatedAt`/`UpdatedAt` timestamps, auto-filter soft-deleted entities, and tenant-aware query filter support. Every EF Core project manually overrides `SaveChangesAsync` and adds `HasQueryFilter` for soft-deletes — this packages those patterns into a base class.

**Competition check:** No standalone EF Core convention base class exists. Patterns are spread across blog posts and internal libs.

## Goals

1. Provide `HexGuardDbContext` base class extending `DbContext`.
2. Auto-set `CreatedAt` on add and `UpdatedAt` on modify for entities implementing `IAuditable`.
3. Auto-filter entities implementing `ISoftDelete` via `HasQueryFilter(e => !e.IsDeleted)`.
4. Support `ITenantAware` entities with tenant-filter injection.
5. Override `SaveChangesAsync` transparently.

## Proposed Public API

```csharp
public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}

public interface ISoftDelete
{
    bool IsDeleted { get; set; }
    DateTime? DeletedAt { get; set; }
}

public interface ITenantAware
{
    string TenantId { get; set; }
}

public abstract class HexGuardDbContext : DbContext
{
    protected HexGuardDbContext(DbContextOptions options, IClock? clock = null) : base(options);

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Auto-applies HasQueryFilter for ISoftDelete entities
        // Auto-applies HasQueryFilter for ITenantAware entities
        base.OnModelCreating(builder);
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        // Auto-set CreatedAt/UpdatedAt on IAuditable entities
        // Auto-set DeletedAt on ISoftDelete entities being deleted
        return base.SaveChangesAsync(ct);
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.DbContext/` with standard `.csproj`.
2. Implement `IAuditable`, `ISoftDelete`, `ITenantAware` interfaces.
3. Implement `HexGuardDbContext` base class.
4. Add tests with EF Core in-memory database.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
