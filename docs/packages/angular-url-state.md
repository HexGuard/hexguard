# `@hexguard/angular-url-state` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and validation
guidance.

## Purpose

`@hexguard/angular-url-state` keeps lightweight Angular UI state synchronized with URL query
parameters using standalone APIs, signals, and Angular Router abstractions.

The package is intentionally narrow:

- no global state manager
- no path-param or hash support in V1
- no form binding in the core package
- no runtime validation dependency

## Feature Matrix

| Capability                                            | Status      | Notes                                                                                     |
| ----------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| Typed signal-backed query state                       | Available   | `urlState()` exposes writable signals plus `snapshot()`, `patch()`, and `reset()`.        |
| Deterministic serialization by schema order           | Available   | Stable serialization keeps shared URLs, docs, and tests predictable.                      |
| Query-key remapping with `queryKey`                   | Available   | Local TypeScript keys can stay descriptive while the URL follows compact or legacy names. |
| Unmanaged query-param preservation                    | Available   | Managed writes keep unrelated query params intact.                                        |
| Invalid-param cleanup on the next managed write       | Available   | `removeInvalid` is intentionally deferred until the next write.                           |
| Immediate invalid URL normalization                   | Proposed    | Eager cleanup remains an RFC because it changes navigation timing behavior.               |
| Dev-mode duplicate ownership detection                | Proposed    | Diagnostics for overlapping writers may land later if real adopters need them.            |
| Reactive Forms binding in the core package            | Not planned | That concern lives in `@hexguard/angular-query-form`.                                     |
| Transaction or manual-commit mode in the core package | Not planned | Staged edit flows belong in higher-level app state or `@hexguard/angular-query-form`.     |
| Path params or hash support                           | Not planned | Query-string synchronization remains the package boundary.                                |

## Public API Map

| Export                      | Role                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------ |
| `urlState()`                | Creates the typed signal-backed state handle for a schema                            |
| `provideHexGuardUrlState()` | Registers DI defaults for history, debounce, default stripping, and invalid handling |
| `stringParam()`             | Single string value                                                                  |
| `numberParam()`             | Finite numeric value                                                                 |
| `booleanParam()`            | `true/false` and `1/0` parsing                                                       |
| `enumParam()`               | Fixed string-union value                                                             |
| `arrayParam()`              | Repeated query-param values                                                          |
| `dateIsoParam()`            | ISO-8601 date value or `null`                                                        |
| `nullableParam()`           | Allows `null` in combination with another codec                                      |
| `ArrayParamOptions`         | Configures repeated query-param defaults for `arrayParam()`                          |
| `InvalidQueryParamError`    | Dev-mode strict parsing failure                                                      |

Low-level type exports also remain part of the supported public API for wrappers and tests,
including `UrlState`, `UrlStateSchema`, `UrlStateOptions`, `UrlStateOptionsInput`, `ParamCodec`,
`ParamRawValue`, `ParamParseResult`, `InferCodecValue`, `InferSchemaValue`,
`InvalidParamBehavior`, and `UrlStateHistoryMode`.

## Option Resolution and Defaults

Both `provideHexGuardUrlState(options?)` and `urlState(schema, options?)` accept the same
`UrlStateOptionsInput` shape.

Resolution order is:

1. library defaults
2. injector-level defaults from `provideHexGuardUrlState()`
3. per-instance overrides passed to `urlState()`

`debounceMs` is normalized to a non-negative integer. Invalid values fall back to `0`.

| Option                  | Default               | Notes                                                                                                                                    |
| ----------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `history`               | `'replace'`           | Best for search/filter churn. Switch to `'push'` for state that should participate in browser history, such as tabs or presets.          |
| `debounceMs`            | `0`                   | Only affects local writes that schedule navigation. URL-originated hydration still applies immediately.                                  |
| `removeDefaultsFromUrl` | `true`                | Keeps URLs short by omitting values equal to codec defaults. Turn it off if explicit default params matter to consumers outside the app. |
| `invalidParamBehavior`  | `'fallbackToDefault'` | `'removeInvalid'` cleans the URL on the next write; `'throwInDev'` throws only in Angular dev mode and stays production-safe otherwise.  |

## Internal Behavior Notes

