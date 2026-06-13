# `@hexguard/angular-url-state`

Type-safe, signal-first URL query state for Angular.

This package keeps Angular application state synchronized with query parameters using standalone
APIs, signals, and the Angular Router. It is designed for filter panels, admin tables,
dashboards, reports, and any other place where the URL should be shareable, deterministic, and
safe to parse.

Additional in-repo guides:

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-url-state.md)
- [Demo runbook](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [Package catalog and roadmap context](https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md)

## Installation

```bash
pnpm add @hexguard/angular-url-state
```

## Quickstart

```ts
import {
  arrayParam,
  enumParam,
  numberParam,
  provideHexGuardUrlState,
  stringParam,
  urlState,
} from '@hexguard/angular-url-state';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHexGuardUrlState()],
});

const ordersState = urlState(
  {
    search: stringParam(''),
    page: numberParam(1),
    status: enumParam(['open', 'closed', 'archived'] as const, 'open'),
    tags: arrayParam(stringParam()),
  },
  {
    history: 'replace',
    debounceMs: 250,
    removeDefaultsFromUrl: true,
  },
);

ordersState.search();
ordersState.search.set('quarterly review');
ordersState.page.set(2);
ordersState.patch({ tags: ['priority', 'enterprise'] });
```

## API Reference

### `provideHexGuardUrlState(options?)`

Registers global defaults for the library through Angular dependency injection.

The `options` parameter is optional. It sets defaults for every `urlState()` handle created in the
same injector tree.

`urlState(schema, options?)` accepts the same shape for one specific state handle. Resolution order
is:

1. library defaults
2. `provideHexGuardUrlState()` defaults
3. per-call `urlState(schema, options?)` overrides

`debounceMs` is normalized to a non-negative integer. Invalid values fall back to `0`.

| Option                  | Default               | What it controls                                                   | Typical use                                                                                                                                           |
| ----------------------- | --------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `history`               | `'replace'`           | Whether writes replace the current history entry or push a new one | Use `'replace'` for fast-moving filters and search boxes; use `'push'` for tabs, presets, and other state users may navigate with Back/Forward        |
| `debounceMs`            | `0`                   | Delay before local signal writes trigger router navigation         | Use `150-300` for type-ahead search; keep `0` for clicks, toggles, selects, and pagination                                                            |
| `removeDefaultsFromUrl` | `true`                | Whether values equal to codec defaults are omitted from the URL    | Keep `true` for short canonical URLs; set `false` if external tooling or shared links depend on explicit default params                               |
| `invalidParamBehavior`  | `'fallbackToDefault'` | What happens when incoming query params fail to parse              | Use `'fallbackToDefault'` for production-safe behavior, `'removeInvalid'` to scrub bad params, and `'throwInDev'` to catch bad links while developing |

### `urlState(schema, options?)`

Creates a typed state object whose properties are writable Angular signals.

The optional `options` parameter accepts the same shape described above, but only for this one
state handle.

```ts
const state = urlState({
  search: stringParam(''),
  page: numberParam(1),
});

state.search();
state.search.set('boots');
state.patch({ page: 2 });
state.snapshot();
state.reset();
```

### Param codecs

- `stringParam(defaultValue = '')`
- `numberParam(defaultValue)`
- `booleanParam(defaultValue)`
- `enumParam(values, defaultValue)`
- `arrayParam(innerCodec, { defaultValue? })`
- `dateIsoParam(defaultValue = null)`
- `nullableParam(innerCodec)`

Each codec exposes:

- `defaultValue`
- `parse(raw)`
- `serialize(value)`
- optional `equals(left, right)` for structural comparisons

### Custom codecs

Use a custom codec when the built-in primitives are not expressive enough for your domain type.
Provide `equals` whenever parsing creates fresh arrays, dates, or objects so equivalent values do
not trigger redundant signal writes or router navigations.

```ts
import type { ParamCodec, ParamRawValue } from '@hexguard/angular-url-state';

type SortValue = {
  column: 'createdAt' | 'total';
  direction: 'asc' | 'desc';
};

const defaultSort: SortValue = { column: 'createdAt', direction: 'desc' };

export function sortParam(defaultValue: SortValue = defaultSort): ParamCodec<SortValue> {
  return {
    defaultValue,
    parse(raw: ParamRawValue) {
      if (typeof raw !== 'string') {
        return {
          ok: false,
          reason: 'Expected a single sort token.',
          fallback: defaultValue,
        };
      }

      const [column, direction] = raw.split(':');

      if (
        (column === 'createdAt' || column === 'total') &&
        (direction === 'asc' || direction === 'desc')
      ) {
        return {
          ok: true,
          value: {
            column,
            direction,
          },
        };
      }

      return {
        ok: false,
        reason: 'Expected <column>:<direction>.',
        fallback: defaultValue,
      };
    },
    serialize(value) {
      return `${value.column}:${value.direction}`;
    },
    equals(left, right) {
      return left.column === right.column && left.direction === right.direction;
    },
  };
}
```

## Examples

### Search page with debouncing

```ts
const state = urlState(
  {
    search: stringParam(''),
    status: enumParam(['open', 'closed'] as const, 'open'),
    page: numberParam(1),
  },
  {
    debounceMs: 250,
    history: 'replace',
  },
);
```

### Dashboard filters with browser history

```ts
const state = urlState(
  {
    startDate: dateIsoParam(),
    endDate: dateIsoParam(),
    showArchived: booleanParam(false),
    tab: enumParam(['overview', 'revenue'] as const, 'overview'),
  },
  {
    history: 'push',
  },
);
```

### Nullable values

```ts
const state = urlState({
  selectedId: nullableParam(stringParam('')),
});
```

## Invalid URL Handling

`fallbackToDefault` is the default behavior and is the safest production choice. Invalid numbers,
booleans, enums, arrays, or dates fall back to codec defaults instead of throwing.

When stricter behavior is needed:

- use `removeInvalid` to clean bad query params out of the URL after parsing
- use `throwInDev` to fail loudly during development while keeping production safe

## Release Contract

- bump `angular/packages/angular-url-state/package.json`
- tag `angular-url-state-v<version>`
- let `.github/workflows/release-angular-url-state.yml` validate, publish, and create the release

## Multiple Instances and Route Transitions

This note only matters in a narrow set of component designs.

It is safe to split one route into multiple `urlState()` handles when each handle owns different
query-param keys. A common example is one handle for filters and another for pagination. Each
instance preserves unmanaged keys when it writes, so those disjoint slices compose correctly.

The unsupported case is multiple handles trying to own the same key, such as two widgets both
writing `page` or `search`. In that setup the library does not coordinate competing writers, so the
last write wins.

This also affects components with debounced URL writes that are destroyed during navigation. The
library clears the pending timer and removes its `Location` listener when the host component is
destroyed, so stale writes do not leak into the next route.

Use cases affected by this note:

- one route split into filter state, pagination state, or tab state: supported when keys are disjoint
- parent and child components that both want to edit the same query param: not recommended
- long-lived services trying to own route-specific query state across navigation: not recommended
- debounced search pages that users may leave quickly: supported, because cleanup happens on destroy

For most applications this is not worth "fixing" in the library. Overlapping ownership is usually a
state-boundary problem, not a missing feature. The simpler pattern is to keep one logical owner for
each query key and pass signals or update helpers down to child components. A coordination layer is
only worth building if your app genuinely needs multiple independent editors for the same URL param.

## Design Notes

- signal-first public API
- deterministic serialization order based on schema order
- no hidden globals outside Angular DI
- no direct browser globals in the core logic
- small, pure codecs that are easy to unit test
- router synchronization isolated from codec parsing

## Testing Strategy

The package is tested at three levels:

- codec unit tests for parsing, serialization, defaults, arrays, nullable values, and dates
- router integration tests for initialization, navigation updates, debouncing, invalid handling,
  strict invalid handling, multi-instance composition, route transition cleanup, and browser
  history behavior
- Playwright coverage over the demo app to confirm real browser navigation stays healthy
- demo-app build and app tests to confirm real Angular usage stays healthy

## SSR

The package interacts through Angular Router and `Location` abstractions rather than browser
globals, which keeps the core compatible with server-side rendering environments.

## Versioning Policy

HexGuard uses semantic versioning.

- `0.x` releases may refine API shape quickly while the library hardens.
- breaking API changes will be called out explicitly in release notes.
- the goal for `1.0` is a minimal, stable URL-state core that future HexGuard packages can build
  on top of.

## Release Workflow

Package publishing is handled by `.github/workflows/release-angular-url-state.yml`.

- bump the version in `package.json`
- push the change to `main`
- tag the release as `angular-url-state-v<version>`
- the workflow validates the workspace, runs Playwright, publishes to npm, and creates a GitHub
  release with the built tarball
