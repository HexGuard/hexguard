---
id: feature-dotnet-leave
type: feature
status: proposed
created: 2026-06-28
package: 'HexGuard.Leave'
---

# HexGuard.Leave

## Summary

Leave/absence management backend for .NET — request submission, approval workflow, balance tracking, and team calendar. For HR systems and workforce management.

## Goals

- Leave type configuration with policy rules
- Leave request submission with date validation
- Approval workflow with configurable approvers
- Leave balance tracking with accrual rules
- Holiday calendar management per location
- Team absence calendar queries
- Conflict detection (team coverage, overlapping requests)
- Policy enforcement (max consecutive days, notice period)
- Attachment support for supporting documents

## Non-Goals

- No payroll integration
- No shift scheduling
- No attendance tracking

## Proposed Public API

```csharp
public interface ILeaveService
{
    // Leave types
    Task<IReadOnlyList<LeaveType>> GetLeaveTypesAsync(CancellationToken ct = default);
    // Requests
    Task<LeaveRequest> SubmitRequestAsync(SubmitLeaveRequest request, CancellationToken ct = default);
    Task<LeaveRequest?> GetRequestAsync(string requestId, CancellationToken ct = default);
    Task<IReadOnlyList<LeaveRequest>> QueryRequestsAsync(LeaveQuery query, CancellationToken ct = default);
    Task<LeaveRequest> CancelRequestAsync(string requestId, CancellationToken ct = default);
    // Approvals
    Task<LeaveRequest> ApproveAsync(string requestId, string? comment = null, CancellationToken ct = default);
    Task<LeaveRequest> RejectAsync(string requestId, string reason, CancellationToken ct = default);
    Task<IReadOnlyList<LeaveRequest>> GetPendingApprovalsAsync(string approverId, CancellationToken ct = default);
    // Balances
    Task<IReadOnlyList<LeaveBalance>> GetBalancesAsync(string userId, int year, CancellationToken ct = default);
    Task AccrueBalancesAsync(int year, CancellationToken ct = default);
    // Calendar
    Task<IReadOnlyList<TeamAbsence>> GetTeamAbsencesAsync(TeamCalendarQuery query, CancellationToken ct = default);
    Task<IReadOnlyList<AbsenceConflict>> DetectConflictsAsync(string userId, DateTimeOffset from, DateTimeOffset to, CancellationToken ct = default);
    // Holidays
    Task<IReadOnlyList<Holiday>> GetHolidaysAsync(string location, int year, CancellationToken ct = default);
}

public sealed record SubmitLeaveRequest(string UserId, string LeaveTypeId, DateTimeOffset StartDate, DateTimeOffset EndDate, bool IsHalfDay = false, string? Reason = null);
public enum LeaveStatus { Draft, Submitted, Approved, Rejected, Cancelled }

public sealed record LeaveBalance(string UserId, string LeaveTypeId, string LeaveTypeName, decimal Total, decimal Used, decimal Remaining, string Unit);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Leave/` with `.csproj`.
2. Implement leave types, request workflow, approval, balances, team calendar.
3. Add conflict detection and policy enforcement.
4. Add xunit tests. Register in `HexGuard.slnx`.
