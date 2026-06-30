import { resource, type ResourceRef, type Signal } from '@angular/core';

// ── Types ──────────────────────────────────────────────────────

export interface CacheOptions {
  /** Time-to-live in milliseconds. Cache entries older than this are refetched. @default 60_000 */
  ttl?: number;
  /** When true, returns cached value immediately and refreshes in background. @default false */
  staleWhileRevalidate?: boolean;
}

export interface RetryOptions {
  /** Maximum number of retry attempts. @default 3 */
  maxRetries?: number;
  /** Base delay in milliseconds before first retry (doubles each attempt). @default 1_000 */
  baseDelay?: number;
}

// ── Cache entry ────────────────────────────────────────────────

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const globalCache = new Map<string, CacheEntry<unknown>>();

function cacheKey(request: unknown): string {
  try { return JSON.stringify(request); } catch { return String(request); }
}

function isExpired(entry: CacheEntry<unknown>): boolean {
  return Date.now() > entry.expiresAt;
}

// ── cachedResource ─────────────────────────────────────────────

/**
 * Wraps Angular's `resource()` with an in-memory cache.
 *
 * Cache key is derived from `JSON.stringify` of the request params.
 * On cache hit within TTL, returns the cached value. On miss or expiry, fetches.
 *
 * When `staleWhileRevalidate` is true, returns stale cached data
 * immediately and refreshes in the background.
 *
 * @example
 * ```typescript
 * const products = cachedResource(
 *   () => ({ category: filter() }),
 *   req => api.getProducts(req),
 *   { ttl: 30_000, staleWhileRevalidate: true },
 * );
 * ```
 */
export function cachedResource<T, R>(
  paramsFn: () => R,
  loader: (req: R) => Promise<T>,
  options?: CacheOptions,
): ResourceRef<T | undefined> {
  const ttl = options?.ttl ?? 60_000;
  const staleWhileRevalidate = options?.staleWhileRevalidate ?? false;

  return resource<T, R>({
    params: () => paramsFn(),
    loader: async ({ params: req, abortSignal }): Promise<T> => {
      const key = cacheKey(req);

      const cached = globalCache.get(key) as CacheEntry<T> | undefined;
      if (cached && !isExpired(cached)) return cached.value;

      if (staleWhileRevalidate && cached) {
        loader(req).then((fresh) => {
          globalCache.set(key, { value: fresh, expiresAt: Date.now() + ttl });
        }).catch(() => {});
        return cached.value;
      }

      const result = await loader(req);
      if (!abortSignal.aborted) {
        globalCache.set(key, { value: result, expiresAt: Date.now() + ttl });
      }
      return result;
    },
  });
}

/**
 * Wraps Angular's `resource()` with automatic retry on failure.
 *
 * Retries failed requests with exponential backoff up to `maxRetries` times.
 *
 * @example
 * ```typescript
 * const user = retryResource(
 *   () => userId(),
 *   id => api.getUser(id),
 *   { maxRetries: 3, baseDelay: 1_000 },
 * );
 * ```
 */
export function retryResource<T, R>(
  paramsFn: () => R,
  loader: (req: R) => Promise<T>,
  options?: RetryOptions,
): ResourceRef<T | undefined> {
  const maxRetries = options?.maxRetries ?? 3;
  const baseDelay = options?.baseDelay ?? 1_000;

  return resource<T, R>({
    params: () => paramsFn(),
    loader: async ({ params: req }): Promise<T> => {
      let retryCount = 0;
      while (true) {
        try {
          return await loader(req);
        } catch (err) {
          retryCount++;
          if (retryCount > maxRetries) throw err;
          await new Promise<void>((r) => setTimeout(r, baseDelay * Math.pow(2, retryCount - 1)));
        }
      }
    },
  });
}

/**
 * Wraps Angular's `resource()` with request deduplication.
 *
 * Concurrent identical requests (same `JSON.stringify` key) share a single
 * in-flight `Promise`, preventing duplicate network calls.
 *
 * @example
 * ```typescript
 * const data = deduplicatedResource(
 *   () => query(),
 *   q => api.search(q),
 * );
 * ```
 */
export function deduplicatedResource<T, R>(
  paramsFn: () => R,
  loader: (req: R) => Promise<T>,
): ResourceRef<T | undefined> {
  const inFlight = new Map<string, Promise<T>>();

  return resource<T, R>({
    params: () => paramsFn(),
    loader: async ({ params: req }): Promise<T> => {
      const key = cacheKey(req);
      const existing = inFlight.get(key);
      if (existing) return existing;

      const promise = loader(req).finally(() => inFlight.delete(key));
      inFlight.set(key, promise);
      return promise;
    },
  });
}
