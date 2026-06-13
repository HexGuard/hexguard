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

Supported options:

- `history: 'replace' | 'push'`
- `debounceMs: number`
- `removeDefaultsFromUrl: boolean`
- `invalidParamBehavior: 'fallbackToDefault' | 'removeInvalid' | 'throwInDev'`

### `urlState(schema, options?)`

Creates a typed state object whose properties are writable Angular signals.

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

## Multiple Instances and Route Transitions

You can create more than one `urlState()` handle inside the same component when each instance owns
different query-param keys. Each instance merges unmanaged keys back into the URL, which lets
independent filter and pagination state compose safely.

Avoid overlapping ownership of the same key across multiple `urlState()` instances. The library
does not arbitrate conflicting writers for the same query parameter.

`urlState()` is scoped to the current Angular injection context. When the hosting component is
destroyed during a route transition, the library removes its `Location` listener and clears any
pending debounce timer. Create the state inside the route-aware component that owns that slice of
URL state.

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
