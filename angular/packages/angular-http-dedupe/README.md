# @hexguard/angular-http-dedupe

**Collapse duplicate concurrent HTTP requests in Angular.** Keyed in-flight deduplication with optional response caching. Pure factory — no DI required.

---

## Problem

When multiple components independently request the same data on mount, each fires its own HTTP call. `asyncAction()` in `@hexguard/angular-async-state` deduplicates per-handle-instance, but across components each still fires independently. This package deduplicates **by request key across all consumers**.

## Installation

```bash
pnpm add @hexguard/angular-http-dedupe
```

## Quickstart

```typescript
import { createHttpDedupe } from '@hexguard/angular-http-dedupe';

const dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });

// Two simultaneous calls to the same URL return the same promise:
const [a, b] = await Promise.all([
  dedupe.execute({ method: 'GET', url: '/api/orders' }, () => fetch('/api/orders').then(r => r.text())),
  dedupe.execute({ method: 'GET', url: '/api/orders' }, () => fetch('/api/orders').then(r => r.text())),
]);
// fetch() called only once
```

## API

### `createHttpDedupe<T>(options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxAgeMs` | `number` | `0` | Cache completed responses (0 = no cache) |
| `keyFn` | `(req) => string` | `method:url` | Custom request fingerprint |
| `maxCacheSize` | `number` | `50` | LRU eviction limit |

### `HttpDedupe<T>` handle

| Method | Description |
|--------|-------------|
| `execute(req, fetch)` | Execute with in-flight dedup + optional cache |
| `invalidate(key)` | Remove cached response by key |
| `clear()` | Clear all cached responses |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| In-flight dedup (keyed by URL+method) | ✅ |
| Response caching with TTL | ✅ |
| Custom key function | ✅ |
| LRU eviction | ✅ |
| Error passthrough (no cache on failure) | ✅ |
| `HttpInterceptorFn` integration | ❌ (v0.2) |
| Persistent response cache | ❌ (memory only) |

## Demo

Visit `/packages/angular-http-dedupe/demo` to test in-flight dedup and response caching.
