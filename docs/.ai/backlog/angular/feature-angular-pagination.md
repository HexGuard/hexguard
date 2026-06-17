---
id: feature-angular-pagination
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-pagination'
---

# Angular Pagination Package

## Summary

Design `@hexguard/angular-pagination` as a headless Angular package for pagination state signals, page-change helpers, and URL-compatible page state to pair with `HexGuard.Pagination` on the .NET side.

The repeated problem is that every list, table, and search-results page needs pagination state — current page, page size, total count, total pages, next/previous enabled, page-range display — yet every team rebuilds the same page-number math, boundary handling, and reset semantics. On top of that, pagination state needs to compose with URL query params (via `@hexguard/angular-url-state`), sort state, and filter state for a coherent paginated browsing experience.

## Goals

- Provide `injectPagination(options?)` returning signal-based pagination state: page, pageSize, total, totalPages, hasNext, hasPrevious, rangeStart, rangeEnd.
- Support imperative navigation: `goToPage(n)`, `nextPage()`, `previousPage()`, `firstPage()`, `lastPage()`.
- Support configurable page sizes with a `setPageSize(n)` helper.
- Support automatic reset to page 1 when total changes or an external reset signal fires (composable with query-form `resetKeysOnChange` pattern).
- Provide a URL-sync adapter that binds pagination state to `@hexguard/angular-url-state` query params.
- Provide a convenience bridge to `HexGuard.Pagination` response models (`PaginationResponse<T>` → internal state).
- Keep the package dependency-free beyond `@angular/core` and `tslib`. URL-sync adapter has an optional peer dependency on `@hexguard/angular-url-state`.

## Non-Goals

- Rendering pagination UI (page buttons, page-size dropdown, item count) — that's app or design-system owned.
- Cursor-based pagination — this package handles offset/page-number pagination common in business apps.
- Infinite-scroll or load-more pagination — that's `@hexguard/angular-scroll-state`.
- Server-side pagination fetch — that's async-state's responsibility.

## Decisions

- Use 1-based page numbering internally (page 1 = first page) for user-facing consistency.
- Default page size to 20, configurable via options.
- Compute totalPages, hasNext, hasPrevious, rangeStart, rangeEnd as derived signals from page/pageSize/total.
- Keep the URL-sync adapter as a separate export (`withPaginationUrlSync`) so the core pagination package has no URL-state dependency.
- Treat `total` as a writeable signal — the consumer sets it when data loads from the API.

## Proposed Public API

```ts
import { injectPagination, withPaginationUrlSync } from '@hexguard/angular-pagination';

// Standalone usage
@Component({ ... })
export class ProductListComponent {
  private readonly data = injectAsyncValue(...);

  readonly pagination = injectPagination({
    pageSize: 20,
    resetOn: this.data.parameters,        // reset to page 1 when search params change
  });

  // Read state
  readonly page = this.pagination.page;          // Signal<number>
  readonly pageSize = this.pagination.pageSize;  // Signal<number>
  readonly total = this.pagination.total;        // Signal<number>
  readonly totalPages = this.pagination.totalPages;   // Signal<number>
  readonly hasNext = this.pagination.hasNext;         // Signal<boolean>
  readonly hasPrevious = this.pagination.hasPrevious; // Signal<boolean>
  readonly rangeStart = this.pagination.rangeStart;   // Signal<number>
  readonly rangeEnd = this.pagination.rangeEnd;       // Signal<number>

  // Navigate
  this.pagination.nextPage();
  this.pagination.previousPage();
  this.pagination.goToPage(3);
  this.pagination.firstPage();
  this.pagination.lastPage();
  this.pagination.setPageSize(50);

  // Set total when data loads
  effect(() => {
    const result = this.data.value();
    if (result) {
      this.pagination.total.set(result.totalCount);
    }
  });
}

// URL-sync adapter (optional, requires @hexguard/angular-url-state)
const pagination = injectPagination({
  pageSize: 20,
  ...withPaginationUrlState({            // binds page/pageSize to URL params
    urlState: inject(UrlState),          // or pass the urlState() handle
    paramPage: 'p',
    paramSize: 'size',
  }),
});

// Options
interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
  resetOn?: Signal<unknown>;             // reset to page 1 when this signal changes
}

// Return type
interface PaginationHandle {
  readonly page: WritableSignal<number>;
  readonly pageSize: WritableSignal<number>;
  readonly total: WritableSignal<number>;
  readonly totalPages: Signal<number>;
  readonly hasNext: Signal<boolean>;
  readonly hasPrevious: Signal<boolean>;
  readonly rangeStart: Signal<number>;
  readonly rangeEnd: Signal<number>;
  readonly isFirstPage: Signal<boolean>;
  readonly isLastPage: Signal<boolean>;
  nextPage(): void;
  previousPage(): void;
  goToPage(page: number): void;
  firstPage(): void;
  lastPage(): void;
  setPageSize(size: number): void;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-pagination/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:pagination`, `test:lib:pagination`).

### Phase 1: Core Implementation

3. Implement `injectPagination()` — writable signals for `page`, `pageSize`, `total`; derived signals for `totalPages`, `hasNext`, `hasPrevious`, `rangeStart`, `rangeEnd`, `isFirstPage`, `isLastPage`.
4. Implement navigation methods: `goToPage(n)` with boundary clamping (1..totalPages), `nextPage()`, `previousPage()`, `firstPage()`, `lastPage()`.
5. Implement `setPageSize(n)` — resets to page 1 when page size changes.
6. Implement `resetOn` — `effect()` that resets to page 1 when the tracked signal changes.
7. Implement URL-sync adapter (`withPaginationUrlState`) — reads initial page/pageSize from URL params, writes changes back.
8. Add unit tests for: page math at boundaries (page 1, last page, single page), navigation methods, page-size change with auto-reset, `resetOn` signal, URL-sync read/write (mock urlState), total updates, and edge cases (total=0, pageSize=0, negative page).

### Phase 2: Demo & Docs

9. Add a demo route at `/packages/angular-pagination` showing:
   - A paginated list with page navigation, page-size selector, and item-range display
   - URL-synced page state (via mock or real url-state)
   - Integration with async-state (load page on page change)
   - Reset-to-page-1 when total changes
10. Add Playwright coverage for the demo page.
11. Write the deep-dive doc at `docs/packages/angular-pagination.md`.
12. Update the npm-facing `README.md`.

### Phase 3: Release

13. Add `verify:package:pagination` to `angular/package.json`.
14. Add `.github/workflows/release-angular-pagination.yml`.
15. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:pagination` — unit tests for page math, navigation, reset, URL-sync.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm verify:package:pagination` — tarball smoke test.

## Follow-Ups

- Revisit a `HexGuard.Pagination` response-to-state helper that maps `PaginationResponse<T>` directly into the pagination handle.
- Evaluate adding cursor-based pagination support once the offset/page-number model proves out.
- Consider a `@hexguard/angular-pagination-ui` companion with optional page-button and page-size-dropdown rendering helpers.
