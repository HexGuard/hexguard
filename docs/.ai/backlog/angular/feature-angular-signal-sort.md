---
id: feature-angular-signal-sort
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-signal-sort'
---

# @hexguard/angular-signal-sort

## Summary

Single-function sort utility for array signals â€” take `Signal<T[]>` plus a sort config, get a sorted `Signal<T[]>`. Supports multi-sort, custom comparers, and locale-aware strings. Trivial pattern repeated hundreds of times per codebase.

**Competition check:** No Angular signal-sort utility exists.


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
export interface SortConfig<T> {
  key: keyof T | ((item: T) => unknown);
  direction?: 'asc' | 'desc';
  comparer?: (a: unknown, b: unknown) => number;
  locale?: string;
  caseSensitive?: boolean;
}

export function sorted<T>(
  source: Signal<T[]>,
  config: SortConfig<T> | Signal<SortConfig<T>>
): Signal<T[]>;

export function sortedMulti<T>(
  source: Signal<T[]>,
  configs: SortConfig<T>[] | Signal<SortConfig<T>[]>
): Signal<T[]>;

// Usage
const sortedItems = sorted(items, { key: 'name', direction: 'asc' });
const sortedUsers = sortedMulti(users, [
  { key: 'age', direction: 'desc' },
  { key: 'name', direction: 'asc' },
]);
```

## Implementation Plan

1. Scaffold `angular/packages/angular-signal-sort/`.
2. Implement `sorted()` and `sortedMulti()` with `computed()`.
3. Support key extraction, custom comparers, locale sorting.
4. Add tests.
5. Register in workspace.
