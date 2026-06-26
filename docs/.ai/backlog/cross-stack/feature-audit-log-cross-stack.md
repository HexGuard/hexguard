---
id: feature-audit-log-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.AuditTrail + @hexguard/angular-audit-log'
---

# Audit Log Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for audit logging — the .NET side captures entity changes via EF Core interceptor, stores audit events, and exposes a queryable API; the Angular side provides a headless audit log viewer with filtering, pagination, and detail expansion.

**Promoted from sidenote:** `HexGuard.AuditTrail` already has a planned brief in `dotnet/` for the backend. `@hexguard/angular-audit-log-viewer` is a sidenote. This brief formalizes the frontend counterpart and cross-stack contract.

## Why Wide Adoption

Audit trails are required by compliance standards (SOX, HIPAA, GDPR, SOC 2) and are a standard feature in enterprise apps. Every team building admin panels ends up building an audit log viewer.

## Goals

### .NET (`HexGuard.AuditTrail` — extending existing brief)

1. Expose a queryable audit log API endpoint with filtering (entity, action, user, date range).
2. Provide `IAuditLogService` for programmatic querying.

### Angular (`@hexguard/angular-audit-log`)

1. Provide `injectAuditLog()` — query state with filters, pagination, and detail expansion.
2. Support filtering by entity type, action (created/updated/deleted), user, date range.
3. Support detail expansion — show before/after values for changes.
4. Provide human-readable action descriptions.

## Proposed Public API

### Angular

```typescript
export interface AuditLogConfig {
  endpoint: string;                          // API base URL
  pageSize?: number;
}

export interface AuditLogState {
  readonly entries: Signal<AuditLogEntry[]>;
  readonly totalCount: Signal<number>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly filters: Signal<AuditLogFilters>;
  readonly expandedEntry: Signal<string | null>;   // Entry ID
  readonly selectedEntry: Signal<AuditLogEntry | null>;

  setFilters(filters: Partial<AuditLogFilters>): void;
  resetFilters(): void;
  loadPage(page: number): Promise<void>;
  expandEntry(id: string | null): void;
  refresh(): Promise<void>;
}

export interface AuditLogFilters {
  entityType?: string;
  action?: 'created' | 'updated' | 'deleted';
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  changes: AuditChange[];                    // Before/after per field
  metadata: Record<string, string>;
}

export interface AuditChange {
  field: string;
  oldValue: string | null;
  newValue: string | null;
}

export function injectAuditLog(config: AuditLogConfig): AuditLogState;
```

## Implementation Plan

1. Extend existing `HexGuard.AuditTrail` brief with query API specification.
2. Create Angular package with `injectAuditLog()`.
3. Add tests for filtering, pagination, detail expansion.
4. Register both packages.
