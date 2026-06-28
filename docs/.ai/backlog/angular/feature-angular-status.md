---
id: feature-angular-status
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-status'
---

# @hexguard/angular-status

## Summary

System status page state â€” health checks, recent incidents, uptime, metrics overview. Like Statuspage.io but headless state for embedding in admin panels.


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
export function injectSystemStatus(config: {
  endpoints: { health: string; metrics?: string; incidents?: string };
}): {
  readonly overallStatus: Signal<'operational' | 'degraded' | 'outage' | 'maintenance'>;
  readonly checks: Signal<HealthCheck[]>;
  readonly incidents: Signal<Incident[]>;
  readonly uptime: Signal<{ daily: number; weekly: number; monthly: number }>;
  readonly isLoading/error: Signal<boolean>;
  refresh(): Promise<void>;
  startPolling(intervalMs: number): void;
  stopPolling(): void;
};
```

## Implementation Plan
1. Scaffold `angular/packages/angular-status/`.
2. Implement health + metrics + incidents aggregation with signals.
3. Add tests. Register in workspace.
