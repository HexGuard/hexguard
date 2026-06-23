# `@hexguard/angular-query-form` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and validation
guidance.

## Purpose

`@hexguard/angular-query-form` binds top-level Angular Reactive Forms controls to typed query
parameters by layering on `@hexguard/angular-url-state`.

The package is intentionally narrow:

- no template-driven forms in V1
- no nested control path mapping in V1
- no local-only field orchestration in V1
- no validation-rule or validation-UI abstraction
- no second query parser or router synchronization layer

## Feature Matrix

| Capability                                    | Status      | Notes                                                                                |
| --------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| Top-level Reactive Forms binding              | Available   | `queryForm()` keeps managed top-level controls and one `urlState()` owner aligned.   |
| Dependent-key resets with `resetKeysOnChange` | Available   | Reset targets return to codec defaults when a managed source key changes.            |
| Managed subset binding with `managedKeys`     | Available   | One schema can keep URL-only keys such as `page`, `tab`, or `view` outside the form. |
| Manual or apply-button sync mode              | Available   | `syncMode: 'manual'` stages edits until `commit()` and exposes `hasPendingChanges`.  |
| Nested control path mapping                   | Proposed    | Nested paths such as `filters.search` remain outside the `0.1.x` surface.            |
| Composable child bindings or slices           | Proposed    | The package still prefers one route-aware owner per managed query slice.             |
| Template-driven forms                         | Not planned | Reactive Forms is the intentional scope for this package.                            |
| Validation UI or backend error mapping        | Not planned | Those concerns stay in application code.                                             |

## Public API Map

| Export                         | Role                                                 |
| ------------------------------ | ---------------------------------------------------- |
| `queryForm()`                  | Creates the form-to-query binding handle             |
| `QueryForm`                    | High-level handle shape returned by `queryForm()`    |
| `QueryFormManagedKeys`         | Ordered subset of schema keys bound to the form      |
| `QueryFormOptions`             | URL-state options plus dependent-key reset rules     |
| `QueryFormResetKeysOnChange`   | Maps source keys to keys reset to codec defaults     |
| `QueryFormSyncMode`            | Chooses live or manual/apply-button sync behavior    |
| `QueryFormControls`            | Typed top-level control map for schema-backed forms  |
| `QueryFormControlMissingError` | Runtime configuration error for missing controls     |
| `QueryFormManagedKeyError`     | Runtime configuration error for invalid managed keys |
| `QueryFormResetKeyError`       | Runtime configuration error for invalid reset rules  |

The package also re-exports the common URL-state codecs and `provideHexGuardUrlState()` helper for
ergonomic single-package imports.

Low-level URL-state types such as `UrlState`, `UrlStateOptionsInput`, `UrlStateHistoryMode`,
`InvalidParamBehavior`, `ParamCodec`, `ParamRawValue`, parse-result types, `InferCodecValue`, and
`InferSchemaValue` are also re-exported so wrapper libraries and tests do not need a second import
path.

The returned handle exposes `form`, `urlState`, `hasPendingChanges`, `snapshot()`, `patch()`,
`reset()`, `commit()`, and `revert()`.

## Option Resolution and Defaults

`queryForm(form, schema, options?)` accepts the same runtime URL behavior options as
`urlState(schema, options?)`, plus `managedKeys`, `syncMode`, and `resetKeysOnChange`.

Resolution order for URL behavior is still:

1. library defaults from `@hexguard/angular-url-state`
2. injector-level defaults from `provideHexGuardUrlState()`
3. per-instance overrides passed to `queryForm()`

`managedKeys`, `syncMode`, and `resetKeysOnChange` are query-form-specific and apply only inside
the local binding instance.

Example:

```ts
queryForm(form, schema, {
  managedKeys: ['search', 'status', 'tags'],
  syncMode: 'manual',
  debounceMs: 250,
  history: 'replace',
  resetKeysOnChange: {
    search: ['page'],
    status: ['page'],
    tags: ['page'],
  },
});
```

Practical rules:

- use `history: 'replace'` for fast-moving search/filter forms
- use `history: 'push'` when query-form view changes should participate in Back/Forward history
- use `invalidParamBehavior: 'removeInvalid'` when malformed links should clean themselves up on
  the next stable state
- use `managedKeys` when the route schema includes URL-owned keys such as pagination, tabs, or
  view mode that should not require matching form controls
