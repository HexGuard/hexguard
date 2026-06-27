---
id: feature-dotnet-approvals
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Approvals'
---

# HexGuard.Approvals

## Summary

Approval workflow engine for .NET — define approval chains, submit items for approval, process approve/reject/delegate actions, and query approval status. Pairs with `@hexguard/angular-approvals`.

## Goals

- Approval chain definition (serial, parallel, any-of, consensus)
- Item submission with metadata and due dates
- Approve/reject/delegate/reassign actions
- Approval history and audit trail
- Due-date escalation (auto-escalate overdue items)
- Notification integration hooks
- EF Core persistence with query helpers

## Non-Goals

- No workflow engine (orchestration of arbitrary business processes)
- No UI rendering
- No email sending (hooks only)

## Proposed Public API

```csharp
public interface IApprovalService
{
    Task<ApprovalResult> SubmitAsync(ApprovalRequest request, CancellationToken ct = default);
    Task<ApprovalResult> ActAsync(string itemId, ApprovalAction action, CancellationToken ct = default);
    Task<IReadOnlyList<ApprovalItem>> GetPendingAsync(string approverId, ApprovalQuery query, CancellationToken ct = default);
    Task<ApprovalItem?> GetItemAsync(string itemId, CancellationToken ct = default);
    Task<IReadOnlyList<ApprovalItem>> GetHistoryAsync(ApprovalHistoryQuery query, CancellationToken ct = default);
    Task EscalateOverdueAsync(CancellationToken ct = default);
}

public sealed record ApprovalRequest(
    string ItemType,
    string ItemId,
    string Title,
    string RequesterId,
    ApprovalChain Chain,
    DateTimeOffset? DueDate = null,
    Dictionary<string, string>? Metadata = null
);

public sealed record ApprovalAction(
    string ActorId,
    ApprovalDecision Decision,
    string? Comment = null,
    string? DelegateToUserId = null
);

public enum ApprovalDecision { Approved, Rejected, Delegated }
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Approvals/` with `.csproj`.
2. Implement approval chain models, service, EF Core configuration.
3. Add escalation background service.
4. Add xunit tests for all chain types.
5. Register in `HexGuard.slnx`, add to Sample API.
