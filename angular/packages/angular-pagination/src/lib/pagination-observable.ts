import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export interface PaginationObservables {
  /** Emits the current page number (1-based). */
  readonly page$: BehaviorSubject<number>;
  /** Emits the current page size. */
  readonly pageSize$: BehaviorSubject<number>;
  /** Emits the total item count. */
  readonly total$: BehaviorSubject<number>;
  /** Emits the total number of pages. */
  readonly totalPages$: Observable<number>;
  /** Emits `true` when there is a next page available. */
  readonly hasNext$: Observable<boolean>;
  /** Emits `true` when there is a previous page available. */
  readonly hasPrevious$: Observable<boolean>;
  /** Emits the 1-based start index of the current page range. */
  readonly rangeStart$: Observable<number>;
  /** Emits the 1-based end index of the current page range. */
  readonly rangeEnd$: Observable<number>;
  goToPage(page: number): void;
  nextPage(): void;
  previousPage(): void;
  firstPage(): void;
  lastPage(): void;
  setPageSize(size: number): void;
}

/**
 * Creates an observable-based pagination state, mirroring
 * `injectPagination()` but without Angular DI.
 *
 * @param pageSize - Number of items per page. Default `20`.
 * @param initialPage - Starting page number. Default `1`.
 * @returns An object with `page$`, `pageSize$`, `total$`
 *   `BehaviorSubject`s, derived `totalPages$`, `hasNext$`,
 *   `hasPrevious$`, `rangeStart$`, `rangeEnd$` observables, and
 *   navigation methods.
 *
 * @example
 * ```ts
 * import { createPaginationState } from '@hexguard/angular-pagination';
 *
 * const pag = createPaginationState();
 * pag.page$.subscribe(p => loadPage(p));
 * pag.nextPage();
 * ```
 */
export function createPaginationState(
  pageSize: number = 20,
  initialPage: number = 1,
): PaginationObservables {
  const pageSubject = new BehaviorSubject<number>(initialPage);
  const pageSizeSubject = new BehaviorSubject<number>(pageSize);
  const totalSubject = new BehaviorSubject<number>(0);

  const totalPages$ = combineLatest([totalSubject, pageSizeSubject]).pipe(
    map(([total, ps]) => (total <= 0 || ps <= 0 ? 0 : Math.ceil(total / ps))),
    distinctUntilChanged(),
  );

  const hasNext$ = combineLatest([pageSubject, totalPages$]).pipe(
    map(([page, totalPages]) => page < totalPages),
    distinctUntilChanged(),
  );

  const hasPrevious$ = pageSubject.pipe(
    map((page) => page > 1),
    distinctUntilChanged(),
  );

  const rangeStart$ = combineLatest([pageSubject, pageSizeSubject, totalSubject]).pipe(
    map(([page, ps, total]) => (total === 0 ? 0 : (page - 1) * ps + 1)),
    distinctUntilChanged(),
  );

  const rangeEnd$ = combineLatest([pageSubject, pageSizeSubject, totalSubject]).pipe(
    map(([page, ps, total]) => Math.min(page * ps, total)),
    distinctUntilChanged(),
  );

  function clamp(page: number): number {
    const totalPages = Math.max(Math.ceil(totalSubject.getValue() / pageSizeSubject.getValue()), 1);
    return Math.max(1, Math.min(page, totalPages));
  }

  function goToPage(page: number): void {
    pageSubject.next(clamp(page));
  }
  function nextPage(): void {
    const next = pageSubject.getValue() + 1;
    if (next <= Math.max(Math.ceil(totalSubject.getValue() / pageSizeSubject.getValue()), 1)) {
      pageSubject.next(next);
    }
  }
  function previousPage(): void {
    const prev = pageSubject.getValue() - 1;
    if (prev >= 1) pageSubject.next(prev);
  }
  function firstPage(): void {
    pageSubject.next(1);
  }
  function lastPage(): void {
    pageSubject.next(Math.max(Math.ceil(totalSubject.getValue() / pageSizeSubject.getValue()), 1));
  }
  function setPageSize(size: number): void {
    pageSizeSubject.next(size);
    pageSubject.next(1);
  }

  return {
    page$: pageSubject,
    pageSize$: pageSizeSubject,
    total$: totalSubject,
    totalPages$,
    hasNext$,
    hasPrevious$,
    rangeStart$,
    rangeEnd$,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setPageSize,
  };
}
