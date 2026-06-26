---
id: feature-ts-collections
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-collections'
---

# @hexguard/ts-collections

## Summary

Collection utility functions for TypeScript — deep merge, deep clone, deep equal, diff/patch, groupBy, uniqueBy, sortBy, chunk, range. Every TypeScript codebase accumulates ad-hoc versions of these.

**Competition check:** `lodash`, `ramda` cover these but are large. This is a narrow, tree-shakeable package with just the 10 most commonly used collection utilities.

## Proposed Public API

```typescript
export function deepMerge<T extends Record<string, unknown>>(target: T, ...sources: Partial<T>[]): T;
export function deepClone<T>(value: T): T;
export function deepEqual(a: unknown, b: unknown): boolean;
export function diff<T>(oldObj: T, newObj: T): DiffEntry[];
export function patch<T>(obj: T, entries: DiffEntry[]): T;

export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]>;
export function uniqueBy<T>(array: T[], keyFn: (item: T) => unknown): T[];
export function sortBy<T>(array: T[], keyFn: (item: T) => unknown, dir?: 'asc' | 'desc'): T[];
export function chunk<T>(array: T[], size: number): T[][];
export function range(start: number, end: number, step?: number): number[];

export interface DiffEntry {
  path: string;          // "user.address.city"
  type: 'added' | 'removed' | 'changed';
  oldValue?: unknown;
  newValue?: unknown;
}
```

## Implementation Plan

1. Create `ts/packages/ts-collections/`.
2. Implement all utilities.
3. Add tests.
4. Publish to npm.
