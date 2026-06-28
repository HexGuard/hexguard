---
id: feature-ts-cache
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-cache'
---

# @hexguard/ts-cache

## Summary

In-memory cache utilities â€” `LruCache<K,V>` with eviction, `TtlCache<K,V>` with time-based expiry, and `memo()` for function memoization. Every app with expensive computations or API calls needs caching.

**Competition check:** `lru-cache` (100M+ weekly) is dominant but heavy. No single package combines LRU + TTL + memo.


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
export class LruCache<K, V> {
  constructor(maxSize: number);
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  readonly size: number;
  keys(): IterableIterator<K>;
  values(): IterableIterator<V>;
}

export class TtlCache<K, V> {
  constructor(options?: { defaultTtlMs?: number; maxSize?: number });
  get(key: K): V | undefined;
  set(key: K, value: V, ttlMs?: number): void;
  delete(key: K): boolean;
  clear(): void;
  cleanup(): void;
  readonly size: number;
}

export function memo<T extends (...args: unknown[]) => unknown>(
  fn: T, options?: { ttlMs?: number; maxSize?: number; keyFn?: (...args: Parameters<T>) => string }
): T & { clear(): void; readonly cacheSize: number };
```

## Implementation Plan

1. Create `ts/packages/ts-cache/`.
2. Implement `LruCache` with doubly-linked list + hash map.
3. Implement `TtlCache` with periodic cleanup.
4. Implement `memo` wrapper.
5. Add tests.
6. Publish to npm.
