import { inject } from '@angular/core';
import type { WritableSignal } from '@angular/core';
import type { PersistSignalOptions } from './types';
import { PersistSignalService } from './persist-signal-service';

/**
 * Creates a `WritableSignal<T>` that automatically persists its value to storage.
 *
 * On construction, reads the stored value from storage and hydrates the signal.
 * On every signal change, writes the new value to storage via an `effect()`.
 * Supports TTL expiry, custom serialization, migration callback, debounced writes,
 * and cross-tab synchronization.
 *
 * @example
 * ```typescript
 * const theme = injectPersistedSignal('app-theme', 'light');
 * theme();        // reads from storage or 'light'
 * theme.set('dark'); // updates signal AND persists to localStorage
 * ```
 *
 * @example
 * ```typescript
 * const prefs = injectPersistedSignal('user-prefs', { sidebar: true, pageSize: 20 }, {
 *   ttlMs: 86_400_000, // 24h
 *   onRestore: (stored) => ({ ...stored, migratedField: true }),
 * });
 * ```
 */
export function injectPersistedSignal<T>(
  key: string,
  defaultValue: T,
  options?: PersistSignalOptions<T>,
): WritableSignal<T> {
  return inject(PersistSignalService).createPersistedSignal(key, defaultValue, options);
}
