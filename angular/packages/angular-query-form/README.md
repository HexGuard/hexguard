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
  page: new FormControl(1, { nonNullable: true }),
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
    debounceMs: 250,
    history: 'replace',
    resetKeysOnChange: {
      search: ['page'],
      status: ['page'],
    },
  },
);

query.snapshot();
query.patch({ search: 'priority', page: 1 });
query.reset();
```

## What `queryForm()` Owns

- top-level Reactive Forms controls whose names match schema keys
- URL hydration into form controls on initial load and history replay
- form-originated updates back into query params through `urlState()`
- dependent-key reset rules such as `search -> page`
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

Schema keys must match top-level controls in the supplied `FormGroup`. Extra controls are allowed,
but they remain local and unmanaged in `0.1.x`.

Returned handle:

- `form`: the original `FormGroup`
- `urlState`: the underlying `urlState()` handle for direct signal access when needed
- `snapshot()`: current typed query-form snapshot
- `patch(value)`: patch URL-backed values through the underlying state
- `reset()`: reset URL-backed values to codec defaults

Other exported API names you may import directly:

- `QueryForm`
- `QueryFormControls`
- `QueryFormOptions`
- `QueryFormResetKeysOnChange`
- `QueryFormControlMissingError`
- `QueryFormResetKeyError`

### Options

`QueryFormOptions` accepts every `UrlStateOptionsInput` field from
`@hexguard/angular-url-state`, plus `resetKeysOnChange`.

| Option                  | Default                                                   | What it controls                                                 |
| ----------------------- | --------------------------------------------------------- | ---------------------------------------------------------------- |
| `history`               | inherited from URL state defaults (`'replace'`)           | push or replace browser history entries                          |
| `debounceMs`            | inherited from URL state defaults (`0`)                   | delay before form-originated changes navigate                    |
| `removeDefaultsFromUrl` | inherited from URL state defaults (`true`)                | omit codec defaults from the URL                                 |
| `invalidParamBehavior`  | inherited from URL state defaults (`'fallbackToDefault'`) | fallback, remove invalid params, or throw in dev                 |
| `resetKeysOnChange`     | `undefined`                                               | reset dependent keys to codec defaults when a source key changes |

`resetKeysOnChange` only resets keys that were not explicitly changed in the same form emission.
This makes patterns like `search -> page` safe even when a user edits both values together.

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
