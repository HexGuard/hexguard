# `@hexguard/angular-query-form`

Reactive Forms binding for typed Angular URL query state.

This package builds on `@hexguard/angular-url-state` so filter-heavy pages can keep top-level
Reactive Forms controls, query parameters, browser history, and reset behavior aligned without
rewriting synchronization glue in every component.

Additional in-repo guides:

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-query-form.md)
- [Demo runbook](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [Package catalog and roadmap context](https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md)

## Installation

```bash
pnpm add @hexguard/angular-query-form @hexguard/angular-url-state
```

## Quickstart

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { provideRouter } from '@angular/router';
import {
  enumParam,
  numberParam,
  provideHexGuardUrlState,
  queryForm,
  stringParam,
} from '@hexguard/angular-query-form';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHexGuardUrlState()],
});

const form = new FormGroup({
  search: new FormControl('', { nonNullable: true }),
  status: new FormControl<'all' | 'open' | 'closed'>('all', { nonNullable: true }),
});

const query = queryForm(
  form,
  {
    search: stringParam(''),
    page: numberParam(1),
    status: enumParam(['all', 'open', 'closed'] as const, 'all'),
  },
  {
    managedKeys: ['search', 'status'],
    syncMode: 'manual',
    debounceMs: 250,
    history: 'replace',
    resetKeysOnChange: {
      search: ['page'],
      status: ['page'],
    },
  },
);

query.snapshot();
query.hasPendingChanges();
query.commit();
query.patch({ page: 2 });
query.revert();
query.reset();
```

## Feature Matrix

| Capability                                    | Status      | Notes                                                                                                                 |
| --------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| Top-level Reactive Forms binding              | Available   | `queryForm()` keeps managed form controls and typed URL state aligned through one underlying `urlState()` handle.     |
| Dependent-key resets with `resetKeysOnChange` | Available   | Common flows such as `search -> page` and `status -> page` work without page-local synchronization glue.              |
| Managed subset binding with `managedKeys`     | Available   | Keep URL-only keys such as `page`, `tab`, or `view` outside the form while the same schema still owns them.           |
| Manual or apply-button sync mode              | Available   | `syncMode: 'manual'` stages edits locally, exposes `hasPendingChanges`, and commits through `commit()` or `revert()`. |
| Nested control path mapping                   | Proposed    | Paths such as `filters.search` are not supported in `0.1.x`.                                                          |
| Composable child bindings or slices           | Proposed    | The intended model is still one route-aware owner per managed query slice.                                            |
| Template-driven forms                         | Not planned | The package intentionally targets Angular Reactive Forms only.                                                        |
| Validation UI or backend error mapping        | Not planned | Keep the package focused on URL and form synchronization rather than broader form state concerns.                     |

## What `queryForm()` Owns

- top-level Reactive Forms controls for every managed schema key
- subset binding when only part of the schema should map to the form
- URL hydration into form controls on initial load and history replay
- live or manual/apply-button form-originated synchronization through `urlState()`
- dependent-key reset rules such as `search -> page`
- pending-change tracking for staged manual edits
- a small high-level handle around the form and URL state

## What It Does Not Own

- template-driven forms
- nested control path mapping
- local-only field orchestration
- validation rules or validation UI
- dirty-state guards
- backend error mapping
- submit locking or broader async action state

## API Reference

### `queryForm(form, schema, options?)`

Creates a Reactive Forms binding backed by typed URL query state.

`queryForm()` must run inside an Angular injection context because it delegates URL behavior to
`urlState()`.

By default, schema keys must match top-level controls in the supplied `FormGroup`. When
`managedKeys` is provided, only that subset needs matching controls. Remaining schema keys stay
URL-owned through `query.urlState`.

Returned handle:

- `form`: the original `FormGroup`
- `urlState`: the underlying `urlState()` handle for direct signal access when needed
- `hasPendingChanges`: signal that flips on when manual mode has staged edits
- `snapshot()`: current committed typed query-form snapshot
- `patch(value)`: immediately patch committed URL-backed values through the underlying state
- `reset()`: reset committed URL-backed values to codec defaults and clear staged edits
- `commit()`: write staged manual edits to the URL-backed state
- `revert()`: discard staged manual edits and resync the form to the committed URL state

Other exported API names you may import directly:

- `QueryForm`
- `QueryFormControls`
- `QueryFormManagedKeys`
- `QueryFormOptions`
- `QueryFormResetKeysOnChange`
- `QueryFormSyncMode`
- `QueryFormControlMissingError`
- `QueryFormManagedKeyError`
- `QueryFormResetKeyError`

### Options

`QueryFormOptions` accepts every `UrlStateOptionsInput` field from
`@hexguard/angular-url-state`, plus `managedKeys`, `syncMode`, and `resetKeysOnChange`.

| Option                  | Default                                                   | What it controls                                                         |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| `history`               | inherited from URL state defaults (`'replace'`)           | push or replace browser history entries                                  |
| `debounceMs`            | inherited from URL state defaults (`0`)                   | delay before form-originated changes navigate                            |
| `removeDefaultsFromUrl` | inherited from URL state defaults (`true`)                | omit codec defaults from the URL                                         |
| `invalidParamBehavior`  | inherited from URL state defaults (`'fallbackToDefault'`) | fallback, remove invalid params, or throw in dev                         |
| `managedKeys`           | every schema key                                          | limit form binding to a schema subset while other keys stay URL-owned    |
| `syncMode`              | `'live'`                                                  | write immediately or stage edits until `commit()`                        |
| `resetKeysOnChange`     | `undefined`                                               | reset dependent keys to codec defaults when a managed source key changes |

`resetKeysOnChange` only resets keys that were not explicitly changed in the same form emission.
This makes patterns like `search -> page` safe even when a user edits both values together.

When `syncMode` is `'manual'`, form edits update only the staged form state until `commit()`.
`patch()` and `reset()` still act on the committed URL-backed state immediately.

### Re-exported URL-state building blocks

For ergonomic single-package imports, this package re-exports the common URL-state codecs and
provider helpers it depends on:

- `stringParam`
- `numberParam`
- `booleanParam`
- `enumParam`
- `arrayParam`
- `dateIsoParam`
- `nullableParam`
- `provideHexGuardUrlState`

The parsing, serialization, history, and invalid-param semantics still belong to
`@hexguard/angular-url-state`.

Prefer the form surface first. Reach for `query.urlState` only when you specifically need direct
signal access or URL-state methods that are intentionally not mirrored on form controls.

## Behavioral Notes

- Managed controls are updated with `emitEvent: false` for URL-originated writes so form hydration
  and history replay do not create feedback loops.
- `form.getRawValue()` is used for managed keys, so disabled URL-backed controls still serialize
  deterministically.
- Control values are compared with each codec's `equals()` function when available.
- `snapshot()` always reports the committed URL-backed state. In manual mode, staged form edits do
  not appear there until `commit()` succeeds.
- External URL changes overwrite staged manual edits so the form does not drift away from browser
  history or direct navigation.
- Invalid query params are handled entirely through the delegated URL-state options.

## Validation

```bash
pnpm test:lib:query-form
pnpm build:lib:query-form
pnpm test:e2e
```

The demo routes are part of the validation story because they exercise the same public API the
package exports.

## Release Contract

- bump `angular/packages/angular-query-form/package.json`
- tag `angular-query-form-v<version>`
- let `.github/workflows/release-angular-query-form.yml` validate, publish, and create the release
