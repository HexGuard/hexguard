# Changelog

## 0.1.0 — 2026-06-28

Initial release of `@hexguard/angular-clipboard`.

### Features

- `injectClipboard()` — headless clipboard interaction state
- `copy(text)` — write text to clipboard with execCommand fallback
- `paste()` — read text from clipboard with permission handling
- `lastCopied` / `lastPasted` signals for reactive UI binding
- `history` signal with configurable history size
- `permissionState` signal for clipboard permission awareness
- `isCopying` / `copyError` signals for operation feedback
- Automatic cleanup via DestroyRef
