---
id: feature-angular-job-monitor
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-job-monitor'
---

# @hexguard/angular-job-monitor

## Summary

Background job monitoring dashboard state â€” job list, statuses, schedules, history, manual trigger. Every app with background jobs needs monitoring.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export function injectJobMonitor(config: { endpoint: string }): {
  readonly jobs: Signal<JobInfo[]>;
  readonly recentExecutions: Signal<JobExecution[]>;
  readonly selectedJob: Signal<JobInfo | null>;
  readonly isLoading/error: Signal<boolean>;
  triggerJob(id: string): Promise<void>;
  cancelExecution(executionId: string): Promise<void>;
  refresh(): Promise<void>;
};

export interface JobInfo { id: string; name: string; schedule: string; status: 'running'|'idle'|'failed'; lastRun?: Date; }
export interface JobExecution { id: string; jobId: string; startedAt: Date; completedAt?: Date; status: string; error?: string; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-job-monitor/`.
2. Implement job list, execution history, manual trigger with signals.
3. Add tests. Register in workspace.
