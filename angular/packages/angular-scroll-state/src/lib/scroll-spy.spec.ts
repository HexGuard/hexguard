import { TestBed } from '@angular/core/testing';
import { inScrollSpy } from './scroll-spy';

// Mock IntersectionObserver for jsdom test environment
class MockIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '0px';
  readonly thresholds: number[] = [];
  readonly scrollMargin: string = '0px';

  constructor(
    private callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? '0px';
    this.thresholds = options?.threshold
      ? Array.isArray(options.threshold)
        ? [...options.threshold]
        : [options.threshold]
      : [0];
  }

  observe(_target: Element): void {
    const entry: IntersectionObserverEntry = {
      target: _target,
      isIntersecting: false,
      intersectionRatio: 0,
      boundingClientRect: new DOMRect(),
      intersectionRect: new DOMRect(),
      rootBounds: null,
      time: Date.now(),
    };
    this.callback([entry], this as unknown as IntersectionObserver);
  }

  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

// Polyfill before tests run
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

describe(inScrollSpy.name, () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  it('starts with null active section', () => {
    TestBed.runInInjectionContext(() => {
      const spy = inScrollSpy(['intro', 'details']);
      expect(spy.activeSection()).toBeNull();
    });
  });

  it('accepts custom rootMargin', () => {
    TestBed.runInInjectionContext(() => {
      const spy = inScrollSpy(['a', 'b'], { rootMargin: '0px' });
      expect(spy.activeSection()).toBeNull();
    });
  });
});
