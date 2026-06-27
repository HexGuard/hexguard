---
id: feature-dotnet-dsar
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Dsar'
---

# HexGuard.Dsar

## Summary

Data Subject Access Request (DSAR) handling for .NET — receive, validate, track, and fulfill GDPR/CCPA data subject requests. Automates the compliance workflow for access, erasure, rectification, and portability requests.

## Goals

- DSAR submission endpoint with validation
- Request types: access, erasure, rectification, portability, restriction
- Identity verification before fulfillment
- Request tracking with status (pending → verifying → processing → completed → rejected)
- SLA tracking (GDPR: 30 days, CCPA: 45 days)
- Automated data collection across registered data sources
- Fulfillment response generation (JSON/PDF export)
- Request history and audit trail

## Non-Goals

- No identity verification implementation (delegates to configured verifier)
- No actual data deletion (delegates to registered handlers)
- No compliance dashboard UI

## Proposed Public API

```csharp
public interface IDsarService
{
    Task<DsarRequest> SubmitAsync(DsarSubmission submission, CancellationToken ct = default);
    Task<DsarRequest?> GetAsync(string requestId, CancellationToken ct = default);
    Task<IReadOnlyList<DsarRequest>> GetByUserAsync(string userId, CancellationToken ct = default);
    Task<DsarFulfillment> FulfillAsync(string requestId, CancellationToken ct = default);
    Task RejectAsync(string requestId, string reason, CancellationToken ct = default);
    Task<IReadOnlyList<DsarRequest>> GetOverdueAsync(CancellationToken ct = default);
}

public sealed record DsarSubmission(
    string UserId,
    DsarRequestType Type,
    string? Details = null,
    string? PreferredFormat = "json"
);

public enum DsarRequestType { Access, Erasure, Rectification, Portability, Restriction }

public sealed record DsarRequest(
    string Id,
    string UserId,
    DsarRequestType Type,
    DsarRequestStatus Status,
    DateTimeOffset SubmittedAt,
    DateTimeOffset Deadline,
    string? CompletedAt,
    string? RejectionReason
);

// Data source registration
public interface IDsarDataSource
{
    string SourceName { get; }
    Task<object?> CollectUserDataAsync(string userId, CancellationToken ct = default);
    Task DeleteUserDataAsync(string userId, CancellationToken ct = default);
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Dsar/` with `.csproj`.
2. Implement submission, tracking, data source registration, fulfillment.
3. Add SLA monitoring and overdue detection.
4. Add xunit tests. Register in `HexGuard.slnx`.
