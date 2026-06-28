# Changelog

## 0.1.0 — 2026-06-28

Initial release of `@hexguard/angular-dirty-state`.

### Features

- `injectDirtyState()` — headless unsaved-change tracking
- `isDirty` signal for reactive UI binding
- `markDirty()` / `markClean()` / `reset()` imperative controls
- `snapshot()` capture for baseline comparison
- `injectDirtyGuard()` — CanDeactivateFn factory for route guard integration
- Automatic cleanup via DestroyRef
