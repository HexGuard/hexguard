# Changelog

## 0.1.0 — 2026-06-16

Initial release of `@hexguard/angular-url-state`.

### Features

- Typed, signal-backed query-param state through `urlState(schema, options?)`
- Deterministic URL serialization that preserves schema property order
- Query-key remapping with `queryKey` to decouple local signal names from URL contracts
- Unmanaged query-param preservation — writes only touch declared keys
- Three invalid-param behaviors: `fallbackToDefault`, `removeInvalid`, and `throwInDev`
- Replace and push history modes
- Configurable per-handle and global debounce via `provideHexGuardUrlState()`
- Duplicate-ownership detection in dev mode
- Full set of codecs: `stringParam`, `numberParam`, `booleanParam`, `enumParam`, `arrayParam`, `nullableParam`, `dateIsoParam`

### Documentation

- Package README with feature matrix, quickstart, API reference, and demo route guidance
- Deep package notes in `docs/packages/angular-url-state.md`
- Docs-grade demo app with orders and dashboard routes
- Playwright end-to-end coverage for URL hydration, history replay, and responsive layout
