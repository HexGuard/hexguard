---
id: feature-dotnet-usage-metering
type: feature
status: proposed
created: 2026-06-27
package: HexGuard.UsageMetering
---

# HexGuard.UsageMetering

## Summary

Per-tenant usage metering and limit enforcement — track API calls, storage, seats, feature usage. Enforce plan limits. Essential for usage-based B2B SaaS billing.

## Proposed Public API

```csharp
public interface IUsageMeter
{
    Task RecordAsync(string tenantId, string metric, long count, CancellationToken ct);
    Task<UsageReport> GetReportAsync(string tenantId, DateTime from, DateTime to, CancellationToken ct);
    Task<bool> IsWithinLimitAsync(string tenantId, string metric, CancellationToken ct);
}

public sealed record UsageReport
{
    public string TenantId { get; init; }
    public IReadOnlyDictionary<string, UsageMetric> Metrics { get; init; }
}

public sealed record UsageMetric { public long Used { get; init; } public long Limit { get; init; } public double Percentage => (double)Used / Limit * 100; }

// Middleware: enforce limits on API requests
app.UseUsageLimits();
// Returns 429 Too Many Requests with Retry-After + usage headers
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.UsageMetering/`.
2. Implement metric recording, limit enforcement, reporting.
3. Add tests. Register in `HexGuard.slnx`. Publish as NuGet.
