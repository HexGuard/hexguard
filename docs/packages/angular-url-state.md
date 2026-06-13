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
| `InvalidQueryParamError`    | Dev-mode strict parsing failure                                                      |

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
- Signal writes are wrapped to schedule router synchronization while URL-originated writes bypass
  re-entrant navigation.
- Debounced writes coalesce bursty input such as search fields.
- `removeInvalid` reparses bad URLs into fallback values and then cleans the invalid params from
  the URL.

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
