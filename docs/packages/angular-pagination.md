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