- use `syncMode: 'manual'` when the URL should update only after an explicit Apply action
- use `resetKeysOnChange` for dependent query semantics such as filter changes resetting pagination

## Internal Behavior Notes

- `queryForm()` creates one underlying `urlState()` handle and treats it as the single URL owner.
- `query.urlState` is the explicit low-level escape hatch for direct signal access.
- By default every schema key must match a top-level Reactive Forms control. When `managedKeys` is
  provided, only that subset must exist and the rest remain URL-owned.
- URL-originated writes update controls with `emitEvent: false` to prevent feedback loops and noisy
  dirty/touched behavior.
- Live mode form-originated writes compare against the current URL-state snapshot and patch only
  changed managed keys.
- Manual mode stages managed edits locally, keeps `snapshot()` committed, and reports divergence
  through `hasPendingChanges` until `commit()` or `revert()`.
- Equality checks come from the schema codec when available, which matters for arrays and other
  non-primitive values.
- `form.getRawValue()` is used so disabled managed controls still participate predictably in the
  query snapshot.
- Dependent resets only apply to keys that were not explicitly changed in the same emission.
- External URL changes overwrite staged manual edits so browser history remains authoritative.

## Managed Subset Scope

In `0.1.x`, the intended pattern is one `FormGroup` with top-level controls for each managed schema
key.

Supported:

- `search`, `status`, and `tags` as managed top-level controls with `page` left URL-only
- one schema that mixes managed form keys with URL-owned keys accessed through `query.urlState`
- extra local form controls that the query-form binding ignores
- one route-aware component owning one query-form binding

Not supported in `0.1.x`:

- nested paths like `filters.search`
- arrays of child groups mapped into the URL
- multiple independent query-form bindings managing the same query key

## Invalid URL Handling

Query parsing and invalid-param handling are delegated entirely to `@hexguard/angular-url-state`.

That means:

- `fallbackToDefault` hydrates controls with codec defaults and leaves the URL unchanged
- `removeInvalid` hydrates controls with safe values and removes bad params on the next write
- `throwInDev` still throws only in Angular dev mode when configured

`@hexguard/angular-query-form` should not add its own second invalid-param policy layer.

## Demo Routes

