---
id: feature-angular-resource
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-resource'
---

# @hexguard/angular-resource

## Summary

Typed helper utilities for Angular's built-in `resource()` and `httpResource()` APIs — caching, retry, request deduplication, stale-while-revalidate, and batch loading. Complements Angular's resource API (introduced in Angular 22+) with production-ready patterns.

**Promoted from sidenote.** Angular's `resource()` is new and powerful but lacks built-in caching, retry, and deduplication — patterns every production app needs.

## Competition Check

Angular's `resource()` is built-in but basic. No third-party package extends it yet.

## Why Wide Adoption

Angular 22+'s `resource()` and `httpResource()` are the new standard for async data loading. They replace manual `switchMap` + `signal` patterns. However, they lack: caching (same request served from memory), retry (transient failures), deduplication (concurrent identical requests), and stale-while-revalidate (show cached data, refresh in background).

## Goals

1. Provide `cachedResource` — wraps `resource()` with in-memory cache and configurable TTL.
2. Provide `retryResource` — automatically retries failed requests with exponential backoff.
3. Provide `deduplicatedResource` — deduplicates concurrent identical requests.
4. Provide `staleResource` — stale-while-revalidate pattern: show cached value immediately, refresh in background.
5. All return a `ResourceRef<T>`-compatible interface so consumers use a familiar API.

## Proposed Public API

```typescript
// ── Cached resource ─────────────────────────────────────

export function cachedResource<T>(
  request: Signal<unknown>,
  loader: (req: unknown) => Promise<T>,
  options?: { ttl?: number; staleWhileRevalidate?: boolean }
): ResourceRef<T>;

// ── Retry resource ──────────────────────────────────────

export function retryResource<T>(
  request: Signal<unknown>,
  loader: (req: unknown) => Promise<T>,
  options?: { maxRetries?: number; baseDelay?: number }
): ResourceRef<T>;

// ── Deduplicated resource ───────────────────────────────

export function deduplicatedResource<T>(
  request: Signal<unknown>,
  loader: (req: unknown) => Promise<T>
): ResourceRef<T>;

// ── Usage ─────────────────────────────────────────────────

const products = cachedResource(
  computed(() => ({ category: filter() })),
  req => api.getProducts(req),
  { ttl: 30_000, staleWhileRevalidate: true }
);

const user = retryResource(
  signal(userId()),
  id => api.getUser(id),
  { maxRetries: 3, baseDelay: 1000 }
);
```

## Implementation Plan

1. Scaffold `angular/packages/angular-resource/`.
2. Implement `cachedResource` with in-memory `Map` cache and TTL expiry.
3. Implement `retryResource` with exponential backoff and max retries.
4. Implement `deduplicatedResource` with in-flight `Promise` tracking.
5. Add tests: cache hit/miss, TTL expiry, retry on failure, dedup concurrent calls.
6. Register in workspace.
