# @hexguard/angular-breakpoint-observer — Deep Package Notes

Signal-based reactive breakpoint detection for Angular: one injectable factory wrapping `window.matchMedia` into typed signals with `active`, `above`, `below`, `matches`, and per-breakpoint helpers.

## Problem

CSS media queries handle presentation, but component logic frequently needs to know the viewport size in TypeScript — show/hide table columns on mobile, switch layout orientation, choose responsive data-display mode, or adapt pagination size. Every team reinvents `matchMedia` listeners with:

- Manual `addEventListener` / `removeEventListener` cleanup
- Inconsistent breakpoint naming across components
- No standard "above" or "below" comparison helpers
- No reactive signal integration — values are one-shot reads or raw DOM events

**`@hexguard/angular-breakpoint-observer`** standardizes this into a single injectable contract.

## Design

### One Injectable, One Return Type

```ts
import { injectBreakpointObserver } from '@hexguard/angular-breakpoint-observer';

const bp = injectBreakpointObserver({
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 },
});
```

The `BreakpointObserver` return type provides five categories of reactive signals:

| Category       | Member           | Type                              | Description                      |
| -------------- | ---------------- | --------------------------------- | -------------------------------- |
| Active         | `active`         | `Signal<string>`                  | Largest matching breakpoint name |
| Per-breakpoint | `breakpoints`    | `Record<string, Signal<boolean>>` | One boolean per breakpoint       |
| Comparison     | `above(name)`    | `Signal<boolean>`                 | Viewport ≥ named breakpoint      |
| Comparison     | `below(name)`    | `Signal<boolean>`                 | Viewport < named breakpoint      |
| Arbitrary      | `matches(query)` | `Signal<boolean>`                 | Any CSS media query string       |

### Lifecycle

All `matchMedia` listeners are registered through `addEventListener('change', ...)` and cleaned up automatically via `DestroyRef.onDestroy()`. When the injecting component or service is destroyed, all listeners are removed.

The `matches(query)` method creates a standalone `MediaQueryList` — its listener is also cleaned up on destroy.

### Default Breakpoints

Defaults match the Tailwind / PostCSS convention:

| Name  | Min Width |
| ----- | --------- |
| `sm`  | 640px     |
| `md`  | 768px     |
| `lg`  | 1024px    |
| `xl`  | 1280px    |
| `2xl` | 1536px    |

All defaults are overridable via the `breakpoints` option.

## API Surface

### `injectBreakpointObserver(options?)`

**Imports:** `@angular/core` (`DestroyRef`, `inject`, `computed`, `signal`, `Signal`)

**Parameters:**

- `options.breakpoints?: Record<string, number>` — Custom breakpoint map. Defaults to Tailwind-compatible values.

**Returns:** `BreakpointObserver`

### `BreakpointObserver`

```ts
interface BreakpointObserver {
  readonly active: Signal<string>;
  readonly breakpoints: Record<string, Signal<boolean>>;
  above(name: string): Signal<boolean>;
  below(name: string): Signal<boolean>;
  matches(query: string): Signal<boolean>;
}
```

---

## Assessment: Potential Improvements

| Area        | Suggestion                                                                                                | Priority |
| ----------- | --------------------------------------------------------------------------------------------------------- | -------- |
| API         | Consider `atLeast(name)` / `atMost(name)` as aliases for `above`/`below` for readability                  | Low      |
| API         | Consider an `orientation` signal (portrait vs landscape) as a built-in query                              | Low      |
| Edge Cases  | No test for empty breakpoint map or zero-value thresholds                                                 | Low      |
| SSR         | Document `isPlatformBrowser` guard pattern for SSR apps                                                   | Low      |
| Performance | All breakpoints create separate `matchMedia` listeners — consider lazy creation for large breakpoint maps | Low      |

## Behavior Notes

### `active` Resolution

The `active` signal iterates breakpoints from largest to smallest and returns the name of the first match. At 1024px viewport width, with default breakpoints, `active` returns `'lg'` because:

- `2xl` (1536px) → no match
- `xl` (1280px) → no match
- `lg` (1024px) → match → returns `'lg'`

When no breakpoint matches (viewport narrower than the smallest defined breakpoint), `active` returns an empty string `''`.

### `above` vs `below`

- `above(name)` returns `true` when the viewport is **at or above** the named breakpoint's minimum width.
- `below(name)` returns `true` when the viewport is **strictly below** the named breakpoint's minimum width.
- Unknown breakpoint names return `false` for both `above` and `below`.

### `matches(query)`

The `matches()` method creates a new `MediaQueryList` for the given query string. It is independent of the breakpoint map. Common use cases:

```ts
// Landscape orientation
const isLandscape = bp.matches('(orientation: landscape)');

// Dark mode preference
const prefersDark = bp.matches('(prefers-color-scheme: dark)');

// Reduced motion
const prefersReducedMotion = bp.matches('(prefers-reduced-motion: reduce)');

// Custom range
const isTablet = bp.matches('(min-width: 768px) and (max-width: 1023px)');
```

## SSR Compatibility

`window.matchMedia` is browser-only. If `injectBreakpointObserver()` is called during server-side rendering, Angular's `DestroyRef` is available, but `window.matchMedia` will throw since `window` is not defined.

**Recommended guard for SSR apps:**

```ts
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';

function injectBreakpointObserverSafe() {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    // Return a no-op observer that never matches
    return createNoopObserver();
  }
  return injectBreakpointObserver();
}
```

For most apps, this is unnecessary — if the component never renders on the server (e.g., it's inside a route guard or a client-only feature), `injectBreakpointObserver()` can be used directly.

## Comparison with Alternatives

| Approach                         | Reactive Signals |       Cleanup       | Standardized Naming | Custom Queries |
| -------------------------------- | :--------------: | :-----------------: | :-----------------: | :------------: |
| Raw `matchMedia`                 |        ✗         |       Manual        |          ✗          |       ✓        |
| CDK BreakpointObserver           | Observable-based | Manual unsubscribe  |          ✗          |       ✓        |
| **HexGuard breakpoint-observer** |    ✓ `Signal`    | Auto (`DestroyRef`) | ✓ Tailwind defaults |       ✓        |

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension              | Finding                                                                                                                         | Severity |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design      | Clean surface: 1 function (`injectBreakpointObserver`), `DEFAULT_BREAKPOINTS`, 2 types.                                         | praise   |
| Implementation Quality | Signal-first with `above()`/`below()`/`matches()` helpers. All `matchMedia` listeners cleaned up via `DestroyRef`.              | praise   |
| Implementation Quality | Tailwind-compatible defaults (sm/md/lg/xl/2xl).                                                                                 | praise   |
| Test Coverage          | Breakpoint matching, active resolution, above/below, unknown names, custom breakpoints, `matches()` arbitrary queries.          | praise   |
| Test Coverage          | No viewport resize simulation test (matchMedia change event propagation not tested). No SSR guard (`window.matchMedia` throws). | minor    |
| Demo Integration       | Interactive demo with live breakpoint display and resize window guidance.                                                       | praise   |
