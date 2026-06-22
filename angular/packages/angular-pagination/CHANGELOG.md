# Changelog

## 0.1.0 — 2026-06-22

Initial release of `@hexguard/angular-pagination`.

### Features

- `injectPagination()` — signal-based pagination state: page, pageSize, total, totalPages, hasNext, hasPrevious, rangeStart, rangeEnd
- Navigation helpers: goToPage, nextPage, previousPage, firstPage, lastPage, setPageSize
- Optional URL-sync adapter via `withPaginationUrlSync()` for @hexguard/angular-url-state
- Auto-reset to page 1 on external signal change
- Pairs with HexGuard.Pagination .NET contracts
