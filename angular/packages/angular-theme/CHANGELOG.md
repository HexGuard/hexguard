# Changelog

## 0.2.0 — 2026-06-30

- Add `tokens` config to `ThemeConfig` — per-theme CSS custom property overrides written to `<html>`.
- Add `injectTokenTheme()` — combines theme switching with design token layer application.
- Export `TokenLayerMap` type.

## 0.1.0 — 2026-06-28

Initial release of `@hexguard/angular-theme`.

### Features

- `injectTheme()` — headless theme switching state
- `mode` signal: `'light' | 'dark' | 'system'`
- `effectiveTheme` signal: resolved theme accounting for system preference
- `isDark` / `isLight` signals for reactive UI binding
- `setMode(mode)`, `toggle()`, `resetToSystem()` methods
- `prefers-color-scheme` detection via matchMedia with live listener
- localStorage persistence via configurable `persistKey`
- Auto-applies `data-theme` attribute on `<html>` element
- SSR-safe with platform guard
- Automatic cleanup via DestroyRef
