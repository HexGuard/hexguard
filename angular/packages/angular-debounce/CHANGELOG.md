# Changelog

## 0.1.0 — 2026-06-17

Initial release of `@hexguard/angular-debounce`.

### Features

- `debouncedSignal()` — debounced value signal primitive with configurable leading/trailing edge behavior
- `isPending` signal for tracking whether a trailing flush is scheduled
- `flush()` to immediately emit the current source value and cancel any pending timeout
- `cancel()` to clear a pending timeout without emitting
- Two-way binding support via writable source creation

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-debounce.md`
- Docs-grade demo app with basic and leading/trailing comparison routes
