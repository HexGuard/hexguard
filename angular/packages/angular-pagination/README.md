# @hexguard/angular-pagination

**Signal-based pagination state for Angular.** Page, pageSize, total, derived signals (totalPages, hasNext, rangeStart, etc.), and optional URL-sync adapter. Pairs with `HexGuard.Pagination` on the .NET side.

**[Deep package notes](docs/packages/angular-pagination.md)** · **[.NET counterpart](/dotnet/hexguard-pagination)** · **[Demo](/packages/angular-pagination/demo)** · **[Cross-stack demo](/packages/angular-pagination/cross-stack-demo)**

---

## Problem

Every list, table, and search-results page needs pagination state — current page, page size, total count, total pages, next/previous enabled, page-range display — yet every team rebuilds the same page-number math, boundary handling, and reset semantics. Pagination state also needs to compose with URL query params and filter signals.

**`@hexguard/angular-pagination`** standardizes this into one injectable contract with writable signals (`page`, `pageSize`, `total`), derived computed signals, and navigation helpers.

## Installation

```bash
pnpm add @hexguard/angular-pagination
```

## Quickstart

```typescript
import { injectPagination } from '@hexguard/angular-pagination';

@Component({...})
class ProductListComponent {
  readonly pag = injectPagination({ pageSize: 20 });

  // Read state
  readonly page = this.pag.page;               // WritableSignal<number>
  readonly totalPages = this.pag.totalPages;    // Signal<number>
  readonly hasNext = this.pag.hasNext;          // Signal<boolean>

  // Set total from API
  ngOnInit() { this.fetchPage(); }

  async fetchPage() {
    const res = await fetch(`/api/products?page=${this.pag.page()}&size=${this.pag.pageSize()}`);
    const body = await res.json();
    this.pag.total.set(body.totalCount);
    this.items = body.items;
  }
}
```

## Use Cases

### Search/filter with auto-reset
```typescript
const searchFilter = signal('');
const pag = injectPagination({ pageSize: 20, resetOn: searchFilter });
// When searchFilter changes, pagination resets to page 1 automatically.
```

### URL-synced pagination
```typescript
import { urlState, numberParam } from '@hexguard/angular-url-state';
import { withPaginationUrlSync } from '@hexguard/angular-pagination';

const state = urlState({ page: { codec: numberParam(1), queryKey: 'p' } });
const pag = injectPagination({ pageSize: 20 });
withPaginationUrlSync(pag, { urlState: state });
```

### Range display
```html
<span>Showing {{ pag.rangeStart() }}–{{ pag.rangeEnd() }} of {{ pag.total() }}</span>
```

## API

### `injectPagination(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pageSize` | `number` | `20` | Number of items per page |
| `initialPage` | `number` | `1` | Starting page (1-based) |
| `resetOn` | `Signal<unknown>` | — | External signal — page resets to 1 on change |

### `PaginationHandle`

| Member | Type | Description |
|--------|------|-------------|
| `page` | `WritableSignal<number>` | Current page (1-based) |
| `pageSize` | `WritableSignal<number>` | Items per page |
| `total` | `WritableSignal<number>` | Total items (set from API response) |
| `totalPages` | `Signal<number>` | Derived: `ceil(total / pageSize)` |
| `hasNext` | `Signal<boolean>` | `page < totalPages` |
| `hasPrevious` | `Signal<boolean>` | `page > 1` |
| `rangeStart` | `Signal<number>` | 1-based index of first visible item |
| `rangeEnd` | `Signal<number>` | 1-based index of last visible item |
| `isFirstPage` | `Signal<boolean>` | `page <= 1` |
| `isLastPage` | `Signal<boolean>` | `page >= totalPages` |
| `goToPage(n)` | `(n) => void` | Navigate to page (clamped) |
| `nextPage()` / `previousPage()` | `() => void` | Step one page (no-op at bounds) |
| `firstPage()` / `lastPage()` | `() => void` | Jump to boundary |
| `setPageSize(n)` | `(n) => void` | Change page size, resets to page 1 |

## Cross-stack Pairing

The Angular package pairs with `HexGuard.Pagination` (.NET) which provides `QueryRequest` / `QueryResponse<T>` records. See the [cross-stack demo](/packages/angular-pagination/cross-stack-demo) for end-to-end integration.

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Page math and navigation signals | ✅ |
| URL-sync adapter (angular-url-state) | ✅ |
| Auto-reset on filter change | ✅ |
| Data fetching (API calls) | ❌ (handle externally) |

## Demo

Visit `/packages/angular-pagination/demo` for a live pagination playground, and `/packages/angular-pagination/cross-stack-demo` for the .NET-backed version.