- Serialization order follows schema key order so URLs stay deterministic.
- Unmanaged query params are preserved on writes so the library only owns declared keys.
- Schema fields may remap one local property name to a different external query key through
  `{ codec, queryKey }`.
- Signal writes are wrapped to schedule router synchronization while URL-originated writes bypass
  re-entrant navigation.
- Debounced writes coalesce bursty input such as search fields.
- `removeInvalid` reparses bad URLs into fallback values and then cleans the invalid params from
  the URL on the next managed write.

## Query-Key Remapping

Use `queryKey` when the local TypeScript key should stay descriptive but the external query string
must honor a legacy contract or stay compact.

```ts
const state = urlState({
  searchText: { codec: stringParam(''), queryKey: 'q' },
  pageNumber: { codec: numberParam(1), queryKey: 'p' },
  selectedTags: { codec: arrayParam(stringParam()), queryKey: 'tag' },
});
```

Key rules:

- local schema keys still drive signals, snapshots, and `patch()` calls
- `queryKey` defaults to the schema property name, so existing consumers do not need changes
- deterministic serialization still follows local schema order, not sorted query-key order
- duplicate `queryKey` values fail fast during `urlState()` setup
- invalid-param diagnostics carry both the local schema key and the incoming `queryKey` when they differ
- reserved local names such as `patch`, `reset`, and `snapshot` remain blocked on the returned handle, but the external query key may use those strings

## Built-in Codec Options

`ArrayParamOptions<T>` currently exposes one field for `arrayParam()`:

| Field          | Default | Description                                                                     |
| -------------- | ------- | ------------------------------------------------------------------------------- |
| `defaultValue` | `[]`    | Fallback array used when the param is missing, invalid, or reset to its default |

## Custom Codec Guidance

- Treat codecs as pure translators between typed application state and query-param strings.
- Supply `equals` for any codec that produces arrays, dates, or object values on parse. Without
  it, semantically equivalent values can look different by reference and cause redundant signal
  writes or no-op navigations.
- Keep parse failures descriptive. The `reason` string becomes the payload used by
  `InvalidQueryParamError` in `throwInDev` mode.

## Multi-instance and Route Lifecycle

- Multiple `urlState()` handles can coexist in one component when each one owns disjoint query
  keys, such as `filtersState` and `paginationState`.
- Overlapping ownership of the same query key is not a supported coordination mechanism for
  `0.1.x`. If two instances manage the same key, the last writer wins.
- `urlState()` listeners are tied to the component injection context. When the owning route is
  destroyed, the library tears down the `Location` listener and clears pending debounce timers.
- The intended pattern is one route-aware component owning each slice of URL state, rather than a
  singleton service that survives unrelated route transitions.

Practical impact:

- safe: one route splits ownership into filters, pagination, and tab state with disjoint keys
- risky: parent and child components both write `page`, `search`, or another shared key
- risky: a service outlives the route but continues trying to own route-scoped query params
- safe: a debounced search page is destroyed during navigation because pending writes are cleaned up

Is it worth fixing in the library?

- usually no, because overlapping ownership is ambiguous by design rather than an implementation gap
- usually yes only if your product intentionally needs multiple independent editors for the exact
  same query key and a single owner is not realistic
- for most apps, the better fix is architectural: one `urlState()` owner per query key, with child
  components receiving signals or update methods instead of creating their own competing handles

## Demo Routes

Run the demo app locally with `pnpm start`, then inspect the routes listed in the [URL state demo
runbook section](../demo/README.md#url-state-demo-routes).

- `/packages/angular-url-state`: package overview and demo catalog
- `/packages/angular-url-state/orders?p=2`: remapped query keys plus debounced replace-state filters
- `/packages/angular-url-state/dashboard`: push-state tabs, presets, and archive-toggle history replay

## Validation Surface

```bash
pnpm test:lib
pnpm build:lib
pnpm test:e2e
```

The Playwright suite is relevant because the demo exercises the same public API the package exports.

The library test suite explicitly covers strict invalid handling in `throwInDev` mode,
multi-instance composition with disjoint query keys, and cleanup of pending debounced writes on
route transitions.

## Release Contract

- bump `angular/packages/angular-url-state/package.json`
- tag `angular-url-state-v<version>`
- let `.github/workflows/release-angular-url-state.yml` validate, publish, and create the release