Run the demo app locally with `pnpm start`, then inspect the routes listed in the [query form demo
runbook section](../demo/README.md#query-form-demo-routes).

- `/packages/angular-query-form`: package overview and demo catalog
- `/packages/angular-query-form/orders`: staged apply mode plus subset binding where filters live in
  the form while `page` and `pageSize` stay URL-owned
- `/packages/angular-query-form/recovery`: malformed-link cleanup plus push-state history replay

The overview page and both demos expose stable `data-testid` hooks and source-backed inspector
panels, so the routes act as both documentation and Playwright fixtures.

## Validation Surface

```bash
pnpm test:lib:query-form
pnpm build:lib:query-form
pnpm test:app
pnpm test:e2e
```

Cross-library and release-oriented changes should also run:

```bash
pnpm test:lib
pnpm build:lib
pnpm verify:package
```

## Release Contract

- bump `angular/packages/angular-query-form/package.json`
- tag `angular-query-form-v<version>`
- let `.github/workflows/release-angular-query-form.yml` validate, publish, and create the release

## Related Resources

- [Package README](../../angular/packages/angular-query-form/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-query-form/)
- [Source Code](../../angular/packages/angular-query-form/src/)
- [Depends on: `@hexguard/angular-url-state`](./angular-url-state.md)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational — no code has been changed.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                                                                        | Severity |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Public API Design         | Narrow surface — 3 package-specific exports + ergonomic re-exports from `@hexguard/angular-url-state`. No internal helpers leaked.                                                                                                                                             | praise   |
| Public API Design         | `queryForm()` has JSDoc `@example`, but `QueryFormOptions`, `QueryForm`, and error classes lack `@example` tags showing TypeScript and template usage.                                                                                                                         | moderate |
| Public API Design         | `dateIsoParam` and `nullableParam` are re-exported from `@hexguard/angular-url-state` but never demonstrated in any demo page or spec — dead re-exports from a consumer perspective.                                                                                           | minor    |
| Public API Design         | Multiple overloads for `queryForm()` with/without `managedKeys` provide excellent type inference.                                                                                                                                                                              | praise   |
| Implementation Quality    | Signals + `effect()` for URL-state sync, `form.valueChanges.subscribe()` properly unsubscribed in `destroyRef.onDestroy()`. `emitEvent: false` prevents feedback loops.                                                                                                        | praise   |
| Implementation Quality    | Three dedicated error classes (`QueryFormControlMissingError`, `QueryFormManagedKeyError`, `QueryFormResetKeyError`) with descriptive messages.                                                                                                                                | praise   |
| Implementation Quality    | Delegates all URL behavior (history, debounce, invalid params) to underlying `urlState()` — clean separation of concerns.                                                                                                                                                      | praise   |
| Implementation Quality    | `snapshotsEqual()`, `diffSnapshots()`, `valuesEqual()` helpers use codec `equals()` when available — handles non-primitive value comparison correctly.                                                                                                                         | praise   |
| Documentation             | README covers feature matrix, 13+ behavioral notes, option resolution, managed subset scope. Excellent depth for a composition-layer package.                                                                                                                                  | praise   |
| Documentation             | Deep-dive doc duplicates feature matrix from README (intentional for standalone reference) and adds internal behavior notes. No mention of `queryKey` remapping feature.                                                                                                       | minor    |
| Documentation             | No explicit documentation of `arrayParam` codec equality behavior for `resetKeysOnChange` with tag arrays.                                                                                                                                                                     | minor    |
| Test Coverage             | 18 test cases covering: initial hydration, form-to-URL sync, remapped query keys, managedKeys subset, resetKeysOnChange, patch/reset, debounce, manual sync + commit/revert, external URL overwrites, history push, invalid param cleanup, all error classes, destroy cleanup. | praise   |
| Test Coverage             | Not tested: `booleanParam`/`dateIsoParam`/`nullableParam` through `queryForm()`, `syncMode` default (`'live'`), `removeDefaultsFromUrl`, `fallbackToDefault` invalid param behavior, `throwInDev`, empty `FormGroup` edge case, `emitEvent: false` performance regression.     | moderate |
| Demo Integration          | Two distinct demos (orders with manual sync + recovery with malformed-link cleanup). Comprehensive Playwright tests covering hydration, filter+reset, discard draft, demo navigation, malformed link recovery.                                                                 | praise   |
| Demo Integration          | Stable `data-testid` attributes on ALL interactive elements. Inspector panels with snapshot JSON and code samples on both demo pages.                                                                                                                                          | praise   |
| Demo Integration          | Recovery demo Playwright test covers malformed param cleanup with history back behavior — excellent edge case coverage.                                                                                                                                                        | praise   |
| Cross-package Consistency | Build scripts correctly build dependency first (`pnpm build:lib:url-state && ng build angular-query-form`). Release workflow exists. Catalog entry complete.                                                                                                                   | praise   |
| Cross-package Consistency | `provideHexGuardUrlState()` re-exported for ergonomic single-package imports — matches workflow instructions for composition-layer packages.                                                                                                                                   | praise   |
| Cross-package Consistency | No ecosystem pairing needed (Angular-only package, no .NET counterpart).                                                                                                                                                                                                       | praise   |

### Improvement & Extension Opportunities

| Area          | Suggestion                                                                                                                      | Type        | Difficulty |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| API           | Add `@example` JSDoc tags to `QueryFormOptions`, `QueryForm`, and all error classes.                                            | improvement | easy       |
| API           | Consider removing dead re-exports of `dateIsoParam` and `nullableParam` from public API, or add a demo page demonstrating them. | improvement | easy       |
| Documentation | Document `queryKey` remapping feature (`{ codec: ..., queryKey: 'q' }`) in both README and deep-dive doc.                       | improvement | easy       |
| Documentation | Document `arrayParam` codec equality behavior for `resetKeysOnChange` with tag arrays.                                          | improvement | easy       |
| Tests         | Add tests for `booleanParam`/`dateIsoParam`/`nullableParam` through `queryForm()`.                                              | improvement | easy       |
| Tests         | Add `removeDefaultsFromUrl`, `fallbackToDefault`, and `throwInDev` tests.                                                       | improvement | medium     |
| Tests         | Add empty `FormGroup` edge case test.                                                                                           | improvement | easy       |
| Extension     | Nested control path mapping (currently Proposed) — support for paths like `filters.search`.                                     | extension   | medium     |
| Extension     | Composable child bindings or slices (currently Proposed) — multiple query-form bindings on disjoint schema slices.              | extension   | hard       |
