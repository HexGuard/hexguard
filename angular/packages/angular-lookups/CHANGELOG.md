# Changelog

## 0.1.0 — 2026-06-16

Initial release of `@hexguard/angular-lookups`.

### Features

- One typed `LookupCatalog` contract with version metadata, collections, and items
- `validateLookupCatalog()` / `assertLookupCatalog()` — pure validation helpers that catch malformed payloads
- `provideHexGuardLookups(options)` — registers one loader-backed lookup cache
- `injectLookups()` — imperative facade with `collection()`, `options()`, `label()`, `hasItem()` plus signal-backed variants
- `ensureLoaded()`, `reload()`, and `invalidate()` — explicit cache lifecycle
- `HexguardLookupLabelPipe` — thin standalone pipe for template-only label resolution
- `LookupCatalogValidationError` — typed error listing all contract violations
- Signal-backed facade helpers: `collectionSignal()`, `optionsSignal()`, `labelSignal()`, `hasItemSignal()`
- `initialCatalog` option to seed the cache before the first remote load
- `mapError` option to normalize transport failures

### Documentation

- Package README with quickstart, owned/not-owned boundaries, and first-demo guidance
- Deep package notes in `docs/packages/angular-lookups.md`
- Docs-grade demo app with editor, summary, and live backend routes
- Playwright end-to-end coverage for catalog loading, refreshed labels, and invalid-payload validation
- Shared .NET sample API at `dotnet/samples/HexGuard.SampleApi/Packages/AngularLookups/`
