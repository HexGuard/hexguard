# Changelog

## 0.1.0 — 2026-06-30

Initial release of `@hexguard/angular-resource`.

### Features

- `cachedResource()` — wraps `resource()` with in-memory cache and TTL
- `retryResource()` — retries failed requests with exponential backoff
- `deduplicatedResource()` — deduplicates concurrent identical requests
- `staleWhileRevalidate` option on cachedResource
