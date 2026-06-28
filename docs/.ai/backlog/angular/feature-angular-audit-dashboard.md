---
id: feature-angular-audit-dashboard
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-audit-dashboard'
---

# @hexguard/angular-audit-dashboard

## Summary

Audit event browsing dashboard â€” timeline, entity filter, user filter, export. Pairs with `HexGuard.AuditTrail`.


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
export function injectAuditDashboard(config: { endpoint: string }): {
  readonly events: Signal<AuditEvent[]>;
  readonly filters: Signal<AuditFilters>;
  readonly timeline: Signal<TimelineEntry[]>;
  readonly totalCount/loading/error: Signal<...>;
  setFilters(f: Partial<AuditFilters>): void;
  loadMore(): Promise<void>;
  export(format: 'csv' | 'pdf'): Promise<void>;
};

export interface AuditFilters { entityType?: string; action?: string; userId?: string; dateFrom?: Date; dateTo?: Date; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-audit-dashboard/`.
2. Implement event browsing, timeline, filtering, export with signals.
3. Add tests. Register in workspace.
