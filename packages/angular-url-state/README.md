# `@hexguard/angular-url-state`

Type-safe, signal-first URL query state for Angular.

This package keeps Angular application state synchronized with query parameters using standalone
APIs, signals, and the Angular Router. It is designed for filter panels, admin tables,
dashboards, reports, and any other place where the URL should be shareable, deterministic, and
safe to parse.

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
  and browser history behavior
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
