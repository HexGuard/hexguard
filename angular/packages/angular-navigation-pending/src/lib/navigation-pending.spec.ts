import { TestBed } from '@angular/core/testing';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { Subject } from 'rxjs';

import { injectNavigationPending } from './navigation-pending';

describe(injectNavigationPending.name, () => {
  let routerEvents: Subject<any>;
  let mockRouter: Partial<Router>;

  beforeEach(() => {
    routerEvents = new Subject<any>();
    mockRouter = {
      events: routerEvents.asObservable(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  describe('app-level (default)', () => {
    it('starts not navigating', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending();
        expect(nav.isNavigating()).toBe(false);
        expect(nav.isSlowNavigation()).toBe(false);
      });
    });

    it('becomes navigating on NavigationStart', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending();
        routerEvents.next(new NavigationStart(1, '/test'));
        expect(nav.isNavigating()).toBe(true);
      });
    });

    it('stops navigating on NavigationEnd', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending();
        routerEvents.next(new NavigationStart(1, '/test'));
        routerEvents.next(new NavigationEnd(1, '/test', '/test'));
        expect(nav.isNavigating()).toBe(false);
      });
    });

    it('stops navigating on NavigationCancel', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending();
        routerEvents.next(new NavigationStart(1, '/test'));
        routerEvents.next(new NavigationCancel(1, '/test', ''));
        expect(nav.isNavigating()).toBe(false);
      });
    });

    it('stops navigating on NavigationError', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending();
        routerEvents.next(new NavigationStart(1, '/test'));
        routerEvents.next(new NavigationError(1, '/test', new Error('fail')));
        expect(nav.isNavigating()).toBe(false);
      });
    });

    it('tracks isSlowNavigation with delay threshold', () => {
      vi.useFakeTimers();
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending({ delayedIndicatorMs: 200 });

        routerEvents.next(new NavigationStart(1, '/test'));
        expect(nav.isSlowNavigation()).toBe(false);

        vi.advanceTimersByTime(200);
        expect(nav.isSlowNavigation()).toBe(true);

        routerEvents.next(new NavigationEnd(1, '/test', '/test'));
        expect(nav.isSlowNavigation()).toBe(false);
      });
      vi.useRealTimers();
    });

    it('isSlowNavigation is immediate when delayedIndicatorMs is 0', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending({ delayedIndicatorMs: 0 });
        routerEvents.next(new NavigationStart(1, '/test'));
        expect(nav.isSlowNavigation()).toBe(true);
      });
    });

    it('markReady is a no-op in non-scoped mode', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending();
        routerEvents.next(new NavigationStart(1, '/test'));
        nav.markReady();
        expect(nav.isNavigating()).toBe(true);
      });
    });
  });

  describe('route-scoped mode', () => {
    it('isNavigating stops when markReady is called', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending({ routeScoped: true });

        routerEvents.next(new NavigationStart(1, '/test'));
        expect(nav.isNavigating()).toBe(true);

        nav.markReady();
        expect(nav.isNavigating()).toBe(false);
      });
    });

    it('isNavigating resets on navigation end', () => {
      TestBed.runInInjectionContext(() => {
        const nav = injectNavigationPending({ routeScoped: true });

        routerEvents.next(new NavigationStart(1, '/test'));
        nav.markReady();
        // Next navigation should start navigating again
        routerEvents.next(new NavigationEnd(1, '/test', '/test'));
        expect(nav.isNavigating()).toBe(false);
      });
    });
  });
});
