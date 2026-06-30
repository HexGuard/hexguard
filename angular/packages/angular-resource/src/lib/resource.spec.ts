import { TestBed } from '@angular/core/testing';
import { cachedResource, retryResource, deduplicatedResource } from './resource';

describe('cachedResource', () => {
  it('should fetch on first access', async () => {
    const r = TestBed.runInInjectionContext(() => {
      return cachedResource<string, string>(() => 'key1', vi.fn().mockResolvedValue('data'), { ttl: 60_000 });
    });

    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(r.value()).toBe('data');
  });

  it('should return cached value on reload within TTL', async () => {
    const fetcher = vi.fn().mockResolvedValue('data');
    const r = TestBed.runInInjectionContext(() => {
      return cachedResource<string, string>(() => 'key2', fetcher, { ttl: 60_000 });
    });

    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(fetcher).toHaveBeenCalledTimes(1);

    r.reload();
    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should refetch after TTL expiry', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockResolvedValue('fresh');
    const r = TestBed.runInInjectionContext(() => {
      return cachedResource<string, string>(() => 'key3', fetcher, { ttl: 100 });
    });

    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(fetcher).toHaveBeenCalledTimes(1);

    // Advance past TTL
    vi.advanceTimersByTime(200);
    r.reload();
    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(r.value()).toBe('fresh');
    vi.useRealTimers();
  });
});

describe('retryResource', () => {
  it('should succeed on first try', async () => {
    const r = TestBed.runInInjectionContext(() => {
      return retryResource<string, string>(() => 'r1', vi.fn().mockResolvedValue('ok'), { maxRetries: 3, baseDelay: 10 });
    });

    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(r.value()).toBe('ok');
  });

  it('should retry on failure and eventually succeed', async () => {
    vi.useFakeTimers();
    let attempts = 0;
    const fetcher = vi.fn().mockImplementation(async () => {
      attempts++;
      if (attempts < 3) throw new Error('transient');
      return 'recovered';
    });

    const r = TestBed.runInInjectionContext(() => {
      return retryResource<string, string>(() => 'r2', fetcher, { maxRetries: 5, baseDelay: 10 });
    });

    // Advance through retry delays
    await vi.advanceTimersByTimeAsync(1000);
    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(r.value()).toBe('recovered');
    expect(attempts).toBe(3);
    vi.useRealTimers();
  });

  it('should give up after max retries', async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn().mockRejectedValue(new Error('always fails'));

    const r = TestBed.runInInjectionContext(() => {
      return retryResource<string, string>(() => 'r3', fetcher, { maxRetries: 2, baseDelay: 10 });
    });

    await vi.advanceTimersByTimeAsync(1000);
    expect(r.error()).toBeTruthy();
    expect(fetcher).toHaveBeenCalledTimes(3); // 1 initial + 2 retries
    vi.useRealTimers();
  });
});

describe('deduplicatedResource', () => {
  it('should fetch and return data', async () => {
    const r = TestBed.runInInjectionContext(() => {
      return deduplicatedResource<string, string>(() => 'dedup1', vi.fn().mockResolvedValue('result'));
    });

    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(r.value()).toBe('result');
  });

  it('should not call loader twice when reloaded while in-flight', async () => {
    let resolvePromise!: (v: string) => void;
    const fetcher = vi.fn().mockImplementation(() => new Promise<string>((r) => { resolvePromise = r; }));

    const r = TestBed.runInInjectionContext(() => {
      return deduplicatedResource<string, string>(() => 'dedup-inflight', fetcher);
    });

    // Wait for fetch to start
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(1));

    // Reload while first request is still pending
    r.reload();

    // The fetcher should still have been called only once (dedup)
    expect(fetcher).toHaveBeenCalledTimes(1);

    resolvePromise('deduped');
    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(r.value()).toBe('deduped');
  });
});
