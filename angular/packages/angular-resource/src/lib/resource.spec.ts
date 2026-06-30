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

  it('should return cached value on second access within TTL', async () => {
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
});

describe('retryResource', () => {
  it('should succeed on first try', async () => {
    const r = TestBed.runInInjectionContext(() => {
      return retryResource<string, string>(() => 'r1', vi.fn().mockResolvedValue('ok'), { maxRetries: 3, baseDelay: 10 });
    });

    await vi.waitFor(() => expect(r.hasValue()).toBe(true));
    expect(r.value()).toBe('ok');
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
});
