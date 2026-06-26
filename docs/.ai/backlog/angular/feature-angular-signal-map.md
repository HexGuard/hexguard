---
id: feature-angular-signal-map
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-signal-map'
---

# @hexguard/angular-signal-map

## Summary

Signal array utility functions — `map`, `filter`, `reduce`, `find`, `some`, `every`, `flatMap` as computed signals operating on array signals. Every data transformation in a component currently writes the same `computed(() => source().map(...))` pattern.

**Competition check:** No Angular signal array utility package exists. The patterns are trivial but repeated endlessly.

## Proposed Public API

```typescript
export function mapSignal<T, U>(source: Signal<T[]>, fn: (item: T, index: number) => U): Signal<U[]>;
export function filterSignal<T>(source: Signal<T[]>, predicate: (item: T) => boolean): Signal<T[]>;
export function findSignal<T>(source: Signal<T[]>, predicate: (item: T) => boolean): Signal<T | undefined>;
export function reduceSignal<T, U>(source: Signal<T[]>, fn: (acc: U, item: T) => U, initial: U): Signal<U>;
export function someSignal<T>(source: Signal<T[]>, predicate: (item: T) => boolean): Signal<boolean>;
export function everySignal<T>(source: Signal<T[]>, predicate: (item: T) => boolean): Signal<boolean>;
export function flatMapSignal<T, U>(source: Signal<T[]>, fn: (item: T) => U[]): Signal<U[]>;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-signal-map/`.
2. Implement each utility as a thin wrapper around `computed()`.
3. Add tests for each function and edge cases (empty array, null/undefined items).
4. Register in workspace.
