import { TestBed } from '@angular/core/testing';

import { injectBreakpointObserver } from './breakpoint-observer';
import { DEFAULT_BREAKPOINTS } from './types';

/**
 * Creates a mock `MediaQueryList` that simulates a `matchMedia` call.
 * The `matches` field reflects whether the simulated viewport width
 * meets the `min-width` in the query string.
 */
function mockMatchMedia(minWidth: number, viewportWidth: number): MediaQueryList {
  const matches = viewportWidth >= minWidth;
  let listeners: Array<(event: MediaQueryListEvent) => void> = [];

  return {
    matches,
    media: `(min-width: ${minWidth}px)`,
    onchange: null,
    addEventListener: (
      _type: string,
      listener: EventListenerOrEventListenerObject,
    ): void => {
      if (typeof listener === 'function') {
        listeners.push(listener as (event: MediaQueryListEvent) => void);
      }
    },
    removeEventListener: (
      _type: string,
      listener: EventListenerOrEventListenerObject,
    ): void => {
      listeners = listeners.filter((l) => l !== listener);
    },
    dispatchEvent(_event: Event): boolean {
      return true;
    },
    addListener(_listener: (event: MediaQueryListEvent) => void): void {
      // no-op for legacy API
    },
    removeListener(_listener: (event: MediaQueryListEvent) => void): void {
      // no-op for legacy API
    },
    // Simulate a viewport width change
    _simulateResize(newWidth: number): void {
      const newMatches = newWidth >= minWidth;
      if (newMatches !== matches) {
        const event = { matches: newMatches } as MediaQueryListEvent;
        listeners.forEach((l) => l(event));
      }
    },
  } as MediaQueryList & { _simulateResize(newWidth: number): void };
}

describe(injectBreakpointObserver.name, () => {
  let originalMatchMedia: typeof window.matchMedia;
  let mqlInstances: Array<MediaQueryList & { _simulateResize(newWidth: number): void }>;

  beforeEach(() => {
    mqlInstances = [];
    originalMatchMedia = window.matchMedia;

    // Default test viewport: 1024px (only 'sm', 'md', 'lg' match)
    const viewportWidth = 1024;

    window.matchMedia = ((query: string) => {
      const minWidthMatch = query.match(/\(min-width: (\d+)px\)/);
      if (minWidthMatch) {
        const minWidth = Number(minWidthMatch[1]);
        const mql = mockMatchMedia(minWidth, viewportWidth) as MediaQueryList & {
          _simulateResize(newWidth: number): void;
        };
        mqlInstances.push(mql);
        return mql;
      }
      // For arbitrary queries
      const mql = {
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
        addListener: () => {},
        removeListener: () => {},
      } as MediaQueryList;
      mqlInstances.push(mql as any);
      return mql;
    }) as typeof window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  describe('basic breakpoint matching', () => {
    it('returns matching breakpoints for the current viewport width', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();

        // At 1024px: sm (640≤), md (768≤), lg (1024≤) match; xl (1280≤) and 2xl (1536≤) don't
        expect(bp.breakpoints['sm']()).toBe(true);
        expect(bp.breakpoints['md']()).toBe(true);
        expect(bp.breakpoints['lg']()).toBe(true);
        expect(bp.breakpoints['xl']()).toBe(false);
        expect(bp.breakpoints['2xl']()).toBe(false);
      });
    });

    it('resolves active to the largest matching breakpoint', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();
        expect(bp.active()).toBe('lg');
      });
    });

    it('returns empty active when no breakpoints match (very narrow viewport)', () => {
      window.matchMedia = ((query: string) => {
        const minWidthMatch = query.match(/\(min-width: (\d+)px\)/);
        const minWidth = minWidthMatch ? Number(minWidthMatch[1]) : 0;
        return {
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
          addListener: () => {},
          removeListener: () => {},
        } as MediaQueryList;
      }) as typeof window.matchMedia;

      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();
        expect(bp.active()).toBe('');
      });
    });
  });

  describe('above()', () => {
    it('returns true for breakpoints at or below the current viewport', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();
        expect(bp.above('sm')()).toBe(true);
        expect(bp.above('md')()).toBe(true);
        expect(bp.above('lg')()).toBe(true);
        expect(bp.above('xl')()).toBe(false);
        expect(bp.above('2xl')()).toBe(false);
      });
    });

    it('returns false for unknown breakpoint names', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();
        expect(bp.above('unknown')()).toBe(false);
      });
    });
  });

  describe('below()', () => {
    it('returns true for breakpoints above the current viewport', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();
        expect(bp.below('sm')()).toBe(false);
        expect(bp.below('md')()).toBe(false);
        expect(bp.below('lg')()).toBe(false);
        expect(bp.below('xl')()).toBe(true);
        expect(bp.below('2xl')()).toBe(true);
      });
    });

    it('returns false for unknown breakpoint names', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();
        expect(bp.below('unknown')()).toBe(false);
      });
    });
  });

  describe('matches()', () => {
    it('evaluates an arbitrary media query', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver();
        // At 1024px
        expect(bp.matches('(min-width: 600px)')()).toBe(true);
        expect(bp.matches('(min-width: 1400px)')()).toBe(false);
      });
    });
  });

  describe('custom breakpoints', () => {
    it('accepts a custom breakpoint map', () => {
      TestBed.runInInjectionContext(() => {
        const bp = injectBreakpointObserver({
          breakpoints: { tablet: 600, desktop: 900 },
        });

        // At 1024px: both match
        expect(bp.breakpoints['tablet']()).toBe(true);
        expect(bp.breakpoints['desktop']()).toBe(true);
        expect(bp.active()).toBe('desktop');
      });
    });
  });

  describe('default breakpoints export', () => {
    it('exports the default breakpoint map', () => {
      expect(DEFAULT_BREAKPOINTS).toEqual({
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
      });
    });
  });
});
