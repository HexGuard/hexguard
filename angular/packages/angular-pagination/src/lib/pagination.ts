import { computed, effect, inject, signal } from '@angular/core';

import type { PaginationHandle, PaginationInternalState, PaginationOptions } from './types';

/**
 * Default number of items per page.
 */
const DEFAULT_PAGE_SIZE = 20;

/**
 * Injects a signal-based pagination handle.
 *
 * @param options - Optional configuration.
 *
 * @example
 * ```ts
 * const pag = injectPagination({ pageSize: 20 });
 *
 * // Reactive reads
 * pag.page(); pag.totalPages(); pag.hasNext();
 *
 * // Set total from API
 * pag.total.set(response.totalCount);
 *
 * // Navigate
 * pag.goToPage(3);
 * pag.nextPage();
 * ```
 */
export function injectPagination(options?: PaginationOptions): PaginationHandle {
  const persistKey = options?.persistPageSize;
  const savedSize = persistKey ? tryReadPageSize(persistKey) : null;
  const pageSize = savedSize ?? options?.pageSize ?? DEFAULT_PAGE_SIZE;
  const initialPage = options?.initialPage ?? 1;
  const resetOn = options?.resetOn;

  function tryReadPageSize(key: string): number | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed = parseInt(raw, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch { /* quota or permission denied */ }
    return null;
  }

  // ── Mutable state ───────────────────────────────────────────────
  const state: PaginationInternalState = {
    page: signal(initialPage),
    pageSize: signal(pageSize),
    total: signal(0),
  };

  // ── Reset on external signal change ────────────────────────────
  if (resetOn) {
    let firstRun = true;
    effect(() => {
      // Read the signal to subscribe
      resetOn();
      if (firstRun) {
        firstRun = false;
        return;
      }
      state.page.set(1);
    });
  }

  // ── Derived signals ────────────────────────────────────────────
  const totalPages = computed(() => {
    const t = state.total();
    const ps = state.pageSize();
    if (t <= 0 || ps <= 0) {
      return 0;
    }
    return Math.ceil(t / ps);
  });

  const hasNext = computed(() => state.page() < totalPages());
  const hasPrevious = computed(() => state.page() > 1);
  const isFirstPage = computed(() => state.page() <= 1);
  const isLastPage = computed(() => state.page() >= totalPages());

  const rangeStart = computed(() => {
    const p = state.page();
    const ps = state.pageSize();
    if (state.total() === 0) {
      return 0;
    }
    return (p - 1) * ps + 1;
  });

  const rangeEnd = computed(() => {
    const p = state.page();
    const ps = state.pageSize();
    const t = state.total();
    const end = p * ps;
    return Math.min(end, t);
  });

  // ── Navigation helpers ─────────────────────────────────────────
  function clamp(page: number): number {
    const max = Math.max(totalPages(), 1);
    return Math.max(1, Math.min(page, max));
  }

  function goToPage(page: number): void {
    state.page.set(clamp(page));
  }

  function nextPage(): void {
    if (hasNext()) {
      state.page.set(state.page() + 1);
    }
  }

  function previousPage(): void {
    if (hasPrevious()) {
      state.page.set(state.page() - 1);
    }
  }

  function firstPage(): void {
    state.page.set(1);
  }

  function lastPage(): void {
    const max = Math.max(totalPages(), 1);
    state.page.set(max);
  }

  function setPageSize(size: number): void {
    state.pageSize.set(size);
    state.page.set(1);
    if (persistKey) {
      try { localStorage.setItem(persistKey, String(size)); } catch { /* ignore */ }
    }
  }

  return {
    page: state.page,
    pageSize: state.pageSize,
    total: state.total,
    totalPages,
    hasNext,
    hasPrevious,
    rangeStart,
    rangeEnd,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
  };
}
