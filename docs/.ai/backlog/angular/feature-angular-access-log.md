---
id: feature-angular-access-log
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-access-log'
---

# @hexguard/angular-access-log

## Summary

Headless access log viewer state — browse who accessed what data, when, and from where. For privacy dashboards ("Who viewed my data?"), security audit, and access transparency.

## Goals

- Access log list with pagination and filters
- Filter by data type, user, action, date range
- Access pattern visualization data (frequency, anomalies)
- Export access log for audit
- Real-time access event streaming (SSE/WebSocket)
- Anomaly detection signals (unusual access patterns)
- Access reason/justification display

## Non-Goals

- No access log storage (server-side)
- No anomaly detection engine (signals only)
- No rendered charts

## Proposed Public API

```typescript
export function injectAccessLog(config: {
  endpoint: string;
  live?: { transport: 'sse' | 'websocket'; url: string };
}): {
  readonly entries: Signal<AccessLogEntry[]>;
  readonly filters: Signal<AccessLogFilters>;
  readonly anomalies: Signal<AccessAnomaly[]>;
  readonly totalCount: Signal<number>;
  readonly isLoading: Signal<boolean>;
  readonly hasMore: Signal<boolean>;
  setFilters(f: Partial<AccessLogFilters>): void;
  loadMore(): Promise<void>;
  export(format: 'csv' | 'pdf'): Promise<void>;
  refresh(): Promise<void>;
};

export interface AccessLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'read' | 'write' | 'delete' | 'export' | 'search';
  dataType: string;
  dataId?: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: Date;
  reason?: string;
  location?: { city?: string; country?: string };
}

export interface AccessLogFilters {
  userId?: string;
  dataType?: string;
  action?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface AccessAnomaly {
  type: 'unusual_location' | 'off_hours' | 'bulk_access' | 'frequency_spike';
  description: string;
  entries: AccessLogEntry[];
  detectedAt: Date;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-access-log/`.
2. Implement access log list, filtering, anomaly signals, live updates.
3. Add export and pagination.
4. Add tests. Register in workspace.
