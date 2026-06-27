---
id: feature-angular-time-tracking
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-time-tracking'
---

# @hexguard/angular-time-tracking

## Summary

Headless time tracking state — timer start/stop, time entry list, timesheet review, and project/client allocation. For freelancer platforms, agency billing, and employee timesheets.

## Goals

- Active timer with start/pause/resume/stop
- Manual time entry (date, duration, description, project, billable)
- Timesheet view (daily/weekly/monthly aggregation)
- Project and client allocation per entry
- Billable vs. non-billable tracking
- Timesheet submission for approval
- Approval workflow state (pending, approved, rejected)
- Running total calculations (hours today/this week/this month)
- Idle detection (pause timer after inactivity)

## Non-Goals

- No rendered timer UI
- No invoicing (uses angular-invoice)
- No payroll integration

## Proposed Public API

```typescript
export function injectTimeTracking(config: {
  endpoint: string;
}): {
  // Timer
  readonly activeTimer: Signal<ActiveTimer | null>;
  readonly elapsed: Signal<number>; // seconds
  readonly isRunning: Signal<boolean>;
  startTimer(projectId?: string, description?: string): void;
  pauseTimer(): void;
  resumeTimer(): void;
  stopTimer(): Promise<TimeEntry>;
  // Entries
  readonly entries: Signal<TimeEntry[]>;
  readonly dateRange: Signal<{ from: Date; to: Date }>;
  readonly summary: Signal<TimeSummary>;
  readonly isLoading/submitting: Signal<boolean>;
  createEntry(entry: NewTimeEntry): Promise<TimeEntry>;
  updateEntry(id: string, changes: Partial<TimeEntry>): Promise<void>;
  deleteEntry(id: string): Promise<void>;
  setDateRange(from: Date, to: Date): void;
  // Timesheets
  readonly timesheets: Signal<Timesheet[]>;
  submitTimesheet(id: string): Promise<void>;
  approveTimesheet(id: string): Promise<void>;
  rejectTimesheet(id: string, reason: string): Promise<void>;
};

export interface ActiveTimer { startTime: Date; projectId?: string; description?: string; isPaused: boolean; }
export interface TimeEntry { id: string; date: Date; durationSeconds: number; description: string; projectId?: string; projectName?: string; isBillable: boolean; timesheetId?: string; }
export interface NewTimeEntry { date: Date; durationSeconds: number; description: string; projectId?: string; isBillable: boolean; }
export interface TimeSummary { totalHours: number; billableHours: number; nonBillableHours: number; entryCount: number; }
export interface Timesheet { id: string; periodStart: Date; periodEnd: Date; status: 'draft' | 'submitted' | 'approved' | 'rejected'; totalHours: number; entryIds: string[]; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-time-tracking/`.
2. Implement timer, entry CRUD, timesheet workflow, summaries with signals.
3. Add idle detection and auto-pause.
4. Add tests. Register in workspace.
