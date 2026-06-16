# Changelog

## 0.1.0 — 2026-06-16

Initial release of `@hexguard/angular-query-form`.

### Features

- `queryForm(form, schema, options?)` — typed Reactive Forms binding backed by `@hexguard/angular-url-state`
- `managedKeys` — bind only a subset of schema keys to form controls while keeping URL-only keys in the same schema
- `resetKeysOnChange` — dependent-key reset rules such as `search -> page` and `status -> page`
- Manual sync mode with `commit()` / `revert()` / `hasPendingChanges()` for apply-button workflows
- URL hydration into form controls on initial load and history replay
- Debounced form-originated URL writes
- URL-owned key preservation when form changes are staged but not committed
- Inherited invalid-param cleanup from `@hexguard/angular-url-state`
- Descriptive errors for missing controls, invalid managed keys, and misconfigured reset rules

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-query-form.md`
- Docs-grade demo app with orders and recovery routes
- Playwright end-to-end coverage for form-URL synchronization and invalid param recovery
