# Changelog

## 0.1.0 — 2026-06-16

Initial release of `@hexguard/angular-optimistic-state`.

### Features

- `optimisticState()` — typed optimistic mutation handle with explicit committed value and overlay state
- Configurable same-target conflict policy: `reject`, `queue`, and `replace`
- `apply()` — optimistic overlay applied immediately to the visible value
- `reconcile()` — confirmed server result merged back into the committed value
- Mutation-entry inspection through `entries()` — pending, queued, succeeded, and failed state per target
- Rollback on failure with mapped error surface
- `setConflictPolicy()` — change policy at runtime without recreating the handle
- `HexguardOptimisticStateOutletComponent` — thin standalone outlet with pending and error companion templates
- `reset()` — return to a known committed snapshot

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-optimistic-state.md`
- Docs-grade demo app with toggle, inline edit, and bulk routes
- Playwright end-to-end coverage for conflict policy behavior and reconciliation
