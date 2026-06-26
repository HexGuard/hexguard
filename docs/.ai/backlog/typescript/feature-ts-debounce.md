---
id: feature-ts-debounce
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-debounce'
---

# @hexguard/ts-debounce

## Summary

Debounce and throttle utilities for TypeScript — framework-agnostic, zero-dependency. `@hexguard/angular-debounce` exists for Angular signals; this is the vanilla TS equivalent for Node.js and non-Angular projects.

**Competition check:** `lodash.debounce` dominates but is part of a larger library.

## Proposed Public API

```typescript
export interface DebounceOptions {
  delay: number;
  leading?: boolean;
  trailing?: boolean;        // Default: true
  maxWait?: number;
}

export interface DebouncedFunction<T extends (...args: unknown[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
  readonly pending: boolean;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T, delay: number | DebounceOptions
): DebouncedFunction<T>;

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T, delay: number | DebounceOptions
): DebouncedFunction<T>;
```

## Implementation Plan

1. Create `ts/packages/ts-debounce/`.
2. Implement `debounce` and `throttle` with leading/trailing/maxWait.
3. Add tests with timer mocking.
4. Publish to npm.
