# Changelog

## 0.1.0 — 2026-06-22

Initial release of `@hexguard/angular-navigation-pending`.

### Features

- `injectNavigationPending()` — signal-based route transition busy state
- `isNavigating` signal — true during any route transition
- `isSlowNavigation` signal — true only after configurable delay threshold (prevents flash-of-spinner)
- Route-scoped mode with `markReady()` for manual page readiness control
- Automatic cleanup via `DestroyRef`

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-navigation-pending.md`
- Docs-grade demo app with navigation pending indicators
