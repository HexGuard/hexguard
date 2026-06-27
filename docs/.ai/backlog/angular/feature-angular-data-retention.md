---
id: feature-angular-data-retention
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-data-retention'
---

# @hexguard/angular-data-retention

## Summary

Headless data retention schedule state — display, manage, and enforce data retention policies. For compliance dashboards showing what data is kept, for how long, and when it will be purged.

## Goals

- Retention policy list with categories and durations
- Data inventory display (what types of data exist)
- Upcoming purges calendar
- Retention policy override requests
- Legal hold management (prevent deletion for legal cases)
- Retention compliance status per category
- Audit-friendly retention decisions log

## Non-Goals

- No actual data deletion (server-side enforcement)
- No retention policy authoring
- No legal hold workflow engine

## Proposed Public API

```typescript
export function injectDataRetention(config: {
  endpoint: string;
}): {
  readonly policies: Signal<RetentionPolicy[]>;
  readonly inventory: Signal<DataInventoryItem[]>;
  readonly upcomingPurges: Signal<PurgeSchedule[]>;
  readonly legalHolds: Signal<LegalHold[]>;
  readonly complianceStatus: Signal<Record<string, 'compliant' | 'overdue' | 'at-risk'>>;
  readonly isLoading: Signal<boolean>;
  requestOverride(policyId: string, reason: string, newDurationDays: number): Promise<void>;
  placeLegalHold(dataCategory: string, caseRef: string, reason: string): Promise<void>;
  releaseLegalHold(holdId: string): Promise<void>;
  refresh(): Promise<void>;
};

export interface RetentionPolicy {
  id: string;
  category: string;
  dataType: string;
  retentionDays: number;
  justification: string;
  isOverridable: boolean;
}

export interface DataInventoryItem {
  category: string;
  recordCount: number;
  oldestRecord: Date;
  newestRecord: Date;
  nextPurgeDate?: Date;
}

export interface PurgeSchedule { category: string; recordCount: number; scheduledDate: Date; }
export interface LegalHold { id: string; dataCategory: string; caseRef: string; placedAt: Date; placedBy: string; reason: string; }
```

## Implementation Plan
1. Scaffold `angular/packages/angular-data-retention/`.
2. Implement policy list, inventory, purge calendar, legal holds with signals.
3. Add compliance status computation.
4. Add tests. Register in workspace.
