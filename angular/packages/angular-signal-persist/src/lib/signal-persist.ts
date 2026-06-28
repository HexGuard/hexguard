import {
  DestroyRef,
  effect,
  inject,
  signal,
  type WritableSignal,
} from '@angular/core';
import type { PersistSignalOptions } from './types';

const STORAGE_TEST_KEY = '__hexguard_persist_test__';

function getStorage(backend?: typeof localStorage | typeof sessionStorage): Storage | null {
  if (backend) return backend;
  if (typeof localStorage !== 'undefined') return localStorage;
  return null;
}

function isStorageAvailable(storage: Storage): boolean {
  try {
    storage.setItem(STORAGE_TEST_KEY, '1');
    storage.removeItem(STORAGE_TEST_KEY);
    return true;
  } catch {
    return false;
  }
}

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
  const {
    backend,
    serializer = JSON.stringify,
    deserializer = JSON.parse as (raw: string) => T,
    ttlMs,
    onRestore,
    writeDelayMs = 0,
    syncAcrossTabs = true,
  } = options ?? {};

  const destroyRef = inject(DestroyRef);
  const storage = getStorage(backend);
  const available = storage !== null && isStorageAvailable(storage);

  // ── Hydrate from storage ─────────────────────────────────────

  let initialValue = defaultValue;

  if (available) {
    try {
      const raw = storage.getItem(key);
      if (raw !== null) {
        const parsed = deserializer(raw) as Record<string, unknown>;

        // Unwrap TTL-wrapped values: { _value: T, _ts: number }
        const storedValue = (ttlMs !== undefined && parsed !== null && typeof parsed === 'object' && '_value' in parsed)
          ? (parsed['_value'] as T)
          : (parsed as T);

        // Check TTL expiry
        if (ttlMs !== undefined && parsed !== null && typeof parsed === 'object' && '_ts' in parsed) {
          const storedTs = parsed['_ts'] as number;
          if (Date.now() - storedTs > ttlMs) {
            // Expired — use default
          } else {
            initialValue = onRestore ? onRestore(storedValue) : storedValue;
          }
        } else {
          initialValue = onRestore ? onRestore(parsed as T) : (parsed as T);
        }
      }
    } catch {
      // Malformed or unreadable — use default
    }
  }

  const state = signal<T>(initialValue);

  // ── Persist on change via effect ──────────────────────────────

  let writeTimer: ReturnType<typeof globalThis.setTimeout> | null = null;

  const persistEffect = effect(() => {
    const currentValue = state();

    if (!available) return;

    if (writeTimer !== null) {
      globalThis.clearTimeout(writeTimer);
    }

    const doWrite = (): void => {
      writeTimer = null;
      try {
        let valueToStore: T | Record<string, unknown> = currentValue;

        // Wrap with timestamp if TTL is configured
        if (ttlMs !== undefined) {
          valueToStore = { _value: currentValue, _ts: Date.now() } as unknown as T;
        }

        storage.setItem(key, serializer(valueToStore));
      } catch {
        // Storage full or unavailable — keep in-memory value
      }
    };

    if (writeDelayMs > 0) {
      writeTimer = globalThis.setTimeout(doWrite, writeDelayMs);
    } else {
      doWrite();
    }
  });

  // ── Cross-tab sync ────────────────────────────────────────────

  if (syncAcrossTabs && available && typeof window !== 'undefined') {
    const handleStorageEvent = (e: StorageEvent): void => {
      if (e.key !== key || e.storageArea !== storage) return;

      if (e.newValue === null) {
        state.set(defaultValue);
      } else {
        try {
          const parsed = deserializer(e.newValue) as T;

          // Handle TTL-wrapped values from other tabs
          const maybeWrapped = parsed as Record<string, unknown> | null;
          const restoredValue =
            maybeWrapped && '_value' in maybeWrapped
              ? (maybeWrapped['_value'] as T)
              : parsed;

          const finalValue = onRestore ? onRestore(restoredValue) : restoredValue;
          state.set(finalValue);
        } catch {
          // Ignore malformed JSON from other tabs
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    destroyRef.onDestroy(() => {
      window.removeEventListener('storage', handleStorageEvent);
    });
  }

  // ── Cleanup ──────────────────────────────────────────────────

  destroyRef.onDestroy(() => {
    persistEffect.destroy();
    if (writeTimer !== null) {
      globalThis.clearTimeout(writeTimer);
    }
  });

  return state;
}
