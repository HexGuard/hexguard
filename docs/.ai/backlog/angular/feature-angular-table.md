---
id: feature-angular-table
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-table'
---

# @hexguard/angular-table

## Summary

Headless data table structure state for Angular — column ordering, visibility toggling, column pinning (fixed left/right), resizable column handles, and sort state. Every admin panel has a data table with show/hide/reorder/resize/sort columns — yet every team rebuilds the same column management state.

**Distinct from `angular-pagination`** (page/pageSize/total) and `angular-selection-state` (checkbox selection). `angular-table` manages the **table structure itself** — its columns.

**Competition check:** Angular CDK's `CdkTable` handles rendering but not headless column state. No standalone column state package exists.

## Proposed Public API

```typescript
export interface ColumnDef {
  id: string;
  label: string;
  visible?: boolean;          // Default: true
  pinned?: 'left' | 'right' | null;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  resizeable?: boolean;
}

export interface TableConfig {
  columns: ColumnDef[] | Signal<ColumnDef[]>;
  persistKey?: string;
}

export interface TableState {
  readonly columns: Signal<ColumnDef[]>;
  readonly visibleColumns: Signal<ColumnDef[]>;
  readonly sort: Signal<SortState[]>;
  readonly hasChanges: Signal<boolean>;

  toggleColumn(id: string): void;
  showColumn(id: string): void;
  hideColumn(id: string): void;
  moveColumn(from: number, to: number): void;
  resizeColumn(id: string, width: number): void;
  pinColumn(id: string, position: 'left' | 'right' | null): void;
  resetColumns(): void;

  toggleSort(id: string): void;
  setSort(id: string, dir: SortDirection): void;
  clearSort(): void;
  readonly isSorted: (id: string) => Signal<SortDirection | null>;
}

export type SortDirection = 'asc' | 'desc';
export interface SortState { id: string; direction: SortDirection; }

export function injectTableState(config: TableConfig): TableState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-table/`.
2. Implement column state management with signals.
3. Support visibility, reorder, pinning, resize, sort.
4. Add localStorage persistence.
5. Add tests: column ops, persistence, sort cycling.
6. Register in workspace.
