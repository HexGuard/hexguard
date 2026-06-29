---
id: feature-angular-cache
type: feature
status: proposed
created: 2026-06-29
package: '@hexguard/angular-cache'
---

# @hexguard/angular-cache

## Summary

Headless client-side cache state — TTL-based expiration, LRU eviction, stale-while-revalidate, and cache invalidation. For API response caching, computed value memoization, and offline data access.

## Goals

- TTL-based cache with configurable expiration per key
- LRU eviction when max size reached
- Stale-while-revalidate pattern (serve stale, refresh in background)
- Cache invalidation by key, pattern, or tag
- Signal-based cache value access
- Cache hit/miss/expiry metrics
- Persistent cache backend (localStorage, IndexedDB)
- Request deduplication (same in-flight request → single promise)

## Non-Goals

- No server-side cache synchronization
- No distributed cache
- No HTTP cache header parsing

## Proposed Public API

```typescript
export function injectCache(config?: CacheConfig): {
  get<T>(key: string): Signal<T | undefined>;
  getAsync<T>(key: string, fetcher: () => Promise<T>, options?: CacheEntryOptions): Promise<T>;
  set<T>(key: string, value: T, options?: CacheEntryOptions): void;
  has(key: string): boolean;
  delete(key: string): void;
  invalidate(pattern: string | RegExp): void;
  invalidateByTag(tag: string): void;
  clear(): void;
  readonly stats: Signal<CacheStats>;
  readonly size: Signal<number>;
};

export interface CacheConfig {
  maxSize?: number;           // max entries before LRU eviction (default 100)
  defaultTtlMs?: number;      // default TTL (default 5 minutes)
  staleWhileRevalidate?: boolean;
  persistent?: boolean;       // survive page reload
}

export interface CacheEntryOptions {
  ttlMs?: number;
  tags?: string[];            // for grouped invalidation
  staleWhileRevalidate?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  hitRate: number;
  size: number;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-cache/`.
2. Implement TTL, LRU eviction, stale-while-revalidate, invalidation with signals.
3. Add persistent backend, request deduplication, stats.
4. Add tests. Register in workspace.
