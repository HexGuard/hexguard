# Changelog

## 0.1.0 — 2026-06-21

Initial release of `@hexguard/angular-breakpoint-observer`.

### Features

- `injectBreakpointObserver()` — signal-based reactive breakpoint detection using `window.matchMedia`
- `active` signal — resolves to the largest matching breakpoint name
- `breakpoints` record — per-breakpoint `Signal<boolean>` for each defined breakpoint
- `above(name)` — derived signal, true when viewport is at or above the named breakpoint
- `below(name)` — derived signal, true when viewport is strictly below the named breakpoint
- `matches(query)` — signal for arbitrary media query strings
- Configurable breakpoint map with Tailwind-compatible defaults (`sm`: 640, `md`: 768, `lg`: 1024, `xl`: 1280, `2xl`: 1536)

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-breakpoint-observer.md`
- Docs-grade demo app with breakpoint detection playground
