/**
 * Public API for `@hexguard/angular-resource`.
 *
 * Helper utilities for Angular's built-in `resource()` API:
 * - `cachedResource()` — in-memory caching with TTL and stale-while-revalidate
 * - `retryResource()` — exponential backoff retry on failure
 * - `deduplicatedResource()` — request deduplication
 */
export { cachedResource, retryResource, deduplicatedResource } from './lib/resource';
export type { CacheOptions, RetryOptions } from './lib/resource';
