# Changelog

## 0.1.0 — 2026-06-17

Initial release of `@hexguard/angular-error-boundary`.

### Features

- `HexguardErrorBoundaryComponent` — declarative standalone component that catches render-time and async errors from projected content
- Custom fallback template support via `@Input() fallback`
- `reset()` method to clear error state and re-render content
- Default fallback with retry button
- `hasError()` and `caughtError()` signals for programmatic access

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-error-boundary.md`
- Docs-grade demo app with error trigger and fallback comparison route
