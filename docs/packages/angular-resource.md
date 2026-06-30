# @hexguard/angular-resource

**Helper utilities for Angular's built-in `resource()` API** — in-memory caching with configurable TTL, exponential-backoff retry, and request deduplication.

---

## Why

Angular 22's `resource()` and `httpResource()` are the new standard for async data loading. They replace manual `switchMap` + `signal` patterns but lack built-in caching (same request served from memory), retry (transient failures), and deduplication (concurrent identical requests). This package plugs those gaps while keeping the familiar `ResourceRef` return type.

## API

### `cachedResource<T, R>(paramsFn, loader, options?)`

```typescript
const products = cachedResource(
  () => ({ category: filter() }),
  req => api.getProducts(req),
  { ttl: 30_000, staleWhileRevalidate: true },
);
```

**Options:**
- `ttl` — cache TTL in ms (default: 60,000).
- `staleWhileRevalidate` — if true, returns stale value immediately and refreshes in background (default: false).

**Cache key** is derived from `JSON.stringify(paramsFn())`.

### `retryResource<T, R>(paramsFn, loader, options?)`

```typescript
const user = retryResource(
  () => userId(),
  id => api.getUser(id),
  { maxRetries: 3, baseDelay: 1_000 },
);
```

**Options:**
- `maxRetries` — max retry attempts (default: 3).
- `baseDelay` — base delay in ms for exponential backoff (default: 1,000).

Retries with `baseDelay * 2^(attempt - 1)` delay between each attempt.

### `deduplicatedResource<T, R>(paramsFn, loader)`

```typescript
const data = deduplicatedResource(
  () => query(),
  q => api.search(q),
);
```

Uses an in-flight `Map<string, Promise<R>>` keyed by `JSON.stringify(paramsFn())`. Concurrent identical requests share one Promise.

## Design Decisions

- All three functions **wrap Angular's `resource()` internally** and return `ResourceRef<T | undefined>` — consumers use the familiar `.value()`, `.error()`, `.isLoading()`, `.status()` API.
- Uses `params` function (Angular 22's `resource()` callback pattern) instead of passing a `Signal` directly.
- **No `staleResource`** separate package in v0.1 — the `staleWhileRevalidate` option on `cachedResource` covers that pattern.
- Global in-memory `Map` for cache — no persistence across page reloads.

## Scope Boundaries

| Concern | Status |
|---------|--------|
| In-memory cache with TTL | ✅ |
| Stale-while-revalidate | ✅ |
| Retry with exponential backoff | ✅ |
| Request deduplication | ✅ |
| Works with `resource()` and `httpResource()` | ✅ |
| Persistent cache (IndexedDB) | ❌ future |
| Tag-based cache invalidation | ❌ future |

## Demo

- Hub: `/packages/angular-resource`
- Demo: `/packages/angular-resource/demo`
