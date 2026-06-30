# @hexguard/angular-resource

**Helper utilities for Angular's built-in `resource()` API.** In-memory caching with TTL, retry with exponential backoff, and request deduplication.

---

## Installation

```bash
pnpm add @hexguard/angular-resource
```

## API

### `cachedResource()`

```typescript
const products = cachedResource(
  () => ({ category: filter() }),
  req => api.getProducts(req),
  { ttl: 30_000, staleWhileRevalidate: true },
);
```

Wraps `resource()` with an in-memory cache. Cache key is `JSON.stringify` of the request params. On cache hit within TTL, returns the cached value. When `staleWhileRevalidate` is true, returns stale data immediately and refreshes in the background.

### `retryResource()`

```typescript
const user = retryResource(
  () => userId(),
  id => api.getUser(id),
  { maxRetries: 3, baseDelay: 1_000 },
);
```

Wraps `resource()` with automatic retry on failure. Retries with exponential backoff (baseDelay × 2^attempt) up to maxRetries times.

### `deduplicatedResource()`

```typescript
const data = deduplicatedResource(
  () => query(),
  q => api.search(q),
);
```

Wraps `resource()` with request deduplication. Concurrent identical requests (same `JSON.stringify` key) share a single in-flight Promise.

### Scope Boundaries

| Concern | Status |
|---------|--------|
| In-memory caching with TTL | ✅ |
| Stale-while-revalidate | ✅ |
| Retry with exponential backoff | ✅ |
| Request deduplication | ✅ |
| Persistent cache (IndexedDB) | ❌ future |
| Cache invalidation by tag | ❌ future |

## Demo

Visit `/packages/angular-resource/demo` to test caching, retry, and dedup behaviors.
