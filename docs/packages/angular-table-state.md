# @hexguard/angular-table-state — Deep Package Notes

Unified table state for Angular: compose sorting, pagination, selection, and filtering into one signal-based handle.

## Problem

Data tables need coordinated sort, page, selection, and filter state — but wiring these together manually leads to scattered signals, inconsistent reset behavior, fragile URL sync, and duplicated boilerplate across every data-table screen.

**`@hexguard/angular-table-state`** composes existing HexGuard primitives (`@hexguard/angular-pagination`, `@hexguard/angular-selection-state`) into a single `injectTableState()` handle. It accepts external handles for pagination and selection (when you want to share state across components) or creates internal defaults.

## API

- `sortColumn: WritableSignal<string | null>` — Current sort column key.
- `sortDirection: WritableSignal<'asc' | 'desc' | ''>` — Current sort direction.
- `toggleSort(column: string)` — Cycle: off → asc → desc → off for the given column.
- `clearSort()` — Reset sort column and direction to defaults.
- `pagination: PaginationHandle` — Delegated pagination sub-state (external or internal).
- `selection: SelectionStateLike` — Delegated selection sub-state (external or internal).
- `filters: Signal<Record<string, string>>` — Active filters.
- `setFilter(key: string, value: string)` — Set a filter.
- `clearFilter(key: string)` — Remove a filter.
- `clearAllFilters()` — Remove all filters.
- `resetAll()` — Clear sort, filters, selection, and reset page to 1.

---

## Assessment: Potential Improvements

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding sort-direction cycle customization (configurable order) | Low |
| API | Consider adding `setFilters(record)` bulk filter setter | Low |
| API | Consider adding column visibility management in v0.2 | Low |
| Tests | Missing test: `resetAll()` resets pagination page to 1 | Low |
| Tests | Missing test: `clearAllFilters()` removes all filters | Low |

## Code Examples

### Full-featured table

```typescript
import { injectTableState } from '@hexguard/angular-table-state';

@Component({ ... })
class DataTableComponent {
  readonly table = injectTableState({
    defaultSortColumn: 'name',
    defaultSortDirection: 'asc',
  });

  readonly columns = ['name', 'status', 'date'];

  onHeaderClick(column: string): void {
    this.table.toggleSort(column);
  }

  onSelectAll(): void {
    this.table.selection.toggleAll();
  }

  applyFilter(key: string, value: string): void {
    this.table.setFilter(key, value);
  }
}
```

### Shared pagination and selection

```typescript
import { injectPagination } from '@hexguard/angular-pagination';
import { injectSelectionState } from '@hexguard/angular-selection-state';
import { injectTableState } from '@hexguard/angular-table-state';

@Component({ ... })
class SharedTableComponent {
  readonly pagination = injectPagination({ pageSize: 20 });
  readonly selection = injectSelectionState<string>();

  readonly table = injectTableState({
    pagination: this.pagination,
    selection: this.selection,
  });

  // pagination and selection are shared with other components
}
```

### URL-synced table

```typescript
import { injectTableState } from '@hexguard/angular-table-state';

@Component({ ... })
class UrlSyncedTableComponent {
  readonly table = injectTableState();
}
```
