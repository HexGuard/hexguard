---
id: feature-dotnet-tenancy
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Tenancy
---

# HexGuard.Tenancy

## Summary

Multi-tenancy infrastructure for ASP.NET Core — tenant resolution from headers/hosts/claims, tenant-scoped `ITenantContext<T>` service, tenant-aware EF Core query filters, and per-tenant connection string resolution. Every SaaS API serving multiple customers needs tenant isolation; this provides the core plumbing.

**Competition check:** `Finbuckle.MultiTenant` (4M+ downloads) is the dominant package — full-featured but opinionated (own tenant model, own middleware pipeline). `HexGuard.Tenancy` targets a narrower API with simpler tenant model and first-class EF Core integration.

## Why Wide Adoption

Multi-tenancy is the foundation of every SaaS application. Tenant isolation (one customer cannot see another's data), tenant-specific configuration (connection strings, feature flags), and tenant context in logs are universal requirements.

## Goals

1. Provide `ITenantContext<T>` — access the current tenant anywhere in the request pipeline.
2. Support tenant resolution from: request header (`X-Tenant-Id`), hostname (`customer1.app.com`), or JWT claim.
3. Provide EF Core query filter integration — auto-add `.Where(e => e.TenantId == current)` to all entities.
4. Support per-tenant connection strings (database-per-tenant).
5. Support tenant-scoped caching (cache keys prefixed by tenant).
6. Pure middleware — minimal dependencies.

## Proposed Public API

```csharp
// ── Tenant Model ──────────────────────────────────────────

public interface ITenant
{
    string Id { get; }
    string? Name { get; }
}

// ── Tenant Context ────────────────────────────────────────

public interface ITenantContext<T> where T : ITenant
{
    T Current { get; }
    bool HasTenant { get; }
    IChangeToken ChangeToken { get; }        // For cache invalidation on tenant switch
}

// ── Options ───────────────────────────────────────────────

public sealed class TenancyOptions
{
    public Func<HttpContext, string?> Resolver { get; set; }
        = ctx => ctx.Request.Headers["X-Tenant-Id"].FirstOrDefault();
    public Func<string, ITenant>? TenantFactory { get; set; }
    public bool RequireTenant { get; set; } = true;    // 400 if missing
    public string[] ExcludePaths { get; set; } = [];    // Skip for non-tenant paths
}

// ── Registration ──────────────────────────────────────────

public static class TenancyExtensions
{
    public static IServiceCollection AddMultiTenancy<T>(
        this IServiceCollection services,
        Action<TenancyOptions> configure)
        where T : class, ITenant;

    public static IApplicationBuilder UseMultiTenancy<T>(
        this IApplicationBuilder app)
        where T : ITenant;
}

// ── EF Core Integration ──────────────────────────────────

public static class TenancyEfCoreExtensions
{
    public static void AddTenantQueryFilter<T>(
        this ModelBuilder builder,
        Expression<Func<T, string>> tenantIdProperty);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddMultiTenancy<Tenant>(options => {
    options.Resolver = ctx => ctx.Request.Headers["X-Tenant-Id"];
    options.TenantFactory = async id => await db.Tenants.FindAsync(id);
});

app.UseMultiTenancy<Tenant>();

// EF Core auto-filter
modelBuilder.Entity<Product>().AddTenantQueryFilter<Product>(p => p.TenantId);

// In a service
public class ProductService
{
    public ProductService(ITenantContext<Tenant> tenant, AppDbContext db)
    {
        // db.Products is auto-filtered to tenant.Current.Id
        var tenantId = tenant.Current.Id;
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Tenancy/` with standard `.csproj`.
2. Implement `ITenant`, `ITenantContext<T>`, and tenant resolution middleware.
3. Implement header, hostname, and claim resolvers.
4. Implement EF Core query filter extension.
5. Implement per-tenant connection string resolution.
6. Add `InternalsVisibleTo` for test project.
7. Create test project with xUnit + `WebApplicationFactory` integration tests.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet.
