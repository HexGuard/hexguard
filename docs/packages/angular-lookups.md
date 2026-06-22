# Angular Lookups

`@hexguard/angular-lookups` standardizes one repeated business-app problem: a backend often owns a
versioned reference-data catalog, but Angular screens re-fetch, re-map, and re-resolve those
labels separately across forms, filters, and detail views.

This package keeps the contract explicit through one validated catalog shape, one loader-backed
cache, one injected facade, and one thin template label pipe.

## .NET Counterpart

This Angular package pairs with `HexGuard.ReferenceData` on the .NET side. The .NET library owns
the same typed catalog contract (`ReferenceDataCatalog`, `ReferenceDataCollection`,
`ReferenceDataItem`) with a built-in validator, while the Angular package handles caching, label
resolution, and template rendering.

Both stacks validate the same catalog shape through the shared `HexGuard.SampleApi`. The .NET
deep-dive is at [hexguard-reference-data.md](hexguard-reference-data.md) and the library source
lives in [`dotnet/src/HexGuard.ReferenceData/`](../../dotnet/src/HexGuard.ReferenceData/).

## Install

```bash
pnpm add @hexguard/angular-lookups @hexguard/angular-async-state
```

For the full in-repo sample with a real backend, start both processes from the repository root:

```bash
pnpm start
pnpm dotnet:start:demo-api
```

The shared sample API listens on `http://127.0.0.1:5074` and serves package-scoped demo routes
under `/api/<package-id>/...`. The reference-data endpoints demonstrate the `HexGuard.ReferenceData`
library types:

- `GET /api/angular-lookups/catalog?scenario=base`
- `GET /api/angular-lookups/catalog?scenario=refreshed`
- `GET /api/angular-lookups/catalog?scenario=invalid`
- `GET /api/reference-data/catalog` (direct library usage, .NET-only demo)
- `GET /api/reference-data/catalog/validate`
- `GET /api/reference-data/catalog/invalid`

## Contract Shape

The package expects one versioned catalog payload:

```ts
interface LookupCatalog {
  metadata: {
    version: string;
    generatedAtUtc: string;
  };
  collections: Array<{
    key: string;
    revision?: string | null;
    items: Array<{
      key: string;
      label: string;
      isActive?: boolean;
      description?: string | null;
    }>;
  }>;
}
```

The first implementation assumes one payload can serve multiple lookup families such as
`categories`, `suppliers`, and `lifecycleStates`.

## Feature Matrix

| Capability                           | Status      | Notes                                                                                                                  |
| ------------------------------------ | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| Loader-backed catalog cache          | Available   | `provideHexGuardLookups()` owns the async lifecycle, current version, reload, and invalidate behavior.                 |
| Imperative lookup facade             | Available   | `injectLookups()` resolves collections, options, labels, and missing-key checks from the shared cache.                 |
| Thin template label pipe             | Available   | `HexguardLookupLabelPipe` resolves labels for display-only templates and keeps fallback rendering explicit.            |
| Catalog validation                   | Available   | Malformed payloads throw `LookupCatalogValidationError` instead of silently hydrating partial state.                   |
| Localized or per-tenant catalogs     | Deferred    | The first release keeps one generic catalog shape and leaves locale- or tenant-specific orchestration to the host app. |
| UI widgets such as select components | Not planned | The package owns lookup state and label resolution, not opinionated form controls.                                     |

## Demo Routes

Start the demo app from the repo root with `pnpm start`, then open:

- `/packages/angular-lookups`: package overview and demo catalog
- `/packages/angular-lookups/editor`: one catalog load feeding three typed select surfaces
- `/packages/angular-lookups/summary`: detail-grid label resolution through the shared cache and label pipe
- `/packages/angular-lookups/backend`: live HTTP integration against the shared .NET sample API

The full route checklist lives in [docs/demo/README.md](../demo/README.md).

## API Notes

### Recommended loader shape

Keep the loader at the integration boundary and return the full catalog payload unchanged:

```ts
const apiBaseUrl = 'http://127.0.0.1:5074';
const response = await fetch(`${apiBaseUrl}/api/angular-lookups/catalog?scenario=base`);
const catalog = (await response.json()) as LookupCatalog;
```

Let the package own validation, caching, reloads, and label resolution after the payload is returned.

### `provideHexGuardLookups(options)`

Registers one lookup cache for the active injector tree.

`HexGuardLookupsOptions<TError>` fields:

| Field            | Required | Description                                                            |
| ---------------- | -------- | ---------------------------------------------------------------------- |
| `load`           | yes      | Async loader returning the full `LookupCatalog`.                       |
| `initialCatalog` | no       | Seed catalog used before the first remote load succeeds.               |
| `mapError`       | no       | Maps unknown transport failures into the host app's public error type. |

### `injectLookups()`

Returns the imperative lookup facade. The facade exposes:

- `state`: the underlying `AsyncState` handle for the current catalog
- `metadata` and `version`: signal-backed metadata helpers
- `ensureLoaded()`, `reload()`, and `invalidate()` for lifecycle control
- `collection()`, `options()`, and `label()` plus signal-backed variants for display and forms
- `hasItem()` for explicit missing-key checks

### `HexguardLookupLabelPipe`

Use the pipe when a template only needs to render one label from one known collection:

```html
{{ product.categoryKey | hexguardLookupLabel: 'categories': 'Unknown category' }}
```

The pipe intentionally stays thin. If a view needs branching behavior or state inspection, prefer
`injectLookups()` in the component and keep fallback rendering explicit.

## Behavioral Notes

- Invalid catalogs fail fast through `LookupCatalogValidationError`.
- Reload failures keep the previous successful catalog visible because the package builds on the
  same explicit async-state semantics used elsewhere in HexGuard.
- Missing keys resolve to `null` from the imperative API so host code can choose a fallback label
  or surface the data mismatch directly.
- The shared sample API deliberately exposes an `invalid` scenario so teams can see the frontend
  reject malformed catalogs instead of silently accepting partial reference data.

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                                                   | Severity |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Narrow surface — 6 named exports + 1 pipe + 5 type re-exports. No internal helpers leaked. Clean separation: validation, DI registration, facade, pipe, errors, options.                                                                                  | praise   |
| Public API Design         | `provideHexGuardLookups()` + `injectLookups()` follows the multi-instance provider pattern exactly.                                                                                                                                                       | praise   |
| Implementation Quality    | Relies on `asyncState()` from `angular-async-state` for cache lifecycle — correct delegation. Validation errors (`LookupCatalogValidationError`) preserved separately from transport errors.                                                              | praise   |
| Implementation Quality    | `EMPTY_LOOKUP_CATALOG`, collections, items all `Object.freeze()`'d.                                                                                                                                                                                       | praise   |
| Test Coverage             | 7 integration tests + 1 pipe test covering: initial catalog seed, load+reload, validation errors, signal-backed helpers, metadata/version signals, transport error mapping, `invalidate()` to idle.                                                       | praise   |
| Test Coverage             | Not tested: pure validation helpers (`validateLookupCatalog`, `assertLookupCatalog`, `findLookupCollection`) individually — only indirectly through integration tests; pipe with null/undefined `itemKey`; `mapError` callback omitted (raw passthrough). | minor    |
| Demo Integration          | 4 demo routes (editor, summary, backend) with snippet generation, Playwright tests, .NET sample API integration. Excellent coverage.                                                                                                                      | praise   |
| Cross-package Consistency | Build scripts correctly build dependency first (`pnpm build:lib:async-state && ng build angular-lookups`). `tsconfig.lib.json` maps dependency to dist/ to avoid rootDir errors.                                                                          | praise   |
