import { liveData$ } from './live-data-observable';

describe('liveData$', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function flushMicrotasks(): Promise<void> {
    await Promise.resolve();
  }

  it('emits data after first successful fetch', async () => {
    const fetcher = vi.fn().mockResolvedValue('value-1');

    const stream = liveData$({ pollInterval: 10_000, fetcher });
    const dataValues: string[] = [];
    stream.data$.subscribe((v: unknown) => dataValues.push(v as string));

    await flushMicrotasks();
    expect(dataValues).toEqual(['value-1']);
    expect(fetcher).toHaveBeenCalledTimes(1);

    stream.stop();
  });

  it('emits loading state during fetch', async () => {
    const fetcher = vi.fn().mockResolvedValue('data');

    const stream = liveData$({ pollInterval: 10_000, fetcher });
    const loadingValues: boolean[] = [];
    stream.loading$.subscribe((v) => loadingValues.push(v));

    // Initial fetch is already in-flight before subscribe — loading true
    // was emitted before subscribe. The promise resolves, giving loading false.
    await flushMicrotasks();
    expect(loadingValues).toEqual([false]);

    stream.stop();
  });

  it('emits data on subsequent polls', async () => {
    let count = 0;
    const fetcher = vi.fn().mockImplementation(() => {
      count++;
      return Promise.resolve(`value-${count}`);
    });

    const stream = liveData$({ pollInterval: 10_000, fetcher });
    const dataValues: string[] = [];
    stream.data$.subscribe((v: unknown) => dataValues.push(v as string));

    await flushMicrotasks();
    expect(dataValues).toEqual(['value-1']);

    // Advance past the poll interval
    vi.advanceTimersByTime(10_000);
    await flushMicrotasks();
    expect(dataValues).toEqual(['value-1', 'value-2']);

    vi.advanceTimersByTime(10_000);
    await flushMicrotasks();
    expect(dataValues).toEqual(['value-1', 'value-2', 'value-3']);

    stream.stop();
  });

  it('captures error on fetch failure', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Network error'));

    const stream = liveData$({
      pollInterval: 10_000,
      fetcher,
      retryConfig: { maxRetries: 0, baseDelayMs: 1000, maxDelayMs: 1000 },
    });
    const errorValues: unknown[] = [];
    stream.error$.subscribe((v) => errorValues.push(v));

    await flushMicrotasks();
    expect(errorValues).toHaveLength(1);
    expect((errorValues[0] as Error).message).toBe('Network error');

    stream.stop();
  });

  it('emits stale signal after double poll interval', async () => {
    const fetcher = vi.fn().mockResolvedValue('data');

    const stream = liveData$({ pollInterval: 10_000, fetcher, staleAfter: 20_000 });
    const staleValues: boolean[] = [];
    stream.stale$.subscribe((v) => staleValues.push(v));

    // Initial fetch emits stale = false
    await flushMicrotasks();

    // Advance past stale threshold (20s). The poll at t=10s fires during
    // advanceTimersByTime but its microtask (which resets the stale
    // accumulator) won't run until flushMicrotasks. So the stale check
    // accumulates uninterrupted and emits true at t=20s.
    vi.advanceTimersByTime(20_000);

    expect(staleValues).toContain(true);

    stream.stop();
  });

  it('refresh() triggers an immediate fetch', async () => {
    let count = 0;
    const fetcher = vi.fn().mockImplementation(() => Promise.resolve(`value-${++count}`));

    const stream = liveData$({ pollInterval: 60_000, fetcher });
    const dataValues: string[] = [];
    stream.data$.subscribe((v: unknown) => dataValues.push(v as string));

    await flushMicrotasks();
    expect(dataValues).toEqual(['value-1']);

    stream.refresh();
    await flushMicrotasks();
    expect(dataValues).toEqual(['value-1', 'value-2']);

    stream.stop();
  });

  it('stop() completes all subjects and stops polling', async () => {
    const fetcher = vi.fn().mockResolvedValue('data');

    const stream = liveData$({ pollInterval: 10_000, fetcher });
    const dataValues: string[] = [];
    const loadingValues: boolean[] = [];
    let dataComplete = false;
    let loadingComplete = false;

    stream.data$.subscribe({
      next: (v: unknown) => dataValues.push(v as string),
      complete: () => {
        dataComplete = true;
      },
    });
    stream.loading$.subscribe({
      next: (v) => loadingValues.push(v),
      complete: () => {
        loadingComplete = true;
      },
    });

    await flushMicrotasks();
    expect(dataValues).toEqual(['data']);

    stream.stop();
    expect(dataComplete).toBe(true);
    expect(loadingComplete).toBe(true);

    // No further fetches
    const callCountBefore = fetcher.mock.calls.length;
    vi.advanceTimersByTime(10_000);
    expect(fetcher).toHaveBeenCalledTimes(callCountBefore);
  });
});
