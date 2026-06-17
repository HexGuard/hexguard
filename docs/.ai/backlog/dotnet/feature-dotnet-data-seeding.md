---
id: feature-dotnet-data-seeding
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.DataSeeding'
---

# .NET Data Seeding Package

## Summary

Design `HexGuard.DataSeeding` as a .NET package for standardizing idempotent data seeding, environment-aware seed sets, test-data factories, and seed-ordering conventions for .NET applications and integration test suites.

The repeated problem is that almost every .NET project needs seed data for development, staging, and test environments — reference catalogs, demo users, sample orders — yet every team builds the same `HasData()` calls, `EnsureCreated()` patterns, test-data builders, and environment-conditional seeding logic from scratch. A standardized seeding infrastructure would eliminate this boilerplate and make seed data consistent across projects.

## Goals

- Provide `ISeedService` and `SeedSet` abstractions for organizing seed data into named, ordered sets.
- Provide environment-aware seed profiles (Development, Staging, Production) so seed data only runs in the right environment.
- Provide idempotent seeding — seeds check for existing data and skip or append rather than duplicate.
- Provide `EntityFactory<T>` for generating test data with auto-incrementing IDs, random values, and overridable defaults.
- Provide `SeedBuilder` fluent API for composing seed sets with dependencies (seed Tenants before Users).
- Provide integration with `WebApplicationFactory` for test data setup.
- Keep EF Core as the primary data-access target with an `ISeedDataWriter<T>` abstraction for provider flexibility.

## Non-Goals

- Data generation for performance or load testing — that's a benchmarking concern.
- Database migration or schema creation — that's EF Core migrations.
- Production data anonymization or masking — that's a data-privacy concern.
- Cloud or remote seed-data synchronization.

## Decisions

- Use environment-based profiles (`ASPNETCORE_ENVIRONMENT`) to gate which seed sets execute.
- Provide idempotency via existence checks (primary-key lookup or unique-constraint match) rather than truncate-and-reload.
- `EntityFactory<T>` uses a configurable faker-like interface with sensible defaults for common types (string, int, DateTime, Guid, email).
- Seed sets declare dependencies via `DependsOn<TOtherSeedSet>()` for ordered execution.
- Register seed services via `AddHexGuardDataSeeding()` extension method on `IServiceCollection`.

## Proposed Public API

```csharp
// Registration — Program.cs
builder.Services.AddHexGuardDataSeeding(options =>
{
    options.AddSeedSet<ReferenceDataSeed>();
    options.AddSeedSet<DemoUserSeed>();
    options.AddSeedSet<SampleOrdersSeed>();
});

// Run seeding (typically in app startup or a CLI command)
var seeder = app.Services.GetRequiredService<ISeedService>();
await seeder.SeedAsync(cancellationToken);

// Seed set
public class ReferenceDataSeed : ISeedSet
{
    public string Name => "reference-data";
    public SeedEnvironment Environments => SeedEnvironment.Development | SeedEnvironment.Staging;

    public async Task SeedAsync(ISeedContext context, CancellationToken ct)
    {
        var categories = context.GetWriter<ProductCategory>();

        if (await categories.AnyAsync(ct))
            return; // idempotent — skip if already seeded

        await categories.AddRangeAsync(new[]
        {
            new ProductCategory { Id = 1, Name = "Hardware" },
            new ProductCategory { Id = 2, Name = "Software" },
        }, ct);
    }
}

// Entity factory for test data
public class OrderFactory : EntityFactory<Order>
{
    public OrderFactory()
    {
        Property(o => o.Id).UseAutoIncrement();
        Property(o => o.OrderDate).UseDefault(() => DateTime.UtcNow);
        Property(o => o.CustomerEmail).UsePattern("customer{0}@example.com");
        Property(o => o.Total).UseRandom(10m, 9999m);
    }
}

// Usage in tests
var factory = new OrderFactory();
var orders = factory.CreateMany(5);      // 5 orders with auto-generated properties
var customOrder = factory.CreateOne(o => { o.Total = 100m; }); // override specific property
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.DataSeeding/` and `dotnet/tests/HexGuard.DataSeeding.Tests/` following existing conventions.
2. Add project reference and solution file entries in `HexGuard.slnx`.

### Phase 1: Core Contracts

3. Define `ISeedService`, `ISeedSet`, `SeedEnvironment` flags enum, `ISeedContext`, `ISeedDataWriter<T>` interfaces.
4. Implement `SeedService` — resolves seed sets, orders by dependency, executes each, tracks completion.
5. Implement `SeedSetDependencyResolver` — topologically sorts seed sets based on `DependsOn<T>()`.
6. Implement `EntityFactory<T>` with property configuration, auto-increment, random generation, and pattern support.
7. Implement `AddHexGuardDataSeeding()` DI extension.
8. Add unit tests for: seed set ordering, dependency resolution, idempotent skip, environment gating, `EntityFactory` generation, property overrides, concurrent seed execution safety, and error handling (missing dependency, circular dependency).

### Phase 2: Sample API & Docs

9. Add a `HexGuard.DataSeeding` demonstration in the shared `HexGuard.SampleApi` showing catalog and demo data seeding.
10. Add integration tests via `WebApplicationFactory`.
11. Write the deep-dive doc at `docs/packages/hexguard-data-seeding.md`.
12. Update the NuGet-facing `README.md`.

### Phase 3: Release

13. Add build and test entries to root `package.json` scripts.
14. Add `.github/workflows/release-dotnet-data-seeding.yml`.
15. Run `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test` for the full validation gate.

## Validation

- `pnpm dotnet:test` — unit and integration tests for seeding, factories, environment gating, idempotency.
- `pnpm dotnet:build` — package builds.
- Sample API manual check.

## Follow-Ups

- Revisit a CLI tool (`dotnet hexguard seed`) for running seeds outside the web host.
- Evaluate adding a `SeedFromJson()` helper that loads seed data from JSON files for non-developer contributors.
- Consider integration with `HexGuard.SoftDelete` for seed-aware soft-delete data setup.
