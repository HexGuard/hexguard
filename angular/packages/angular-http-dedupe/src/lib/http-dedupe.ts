/**
 * Options for `createHttpDedupe`.
 */
export interface HttpDedupeOptions {
  /**
   * Max age for cached responses in milliseconds.
   * When 0, only in-flight deduplication is performed (no response caching).
   * @default 0
   */
  readonly maxAgeMs?: number;

  /**
   * Custom key extractor function.
   * Default: `${method}:${url}` (body is not included to keep the default safe
   * for GET/HEAD requests; override to include body when needed).
   * @default undefined (uses default key: `${method}:${url}`)
   */
  readonly keyFn?: (req: HttpDedupeRequest) => string;

  /**
   * Maximum number of cached responses.
   * Oldest entries are evicted when the cache exceeds this size.
   * @default 50
   */
  readonly maxCacheSize?: number;
}

/**
 * Describes an HTTP request for deduplication purposes.
 */
export interface HttpDedupeRequest {
  readonly method: string;
  readonly url: string;
}

/**
 * Handle returned by `createHttpDedupe`.
 */
export interface HttpDedupe<T> {
  /**
   * Execute a request with deduplication.
   * Returns the same promise if an identical request is currently in-flight.
   * Optionally returns a cached response if `maxAgeMs > 0` and the cache is fresh.
   */
  execute(req: HttpDedupeRequest, fetch: () => Promise<T>): Promise<T>;
  /**
   * Invalidate a cached response by request key.
   */
  invalidate(key: string): void;
  /**
   * Clear the entire cache of completed responses.
   */
  clear(): void;
}

interface CacheEntry<T> {
  readonly promise: Promise<T>;
  readonly timestamp: number;
}

/**
 * Creates a keyed HTTP deduplication primitive.
 *
 * Two-tier dedup:
 * 1. **In-flight** — identical requests while pending share the same promise.
 * 2. **Cache** — identical completed requests within `maxAgeMs` return cached result.
 *
 * This is a pure factory — no DI required. Works in tests or non-Angular contexts.
 *
 * @example
 * ```typescript
 * const dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });
 *
 * // Two simultaneous calls to the same URL return the same promise:
 * const [a, b] = await Promise.all([
 *   dedupe.execute({ method: 'GET', url: '/api/orders' }, () => fetch('/api/orders').then(r => r.text())),
 *   dedupe.execute({ method: 'GET', url: '/api/orders' }, () => fetch('/api/orders').then(r => r.text())),
 * ]);
 * ```
 */
export function createHttpDedupe<T>(options?: HttpDedupeOptions): HttpDedupe<T> {
  const {
    maxAgeMs = 0,
    keyFn = defaultKeyFn,
    maxCacheSize = 50,
  } = options ?? {};

  // In-flight dedup cache: key -> promise
  const inFlight = new Map<string, Promise<T>>();

  // Completed response cache: key -> { promise, timestamp }
  const responseCache = new Map<string, CacheEntry<T>>();

  function defaultKeyFn(req: HttpDedupeRequest): string {
    return `${req.method}:${req.url}`;
  }

  function execute(req: HttpDedupeRequest, fetch: () => Promise<T>): Promise<T> {
    const key = keyFn(req);

    // Check response cache first (if enabled)
    if (maxAgeMs > 0) {
      const cached = responseCache.get(key);
      if (cached && Date.now() - cached.timestamp < maxAgeMs) {
        return cached.promise;
      }
      responseCache.delete(key);
    }

    // Check in-flight dedup
    const pending = inFlight.get(key);
    if (pending) {
      return pending;
    }

    // Start the request
    const promise = fetch().finally(() => {
      inFlight.delete(key);
    });

    inFlight.set(key, promise);

    // Optionally cache the completed response
    if (maxAgeMs > 0) {
      // We need to capture the resolved value
      const cachedPromise = promise.then((value) => {
        // Evict oldest if at capacity
        if (responseCache.size >= maxCacheSize) {
          const firstKey = responseCache.keys().next().value;
          if (firstKey !== undefined) {
            responseCache.delete(firstKey);
          }
        }
        responseCache.set(key, { promise: Promise.resolve(value), timestamp: Date.now() });
        return value;
      });

      // Don't cache rejections
      cachedPromise.catch(() => {
        responseCache.delete(key);
      });

      return cachedPromise;
    }

    return promise;
  }

  function invalidate(key: string): void {
    responseCache.delete(key);
    inFlight.delete(key);
  }

  function clear(): void {
    responseCache.clear();
    inFlight.clear();
  }

  return { execute, invalidate, clear };
}
