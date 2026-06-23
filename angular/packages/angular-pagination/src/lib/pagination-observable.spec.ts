import { createPaginationState } from './pagination-observable';

describe('createPaginationState', () => {
  it('starts at page 1 with given pageSize', () => {
    const pag = createPaginationState(20);
    expect(pag.page$.getValue()).toBe(1);
    expect(pag.pageSize$.getValue()).toBe(20);
  });

  it('goToPage updates the page', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    pag.goToPage(3);
    expect(pag.page$.getValue()).toBe(3);
  });

  it('nextPage increments page', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    pag.nextPage();
    expect(pag.page$.getValue()).toBe(2);
  });

  it('previousPage decrements page', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    pag.goToPage(5);
    pag.previousPage();
    expect(pag.page$.getValue()).toBe(4);
  });

  it('firstPage resets to page 1', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    pag.goToPage(5);
    pag.firstPage();
    expect(pag.page$.getValue()).toBe(1);
  });

  it('lastPage goes to the last page', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    pag.lastPage();
    expect(pag.page$.getValue()).toBe(10);
  });

  it('hasNext$ is true when not on last page', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    const values: boolean[] = [];
    pag.hasNext$.subscribe((v) => values.push(v));
    expect(values[values.length - 1]).toBe(true);
  });

  it('hasPrevious$ is false on first page', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    const values: boolean[] = [];
    pag.hasPrevious$.subscribe((v) => values.push(v));
    expect(values[values.length - 1]).toBe(false);
  });

  it('totalPages$ reflects total / pageSize', () => {
    const pag = createPaginationState(25);
    pag.total$.next(100);
    const values: number[] = [];
    pag.totalPages$.subscribe((v) => values.push(v));
    expect(values[values.length - 1]).toBe(4);
  });

  it('setPageSize resets to page 1 and updates size', () => {
    const pag = createPaginationState(10);
    pag.total$.next(100);
    pag.goToPage(5);
    pag.setPageSize(50);
    expect(pag.page$.getValue()).toBe(1);
    expect(pag.pageSize$.getValue()).toBe(50);
  });
});
