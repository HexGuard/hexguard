/**
 * Public API for `@hexguard/angular-storage`.
 *
 * Provides typed, signal-backed storage for localStorage/sessionStorage
 * with JSON serialization, versioning, cross-tab sync, and TTL expiry.
 */
export { injectStorage } from './lib/storage';
export { StorageService } from './lib/storage-service';
export { fromStorageKey } from './lib/storage-observable';
export type { StorageOptions, TypedStorage, StorageMeta } from './lib/storage';
export { cookieStorage } from './lib/cookie-storage';
export type { CookieStorageOptions } from './lib/cookie-storage';
