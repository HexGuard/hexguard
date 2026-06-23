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

## Code Examples

### Debounced search input with URL sync

```typescript
import { urlState, stringParam, numberParam } from '@hexguard/angular-url-state';

@Component({ ... })
class SearchComponent {
  readonly filters = urlState({
    searchText: { codec: stringParam(''), queryKey: 'q' },
    page: numberParam(1),
    category: stringParam('all'),
  }, { debounceMs: 250, history: 'replace' });

  // Reactive: filters.searchText(), filters.page(), filters.category()
  // URL: ?q=hello&page=2&category=books

  resetSearch(): void {
    this.filters.patch({ page: 1 });  // Maintain category, reset page
  }

  clearAll(): void {
    this.filters.reset();  // All fields back to codec defaults
  }
}
```

### Multi-select tag filter with arrayParam

```typescript
import { urlState, arrayParam, stringParam } from '@hexguard/angular-url-state';

const state = urlState({
  tags: { codec: arrayParam(stringParam()), queryKey: 'tag' },
});

function toggleTag(tag: string): void {
  const current = state.snapshot().tags;
  const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
  state.patch({ tags: next });
}
// URL: ?tag=angular&tag=rxjs&tag=signals
```

### Nullable param with conditional display

```typescript
import { urlState, nullableParam, stringParam } from '@hexguard/angular-url-state';

const state = urlState({ discountCode: nullableParam(stringParam()) });
effect(() => {
  const code = state.snapshot().discountCode;
  if (code !== null) {
    applyDiscount(code); // Only runs when a value is present
  }
});
```

## Related Resources

- [Package README](../../angular/packages/angular-url-state/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-url-state/)
- [Source Code](../../angular/packages/angular-url-state/src/)
- [Consumed by: `@hexguard/angular-query-form`](./angular-query-form.md)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational — no code has been changed.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                                                                                                                                            | Severity   |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Public API Design         | Narrow barrel — only 4 modules re-exported. Internal helpers in `schema.ts` and `router-sync.ts` are correctly hidden.                                                                                                                                                                                                                             | praise     |
| Public API Design         | All public exports have JSDoc, but none include `@example` tags. The workflow instructions require `@example` showing TypeScript and template usage.                                                                                                                                                                                               | moderate   |
| Public API Design         | `export *` barrel is pragmatically justified (each source module exports a focused set of related symbols) but differs from the explicit-named-export pattern used by most sibling packages.                                                                                                                                                       | suggestion |
| Public API Design         | `DEFAULT_URL_STATE_OPTIONS` and `HEXGUARD_URL_STATE_OPTIONS` are exposed without `@internal` annotation — consumers could depend on internals.                                                                                                                                                                                                     | minor      |
| Implementation Quality    | Signal-first architecture with `WritableSignal`, `computed()`, and `equal:` comparators. Excellent use of generics for type inference.                                                                                                                                                                                                             | praise     |
| Implementation Quality    | In-flight deduplication via `applyingUrlState`, `navigationBatchDepth`, `pendingQueryString` comparison — multiple defense layers against redundant navigation.                                                                                                                                                                                    | praise     |
| Implementation Quality    | `writable.set` override pattern mutates the signal object's method reference. Works correctly but is fragile if Angular changes signal internals.                                                                                                                                                                                                  | minor      |
| Implementation Quality    | `flushNavigation()` uses `await router.navigate()` without promise-based concurrent-navigation dedup — `pendingQueryString` mitigates the common case but rapid sequential writes could theoretically overlap.                                                                                                                                     | minor      |
| Implementation Quality    | No browser globals — all dependencies go through Angular DI (`Router`, `ActivatedRoute`, `Location`, `DestroyRef`). SSR compatible.                                                                                                                                                                                                                | praise     |
| Documentation             | README covers quickstart, feature matrix, all 7 codecs, custom codec guidance, invalid URL handling, SSR compatibility, release contract — excellent depth.                                                                                                                                                                                        | praise     |
| Documentation             | Deep-dive doc complements README with internal behavior notes, multi-instance guidance, and query-key remapping rules. Well structured.                                                                                                                                                                                                            | praise     |
| Documentation             | Release tag pattern docs are accurate and match the workflow file.                                                                                                                                                                                                                                                                                 | praise     |
| Test Coverage             | ~32 tests across 3 files: param codec unit tests, router-sync unit tests, full integration tests via `RouterTestingHarness`.                                                                                                                                                                                                                       | praise     |
| Test Coverage             | Missing: `dateIsoParam.equals` test, `arrayParam` with non-string inner codec, `nullableParam` with custom `equals`, `provideHexGuardUrlState()` global option override, SSR/`isDevMode` test for `throwInDev`, rapid concurrent write stress test, `patch()` with undefined values, `reset()` unit test, `booleanParam` with `1`/`0` URL parsing. | moderate   |
| Demo Integration          | Two distinct demos (orders/search + dashboard) demonstrating remapped keys, debounce, push history, date params, archive toggle.                                                                                                                                                                                                                   | praise     |
| Demo Integration          | Stable `data-testid` attributes on ALL interactive elements. Inspector panel with live state + code samples. Snippet markers for doc generation.                                                                                                                                                                                                   | praise     |
| Demo Integration          | 13+ Playwright test cases covering landing page, overview, responsive layout, navigation, hydration, shareable URLs, inspector panel, tab switching, reset filters.                                                                                                                                                                                | praise     |
| Cross-package Consistency | `provideHexGuardUrlState()` follows the `provide*()` naming convention. `urlState()` factory calls `inject()` directly rather than using the inject+token pattern — a deliberate deviation since there's no multi-instance disambiguation use case.                                                                                                | suggestion |
| Cross-package Consistency | No `.NET` counterpart (expected — this is Angular-only URL state, no server-side equivalent needed).                                                                                                                                                                                                                                               | praise     |

### Improvement & Extension Opportunities

| Area      | Suggestion                                                                                                                                                                          | Type        | Difficulty |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| API       | Add `@example` JSDoc tags to `urlState()`, `provideHexGuardUrlState()`, and all 7 codec factories showing TypeScript and template usage patterns.                                   | improvement | easy       |
| API       | Add `reset()` unit test coverage (currently only tested indirectly via Playwright).                                                                                                 | improvement | easy       |
| API       | Consider adding `@internal` annotation to `DEFAULT_URL_STATE_OPTIONS` and optionally `HEXGUARD_URL_STATE_OPTIONS` to clarify intended consumer API vs testing/advanced-use surface. | improvement | easy       |
| Tests     | Add `dateIsoParam.equals` unit test to verify date-equality comparison logic.                                                                                                       | improvement | easy       |
| Tests     | Add `arrayParam(numberParam())` test to verify non-string array codec.                                                                                                              | improvement | easy       |
| Tests     | Add `provideHexGuardUrlState()` global option override test.                                                                                                                        | improvement | easy       |
| Tests     | Add rapid sequential write stress test (no debounce) to verify no double-navigation.                                                                                                | improvement | medium     |
| Tests     | Add SSR/`isDevMode` test for `throwInDev` behavior.                                                                                                                                 | improvement | medium     |
| Extension | Eager invalid-URL normalization (currently Proposed in feature matrix) — cleanup on initial parse rather than deferring to next write.                                              | extension   | medium     |
| Extension | Dev-mode duplicate ownership detection (currently Proposed) — diagnostics for overlapping `urlState()` writers sharing query keys.                                                  | extension   | medium     |
