---
id: feature-angular-field-audit
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-field-audit'
---

# @hexguard/angular-field-audit

## Summary

Headless field-level change history state — who changed what field, from what value to what value, and when. For "View Change History" features on entities, compliance audit trails, and data integrity verification.

## Goals

- Per-entity change history with field-level diff
- Side-by-side before/after value comparison
- Change grouping by edit session
- Filter by field, user, date range
- Restore/rollback individual field values
- Change reason/comment display
- Integration with diff computation for visual comparison

## Non-Goals

- No rendered diff viewer UI
- No actual data restoration (trigger only)
- No change approval workflow

## Proposed Public API

```typescript
export function injectFieldAudit(config: {
  endpoint: string;
}): {
  readonly changes: Signal<FieldChange[]>;
  readonly sessions: Signal<EditSession[]>;
  readonly selectedChange: Signal<FieldChange | null>;
  readonly filters: Signal<AuditFilters>;
  readonly isLoading: Signal<boolean>;
  readonly hasMore: Signal<boolean>;
  selectChange(changeId: string | null): void;
  setFilters(f: Partial<AuditFilters>): void;
  loadMore(): Promise<void>;
  rollback(entityId: string, fieldName: string, toVersion: number): Promise<void>;
  exportEntityHistory(entityType: string, entityId: string, format: 'csv' | 'pdf'): Promise<void>;
};

export interface FieldChange {
  id: string;
  entityType: string;
  entityId: string;
  fieldName: string;
  oldValue: unknown;
  newValue: unknown;
  changedBy: { id: string; name: string };
  changedAt: Date;
  sessionId: string;
  reason?: string;
  version: number;
}

export interface EditSession {
  id: string;
  userId: string;
  userName: string;
  startedAt: Date;
  endedAt?: Date;
  changeCount: number;
  entities: string[];
}

export interface AuditFilters {
  entityType?: string;
  entityId?: string;
  fieldName?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-field-audit/`.
2. Implement field-level change history, session grouping, filtering, rollback with signals.
3. Add diff integration and export.
4. Add tests. Register in workspace.
