# @hexguard/angular-navigation-pending — Deep Package Notes

Route transition busy state for Angular: signal-based `isNavigating` and `isSlowNavigation` indicators with configurable delay threshold and route-scoped mode.

## Problem

Every Angular app needs to know when a route transition is in progress — to show a loading bar, a spinner, or to defer interactions until the new page is ready. Teams rebuild the same Router event subscriptions, timer logic for "slow navigation" detection, and manual cleanup in every project.

**`@hexguard/angular-navigation-pending`** standardizes this into a single injectable contract.

## Design

### One Injectable, Two Signals

```ts
import { injectNavigationPending } from '@hexguard/angular-navigation-pending';

const nav = injectNavigationPending({ delayedIndicatorMs: 200 });
```

| Signal             | Type              | Description                                                     |
| ------------------ | ----------------- | --------------------------------------------------------------- |
| `isNavigating`     | `Signal<boolean>` | True from `NavigationStart` to `NavigationEnd`/`Cancel`/`Error` |
| `isSlowNavigation` | `Signal<boolean>` | True only after `delayedIndicatorMs` of continuous navigation   |

### Two Modes

**App-level (default):** `isNavigating` is purely driven by Router events. The signal becomes `true` on `NavigationStart` and `false` on `NavigationEnd`, `NavigationCancel`, or `NavigationError`.

**Route-scoped (`routeScoped: true`):** `isNavigating` becomes `false` only when `markReady()` is called, giving the component control over when the "loading" state ends. This composes naturally with async data loading:

```ts
const pageNav = injectNavigationPending({ routeScoped: true });

effect(() => {
  if (data.isLoaded()) {
    pageNav.markReady();
  }
});
```

### Flash-of-Spinner Prevention

The `delayedIndicatorMs` option delays `isSlowNavigation` from becoming `true`. Fast transitions (under the threshold) never show the slow-navigation indicator at all — preventing the flash-of-spinner that would otherwise appear and immediately disappear.

## Lifecycle

- The Router event subscription is cleaned up via `DestroyRef.onDestroy()`
- The delay timer (`setTimeout`) is cleared on navigation completion and on destroy

## API Surface

### `injectNavigationPending(options?)`

**Parameters:**

- `options.delayedIndicatorMs?: number` — Delay before `isSlowNavigation` becomes true (default 200, 0 = immediate)
- `options.routeScoped?: boolean` — Enable manual `markReady()` control (default false)

**Returns:** `NavigationPendingState`

### `NavigationPendingState`

```ts
interface NavigationPendingState {
  readonly isNavigating: Signal<boolean>;
  readonly isSlowNavigation: Signal<boolean>;
  markReady(): void;
}
```

## Behavior Notes

- `isSlowNavigation` is always `false` when not navigating.
- When `delayedIndicatorMs: 0`, `isSlowNavigation` mirrors `isNavigating` exactly.
- `markReady()` is a no-op when `routeScoped` is `false`.
- On a new `NavigationStart`, `ready` is reset to `false`, so route-scoped navigation tracking works correctly for repeated navigations.
- The `@angular/router` package is a required peer dependency.

---

## Assessment: Potential Improvements

| Area        | Suggestion                                                                                            | Priority |
| ----------- | ----------------------------------------------------------------------------------------------------- | -------- |
| API         | Consider a `navigationCount` signal tracking total route transitions for analytics                    | Low      |
| API         | Consider `onSlowNavigation` / `onFastNavigation` callbacks for side-effects (e.g., logging)           | Low      |
| Edge Cases  | Route-scoped mode with parallel child/aux routes — `markReady()` from one may prematurely end another | Medium   |
| Edge Cases  | No test for `delayedIndicatorMs: 0` immediate mode                                                    | Low      |
| Integration | Consider a companion `provideNavigationPending()` at the route level for configuration                | Low      |

## Related Resources

- [Package README](../../angular/packages/angular-navigation-pending/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-navigation-pending/)
- [Source Code](../../angular/packages/angular-navigation-pending/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                          | Severity |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Clean surface: 1 function (`injectNavigationPending`), 2 types.                                                                  | praise   |
| Implementation Quality    | Router event subscription with `DestroyRef` cleanup. Delayed slow-navigation indicator prevents spinner flash.                   | praise   |
| Implementation Quality    | Uses RxJS `Subscription` for Router events — inconsistent with signal-first philosophy. Could use `toSignal` or `effect`.        | minor    |
| Test Coverage             | NavigationStart/End/Cancel/Error, delay threshold, immediate mode, route-scoped `markReady()`.                                   | praise   |
| Test Coverage             | No test for rapid successive navigations. `ready` signal in route-scoped mode not reset on `NavigationCancel`/`NavigationError`. | minor    |
| Demo Integration          | Interactive demo with navigation simulation and progress indicator.                                                              | praise   |
| Cross-package Consistency | No `verify:package:navigation-pending` standalone script in `angular/package.json`.                                              | minor    |
