# @hexguard/angular-http-dedupe — Deep Package Notes

Keyed HTTP deduplication: collapse duplicate concurrent requests with optional response caching.

## API

- `createHttpDedupe<T>(options?)` → `HttpDedupe<T>` — Pure factory, no DI required.
- `dedupe.execute(req, fetch)` → `Promise<T>` — Execute with in-flight dedup + optional cache.
- `dedupe.invalidate(key)` — Remove cached response by key.
- `dedupe.clear()` — Clear all cached responses.

---

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider `HttpInterceptorFn` in v0.2 | Medium |
| API | Consider persistent cache (IndexedDB) in v0.2 | Low |
| Tests | Missing: concurrent requests with different bodies but same URL | Low |
| Tests | Missing: LRU eviction at maxCacheSize | Low |

## Code Examples

```typescript
const dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });

// Two simultaneous identical calls — one actual fetch
const [a, b] = await Promise.all([
  dedupe.execute({ method: 'GET', url: '/api/orders' }, fetchFn),
  dedupe.execute({ method: 'GET', url: '/api/orders' }, fetchFn),
]);
```
