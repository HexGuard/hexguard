# @hexguard/angular-pagination — Deep Package Notes

Signal-based pagination state for Angular: page, pageSize, total, derived signals, and URL-sync adapter.

## Problem

Every list, table, and search-results page needs pagination state — current page, page size, total count, total pages, next/previous enabled, page-range display — yet every team rebuilds the same page-number math, boundary handling, and reset semantics. On top of that, pagination state needs to compose with URL query params and filter state.

**`@hexguard/angular-pagination`** standardizes this into one injectable contract.

## API

### `injectPagination(options?)`

**Derived signals (computed):** totalPages, hasNext, hasPrevious, rangeStart, rangeEnd, isFirstPage, isLastPage

**Writable signals:** page, pageSize, total

**Navigation:** goToPage(n), nextPage(), previousPage(), firstPage(), lastPage(), setPageSize(n)

### `withPaginationUrlSync(pag, config)`

Binds pagination state to URL query params via an injected `@hexguard/angular-url-state` UrlState handle.

## .NET Pairing

The Angular package pairs with `HexGuard.Pagination` which provides `QueryRequest` and `QueryResponse<T>` records.

---

## Assessment: Potential Improvements

| Area         | Suggestion                                                                                                                                                                           | Priority |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| API          | Consider adding `pageRange()` computed helper (like the demo computes) as a built-in signal                                                                                          | Low      |
| API          | Consider `goToPage` returning a `Promise` for chaining with async data fetch                                                                                                         | Low      |
| URL Sync     | The `withPaginationUrlSync()` function requires a `UrlStateLike` handle — consider a zero-config variant that injects it internally when `@hexguard/angular-url-state` is configured | Medium   |
| .NET Pairing | The `QueryRequest`/`QueryResponse<T>` contracts are well-aligned but there's no auto-generation of TypeScript types from the .NET records                                            | Low      |
| Tests        | Missing edge case: `totalPages` with zero total returns 0, but `lastPage()` navigates to `max(1, 0) = 1` — this is handled correctly but not explicitly tested                       | Low      |

---

## API Review Findings

Review date: 2026-06-22. Findings are observational — no code has been changed.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                                                     | Severity   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Public API Design         | Narrow surface — 4 exports: `injectPagination()`, `withPaginationUrlSync()`, plus type interfaces. No internal helpers leaked.                                                                                                                              | praise     |
| Public API Design         | `injectPagination()` and `withPaginationUrlSync()` both have JSDoc `@example` tags. `PaginationOptions`, `PaginationHandle`, `UrlStateLike` have property-level JSDoc but no `@example`.                                                                    | minor      |
| Public API Design         | `UrlStateLike` interface provides minimal duck-type coupling with `@hexguard/angular-url-state` — no hard peer dependency needed. Elegant design.                                                                                                           | praise     |
| Public API Design         | All `PaginationHandle` properties are `readonly` signals. Method signatures are plain function types.                                                                                                                                                       | praise     |
| Implementation Quality    | Signal-first: `signal()` for mutable state, `computed()` for all 9 derived values (`totalPages`, `hasNext`, `hasPrevious`, `rangeStart`, `rangeEnd`, `isFirstPage`, `isLastPage`).                                                                          | praise     |
| Implementation Quality    | `resetOn` uses `effect()` with first-run skip via `TestBed.flushEffects()` pattern. `setPageSize` correctly resets to page 1.                                                                                                                               | praise     |
| Implementation Quality    | `clamp()` function guards page number to valid range (`Math.max(1, page)` when `totalPages` is 0).                                                                                                                                                          | praise     |
| Implementation Quality    | URL-sync adapter uses two `effect()` instances for bidirectional sync (state→URL, URL→state). No hard dependency on `@hexguard/angular-url-state`.                                                                                                          | praise     |
| Implementation Quality    | Effect-based bidirectional sync could cause extra writes if both effects fire in same cycle — mitigated by Angular's effect batching.                                                                                                                       | minor      |
| Documentation             | README covers problem statement, quickstart, full API tables, use cases, cross-stack pairing, scope boundaries.                                                                                                                                             | praise     |
| Documentation             | Deep-dive doc is concise (37 lines of content) with a thoughtful "Potential Improvements" table. Could benefit from architecture notes or more detailed API discussion.                                                                                     | suggestion |
| Test Coverage             | 17 test cases covering: initial state, custom pageSize/initialPage, totalPages, hasNext/hasPrevious, rangeStart/rangeEnd, goToPage clamping, nextPage/previousPage boundary, firstPage/lastPage, setPageSize reset, isFirstPage/isLastPage, resetOn signal. | praise     |
| Test Coverage             | **No tests for `withPaginationUrlSync()`** — the URL-sync adapter has zero test coverage. This is a significant gap.                                                                                                                                        | moderate   |
| Test Coverage             | Not tested: `totalPages` with zero/negative total, `pageSize` of 0 or negative, `total` set to negative, `rangeStart`/`rangeEnd` when modifying pageSize, `goToPage` with floating point.                                                                   | minor      |
| Demo Integration          | Full interactive demo with page size selector, total input, page number buttons, range display, signal value panel.                                                                                                                                         | praise     |
| Demo Integration          | Cross-stack demo with .NET API integration — demonstrates real server-side pagination with product table, error handling, and data fetching.                                                                                                                | praise     |
| Demo Integration          | Stable `data-testid` attributes throughout. Demo snippet entries registered for both pages.                                                                                                                                                                 | praise     |
| Demo Integration          | No Playwright E2E tests exercise the pagination playground buttons, range display, or cross-stack demo — only catalog description text assertions exist.                                                                                                    | moderate   |
| Cross-package Consistency | Build scripts, angular.json registration, tsconfig path mapping, CHANGELOG, LICENSE all present and correct.                                                                                                                                                | praise     |
| Cross-package Consistency | Release workflow exists with proper tag pattern `angular-pagination-v*`.                                                                                                                                                                                    | praise     |
| Cross-package Consistency | Strong .NET pairing: `HexGuard.Pagination` provides `QueryRequest` and `QueryResponse<T>` records that mirror Angular computed signals (`HasNext`, `HasPrevious`, `RangeStart`, `RangeEnd`, `TotalPages`).                                                  | praise     |
| Cross-package Consistency | `data/` folder in feature directory is empty — no mock data or mock API functions for isolated testing. Cross-stack demo fetches directly from SampleApi.                                                                                                   | minor      |

### Improvement & Extension Opportunities

| Area          | Suggestion                                                                                                                            | Type        | Difficulty |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| Tests         | Add comprehensive tests for `withPaginationUrlSync()` — state→URL, URL→state, default/custom param names, non-default value omission. | improvement | medium     |
| Tests         | Add Playwright E2E tests for pagination playground (buttons, range display, signal panel) and cross-stack demo.                       | improvement | medium     |
| Tests         | Add edge case tests: zero/negative total, zero/negative pageSize, floating-point `goToPage`.                                          | improvement | easy       |
| Demo          | Add mock data/mock API functions to `data/` folder for isolated testing without SampleApi dependency.                                 | improvement | easy       |
| Documentation | Expand deep-dive doc with architecture notes, URL-sync adapter behavior details, and cross-stack integration patterns.                | improvement | easy       |
| API           | Add built-in `pageRange()` computed signal (currently computed locally in demo).                                                      | extension   | easy       |
| API           | Add zero-config URL-sync variant that injects `UrlStateLike` internally when `@hexguard/angular-url-state` is configured.             | extension   | medium     |
| Extension     | TypeScript type generation from .NET `QueryResponse<T>` records for end-to-end type safety.                                           | extension   | medium     |
