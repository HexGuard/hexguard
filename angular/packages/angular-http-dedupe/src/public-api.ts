/**
 * Public API for `@hexguard/angular-http-dedupe`.
 *
 * Provides keyed in-flight deduplication with optional response caching.
 */
export { createHttpDedupe } from './lib/http-dedupe';
export type { HttpDedupe, HttpDedupeOptions, HttpDedupeRequest } from './lib/http-dedupe';
