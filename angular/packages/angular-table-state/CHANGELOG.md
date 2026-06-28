# Changelog

## 0.1.0 — 2026-06-28

Initial release of `@hexguard/angular-table-state`.

### Features

- `injectTableState()` — unified table state handle
- Sorting: `sortColumn`, `sortDirection` signals, `toggleSort(column)`, `clearSort()`
- Pagination: integrates with `@hexguard/angular-pagination` (accepts external handle or creates internal)
- Selection: integrates with `@hexguard/angular-selection-state` (accepts external handle or creates internal)
- Filtering: `filters` signal, `setFilter()`, `clearFilter()`, `clearAllFilters()`
- `resetAll()` — resets sort, selection, filters, and page to 1
