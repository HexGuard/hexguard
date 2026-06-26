---
id: feature-angular-signal-utils
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-signal-utils'
---

# @hexguard/angular-signal-utils

## Summary

A collection of signal utility functions extending Angular's signal primitives — `computedFrom` (derive from multiple signals with a projection), `toggle` (boolean flip), `memoized` (cached computed with TTL), `debounced` (signal that lags behind source), and `derived` (computed with equality). A foundational building block that other HexGuard packages and consumer apps can depend on.

**Promoted from sidenote.** As the Angular signal ecosystem grows, utility primitives become essential infrastructure.

**Competition check:** No standalone signal utility package exists for Angular. Some community snippets exist on GitHub, but no published npm package.

## Why Wide Adoption

Angular's built-in `signal()`, `computed()`, and `effect()` cover basics but lack common patterns: multi-source computed, toggles, memoized/cached computed, and debounced signals. These patterns appear in virtually every app.

## Goals

1. Provide `computedFrom` — derive a signal from multiple source signals with a projection function.
2. Provide `injectToggle` — boolean toggle signal with `toggle()`, `on()`, `off()` methods.
3. Provide `memoized` — cached computed signal that only recomputes after a TTL window expires.
4. Provide `debouncedSignal` — signal that lags behind its source by a configurable delay.
5. All functions auto-cleanup on destroy.

## Proposed Public API

```typescript
// ── Multi-source computed ────────────────────────────────

export function computedFrom<T, D extends unknown[]>(
  deps: [...{ [K in keyof D]: Signal<D[K]> }],
  project: (...values: D) => T,
  options?: { equal?: (a: T, b: T) => boolean }
): Signal<T>;

// ── Toggle ───────────────────────────────────────────────

export function injectToggle(initial?: boolean): {
  readonly value: Signal<boolean>;
  toggle(): void;
  set(value: boolean): void;
  on(): void;
  off(): void;
};

// ── Memoized (cached computed with TTL) ─────────────────

export function memoized<T>(
  factory: () => T,
  ttlMs: number
): Signal<T>;

// ── Debounced signal ────────────────────────────────────

export function debouncedSignal<T>(
  source: () => T,
  delayMs: number
): Signal<T>;

// ── Usage ─────────────────────────────────────────────────

// computedFrom
const fullName = computedFrom(
  [firstName, lastName] as const,
  (first, last) => `${first} ${last}`
);

// Toggle
const sidebar = injectToggle(true);
sidebar.toggle();

// Memoized (recomputed at most every 5s)
const expensive = memoized(() => computeExpensive(), 5000);
```

## Implementation Plan

1. Scaffold `angular/packages/angular-signal-utils/`.
2. Implement `computedFrom`, `injectToggle`, `memoized`, `debouncedSignal`.
3. Implement cleanup via `DestroyRef`.
4. Add tests for each utility (basic usage, edge cases, cleanup).
5. Register in workspace.
