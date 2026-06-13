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

- bump `packages/angular-url-state/package.json`
- tag `angular-url-state-v<version>`
- let `.github/workflows/release-angular-url-state.yml` validate, publish, and create the release
