---
id: feature-dotnet-data-retention
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.DataRetention'
---

# HexGuard.DataRetention

## Summary

Data retention policy enforcement for .NET — define retention schedules, auto-purge expired data, and manage legal holds. Ensures compliance with GDPR, CCPA, and industry regulations.

## Goals

- Retention policy definition per data category
- Auto-purge expired records via background service
- Legal hold management (prevent deletion during litigation)
- Retention override with audit justification
- Purge preview (what would be deleted)
- Retention compliance reporting
- EF Core integration with query filters
- Soft-delete before hard-purge (two-phase)

## Non-Goals

- No retention policy UI
- No legal hold workflow engine
- No data classification/scanning

## Proposed Public API

```csharp
public interface IRetentionService
{
    Task<IReadOnlyList<RetentionPolicy>> GetPoliciesAsync(CancellationToken ct = default);
    Task<PurgePreview> PreviewPurgeAsync(string? category = null, CancellationToken ct = default);
    Task<PurgeResult> ExecutePurgeAsync(string? category = null, CancellationToken ct = default);
    Task PlaceLegalHoldAsync(LegalHoldRequest request, CancellationToken ct = default);
    Task ReleaseLegalHoldAsync(string holdId, CancellationToken ct = default);
    Task<IReadOnlyList<LegalHold>> GetActiveHoldsAsync(CancellationToken ct = default);
    Task<RetentionComplianceReport> GetComplianceReportAsync(CancellationToken ct = default);
}

public sealed record RetentionPolicy(
    string Id,
    string Category,
    string DataType,
    int RetentionDays,
    string Justification,
    bool IsOverridable
);

public sealed record PurgePreview(
    string Category,
    int RecordCount,
    long EstimatedBytes,
    DateTimeOffset? OldestRecord
);

public sealed record LegalHoldRequest(
    string DataCategory,
    string CaseReference,
    string Reason,
    string RequestedBy
);

// EF Core integration
public static ModelBuilder ApplyRetentionPolicy(this ModelBuilder builder, RetentionPolicy policy);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.DataRetention/` with `.csproj`.
2. Implement policy engine, purge service, legal hold management, compliance reporting.
3. Add EF Core query filters for retention.
4. Add xunit tests. Register in `HexGuard.slnx`.
