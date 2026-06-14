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

## Demo Surface

The demo app currently exercises two query-form workflows:

- `/packages/angular-query-form/orders`: staged apply mode plus subset binding where filters live in
  the form while `page` and `pageSize` stay URL-owned
- `/packages/angular-query-form/recovery`: malformed-link cleanup plus push-state history replay

Both demos expose stable `data-testid` hooks and source-backed inspector panels, so the demos act
as both documentation and Playwright fixtures.

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
