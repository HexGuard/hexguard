---
id: feature-ts-array
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-array'
---

# @hexguard/ts-array

## Summary

Zero-dependency array utility functions â€” chunk, group, unique, shuffle, range, zip, partition, and more. Fills the gap in the standard library.


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
export function chunk<T>(arr: T[], size: number): T[][];
export function groupBy<T, K extends string | number>(arr: T[], fn: (item: T) => K): Record<K, T[]>;
export function unique<T>(arr: T[]): T[];
export function uniqueBy<T, K>(arr: T[], fn: (item: T) => K): T[];
export function shuffle<T>(arr: T[]): T[];
export function range(start: number, end: number, step?: number): number[];
export function zip<A, B>(a: A[], b: B[]): [A, B][];
export function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]];
export function intersect<T>(a: T[], b: T[]): T[];
export function difference<T>(a: T[], b: T[]): T[];
export function move<T>(arr: T[], fromIndex: number, toIndex: number): T[];
export function swap<T>(arr: T[], i: number, j: number): T[];
export function compact<T>(arr: (T | null | undefined)[]): T[];
export function first<T>(arr: T[]): T | undefined;
export function last<T>(arr: T[]): T | undefined;
export function take<T>(arr: T[], n: number): T[];
```

## Implementation Plan

1. Create `ts/packages/ts-array/` with zero dependencies.
2. Implement all functions with full TypeScript types.
3. Add tests for edge cases (empty arrays, sparse arrays).
4. Publish to npm.
