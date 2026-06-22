import type { Signal, WritableSignal } from '@angular/core';

/**
 * Options for configuring the pagination state.
 */
export interface PaginationOptions {
  /**
   * Number of items per page.
   * @default 20
   */
  readonly pageSize?: number;

  /**
   * Initial page number (1-based).
   * @default 1
   */
  readonly initialPage?: number;

  /**
   * An external signal that resets the current page to 1 when its value changes.
   * Useful for resetting pagination when search/filter parameters change.
   */
  readonly resetOn?: Signal<unknown>;
}

/**
 * Handle returned by {@link injectPagination}.
 */
export interface PaginationHandle {
  /** Current page number (1-based). */
  readonly page: WritableSignal<number>;
  /** Number of items per page. */
  readonly pageSize: WritableSignal<number>;
  /** Total number of items across all pages. */
  readonly total: WritableSignal<number>;

  /** Total number of pages (derived). */
  readonly totalPages: Signal<number>;
  /** Whether there is a next page. */
  readonly hasNext: Signal<boolean>;
  /** Whether there is a previous page. */
  readonly hasPrevious: Signal<boolean>;
  /** 1-based index of the first item on the current page (e.g. "Showing 1-20"). */
  readonly rangeStart: Signal<number>;
  /** 1-based index of the last item on the current page. */
  readonly rangeEnd: Signal<number>;
  /** Whether the current page is the first page. */
  readonly isFirstPage: Signal<boolean>;
  /** Whether the current page is the last page. */
  readonly isLastPage: Signal<boolean>;

  /** Navigate to a specific page number (clamped to valid range). */
  goToPage(page: number): void;
  /** Go to the next page. No-op if already on the last page. */
  nextPage(): void;
  /** Go to the previous page. No-op if already on the first page. */
  previousPage(): void;
  /** Go to the first page. */
  firstPage(): void;
  /** Go to the last page. */
  lastPage(): void;
  /** Change the page size. Resets to page 1. */
  setPageSize(size: number): void;
}

/**
 * Internal mutable state for the pagination handle.
 */
export interface PaginationInternalState {
  page: WritableSignal<number>;
  pageSize: WritableSignal<number>;
  total: WritableSignal<number>;
}
