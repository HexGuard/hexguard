# Changelog

## 0.1.0 — 2026-06-22

Initial release of `@hexguard/angular-confirmation`.

### Features

- `injectConfirmation()` — headless confirmation dialog state
- `ask()` — returns `Promise<boolean>` for simple confirm/cancel flows
- `run()` — composes ask with async action execution
- `isOpen` / `currentRequest` signals for reactive UI binding
- Duplicate-open prevention
