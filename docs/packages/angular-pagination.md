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

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding `pageRange()` computed helper (like the demo computes) as a built-in signal | Low |
| API | Consider `goToPage` returning a `Promise` for chaining with async data fetch | Low |
| URL Sync | The `withPaginationUrlSync()` function requires a `UrlStateLike` handle — consider a zero-config variant that injects it internally when `@hexguard/angular-url-state` is configured | Medium |
| .NET Pairing | The `QueryRequest`/`QueryResponse<T>` contracts are well-aligned but there's no auto-generation of TypeScript types from the .NET records | Low |
| Tests | Missing edge case: `totalPages` with zero total returns 0, but `lastPage()` navigates to `max(1, 0) = 1` — this is handled correctly but not explicitly tested | Low |
