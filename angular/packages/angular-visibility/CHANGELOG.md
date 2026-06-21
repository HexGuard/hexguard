# Changelog

## 0.1.0 — 2026-06-22

Initial release of `@hexguard/angular-visibility`.

### Features

- `injectVisibility()` — document/tab visibility and idle detection with signals
- `isVisible` signal — tracks tab hidden/visible state via `document.visibilityState`
- `isIdle`, `idleDuration`, `lastActivity` signals — configurable user inactivity detection
- `inElementVisibility(elementRef)` — IntersectionObserver-based element visibility as a signal
- Configurable idle timeout with custom activity event whitelist
- Automatic cleanup via `DestroyRef`

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-visibility.md`
- Docs-grade demo app with visibility and idle detection playground
