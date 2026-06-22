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

| Signal | Type | Description |
|--------|------|-------------|
| `isVisible` | `Signal<boolean>` | Tab visible (via `document.visibilityState`) |
| `isIdle` | `Signal<boolean>` | No user activity for `idleTimeoutMs` |
| `idleDuration` | `Signal<number>` | Milliseconds since last activity |
| `lastActivity` | `Signal<number>` | Timestamp of last user interaction |

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
