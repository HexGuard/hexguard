---
id: feature-angular-signal-group
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-signal-group'
---

# @hexguard/angular-signal-group

## Summary

Signal-based grouping and aggregation utilities — take `Signal<T[]>`, group by a key, compute per-group aggregates (count, sum, avg, min, max), return reactive `Group<T>[]`. Every dashboard, report, and grouped table needs this.

**Competition check:** No Angular grouping signal utility exists.

## Proposed Public API

```typescript
export interface Group<T> {
  key: string;
  items: T[];
  aggregates: Record<string, number>;
}

export interface GroupConfig<T> {
  source: Signal<T[]>;
  groupBy: (item: T) => string;
  aggregates?: Record<string, (items: T[]) => number>;
  sortGroups?: 'key' | 'count' | { aggregate: string; direction?: 'asc' | 'desc' };
}

export function groupBy<T>(config: GroupConfig<T>): Signal<Group<T>[]>;

export const count: <T>(items: T[]) => number;
export const sum: <T>(field: (item: T) => number) => (items: T[]) => number;
export const avg: <T>(field: (item: T) => number) => (items: T[]) => number;
export const min: <T>(field: (item: T) => number) => (items: T[]) => number;
export const max: <T>(field: (item: T) => number) => (items: T[]) => number;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-signal-group/`.
2. Implement `groupBy()` with signal-based reactivity.
3. Implement aggregate helpers.
4. Add tests: basic grouping, aggregates, sorting, reactivity.
5. Register in workspace.
