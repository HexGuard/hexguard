---
id: feature-dotnet-crm
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Crm'
---

# HexGuard.Crm

## Summary

CRM pipeline engine for .NET — deal management, stage progression, contact management, and activity tracking. Backend for sales CRMs and deal-flow platforms.

## Goals

- Pipeline stage configuration per tenant/team
- Deal CRUD with stage progression and value tracking
- Contact management linked to deals
- Activity logging (calls, emails, meetings, notes)
- Deal movement with audit trail
- Win/loss tracking with reason categorization
- Sales metrics aggregation (pipeline value, win rate, velocity)
- Custom deal fields via JSON metadata

## Non-Goals

- No email integration or sync
- No lead scoring or AI-based predictions
- No UI rendering

## Proposed Public API

```csharp
public interface ICrmService
{
    // Deals
    Task<Deal> CreateDealAsync(CreateDealRequest request, CancellationToken ct = default);
    Task<Deal?> GetDealAsync(string dealId, CancellationToken ct = default);
    Task<IReadOnlyList<Deal>> QueryDealsAsync(DealQuery query, CancellationToken ct = default);
    Task<Deal> UpdateDealAsync(string dealId, UpdateDealRequest request, CancellationToken ct = default);
    Task<Deal> MoveDealAsync(string dealId, string toStageId, int position, CancellationToken ct = default);
    Task<Deal> MarkWonAsync(string dealId, string? reason = null, CancellationToken ct = default);
    Task<Deal> MarkLostAsync(string dealId, string reason, CancellationToken ct = default);
    // Contacts
    Task<Contact> CreateContactAsync(CreateContactRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<Contact>> QueryContactsAsync(ContactQuery query, CancellationToken ct = default);
    Task LinkContactToDealAsync(string contactId, string dealId, CancellationToken ct = default);
    // Activities
    Task<Activity> LogActivityAsync(CreateActivityRequest request, CancellationToken ct = default);
    Task<IReadOnlyList<Activity>> GetActivitiesAsync(ActivityQuery query, CancellationToken ct = default);
    // Metrics
    Task<PipelineMetrics> GetMetricsAsync(PipelineQuery query, CancellationToken ct = default);
}

public sealed record CreateDealRequest(string Name, string StageId, decimal Value, string Currency, string OwnerId, DateTimeOffset? ExpectedCloseDate = null);
public sealed record DealQuery(string? OwnerId = null, string? StageId = null, decimal? MinValue = null, DateTimeOffset? CloseDateFrom = null, int Skip = 0, int Take = 50);
public enum DealStatus { Open, Won, Lost }

public sealed record CreateActivityRequest(string? DealId, string? ContactId, ActivityType Type, string Subject, string? Body = null);
public enum ActivityType { Call, Email, Meeting, Note }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Crm/` with `.csproj`.
2. Implement deal management, stage progression, contacts, activities, metrics.
3. Add EF Core persistence and audit trail.
4. Add xunit tests. Register in `HexGuard.slnx`.
