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

## Public API Map

| Export                         | Role                                                |
| ------------------------------ | --------------------------------------------------- |
| `queryForm()`                  | Creates the form-to-query binding handle            |
| `QueryForm`                    | High-level handle shape returned by `queryForm()`   |
| `QueryFormOptions`             | URL-state options plus dependent-key reset rules    |
| `QueryFormResetKeysOnChange`   | Maps source keys to keys reset to codec defaults    |
| `QueryFormControls`            | Typed top-level control map for schema-backed forms |
| `QueryFormControlMissingError` | Runtime configuration error for missing controls    |
| `QueryFormResetKeyError`       | Runtime configuration error for invalid reset rules |

The package also re-exports the common URL-state codecs and `provideHexGuardUrlState()` helper for
ergonomic single-package imports.

The returned handle exposes `form`, `urlState`, `snapshot()`, `patch()`, and `reset()`.

## Option Resolution and Defaults

`queryForm(form, schema, options?)` accepts the same runtime URL behavior options as
`urlState(schema, options?)`, plus `resetKeysOnChange`.

Resolution order for URL behavior is still:

1. library defaults from `@hexguard/angular-url-state`
2. injector-level defaults from `provideHexGuardUrlState()`
3. per-instance overrides passed to `queryForm()`

`resetKeysOnChange` is query-form-specific and applies only inside the local binding instance.

Example:

```ts
queryForm(form, schema, {
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
- use `resetKeysOnChange` for dependent query semantics such as filter changes resetting pagination

## Internal Behavior Notes

- `queryForm()` creates one underlying `urlState()` handle and treats it as the single URL owner.
- `query.urlState` is the explicit low-level escape hatch for direct signal access.
- Schema keys must match top-level Reactive Forms controls exactly. Missing controls fail fast.
- URL-originated writes update controls with `emitEvent: false` to prevent feedback loops and noisy
  dirty/touched behavior.
- Form-originated writes compare against the current URL-state snapshot and patch only changed
  keys.
- Equality checks come from the schema codec when available, which matters for arrays and other
  non-primitive values.
- `form.getRawValue()` is used so disabled managed controls still participate predictably in the
  query snapshot.
- Dependent resets only apply to keys that were not explicitly changed in the same emission.

## Top-level Control Scope

In `0.1.x`, the intended pattern is one `FormGroup` with top-level controls named after schema
keys.

Supported:

- `search`, `page`, `status`, `tags` as top-level controls
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

- `/packages/angular-query-form/orders`: debounced replace-state search and pagination reset rules
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

- bump `packages/angular-query-form/package.json`
- tag `angular-query-form-v<version>`
- let `.github/workflows/release-angular-query-form.yml` validate, publish, and create the release
