import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { computedFrom } from './computed-from';
import { injectToggle } from './toggle';
import { memoized } from './memoized';
import { throttledSignal } from './throttled-signal';

describe('computedFrom', () => {
  it('should derive from a single signal', () => {
    const a = signal('hello');
    const result = computedFrom([a], (v) => (v as string).toUpperCase());
    expect(result()).toBe('HELLO');
  });

  it('should derive from multiple signals', () => {
    const a = signal(1);
    const b = signal(2);
    const result = computedFrom([a, b], (x, y) => (x as number) + (y as number));
    expect(result()).toBe(3);
  });

  it('should recompute when a dependency changes', () => {
    const a = signal(1);
    const b = signal(10);
    const result = computedFrom([a, b], (x, y) => (x as number) + (y as number));
    expect(result()).toBe(11);
    a.set(5);
    expect(result()).toBe(15);
  });
});

describe('injectToggle', () => {
  function setup(initial?: boolean) {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly toggle = injectToggle(initial);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance.toggle;
  }

  it('should start with default false', () => {
    const t = setup();
    expect(t.value()).toBe(false);
  });

  it('should start with provided initial value', () => {
    const t = setup(true);
    expect(t.value()).toBe(true);
  });

  it('should toggle', () => {
    const t = setup(false);
    t.toggle();
    expect(t.value()).toBe(true);
    t.toggle();
    expect(t.value()).toBe(false);
  });

  it('should set specific value', () => {
    const t = setup(false);
    t.set(true);
    expect(t.value()).toBe(true);
  });

  it('should turn on and off', () => {
    const t = setup(false);
    t.on();
    expect(t.value()).toBe(true);
    t.off();
    expect(t.value()).toBe(false);
  });
});

describe('memoized', () => {
  it('should call factory on first read', () => {
    const fn = vi.fn(() => 42);
    const m = memoized(fn);
    expect(m()).toBe(42);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should return cached value within TTL', () => {
    const fn = vi.fn(() => Date.now());
    const m = memoized(fn, { ttlMs: 5000 });
    const first = m();
    const second = m();
    expect(second).toBe(first);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should re-evaluate after TTL expiry', () => {
    vi.useFakeTimers();
    let callCount = 0;
    const fn = vi.fn(() => { callCount++; return callCount; });
    const m = memoized(fn, { ttlMs: 100 });
    expect(m()).toBe(1);
    expect(m()).toBe(1); // cached
    vi.advanceTimersByTime(100); // trigger TTL timeout
    expect(m()).toBe(2); // recomputed
    vi.useRealTimers();
  });

  it('should cache indefinitely without TTL', () => {
    let callCount = 0;
    const fn = vi.fn(() => ++callCount);
    const m = memoized(fn);
    expect(m()).toBe(1);
    expect(m()).toBe(1);
    expect(m()).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttledSignal', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('should emit initial value', () => {
    const t = throttledSignal('initial', 100);
    expect(t.value()).toBe('initial');
  });

  it('should emit leading edge immediately', () => {
    const t = throttledSignal(0, 1000);
    t.set(1);
    expect(t.value()).toBe(1);
  });

  it('should throttle rapid calls', () => {
    const t = throttledSignal(0, 100);
    t.set(1);
    expect(t.value()).toBe(1); // leading
    t.set(2);
    expect(t.value()).toBe(1); // throttled
    t.set(3);
    expect(t.value()).toBe(1); // throttled
  });

  it('should emit trailing value after delay', () => {
    const t = throttledSignal(0, 100);
    t.set(1);
    expect(t.value()).toBe(1); // leading
    t.set(2);
    vi.advanceTimersByTime(100);
    expect(t.value()).toBe(2); // trailing
  });

  it('should have isPending during throttle window', () => {
    const t = throttledSignal(0, 100);
    t.set(1);
    expect(t.isPending()).toBe(false); // leading emitted
    t.set(2);
    expect(t.isPending()).toBe(true); // trailing pending
    vi.advanceTimersByTime(100);
    expect(t.isPending()).toBe(false); // trailing emitted
  });

  it('should flush pending value immediately', () => {
    const t = throttledSignal(0, 100);
    t.set(1);
    t.set(42);
    expect(t.isPending()).toBe(true);
    t.flush();
    expect(t.value()).toBe(42);
    expect(t.isPending()).toBe(false);
  });

  it('should cancel pending without emitting', () => {
    const t = throttledSignal(0, 100);
    t.set(1);
    t.set(42);
    t.cancel();
    expect(t.value()).toBe(1);
    expect(t.isPending()).toBe(false);
  });
});
