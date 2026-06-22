/**
 * Public API for `@hexguard/angular-pagination`.
 *
 * Core:
 * - `injectPagination()` — signal-based pagination state and navigation.
 *
 * URL-sync adapter (optional, requires @hexguard/angular-url-state):
 * - `withPaginationUrlSync()` — binds pagination state to URL query params.
 */
export { injectPagination } from './lib/pagination';
export { withPaginationUrlSync } from './lib/url-sync';
export type { PaginationOptions, PaginationHandle } from './lib/types';
export type { PaginationUrlSyncConfig, UrlStateLike } from './lib/url-sync';
