# Changelog

## 0.1.0 — 2026-06-22

Initial release of `@hexguard/angular-undo`.

### Features

- `injectUndoStack()` — timer-based undo stack for reversible action flows
- Push actions with configurable TTL undo windows
- Auto-commit on TTL expiry via configurable `onCommit` callback
- `undo()` / `undoGroup()` / `commit()` / `clear()` imperative control
- `pendingUndos`, `hasPending`, `undosForType()` reactive signals
- Action grouping for batch undo
- Automatic timer cleanup via `DestroyRef`

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-undo.md`
- Docs-grade demo app with delete/archive undo flows
