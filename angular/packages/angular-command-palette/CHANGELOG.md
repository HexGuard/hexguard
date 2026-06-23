# Changelog

## 0.1.0 — 2026-06-23

Initial release of `@hexguard/angular-command-palette`.

### Features

- `injectCommandRegistry()` — headless command registry
- `register(command)` / `unregister(id)` — manage commands
- `search(query)` — filter commands by title/category
- `handleShortcut(event)` — match keyboard events against registered shortcuts
- `paletteOpen` / `togglePalette()` / `openPalette()` / `closePalette()` state
- Configurable `enabled` signal per command
- Automatic cleanup via DestroyRef
