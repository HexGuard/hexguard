# Changelog

## 0.1.0 — 2026-06-23

Initial release of `@hexguard/angular-route-memory`.

### Features

- `injectRouteMemory()` — route-to-route memory for save/restore flows
- `save(key, context)` — save route-scoped context
- `restore(key)` — restore previously saved context
- `clear(key)` / `clearAll()` — remove saved context
- `autoSave(key, factory)` — auto-save on scope cleanup
- `hasMemory(key)` — Signal<boolean> for reactive UI binding
- Optional sessionStorage serialization mode
- Automatic cleanup via DestroyRef
