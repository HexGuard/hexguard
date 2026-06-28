import { computed, inject, signal } from '@angular/core';
import { injectPagination } from '@hexguard/angular-pagination';
import type { PaginationHandle } from '@hexguard/angular-pagination';
import type { SelectionStateLike, SortDirection, TableStateHandle, TableStateOptions } from './types';

export function injectTableState(options?: TableStateOptions): TableStateHandle {
  // Pagination: use external or create internal
  const pagination: PaginationHandle =
    options?.pagination ?? injectPagination(options?.paginationOptions);

  // Selection: use external or create internal
  const selection: SelectionStateLike =
    options?.selection ?? createDefaultSelection();

  // Sort state
  const sortColumn = signal<string | null>(null);
  const sortDirection = signal<SortDirection>('asc');

  const sortState = computed(() => ({
    column: sortColumn(),
    direction: sortDirection(),
  }));

  function toggleSort(column: string): void {
    if (sortColumn() === column) {
      sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      sortColumn.set(column);
      sortDirection.set('asc');
    }
  }

  function clearSort(): void {
    sortColumn.set(null);
    sortDirection.set('asc');
  }

  // Filter state
  const filters = signal<Record<string, string>>({});

  function setFilter(column: string, value: string): void {
    filters.update((f) => ({ ...f, [column]: value }));
  }

  function clearFilter(column: string): void {
    filters.update((f) => {
      const next = { ...f };
      delete next[column];
      return next;
    });
  }

  function clearAllFilters(): void {
    filters.set({});
  }

  // Combined reset
  function resetAll(): void {
    clearSort();
    clearAllFilters();
    selection.clearSelection();
    pagination.goToPage(1);
  }

  return {
    sortColumn: sortColumn.asReadonly(),
    sortDirection: sortDirection.asReadonly(),
    toggleSort,
    clearSort,
    sortState,
    pagination,
    selection,
    filters: filters.asReadonly(),
    setFilter,
    clearFilter,
    clearAllFilters,
    resetAll,
  };
}

function createDefaultSelection(): SelectionStateLike {
  const selectedKeys = signal<ReadonlySet<string>>(new Set());
  const selectedCount = computed(() => selectedKeys().size);

  return {
    selectedKeys: selectedKeys.asReadonly(),
    selectedCount,
    toggle(key: string) {
      selectedKeys.update((set) => {
        const next = new Set(set);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      });
    },
    clearSelection() {
      selectedKeys.set(new Set());
    },
    selectAll(keys: readonly string[]) {
      selectedKeys.set(new Set(keys));
    },
    isSelected(key: string) {
      return computed(() => selectedKeys().has(key));
    },
  };
}
