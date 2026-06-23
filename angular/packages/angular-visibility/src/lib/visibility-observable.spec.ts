import {
  fromVisibilityChanges,
  fromIdleState,
  fromElementVisibility,
} from './visibility-observable';

describe('fromVisibilityChanges', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });
  });

  it('emits the current visibility state on subscribe', () => {
    const values: boolean[] = [];
    const sub = fromVisibilityChanges().subscribe((v) => values.push(v));
    expect(values).toEqual([true]);
    sub.unsubscribe();
  });

  it('emits false when the tab becomes hidden', () => {
    const values: boolean[] = [];
    const sub = fromVisibilityChanges().subscribe((v) => values.push(v));

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(values).toEqual([true, false]);
    sub.unsubscribe();
  });

  it('emits true when the tab becomes visible again', () => {
    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });

    const values: boolean[] = [];
    const sub = fromVisibilityChanges().subscribe((v) => values.push(v));

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(values).toEqual([false, true]);
    sub.unsubscribe();
  });

  it('unsubscribes remove the visibilitychange listener', () => {
    const values: boolean[] = [];
    const sub = fromVisibilityChanges().subscribe((v) => values.push(v));
    sub.unsubscribe();

    Object.defineProperty(document, 'visibilityState', {
      value: 'hidden',
      writable: true,
      configurable: true,
    });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(values).toHaveLength(1); // Only the initial emission
  });
});

describe('fromIdleState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits false initially (not idle)', () => {
    const values: boolean[] = [];
    const sub = fromIdleState(1000).subscribe((v) => values.push(v));
    expect(values).toEqual([false]);
    sub.unsubscribe();
  });

  it('emits true after the idle timeout elapses', () => {
    const values: boolean[] = [];
    const sub = fromIdleState(1000).subscribe((v) => values.push(v));

    vi.advanceTimersByTime(1000);
    expect(values).toEqual([false, true]);
    sub.unsubscribe();
  });

  it('emits false on activity after being idle', () => {
    const values: boolean[] = [];
    const sub = fromIdleState(1000).subscribe((v) => values.push(v));

    expect(values).toEqual([false]);

    vi.advanceTimersByTime(1000);
    expect(values).toEqual([false, true]);

    document.dispatchEvent(new Event('mousemove'));
    expect(values).toEqual([false, true, false]);
    sub.unsubscribe();
  });

  it('resets the idle timer on activity before timeout', () => {
    const values: boolean[] = [];
    const sub = fromIdleState(1000).subscribe((v) => values.push(v));

    vi.advanceTimersByTime(500);
    document.dispatchEvent(new Event('mousemove'));
    vi.advanceTimersByTime(500);
    expect(values).toEqual([false]); // Not idle — timer was reset

    vi.advanceTimersByTime(500);
    expect(values).toEqual([false, true]);
    sub.unsubscribe();
  });
});

describe('fromElementVisibility', () => {
  let originalIntersectionObserver: typeof IntersectionObserver;

  beforeEach(() => {
    originalIntersectionObserver = globalThis.IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('emits true when element becomes visible', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {};

    globalThis.IntersectionObserver = class MockIO {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        intersectionCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const el = document.createElement('div');
    const values: boolean[] = [];
    const sub = fromElementVisibility(el).subscribe((v) => values.push(v));

    intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    expect(values).toEqual([true]);
    sub.unsubscribe();
  });

  it('emits false when element leaves the viewport', () => {
    let intersectionCallback: (entries: IntersectionObserverEntry[]) => void = () => {};

    globalThis.IntersectionObserver = class MockIO {
      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        intersectionCallback = callback;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = () => {};
    } as unknown as typeof IntersectionObserver;

    const el = document.createElement('div');
    const values: boolean[] = [];
    const sub = fromElementVisibility(el).subscribe((v) => values.push(v));

    intersectionCallback([{ isIntersecting: true } as IntersectionObserverEntry]);
    intersectionCallback([{ isIntersecting: false } as IntersectionObserverEntry]);
    expect(values).toEqual([true, false]);
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

    const el = document.createElement('div');
    const sub = fromElementVisibility(el).subscribe();
    sub.unsubscribe();

    expect(disconnectCalled).toBe(true);
  });
});
