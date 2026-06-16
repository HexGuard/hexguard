# Changelog

## 0.1.0 — 2026-06-16

Initial release of `@hexguard/angular-async-state`.

### Features

- `asyncState()` — explicit idle/loading/loaded/error/reloading lifecycle for fetch-like flows
- `observableState()` — explicit idle/connecting/live/error/complete lifecycle for long-lived stream flows
- `asyncAction()` — explicit idle/pending/succeeded/failed lifecycle for submit or command flows
- Duplicate-run control: `reuse` (default) and `reject` policies via `AsyncActionDuplicateRunPolicy`
- One-shot observable results in `asyncAction()` while preserving the action handle
- Custom `empty()` and `mapError()` hooks for domain-specific value and error normalization
- `setValue()`, `reset()`, `reload()` ergonomics for value handles
- `connect()`, `disconnect()`, `reconnect()` ergonomics for observable handles
- `HexguardAsyncStateOutletComponent` — thin standalone outlet for value states
- `HexguardAsyncActionOutletComponent` — thin standalone outlet for action states

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-async-state.md`
- Docs-grade demo app with value, observable, and action routes
- Playwright end-to-end coverage for lifecycle transitions and duplicate-run reuse
