/**
 * Public API for `@hexguard/angular-storage`.
 *
 * Provides typed, signal-backed storage for localStorage/sessionStorage
 * with JSON serialization, versioning, cross-tab sync, and TTL expiry.
 */
export { injectStorage } from './lib/storage';
export type { StorageOptions, TypedStorage, StorageMeta } from './lib/storage';
