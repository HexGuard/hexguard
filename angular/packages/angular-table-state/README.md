# @hexguard/angular-table-state

**Unified table state for Angular.** Compose sorting, pagination, selection, and filtering into one signal-based handle with optional URL persistence.

**[Deep package notes](docs/packages/angular-table-state.md)** · **[Demo](/packages/angular-table-state/demo)**

---

## Problem

Data tables need coordinated sort, page, selection, and filter state — but wiring these together manually leads to scattered signals, inconsistent reset behavior, and fragile URL sync.

**`@hexguard/angular-table-state`** composes existing HexGuard primitives (`@hexguard/angular-pagination`, `@hexguard/angular-selection-state`) into a single `injectTableState()` handle with `resetAll()`, filter management, and optional URL sync.

## Installation

```bash
pnpm add @hexguard/angular-table-state
```

Requires `@hexguard/angular-pagination` and `@hexguard/angular-selection-state` as peer dependencies.

## Quickstart

```typescript
import { injectTableState } from '@hexguard/angular-table-state';

const table = injectTableState();

// Sort
table.sortColumn.set('name');
table.sortDirection.set('asc');
table.toggleSort('name');

// Pagination
table.pagination.setPage(2);
table.pagination.page(); // Signal<number>

// Selection
table.selection.toggle('row-1');
table.selection.selectedCount(); // Signal<number>

// Filters
table.setFilter('status', 'active');
table.filters(); // Signal<Record<string, string>>

// Reset everything
table.resetAll();
```

## Use Cases

### Coordinated table controls

```html
<button (click)="table.toggleSort('name')">
  Name {{ table.sortColumn() === 'name' ? table.sortDirection() : '' }}
</button>

<select (change)="table.setFilter('status', $event.target.value)">
  <option value="">All</option>
  <option value="active">Active</option>
</select>

<button (click)="table.pagination.previousPage()">← Prev</button>
<span>Page {{ table.pagination.page() }}</span>
<button (click)="table.pagination.nextPage()">Next →</button>

<button (click)="table.selection.toggleAll()">
  {{ table.selection.allSelected() ? 'Deselect All' : 'Select All' }}
</button>
```

## API

### `injectTableState(options?)`

| Member | Type | Description |
|--------|------|-------------|
| `sortColumn` | `WritableSignal<string \| null>` | Current sort column key |
| `sortDirection` | `WritableSignal<'asc' \| 'desc' \| ''>` | Current sort direction |
| `toggleSort(column)` | `(string) => void` | Toggle sort: off → asc → desc → off |
| `clearSort()` | `() => void` | Reset sort column and direction |
| `pagination` | `PaginationHandle` | Pagination sub-state (external or internal) |
| `selection` | `SelectionStateLike` | Selection sub-state (external or internal) |
| `filters` | `Signal<Record<string, string>>` | Active filters map |
| `setFilter(key, value)` | `(string, string) => void` | Set a filter value |
| `clearFilter(key)` | `(string) => void` | Remove a specific filter |
| `clearAllFilters()` | `() => void` | Remove all filters |
| `resetAll()` | `() => void` | Clear sort, filters, selection, reset page to 1 |

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pagination` | `PaginationHandle?` | — | External pagination handle (default: creates internal) |
| `paginationOptions` | `PaginationOptions?` | — | Options for internal pagination (ignored if external pagination provided) |
| `selection` | `SelectionStateLike?` | — | External selection state (default: creates internal) |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Sort column/direction with toggle | ✅ |
| Pagination delegation (external or internal) | ✅ |
| Selection delegation (external or internal) | ✅ |
| Filter add/remove/clear-all | ✅ |
| resetAll() — coordinated clear | ✅ |
| Column visibility management | ❌ (v0.2) |
| Row expansion state | ❌ (v0.2) |

## Demo

Visit `/packages/angular-table-state/demo` to test sort toggling, pagination, selection, filters, and one-call reset.
