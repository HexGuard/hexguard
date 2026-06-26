---
id: feature-angular-effect-utils
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-effect-utils'
---

# @hexguard/angular-effect-utils

## Summary

Signal effect utilities for Angular — `debouncedEffect` (run an effect after changes settle), `batchEffects` (run multiple effects in a single change detection cycle), `effectWithCleanup` (auto-cleanup reusable effect), and `effectOnIdle` (run effects during browser idle time). Complements `@hexguard/angular-debounce` (which debounces values) with effect-level debouncing.

**Promoted from sidenote.** As signal adoption grows, effect lifecycle management becomes critical for production apps.

**Competition Check:** Angular's built-in `effect()` is the only option — no debounced, batched, or idle-time variants exist in the framework.

## Goals

1. Provide `debouncedEffect` — run effect N ms after the last dependency change.
2. Provide `batchEffects` — run multiple effects in a single microtask, sharing one change detection cycle.
3. Provide `effectWithCleanup` — explicit cleanup function registration without manual `DestroyRef`.
4. Provide `effectOnIdle` — run effect during browser idle periods via `requestIdleCallback`.
5. All return `EffectRef` for manual disposal.

## Proposed Public API

```typescript
export function debouncedEffect(
  fn: () => void | (() => void),
  delayMs: number
): EffectRef;

export function batchEffects(
  ...effects: (() => void)[]
): EffectRef;

export function effectWithCleanup(
  fn: (onCleanup: (cleanupFn: () => void) => void) => void
): EffectRef;

export function effectOnIdle(
  fn: () => void,
  options?: { timeout?: number }
): EffectRef;

// Usage
debouncedEffect(() => saveToStorage(theme()), 500);  // Save 500ms after last change

batchEffects(
  () => updateTotal(),
  () => recalculateTax(),
);  // Both run in same detection cycle
```

## Implementation Plan

1. Scaffold `angular/packages/angular-effect-utils/`.
2. Implement `debouncedEffect` using `setTimeout` + `DestroyRef`.
3. Implement `batchEffects` using `untracked` to batch signal reads.
4. Implement `effectWithCleanup` and `effectOnIdle`.
5. Add tests: debounce timing, batch execution order, cleanup on destroy, idle callback.
6. Register in workspace.
