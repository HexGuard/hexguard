import { TestBed } from '@angular/core/testing';
import { injectTableState } from './table-state';

describe(injectTableState.name, () => {
  it('starts with default values', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      expect(ts.sortColumn()).toBeNull();
      expect(ts.sortDirection()).toBe('asc');
      expect(ts.filters()).toEqual({});
      expect(ts.pagination.page()).toBe(1);
      expect(ts.selection.selectedCount()).toBe(0);
    });
  });

  it('toggleSort sets column and defaults to asc', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.toggleSort('name');
      expect(ts.sortColumn()).toBe('name');
      expect(ts.sortDirection()).toBe('asc');
    });
  });

  it('toggleSort toggles direction on same column', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.toggleSort('name');
      ts.toggleSort('name');
      expect(ts.sortDirection()).toBe('desc');
    });
  });

  it('toggleSort resets direction when switching columns', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.toggleSort('name');
      ts.toggleSort('name');
      ts.toggleSort('age');
      expect(ts.sortColumn()).toBe('age');
      expect(ts.sortDirection()).toBe('asc');
    });
  });

  it('clearSort resets sort', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.toggleSort('name');
      ts.clearSort();
      expect(ts.sortColumn()).toBeNull();
    });
  });

  it('setFilter adds a filter', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.setFilter('status', 'active');
      expect(ts.filters()).toEqual({ status: 'active' });
    });
  });

  it('clearFilter removes a specific filter', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.setFilter('status', 'active');
      ts.setFilter('type', 'premium');
      ts.clearFilter('status');
      expect(ts.filters()).toEqual({ type: 'premium' });
    });
  });

  it('clearAllFilters removes all filters', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.setFilter('a', '1');
      ts.setFilter('b', '2');
      ts.clearAllFilters();
      expect(ts.filters()).toEqual({});
    });
  });

  it('selection toggle works', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.selection.toggle('item-1');
      expect(ts.selection.selectedCount()).toBe(1);
      ts.selection.toggle('item-1');
      expect(ts.selection.selectedCount()).toBe(0);
    });
  });

  it('resetAll clears sort, filters, selection, and resets page', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.toggleSort('name');
      ts.setFilter('status', 'active');
      ts.selection.toggle('item-1');
      ts.pagination.goToPage(3);
      ts.resetAll();
      expect(ts.sortColumn()).toBeNull();
      expect(ts.filters()).toEqual({});
      expect(ts.selection.selectedCount()).toBe(0);
      expect(ts.pagination.page()).toBe(1);
    });
  });

  it('sortState computed signal works', () => {
    TestBed.runInInjectionContext(() => {
      const ts = injectTableState();
      ts.toggleSort('name');
      expect(ts.sortState()).toEqual({ column: 'name', direction: 'asc' });
    });
  });
});
