# Changelog

## 0.1.0 — 2026-06-22

Initial release of `@hexguard/angular-click-outside`.

### Features

- `injectClickOutside()` — signal-based click-outside detection for programmatic use
- `HexguardClickOutsideDirective` — template directive with `(hexguardClickOutside)` output and `[hexguardClickOutsideEnabled]` input
- Configurable `enabled` signal to toggle detection on/off
- Configurable CSS selector exclusions for nested elements
- Automatic cleanup via `DestroyRef`

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-click-outside.md`
- Docs-grade demo app with click-outside detection playground
