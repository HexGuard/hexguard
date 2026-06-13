# HexGuard

HexGuard publishes small, production-grade guardrails for Angular and .NET applications. The
packages in this monorepo focus on boring reliability problems that show up in real teams:
shareable UI state, repeatable submit flows, predictable API error handling, and operationally
safe defaults.

The first package is `@hexguard/angular-url-state`.

## What `@hexguard/angular-url-state` solves

Angular applications repeatedly need to keep lightweight UI state in sync with query parameters:

- search text and filters
- table pagination and page size
- tabs and dashboard presets
- selected IDs and tags
- date ranges and report options
- browser back and forward navigation

`@hexguard/angular-url-state` provides a type-safe, signal-first API for that problem without
introducing a state-management framework or runtime validation dependency.

## Installation

```bash
pnpm add @hexguard/angular-url-state
```

Peer dependencies:

- Angular `^22.0.0`
- Angular Router `^22.0.0`

## Quickstart

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

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

const state = urlState(
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

state.search();
state.search.set('boots');
state.page.set(2);
state.patch({ tags: ['priority'] });
state.reset();
```

## Supported Param Types

- `stringParam(defaultValue)`
- `numberParam(defaultValue)`
- `booleanParam(defaultValue)`
- `enumParam(values, defaultValue)`
- `arrayParam(innerCodec, options?)`
- `dateIsoParam(defaultValue?)`
- `nullableParam(innerCodec)`

## Invalid URL Handling

Invalid query values are safe by default.

- `fallbackToDefault`: parse failures use the codec default or fallback value.
- `removeInvalid`: parse failures use the fallback value and the next synchronized URL removes the
  invalid param.
- `throwInDev`: throws `InvalidQueryParamError` in Angular dev mode and falls back safely in
  production mode.

## SSR Considerations

The core library does not reach for `window`, `document`, or `location`. It integrates through
Angular dependency injection, `Location`, and the Angular Router so the parsing and serialization
logic stays testable and SSR-safe.

## Browser History Behavior

- `history: 'replace'` keeps fast-moving filters from polluting browser history.
- `history: 'push'` creates history entries that work with the browser back and forward buttons.
- external URL changes flow back into signals through Angular routing abstractions.

## Non-goals for V1

- full state management
- path parameter syncing
- hash-fragment syncing
- reactive-forms bindings in the core package
- UI components
- local storage or secret persistence

## Local Development

```bash
pnpm install
pnpm build
pnpm test:ci
pnpm lint
pnpm start
```

The monorepo contains:

- `packages/angular-url-state`: publishable Angular library
- `apps/demo-angular`: demo application with realistic URL-state scenarios

## Roadmap

- `@hexguard/angular-submit-lock`
- `@hexguard/angular-api-errors`
- `@hexguard/angular-table-state`
- `@hexguard/angular-preferences`
- `@hexguard/angular-dirty-state`
- `@hexguard/angular-http-dedupe`
- `HexGuard.ProblemDetails`
- `HexGuard.Webhooks`
- `HexGuard.Pagination`

## License

MIT. See `LICENSE`.
