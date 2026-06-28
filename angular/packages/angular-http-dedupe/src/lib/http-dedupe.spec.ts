import { createHttpDedupe } from './http-dedupe';

describe('createHttpDedupe', () => {
  describe('in-flight deduplication', () => {
    it('should return the same promise for identical in-flight requests', () => {
      const dedupe = createHttpDedupe<string>();
      let callCount = 0;
      const fetchFn = vi.fn(() => new Promise<string>((r) => { callCount++; setTimeout(() => r('ok'), 10); }));

      const p1 = dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      const p2 = dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);

      expect(fetchFn).toHaveBeenCalledTimes(1);
      expect(p1).toBe(p2);
    });

    it('should make separate calls for different URLs', () => {
      const dedupe = createHttpDedupe<string>();
      let callCount = 0;
      const fetchFn = () => new Promise<string>((r) => { callCount++; setTimeout(() => r('ok'), 10); });

      dedupe.execute({ method: 'GET', url: '/api/a' }, fetchFn);
      dedupe.execute({ method: 'GET', url: '/api/b' }, fetchFn);

      expect(callCount).toBe(2);
    });

    it('should allow a new request after the previous one completes', async () => {
      const dedupe = createHttpDedupe<string>();
      const fetchFn = vi.fn(() => Promise.resolve('ok'));

      await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);

      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should use custom key function', () => {
      const dedupe = createHttpDedupe<string>({ keyFn: (req) => `${req.method}:${req.url}` });
      let callCount = 0;
      const fetchFn = () => new Promise<string>((r) => { callCount++; setTimeout(() => r('ok'), 10); });

      dedupe.execute({ method: 'POST', url: '/api/data' }, fetchFn);
      dedupe.execute({ method: 'POST', url: '/api/other' }, fetchFn);

      expect(callCount).toBe(2);
    });
  });

  describe('response caching', () => {
    it('should return cached response within maxAgeMs', async () => {
      vi.useFakeTimers();
      const dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });
      const fetchFn = vi.fn(() => Promise.resolve('cached-value'));

      const r1 = await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      expect(r1).toBe('cached-value');
      expect(fetchFn).toHaveBeenCalledTimes(1);

      const r2 = await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      expect(r2).toBe('cached-value');
      expect(fetchFn).toHaveBeenCalledTimes(1);

      vi.useRealTimers();
    });

    it('should re-fetch after cache expiry', async () => {
      vi.useFakeTimers();
      let value = 1;
      const dedupe = createHttpDedupe<number>({ maxAgeMs: 100 });
      const fetchFn = vi.fn(() => Promise.resolve(value));

      const r1 = await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      expect(r1).toBe(1);
      expect(fetchFn).toHaveBeenCalledTimes(1);

      value = 2;
      vi.advanceTimersByTime(101);

      const r2 = await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      expect(r2).toBe(2);
      expect(fetchFn).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });

    it('should invalidate cached response', async () => {
      const dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });
      const fetchFn = vi.fn(() => Promise.resolve('value'));

      await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      dedupe.invalidate('GET:/api/data');
      await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);

      expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('should clear all cached responses', async () => {
      const dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });
      const fetchFn = vi.fn(() => Promise.resolve('value'));

      await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      dedupe.clear();
      await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);

      expect(fetchFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('error handling', () => {
    it('should not cache rejected promises', async () => {
      const dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });
      const fetchFn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      await expect(
        dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn),
      ).rejects.toThrow('fail');

      const result = await dedupe.execute({ method: 'GET', url: '/api/data' }, fetchFn);
      expect(result).toBe('success');
      expect(fetchFn).toHaveBeenCalledTimes(2);
    });
  });
});
