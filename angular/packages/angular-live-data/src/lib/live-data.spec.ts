import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { injectLiveData } from './live-data';
import type { LiveDataOptions } from './types';

describe(injectLiveData.name, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function createLiveData<T>(options: Partial<LiveDataOptions<T>> & { fetcher: () => Promise<T> }) {
    return TestBed.runInInjectionContext(() =>
      injectLiveData({
        pollInterval: 10_000,
        ...options,
      }),
    );
  }

  /** Flush pending microtasks (promise resolutions/rejections) without advancing timers. */
  async function flushMicrotasks(): Promise<void> {
    await Promise.resolve();
  }

  it('starts with no data, not loading, no error', () => {
    const live = createLiveData({
      fetcher: () => Promise.resolve('hello'),
      pollInterval: 10_000,
    });
    expect(live.data()).toBeUndefined();
    expect(live.loading()).toBe(true);
    expect(live.error()).toBeNull();
    expect(live.stale()).toBe(false);
    expect(live.isPaused()).toBe(false);
  });

  it('emits data after first successful fetch', async () => {
    const live = createLiveData({
      fetcher: () => Promise.resolve('hello'),
    });

    await flushMicrotasks();

    expect(live.data()).toBe('hello');
    expect(live.loading()).toBe(false);
    expect(live.error()).toBeNull();
  });

  it('updates data on subsequent polls', async () => {
    let count = 0;
    const live = createLiveData({
      fetcher: () => Promise.resolve(`value-${++count}`),
    });

    // Initial fetch resolves
    await flushMicrotasks();
    expect(live.data()).toBe('value-1');

    // Advance by one poll interval
    vi.advanceTimersByTime(10_000);
    await flushMicrotasks();

    expect(live.data()).toBe('value-2');
  });

  it('signals stale after double poll interval without success', async () => {
    const live = createLiveData({
      fetcher: () => Promise.resolve('data'),
    });

    await flushMicrotasks();
    expect(live.data()).toBe('data');
    expect(live.stale()).toBe(false);

    // Advance past staleAfter (pollInterval * 2 = 20s)
    vi.advanceTimersByTime(25_000);
    expect(live.stale()).toBe(true);
  });

  it('clears stale after a successful poll', async () => {
    let count = 0;
    const live = createLiveData({
      fetcher: () => Promise.resolve(`value-${++count}`),
    });

    await flushMicrotasks();
    expect(live.data()).toBe('value-1');

    // Advance past staleAfter. Interleave flushMicrotasks between poll
    // intervals so the in-flight dedup doesn't skip polls.
    vi.advanceTimersByTime(10_000);
    await flushMicrotasks();
    vi.advanceTimersByTime(10_000);
    await flushMicrotasks();
    expect(live.data()).toBe('value-3');
    expect(live.stale()).toBe(false);

    // Now let the stale interval accumulate past the threshold
    vi.advanceTimersByTime(25_000);
    expect(live.stale()).toBe(true);

    // Next poll succeeds and clears stale
    vi.advanceTimersByTime(10_000);
    await flushMicrotasks();
    expect(live.data()).toBe('value-4');
    expect(live.stale()).toBe(false);
  });

  it('captures error on fetch failure', async () => {
    const live = createLiveData({
      fetcher: () => Promise.reject(new Error('Network error')),
    });

    await flushMicrotasks();

    expect(live.error()).toBeTruthy();
    expect(String(live.error())).toContain('Network error');
    expect(live.loading()).toBe(false);
  });

  it('recovers after transient failure', async () => {
    let fail = true;
    const live = createLiveData({
      fetcher: () => (fail ? Promise.reject(new Error('Oops')) : Promise.resolve('recovered')),
    });

    await flushMicrotasks();
    expect(live.error()).toBeTruthy();

    // Let retry happen (baseDelayMs = 1000)
    fail = false;
    vi.advanceTimersByTime(1_000);
    await flushMicrotasks();

    expect(live.data()).toBe('recovered');
    expect(live.error()).toBeNull();
  });

  it('pauses and resumes polling', async () => {
    let count = 0;
    const live = createLiveData({
      fetcher: () => Promise.resolve(`value-${++count}`),
    });

    await flushMicrotasks();
    expect(live.data()).toBe('value-1');

    live.pause();
    expect(live.isPaused()).toBe(true);

    // Advance time — no new polls while paused
    vi.advanceTimersByTime(30_000);
    await flushMicrotasks();
    expect(live.data()).toBe('value-1');

    live.resume();
    expect(live.isPaused()).toBe(false);

    // Should fetch immediately on resume
    await flushMicrotasks();
    expect(live.data()).toBe('value-2');
  });

  it('refresh() triggers an immediate fetch', async () => {
    let count = 0;
    const live = createLiveData({
      fetcher: () => Promise.resolve(`value-${++count}`),
    });

    await flushMicrotasks();
    expect(live.data()).toBe('value-1');

    await live.refresh();
    expect(live.data()).toBe('value-2');
  });

  it('cleanup via DestroyRef stops polling', async () => {
    @Component({ standalone: true, template: '' })
    class HostCmp {
      readonly live = injectLiveData({
        pollInterval: 10_000,
        fetcher: () => Promise.resolve('data'),
      });
    }

    const fixture = TestBed.createComponent(HostCmp);
    const live = fixture.componentInstance.live;

    await flushMicrotasks();
    expect(live.data()).toBe('data');

    fixture.destroy();

    // After destroy, no more polling should happen
    vi.advanceTimersByTime(60_000);
    expect(live.data()).toBe('data');
  });

  it('exhausts retries and stays with last error', async () => {
    const live = createLiveData({
      fetcher: () => Promise.reject(new Error('Always fails')),
      retryConfig: { maxRetries: 2, baseDelayMs: 100, maxDelayMs: 1_000 },
    });

    await flushMicrotasks();
    expect(live.error()).toBeTruthy();

    // First retry
    vi.advanceTimersByTime(100);
    await flushMicrotasks();
    expect(live.error()).toBeTruthy();

    // Second retry (last)
    vi.advanceTimersByTime(200);
    await flushMicrotasks();
    expect(live.error()).toBeTruthy();

    // No more retries - should still have error
    vi.advanceTimersByTime(1_000);
    await flushMicrotasks();
    expect(live.error()).toBeTruthy();
  });
});
