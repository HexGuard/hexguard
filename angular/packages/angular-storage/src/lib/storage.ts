import { DestroyRef, inject, signal } from '@angular/core';

import { StorageService } from './storage-service';

/** Metadata about the current stored value. */
export type StorageMeta = 'stored' | 'expired' | 'missing' | 'versionMismatch';

/** Options for {@link injectStorage}. */
export interface StorageOptions<T> {
  /** The default value used when the key is missing, expired, or has a version mismatch. */
  readonly defaultValue: T;

  /**
   * Schema version for migration detection.
   * When the stored version differs from this, the value is treated as missing.
   * @default 1
   */
  readonly version?: number;

  /**
   * Upgrade callback invoked when the stored version differs from the expected version.
   * Receives the raw stored value (at the old version) and the old version number,
   * and must return the migrated value for the current version.
   *
   * If not provided, version mismatches fall through to `defaultValue` (lossy).
   *
   * @example
   * ```ts
   * const prefs = injectStorage('prefs', {
   *   defaultValue: { theme: 'light' },
   *   version: 2,
   *   onUpgrade(raw, fromVersion) {
   *     if (fromVersion === 1) return { theme: raw.theme ?? 'light' };
   *     return raw;
   *   },
   * });
   * ```
   */
  readonly onUpgrade?: (raw: Record<string, unknown>, fromVersion: number) => T;

  /**
   * Time-to-live in milliseconds. When set, values older than `ttlMs` are treated as expired.
   * @default undefined (no expiry)
   */
  readonly ttlMs?: number;

  /**
   * Which storage backend to use.
   * @default 'local'
   */
  readonly storage?: 'local' | 'session';
}

/** The return type of {@link injectStorage}. */
export interface TypedStorage<T> {
  /** Signal emitting the current value (updated on write or cross-tab change). */
  readonly value: import('@angular/core').Signal<T>;

  /** Signal emitting the current storage metadata. */
  readonly meta: import('@angular/core').Signal<StorageMeta>;

  /**
   * Signal that increments on every value change — same-tab writes,
   * cross-tab sync, and programmatic clears all bump this counter.
   * Useful for `effect()` or `computed()` that should react to any change.
   */
  readonly changed: import('@angular/core').Signal<number>;

  /** Persist a new value. */
  set(value: T): void;

  /**
   * Shallow-merge `partial` into the current value.
   * Only works with object types.
   */
  patch(partial: Partial<T>): void;

  /** Remove the key from storage and reset to default. */
  clear(): void;
}

/**
 * Injects a typed, signal-backed storage wrapper for localStorage or sessionStorage.
 *
 * Must be called within an Angular injection context.
 * Listens for cross-tab `storage` events to keep signals in sync.
 * Falls back gracefully when storage is unavailable (private browsing, full quota).
 *
 * @example
 * ```ts
 * const prefs = injectStorage('user-preferences', {
 *   defaultValue: { theme: 'light', sidebar: true },
 *   version: 2,
 *   storage: 'local',
 * });
 *
 * // Read
 * console.log(prefs.value().theme);
 *
 * // Write
 * prefs.set({ theme: 'dark', sidebar: false });
 * prefs.patch({ theme: 'dark' });
 * ```
 */
export function injectStorage<T>(key: string, options: StorageOptions<T>): TypedStorage<T> {
  const service = inject(StorageService);
  return service.get(key, options);
}
