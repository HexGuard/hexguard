# @hexguard/angular-visibility — Deep Package Notes

Document and element visibility tracking for Angular: tab-hidden detection, idle-timeout, user-activity signals, and IntersectionObserver-based element visibility.

## Problem

Many Angular features depend on visibility state — pause polling when the tab is hidden, show "are you still there?" prompts after inactivity, pause animations when elements scroll out of view, and resume when the user returns. Every team rebuilds:

- `document.visibilitychange` listeners with manual cleanup
- `mousemove`/`keydown` activity timers with inconsistent timeout semantics
- `IntersectionObserver` setups per component
- No reactive signal integration — one-shot reads or raw DOM events

**`@hexguard/angular-visibility`** standardizes this into two exports: one injectable factory for document visibility + idle detection, and one standalone function for element visibility.

## Design

### Two Exports, One Pattern

```ts
import { injectVisibility, inElementVisibility } from '@hexguard/angular-visibility';
```

### `injectVisibility()`

| Signal         | Type              | Description                                  |
| -------------- | ----------------- | -------------------------------------------- |
| `isVisible`    | `Signal<boolean>` | Tab visible (via `document.visibilityState`) |
| `isIdle`       | `Signal<boolean>` | No user activity for `idleTimeoutMs`         |
| `idleDuration` | `Signal<number>`  | Milliseconds since last activity             |
| `lastActivity` | `Signal<number>`  | Timestamp of last user interaction           |

**Idle detection** works by listening to a configurable set of DOM events (`mousemove`, `keydown`, `mousedown`, `touchstart`, `scroll`, `wheel` by default). Each event resets the idle timer and updates `lastActivity`. A periodic interval (1s) updates `idleDuration` while the user is idle. When `idleDuration >= idleTimeoutMs`, `isIdle` becomes `true`.

Setting `idleTimeoutMs: 0` disables idle tracking entirely — no event listeners are registered and `isIdle` always returns `false`.

### `inElementVisibility(elementRef)`

Uses `IntersectionObserver` under the hood. The observer is created when the `elementRef` signal produces a value, and disconnected when the signal becomes `undefined` or on destroy.

The returned `Signal<boolean>` updates reactively when the element's intersection state changes.

## Lifecycle

All event listeners and observers are cleaned up automatically via Angular's `DestroyRef`:

- `visibilitychange` listener is removed on destroy
- Activity event listeners are removed on destroy
- The idle timer interval is cleared on destroy
- The `IntersectionObserver` is disconnected on destroy

## API Surface

### `injectVisibility(options?)`

**Parameters:**

- `options.idleTimeoutMs?: number` — Inactivity threshold (default 60000, 0 = disabled)
- `options.activityEvents?: string[]` — Events that reset idle timer (default: `['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'wheel']`)

### `inElementVisibility(elementRef)`

**Parameters:**

- `elementRef: Signal<ElementRef | undefined>` — Signal returning an ElementRef or undefined

**Returns:** `Signal<boolean>`

## SSR Compatibility

Both functions use browser-only APIs (`document`, `IntersectionObserver`, DOM events). If called during SSR:

- `injectVisibility()` reads `document.visibilityState` which will throw if `document` is not defined. Guard with `isPlatformBrowser()` for SSR apps.
- `inElementVisibility()` uses `IntersectionObserver` which is also browser-only. The `IntersectionObserver` constructor will throw if not available.

## Behavior Notes

- `inElementVisibility` creates a **new** `IntersectionObserver` each time the `elementRef` signal changes to a different element, disconnecting the previous observer.
- The idle timer interval runs at 1 second granularity — `idleDuration` updates in ~1s steps, not continuously.
- Custom activity events passed via `activityEvents` replace the default list entirely — they are not merged.

---

## Assessment: Potential Improvements

| Area        | Suggestion                                                                                                                                                                             | Priority    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| API         | Consider an `isAway` signal combining `!isVisible && isIdle` for "user stepped away" state                                                                                             | Low         |
| API         | Consider a `resetIdle()` method for scenarios like "user clicked 'I'm back'"                                                                                                           | Low         |
| Edge Cases  | No test for idle detection resuming after tab becomes visible again                                                                                                                    | Low         |
| Edge Cases  | `inElementVisibility` with `undefined` elementRef — should return `false` but current behavior may throw                                                                               | Medium      |
| Performance | The `IntersectionObserver` is created per `inElementVisibility` call — consider a shared observer for multiple elements                                                                | Low         |
| API         | ✅ Added RxJS observable alternatives — `fromVisibilityChanges()`, `fromIdleState()`, `fromElementVisibility()` — all return `Observable`. Import from `@hexguard/angular-visibility`. | Implemented |

## RxJS Observable API

Three standalone observable functions for RxJS consumers:

```ts
import {
  fromVisibilityChanges,
  fromIdleState,
  fromElementVisibility,
} from '@hexguard/angular-visibility';
import { switchMap } from 'rxjs/operators';

// 1. Tab visibility — pause/resume work
fromVisibilityChanges()
  .pipe(switchMap((isVisible) => (isVisible ? startPolling() : stopPolling())))
  .subscribe();

// 2. Idle detection — mark user as away
type IdleState = 'active' | 'idle';
fromIdleState(120_000) // 2-minute timeout
  .subscribe((isIdle) => updateUserStatus(isIdle ? 'idle' : 'active'));

// 3. Element visibility — lazy-load content when scrolled into view
const target = document.getElementById('lazy-section')!;
fromElementVisibility(target, '0px 0px -200px 0px').subscribe((isVisible) => {
  if (isVisible) loadContent();
});
```

## Related Resources

- [Package README](../../angular/packages/angular-visibility/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-visibility/)
- [Source Code](../../angular/packages/angular-visibility/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                                                               | Severity |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | Two orthogonal primitives: `injectVisibility()` (tab/idle) + `inElementVisibility()` (intersection). Clean separation.                                                | praise   |
| Implementation Quality | Comprehensive: tab visibility change detection, idle timeout tracking, `IntersectionObserver` for element visibility. Automatic `DestroyRef` cleanup.                 | praise   |
| Implementation Quality | `inElementVisibility` uses `effect()` in function body — if caller destroyed without injection context, the effect may leak. No SSR guard (`document` access throws). | moderate |
| Test Coverage          | Tab hide/show, idle timeout, activity reset, custom events, idle duration, `IntersectionObserver` mocking.                                                            | praise   |
| Test Coverage          | No test for element switching (element ref signal changing). No SSR guard test.                                                                                       | minor    |
| Demo Integration       | Interactive demo with tab visibility indicator, idle timer display.                                                                                                   | praise   |
