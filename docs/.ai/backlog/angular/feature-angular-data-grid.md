---
id: feature-angular-data-grid
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-data-grid'
---

# @hexguard/angular-data-grid

## Summary

Pre-built data grid composing table + pagination + selection + filter + sort into one unified state. **Saves 1-2 days per list page.** Auto-reloads when any sub-state changes.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export function injectDataGrid<T>(config: {
  columns: ColumnDef[];
  loadData: (params: DataGridParams) => Promise<{ items: T[]; total: number }>;
  pageSize?: number; persistKey?: string;
  selectionMode?: 'none' | 'single' | 'multi';
  syncToUrl?: boolean;
}): {
  readonly data: Signal<T[]>;
  readonly total: Signal<number>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<string | null>;
  readonly columns: TableState;
  readonly pagination: PaginationState;
  readonly selection: SelectionState<string>;
  readonly filter: FilterState;
  readonly sort: Signal<SortState[]>;
  readonly isEmpty: Signal<boolean>;
  refresh(): Promise<void>; reset(): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-data-grid/`.
2. Compose existing grid primitives into unified state.
3. Implement auto-reload on sub-state change.
4. Add tests.
5. Register in workspace.
