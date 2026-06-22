import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { injectPagination } from './pagination';

describe(injectPagination.name, () => {
  describe('initial state', () => {
    it('starts at page 1 with defaults', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination();
        expect(pag.page()).toBe(1);
        expect(pag.pageSize()).toBe(20);
        expect(pag.total()).toBe(0);
      });
    });

    it('accepts custom page size and initial page', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 50, initialPage: 3 });
        expect(pag.page()).toBe(3);
        expect(pag.pageSize()).toBe(50);
      });
    });
  });

  describe('derived signals (totalPages, hasNext, hasPrevious)', () => {
    it('computes totalPages from total and pageSize', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        expect(pag.totalPages()).toBe(10);
      });
    });

    it('hasNext is true when not on last page', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        expect(pag.hasNext()).toBe(true);
        pag.goToPage(10);
        expect(pag.hasNext()).toBe(false);
      });
    });

    it('hasPrevious is true when not on first page', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        expect(pag.hasPrevious()).toBe(false);
        pag.goToPage(2);
        expect(pag.hasPrevious()).toBe(true);
      });
    });
  });

  describe('rangeStart and rangeEnd', () => {
    it('computes range for page 1', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 20 });
        pag.total.set(100);
        expect(pag.rangeStart()).toBe(1);
        expect(pag.rangeEnd()).toBe(20);
      });
    });

    it('computes range for last page with partial items', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 20 });
        pag.total.set(45);
        pag.goToPage(3);
        expect(pag.rangeStart()).toBe(41);
        expect(pag.rangeEnd()).toBe(45);
      });
    });

    it('returns 0 rangeStart when total is 0', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination();
        expect(pag.rangeStart()).toBe(0);
        expect(pag.rangeEnd()).toBe(0);
      });
    });
  });

  describe('navigation', () => {
    it('goToPage navigates to a specific page', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        pag.goToPage(5);
        expect(pag.page()).toBe(5);
      });
    });

    it('goToPage clamps to valid range', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        pag.goToPage(999);
        expect(pag.page()).toBe(10);
        pag.goToPage(-5);
        expect(pag.page()).toBe(1);
      });
    });

    it('nextPage and previousPage work', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        pag.nextPage();
        expect(pag.page()).toBe(2);
        pag.previousPage();
        expect(pag.page()).toBe(1);
      });
    });

    it('nextPage is no-op on last page', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        pag.goToPage(10);
        pag.nextPage();
        expect(pag.page()).toBe(10);
      });
    });

    it('firstPage and lastPage', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        pag.goToPage(5);
        pag.firstPage();
        expect(pag.page()).toBe(1);
        pag.lastPage();
        expect(pag.page()).toBe(10);
      });
    });

    it('setPageSize resets to page 1', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        pag.goToPage(5);
        pag.setPageSize(25);
        expect(pag.pageSize()).toBe(25);
        expect(pag.page()).toBe(1);
      });
    });
  });

  describe('isFirstPage and isLastPage', () => {
    it('isFirstPage when on page 1', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        expect(pag.isFirstPage()).toBe(true);
        expect(pag.isLastPage()).toBe(false);
      });
    });

    it('isLastPage when on last page', () => {
      TestBed.runInInjectionContext(() => {
        const pag = injectPagination({ pageSize: 10 });
        pag.total.set(100);
        pag.goToPage(10);
        expect(pag.isFirstPage()).toBe(false);
        expect(pag.isLastPage()).toBe(true);
      });
    });
  });

  describe('resetOn', () => {
    it('resets to page 1 when resetOn signal changes', () => {
      TestBed.runInInjectionContext(() => {
        const resetTrigger = signal('initial');
        const pag = injectPagination({
          pageSize: 10,
          initialPage: 3,
          resetOn: resetTrigger,
        });
        pag.total.set(100);
        pag.goToPage(5);

        // Flush effects so the resetOn effect runs
        TestBed.flushEffects();

        // Change the reset signal
        resetTrigger.set('changed');
        TestBed.flushEffects();
        expect(pag.page()).toBe(1);
      });
    });
  });
});
