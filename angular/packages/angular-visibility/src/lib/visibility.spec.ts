import { TestBed } from '@angular/core/testing';

import { injectVisibility, inElementVisibility } from './visibility';
import { DEFAULT_ACTIVITY_EVENTS, DEFAULT_IDLE_TIMEOUT_MS } from './types';

describe('injectVisibility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Default: tab is visible
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('tab visibility', () => {
    it('starts visible when document is visible', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility();
        expect(vis.isVisible()).toBe(true);
      });
    });

    it('becomes hidden on visibilitychange event', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility();

        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));

        expect(vis.isVisible()).toBe(false);
      });
    });

    it('becomes visible again on visibilitychange', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility();

        // Hide
        Object.defineProperty(document, 'visibilityState', {
          value: 'hidden',
          writable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
        expect(vis.isVisible()).toBe(false);

        // Show
        Object.defineProperty(document, 'visibilityState', {
          value: 'visible',
          writable: true,
        });
        document.dispatchEvent(new Event('visibilitychange'));
        expect(vis.isVisible()).toBe(true);
      });
    });
  });

  describe('idle detection', () => {
    it('starts not idle', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility();
        expect(vis.isIdle()).toBe(false);
      });
    });

    it('becomes idle after the timeout period', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility({ idleTimeoutMs: 5000 });
        expect(vis.isIdle()).toBe(false);

        vi.advanceTimersByTime(5000);
        expect(vis.isIdle()).toBe(true);
      });
    });

    it('resets idle timer on activity event', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility({ idleTimeoutMs: 5000 });

        vi.advanceTimersByTime(3000);
        // Simulate user activity
        document.dispatchEvent(new MouseEvent('mousemove'));
        vi.advanceTimersByTime(3000);

        // Should not be idle yet — timer was reset
        expect(vis.isIdle()).toBe(false);

        vi.advanceTimersByTime(2000);
        expect(vis.isIdle()).toBe(true);
      });
    });

    it('tracks idleDuration increasing over time', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility({ idleTimeoutMs: 10000 });

        vi.advanceTimersByTime(3000);
        expect(vis.idleDuration()).toBeGreaterThanOrEqual(3000);

        vi.advanceTimersByTime(2000);
        expect(vis.idleDuration()).toBeGreaterThanOrEqual(5000);
      });
    });

    it('resets idleDuration on activity', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility({ idleTimeoutMs: 10000 });

        vi.advanceTimersByTime(3000);

        document.dispatchEvent(new MouseEvent('mousedown'));
        expect(vis.idleDuration()).toBe(0);
      });
    });

    it('never becomes idle when idleTimeoutMs is 0', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility({ idleTimeoutMs: 0 });

        vi.advanceTimersByTime(100000);
        expect(vis.isIdle()).toBe(false);
      });
    });

    it('uses custom activity events', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility({
          idleTimeoutMs: 5000,
          activityEvents: ['click'],
        });

        vi.advanceTimersByTime(3000);

        // mousemove should NOT reset (not in whitelist)
        document.dispatchEvent(new MouseEvent('mousemove'));
        vi.advanceTimersByTime(2000);
        expect(vis.isIdle()).toBe(true);
      });
    });
  });

  describe('lastActivity', () => {
    it('updates on activity', () => {
      TestBed.runInInjectionContext(() => {
        const vis = injectVisibility({ idleTimeoutMs: 5000 });
        const before = vis.lastActivity();

        vi.advanceTimersByTime(1000);
        document.dispatchEvent(new MouseEvent('keydown'));

        expect(vis.lastActivity()).toBeGreaterThan(before);
      });
    });
  });
});

describe('inElementVisibility', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    originalIntersectionObserver = globalThis.IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('returns false when element is undefined', () => {
    TestBed.runInInjectionContext(() => {
      const elSignal = vi.fn().mockReturnValue(undefined);
      const isVisible = inElementVisibility(elSignal as any);

      expect(isVisible()).toBe(false);
    });
  });

  it('observes the element and reports intersection', () => {
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {};

    globalThis.IntersectionObserver = class MockIntersectionObserver {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        intersectionCallback = callback;
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = () => {};
    } as any;

    TestBed.runInInjectionContext(() => {
      const el = document.createElement('div');
      const elSignal = vi.fn().mockReturnValue({ nativeElement: el });
      const isVisible = inElementVisibility(elSignal as any);

      // Flush effects so the effect() body runs synchronously
      TestBed.flushEffects();

      expect(mockObserve).toHaveBeenCalledWith(el);
      expect(isVisible()).toBe(false);

      // Simulate intersection
      intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
      expect(isVisible()).toBe(true);

      intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry]);
      expect(isVisible()).toBe(false);
    });
  });

  it('disconnects observer on destroy', () => {
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();

    globalThis.IntersectionObserver = class MockIntersectionObserver {
      constructor(_callback: any) {
        // capture but not used for this test
      }
      observe = mockObserve;
      disconnect = mockDisconnect;
      unobserve = () => {};
    } as any;

    TestBed.runInInjectionContext(() => {
      const el = document.createElement('div');
      const elSignal = vi.fn().mockReturnValue({ nativeElement: el });
      inElementVisibility(elSignal as any);

      TestBed.flushEffects();
      expect(mockObserve).toHaveBeenCalled();

      // Simulate component destroy — this triggers DestroyRef cleanup
      TestBed.resetTestingModule();

      expect(mockDisconnect).toHaveBeenCalled();
    });
  });
});
