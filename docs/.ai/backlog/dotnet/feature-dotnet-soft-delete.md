---
id: feature-dotnet-soft-delete
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.SoftDelete'
---

# .NET Soft Delete Package

## Summary

Design `HexGuard.SoftDelete` as a .NET package for standardizing soft-delete query filters, restore helpers, deleted-at/deleted-by conventions, and cascade-aware deletion behavior.

The repeated problem is that soft-delete is one of the most common data-access patterns in business applications — entities should be marked as deleted rather than physically removed — yet every team implements it differently: some use nullable `DeletedAt`, some add `IsDeleted` booleans, some include `DeletedBy`, and the query filters to exclude soft-deleted records are written and rewritten in every project. A standardized set of conventions and helpers would eliminate this boilerplate.

## Goals

- Define a clear soft-delete interface (`ISoftDeletable`) with `DeletedAtUtc`, `DeletedBy` fields.
- Provide an optional simpler variant with just `IsDeleted` for cases where timestamps aren't needed.
- Provide EF Core query filters that automatically exclude soft-deleted records from normal queries.
- Provide `ISoftDeleteQueryBuilder` for including soft-deleted records when needed (e.g., admin restore UI).
- Provide restore helpers (`MarkUndeletedAsync`, `RestoreAsync`) with optional audit tracking.
- Support cascade-aware deletion — configure whether related entities are also soft-deleted.
- Keep persistence provider abstraction light — EF Core first, with room for other providers.

## Non-Goals

- Physical deletion or hard-delete purge policies (those are application-specific).
- Multi-tenant soft-delete isolation (that belongs in a tenant-context package).
- Audit-trail integration beyond basic who-deleted-it tracking (that's the AuditTrail package).
- Complex cascade rules beyond parent-child soft-delete propagation.

## Decisions

- Prefer `DeletedAtUtc` + `DeletedBy` as the primary contract, with `IsDeleted` as a computed or alternative simpler model.
- Use EF Core `HasQueryFilter` for automatic filtering — consumers opt in via AddHexGuardSoftDelete().
- Keep the filter expression generation as an extension method on `ModelBuilder` for discoverability.
- Treat `DeletedBy` as an optional string — the consumer provides the current user via a delegate.
- Release as a single NuGet package with optional EF Core integration in a sub-namespace.

## Proposed Public API

```csharp
// Core interface
public interface ISoftDeletable
{
    DateTime? DeletedAtUtc { get; }
    string? DeletedBy { get; }
}

// Simpler variant
public interface ISoftDeletableSimple
{
    bool IsDeleted { get; }
}

// Registration
public static class SoftDeleteRegistration
{
    // In Program.cs or DbContext configuration
    public static ModelBuilder ApplySoftDeleteFilters(
        this ModelBuilder builder,
        Func<string?>? currentUserProvider = null);
}

// For querying soft-deleted records
public static class SoftDeleteQueryExtensions
{
    // Include soft-deleted records in a query
    public static IQueryable<T> IgnoreSoftDelete<T>(this IQueryable<T> source)
        where T : class, ISoftDeletable;
}

// For restore operations
public static class SoftDeleteRestoreExtensions
{
    public static async Task MarkUndeletedAsync<T>(
        this DbSet<T> dbSet,
        Expression<Func<T, bool>> predicate,
        string? restoredBy = null,
        CancellationToken ct = default)
        where T : class, ISoftDeletable;

    public static async Task SoftDeleteAsync<T>(
        this DbSet<T> dbSet,
        Expression<Func<T, bool>> predicate,
        string? deletedBy = null,
        CancellationToken ct = default)
        where T : class, ISoftDeletable;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.SoftDelete/` and `dotnet/tests/HexGuard.SoftDelete.Tests/` following the `HexGuard.ValidationContracts` convention.
2. Add project reference and solution file entries in `HexGuard.slnx`.

### Phase 1: Core Contracts

3. Define `ISoftDeletable` and `ISoftDeletableSimple` interfaces.
4. Implement `SoftDeleteRegistration.ApplySoftDeleteFilters()` — EF Core `HasQueryFilter` for all entities implementing the interfaces.
5. Implement `SoftDeleteQueryExtensions.IgnoreSoftDelete()` — opt-out of the global filter via `IgnoreQueryFilters()`.
6. Implement `SoftDeleteRestoreExtensions.SoftDeleteAsync()` — sets `DeletedAtUtc`/`DeletedBy` (or `IsDeleted`).
7. Implement `SoftDeleteRestoreExtensions.MarkUndeletedAsync()` — clears the delete markers.
8. Add unit tests for: query filter exclusion, `IgnoreSoftDelete`, soft-delete operation, restore operation, cascade behavior (configurable), both interface variants, multiple entities, and concurrent operations.

### Phase 2: Sample API & Demo

9. Add a `HexGuard.SoftDelete` endpoint group to the shared `HexGuard.SampleApi` demonstrating:
    - A `Products` DbContext with soft-delete enabled
    - GET (excludes deleted), GET with deleted included, DELETE (soft), POST restore
    - In-memory EF Core provider for demo purposes
10. Add integration tests via `WebApplicationFactory` for the sample endpoint.
11. Write the deep-dive doc at `docs/packages/hexguard-soft-delete.md`.
12. Update the NuGet-facing `README.md` with quickstart and API reference.

### Phase 3: Release

13. Add build and test entries to `dotnet/HexGuard.slnx` and root `package.json` scripts (`pnpm dotnet:build`, `pnpm dotnet:test`).
14. Add `.github/workflows/release-dotnet-soft-delete.yml` following existing .NET release patterns.
15. Run `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test` for the full validation gate.

## Validation

- `pnpm dotnet:test` — .NET unit and integration tests for query filters, soft-delete, restore, cascade.
- `pnpm dotnet:build` — package builds.
- Sample API endpoint manual check via `pnpm dotnet:start:demo-api`.

## Follow-Ups

- Revisit whether a companion `HexGuard.SoftDelete.EntityFrameworkCore` namespace should be split for provider-agnostic use.
- Evaluate hard-delete / purge policies (e.g., "delete records soft-deleted more than 30 days ago") as a separate companion.
- Consider adding an `IProcessSoftDeletes` interface for services that need pre/post delete callbacks.
