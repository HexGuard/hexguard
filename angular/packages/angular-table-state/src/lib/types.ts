import type { PaginationHandle, PaginationOptions } from '@hexguard/angular-pagination';
import type { Signal, WritableSignal } from '@angular/core';

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  readonly column: string | null;
  readonly direction: SortDirection;
}

export interface TableStateOptions {
  /** External pagination handle. If omitted, creates an internal default. */
  readonly pagination?: PaginationHandle;
  /** Options for internal pagination (ignored if external pagination provided). */
  readonly paginationOptions?: PaginationOptions;
  /** External selection state handle. If omitted, creates an internal default. */
  readonly selection?: SelectionStateLike;
}

export interface SelectionStateLike {
  readonly selectedKeys: Signal<ReadonlySet<string>>;
  readonly selectedCount: Signal<number>;
  toggle(key: string): void;
  clearSelection(): void;
  selectAll(keys: readonly string[]): void;
  isSelected(key: string): Signal<boolean>;
}

export interface TableStateHandle {
  // ── Sorting ─────────────────────────────────────────────────
  readonly sortColumn: Signal<string | null>;
  readonly sortDirection: Signal<SortDirection>;
  toggleSort(column: string): void;
  clearSort(): void;
  readonly sortState: Signal<SortState>;

  // ── Pagination ──────────────────────────────────────────────
  readonly pagination: PaginationHandle;

  // ── Selection ───────────────────────────────────────────────
  readonly selection: SelectionStateLike;

  // ── Filtering ───────────────────────────────────────────────
  readonly filters: Signal<Record<string, string>>;
  setFilter(column: string, value: string): void;
  clearFilter(column: string): void;
  clearAllFilters(): void;

  // ── Combined ────────────────────────────────────────────────
  resetAll(): void;
}
