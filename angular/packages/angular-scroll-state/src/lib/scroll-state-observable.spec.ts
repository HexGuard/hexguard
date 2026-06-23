import { fromScrollPosition, fromInfiniteScroll, fromScrollSpy } from './scroll-state-observable';

describe('fromScrollPosition', () => {
  it('emits the initial scroll position on subscribe (custom target)', () => {
    const target = document.createElement('div');
    Object.defineProperty(target, 'scrollTop', { value: 42, writable: true, configurable: true });

    const values: number[] = [];
    const sub = fromScrollPosition(target).subscribe((v) => values.push(v));
    expect(values).toEqual([42]);
    sub.unsubscribe();
  });

  it('emits updated position on scroll event (custom target)', () => {
    const target = document.createElement('div');
    Object.defineProperty(target, 'scrollTop', { value: 0, writable: true, configurable: true });

    const values: number[] = [];
    const sub = fromScrollPosition(target).subscribe((v) => values.push(v));
    expect(values).toEqual([0]);
    sub.unsubscribe();
  });

  it('supports a custom scroll target with defined scrollTop', () => {
    const target = document.createElement('div');
    Object.defineProperty(target, 'scrollTop', { value: 100, writable: true, configurable: true });

    const values: number[] = [];
    const sub = fromScrollPosition(target).subscribe((v) => values.push(v));
    expect(values).toEqual([100]);
    sub.unsubscribe();
  });

  it('unsubscribes remove the scroll listener (custom target)', () => {
    const target = document.createElement('div');
    Object.defineProperty(target, 'scrollTop', { value: 0, writable: true, configurable: true });

    const values: number[] = [];
    const sub = fromScrollPosition(target).subscribe((v) => values.push(v));
    expect(values).toHaveLength(1);

    sub.unsubscribe();
    target.dispatchEvent(new Event('scroll'));
    expect(values).toHaveLength(1); // No additional emissions
  });
});

describe('fromInfiniteScroll', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    originalIntersectionObserver = globalThis.IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('emits when the sentinel enters the viewport', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {};
    let observedElement: Element | null = null;

    globalThis.IntersectionObserver = class MockIO {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        intersectionCallback = callback;
      }
      observe(el: Element) {
        observedElement = el;
      }
      disconnect = vi.fn();
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const sentinel = document.createElement('div');
    const values: number[] = [];
    const sub = fromInfiniteScroll(sentinel).subscribe(() => values.push(1));

    expect(observedElement).toBe(sentinel);
    intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    expect(values).toEqual([1]);
    sub.unsubscribe();
  });

  it('does not double-emit on repeated intersections', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {};

    globalThis.IntersectionObserver = class MockIO {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        intersectionCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const sentinel = document.createElement('div');
    const values: number[] = [];
    const sub = fromInfiniteScroll(sentinel).subscribe(() => values.push(1));

    intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    expect(values).toEqual([1]); // Only one emission
    sub.unsubscribe();
  });

  it('disconnects the observer on unsubscribe', () => {
    let disconnectCalled = false;

    globalThis.IntersectionObserver = class MockIO {
      constructor() {}
      observe = vi.fn();
      disconnect = vi.fn(() => {
        disconnectCalled = true;
      });
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const sentinel = document.createElement('div');
    const sub = fromInfiniteScroll(sentinel).subscribe();
    sub.unsubscribe();
    expect(disconnectCalled).toBe(true);
  });
});

describe('fromScrollSpy$', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    originalIntersectionObserver = globalThis.IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('does not emit on subscribe (waits for intersections)', () => {
    globalThis.IntersectionObserver = class MockIO {
      constructor() {}
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const sectionEl = document.createElement('div');
    sectionEl.id = 'intro';
    document.body.appendChild(sectionEl);

    const values: Array<string | null> = [];
    const sub = fromScrollSpy([]).subscribe((v: string | null) => values.push(v));
    expect(values).toHaveLength(0);

    sub.unsubscribe();
    document.body.removeChild(sectionEl);
  });

  it('emits the most-visible section ID on intersection', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {};
    let observedElements: Element[] = [];

    globalThis.IntersectionObserver = class MockIO {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        intersectionCallback = callback;
      }
      observe(el: Element) {
        observedElements.push(el);
      }
      disconnect = vi.fn();
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const section1 = document.createElement('div');
    section1.id = 'intro';
    document.body.appendChild(section1);

    const section2 = document.createElement('div');
    section2.id = 'details';
    document.body.appendChild(section2);

    const values: Array<string | null> = [];
    const sub = fromScrollSpy(['intro', 'details']).subscribe((v: string | null) => values.push(v));

    expect(observedElements).toHaveLength(2);

    intersectionCallback([
      { target: { id: 'intro' }, intersectionRatio: 0.8 } as IntersectionObserverEntry,
      { target: { id: 'details' }, intersectionRatio: 0.2 } as IntersectionObserverEntry,
    ]);
    expect(values).toEqual(['intro']);

    sub.unsubscribe();
    document.body.removeChild(section1);
    document.body.removeChild(section2);
  });

  it('disconnects the observer on unsubscribe', () => {
    let disconnectCalled = false;

    globalThis.IntersectionObserver = class MockIO {
      constructor() {}
      observe = vi.fn();
      disconnect = vi.fn(() => {
        disconnectCalled = true;
      });
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const sub = fromScrollSpy([]).subscribe();
    sub.unsubscribe();
    expect(disconnectCalled).toBe(true);
  });
});
