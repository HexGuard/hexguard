---
id: feature-dotnet-time-tracking
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.TimeTracking'
---

# HexGuard.TimeTracking

## Summary

Time tracking storage and reporting for .NET — time entry CRUD, timesheet management, approval workflow, and aggregation. Backend for freelancer platforms and employee timesheets.

## Goals

- Time entry creation with project/client allocation
- Active timer tracking (start/pause/resume/stop)
- Timesheet generation and submission
- Approval workflow (submit → approve/reject)
- Time aggregation (daily, weekly, monthly, per project, per client)
- Billable vs. non-billable flagging
- Idle timeout detection
- Export for payroll/invoicing (CSV, JSON)

## Non-Goals

- No payroll calculation
- No invoicing (uses HexGuard.Invoicing)
- No scheduling or resource allocation

## Proposed Public API

```csharp
public interface ITimeTrackingService
{
    // Entries
    Task<TimeEntry> CreateEntryAsync(CreateEntryRequest request, CancellationToken ct = default);
    Task<TimeEntry?> GetEntryAsync(string entryId, CancellationToken ct = default);
    Task<IReadOnlyList<TimeEntry>> QueryEntriesAsync(EntryQuery query, CancellationToken ct = default);
    Task<TimeEntry> UpdateEntryAsync(string entryId, UpdateEntryRequest request, CancellationToken ct = default);
    Task DeleteEntryAsync(string entryId, CancellationToken ct = default);
    // Timer
    Task<TimerState> StartTimerAsync(string userId, StartTimerRequest request, CancellationToken ct = default);
    Task<TimerState> PauseTimerAsync(string userId, CancellationToken ct = default);
    Task<TimerState> ResumeTimerAsync(string userId, CancellationToken ct = default);
    Task<TimeEntry> StopTimerAsync(string userId, CancellationToken ct = default);
    Task<TimerState?> GetActiveTimerAsync(string userId, CancellationToken ct = default);
    // Timesheets
    Task<Timesheet> CreateTimesheetAsync(CreateTimesheetRequest request, CancellationToken ct = default);
    Task<Timesheet> SubmitTimesheetAsync(string timesheetId, CancellationToken ct = default);
    Task<Timesheet> ApproveTimesheetAsync(string timesheetId, CancellationToken ct = default);
    Task<Timesheet> RejectTimesheetAsync(string timesheetId, string reason, CancellationToken ct = default);
    // Reports
    Task<TimeReport> GetReportAsync(TimeReportQuery query, CancellationToken ct = default);
}

public sealed record CreateEntryRequest(
    string UserId,
    DateTimeOffset Date,
    int DurationSeconds,
    string Description,
    string? ProjectId = null,
    bool IsBillable = true
);

public sealed record EntryQuery(
    string UserId,
    DateTimeOffset? From = null,
    DateTimeOffset? To = null,
    string? ProjectId = null,
    bool? IsBillable = null
);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.TimeTracking/` with `.csproj`.
2. Implement entry CRUD, timer management, timesheet workflow, aggregation.
3. Add idle detection and export.
4. Add xunit tests. Register in `HexGuard.slnx`.
