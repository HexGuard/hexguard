# @hexguard/angular-pagination

Signal-based pagination state for Angular: page, pageSize, total, derived signals, and optional URL-sync adapter for `@hexguard/angular-url-state`. Pairs with `HexGuard.Pagination` on the .NET side.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-pagination.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-pagination
```

## Quickstart

```ts
import { injectPagination } from '@hexguard/angular-pagination';

@Component({ ... })
export class ProductListComponent {
  readonly pagination = injectPagination({ pageSize: 20 });

  // Read state
  readonly page = this.pagination.page;           // Signal<number>
  readonly totalPages = this.pagination.totalPages; // Signal<number>
  readonly hasNext = this.pagination.hasNext;       // Signal<boolean>

  // Navigate
  this.pagination.nextPage();
  this.pagination.goToPage(3);

  // Set total from API response
  this.pagination.total.set(response.totalCount);
}
```

## Features

| Feature                     | Status | Notes                                      |
| --------------------------- | ------ | ------------------------------------------ |
| Page math signals           | ✅     | page, pageSize, total, totalPages, etc.    |
| Navigation helpers          | ✅     | goToPage, next, prev, first, last          |
| URL-sync adapter            | ✅     | Optional, pairs with angular-url-state     |
| Auto-reset on signal change | ✅     | Reset to page 1 when external signal fires |
| Pairs with .NET             | ✅     | HexGuard.Pagination QueryRequest/Response   |

## API Reference

### `injectPagination(options?)`

```ts
interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
  resetOn?: Signal<unknown>;
}

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

### `withPaginationUrlState(config)`

```ts
interface PaginationUrlSyncConfig {
  urlState?: UrlState;
  paramPage?: string;    // default 'p'
  paramSize?: string;    // default 'size'
}
```
