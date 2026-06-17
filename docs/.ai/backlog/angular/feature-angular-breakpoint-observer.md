---
id: feature-angular-breakpoint-observer
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-breakpoint-observer'
---

# Angular Breakpoint Observer Package

## Summary

Design `@hexguard/angular-breakpoint-observer` as a tiny Angular package for standardizing reactive TypeScript breakpoint detection with typed breakpoint contracts, signal-based active-breakpoint helpers, and above/below/media-query matching so component logic can respond to viewport changes without CSS-only media queries.

The repeated problem is that CSS media queries handle presentation, but component logic frequently needs to know the viewport size in TypeScript — show/hide table columns on mobile, switch layout orientation, choose responsive data-display mode, or adapt pagination size. Every team reinvents `matchMedia` listeners with manual cleanup and inconsistent breakpoint naming.

## Goals

- Provide `injectBreakpointObserver()` returning signal-based active breakpoint and above/below comparisons.
- Provide built-in default breakpoints matching common CSS frameworks (`sm: 640`, `md: 768`, `lg: 1024`, `xl: 1280`, `2xl: 1536`).
- Support fully custom breakpoint maps for app-specific viewport thresholds.
- Expose `active: Signal<string>` — the name of the currently active (largest matching) breakpoint.
- Expose `above(name): Signal<boolean>` and `below(name): Signal<boolean>` comparison helpers.
- Expose `matches(query): Signal<boolean>` for arbitrary media query strings.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- CSS media query generation — this is for TypeScript, not stylesheets.
- Breakpoint-change animations or transition helpers.
- Element-level resize observation — that's `ResizeObserver` (`@hexguard/angular-window-state`).

## Decisions

- Use `window.matchMedia` under the hood with `change` event listeners and `DestroyRef` cleanup.
- Default breakpoints use pixel-based `min-width` queries, matching the Tailwind/PostCSS convention.
- `active` resolves to the largest matching breakpoint name (e.g., at 1024px → `'lg'`).
- `above(name)` returns `true` when the viewport is at or above the given breakpoint's minimum width.
- `below(name)` returns `true` when the viewport is strictly below the given breakpoint's minimum width.
- Keep the API surface small: one injectable factory, one options interface, one return type.

## Proposed Public API

```ts
import { injectBreakpointObserver, type BreakpointConfig } from '@hexguard/angular-breakpoint-observer';

const bp = injectBreakpointObserver({
  breakpoints: {               // custom breakpoints (default shown below)
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
});

// Reactive signals
const active = bp.active;                // Signal<'sm' | 'md' | 'lg' | 'xl' | '2xl'>
const isMobile = bp.below('md');         // Signal<boolean> — viewport < 768px
const isDesktop = bp.above('lg');        // Signal<boolean> — viewport >= 1024px
const isTablet = bp.matches('(min-width: 768px) and (max-width: 1023px)');

// All breakpoints as individual signals for template binding
bp.breakpoints;                          // { sm: Signal<boolean>, md: Signal<boolean>, ... }

// Options
interface BreakpointObserverOptions {
  breakpoints?: Record<string, number>;  // name → min-width in px
}

// Return type
interface BreakpointObserver {
  readonly active: Signal<string>;
  readonly breakpoints: Record<string, Signal<boolean>>;
  above(name: string): Signal<boolean>;
  below(name: string): Signal<boolean>;
  matches(query: string): Signal<boolean>;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-breakpoint-observer/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:breakpoint-observer`, `test:lib:breakpoint-observer`).

### Phase 1: Core Implementation

3. Implement `injectBreakpointObserver()` using `window.matchMedia` with `DestroyRef` cleanup.
4. Implement per-breakpoint `Signal<boolean>` generation from `MediaQueryList` change events.
5. Implement `active` signal that resolves to the largest matching breakpoint name.
6. Implement `above(name)` and `below(name)` — derived signals from the breakpoint map.
7. Implement `matches(query)` for arbitrary media query strings.
8. Add unit tests for: breakpoint matching at various viewport widths, `above`/`below` logic, `active` breakpoint resolution, `matches` arbitrary queries, custom breakpoint maps, cleanup on destroy, and no-breakpoints-matched edge case.

### Phase 2: Demo & Docs

9. Add a demo route at `/packages/angular-breakpoint-observer` showing:
    - Live active-breakpoint display that changes when resizing
    - Column visibility toggling based on breakpoints (hide column below md)
    - Layout orientation switch (table ↔ cards based on breakpoint)
10. Add Playwright coverage for the demo page.
11. Write the deep-dive doc at `docs/packages/angular-breakpoint-observer.md`.
12. Update the npm-facing `README.md`.

### Phase 3: Release

13. Add `verify:package:breakpoint-observer` to `angular/package.json`.
14. Add `.github/workflows/release-angular-breakpoint-observer.yml`.
15. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:breakpoint-observer` — unit tests for breakpoint matching, above/below, custom configs, cleanup.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm verify:package:breakpoint-observer` — tarball smoke test.

## Follow-Ups

- Revisit whether the default breakpoints should align with Angular Material's `LayoutModule` breakpoints for teams migrating from Material.
- Evaluate adding a `useBreakpointObserver()` standalone function (non-injectable) for services or non-Angular contexts.
