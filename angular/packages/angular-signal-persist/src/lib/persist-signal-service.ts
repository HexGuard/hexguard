import { DestroyRef, effect, Injectable, inject, signal, type WritableSignal } from '@angular/core';
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
 * Singleton service that creates persisted signals with automatic
 * storage hydration, persistence, TTL expiry, and cross-tab sync.
 *
 * Each call to `createPersistedSignal()` returns an independent
 * `WritableSignal<T>` scoped to the consumer's injection context.
 */
@Injectable({ providedIn: 'root' })
export class PersistSignalService {
  /**
   * Creates a `WritableSignal<T>` that automatically persists its value to storage.
   *
   * @param key - Storage key.
   * @param defaultValue - Default value if none is stored.
   * @param options - Optional persistence configuration.
   * @returns A `WritableSignal<T>` that auto-persists on change.
   */
  createPersistedSignal<T>(
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

    // ── Hydrate from storage ──
    let initialValue = defaultValue;

    if (available) {
      try {
        const raw = storage.getItem(key);
        if (raw !== null) {
          const parsed = deserializer(raw) as Record<string, unknown>;

          const storedValue = (ttlMs !== undefined && parsed !== null && typeof parsed === 'object' && '_value' in parsed)
            ? (parsed['_value'] as T)
            : (parsed as T);

          if (ttlMs !== undefined && parsed !== null && typeof parsed === 'object' && '_ts' in parsed) {
            const storedTs = parsed['_ts'] as number;
            if (Date.now() - storedTs <= ttlMs) {
              initialValue = onRestore ? onRestore(storedValue) : storedValue;
            }
          } else {
            initialValue = onRestore ? onRestore(parsed as T) : (parsed as T);
          }
        }
      } catch {
        // Malformed — use default
      }
    }

    const state = signal<T>(initialValue);

    // ── Persist on change via effect ──
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
          if (ttlMs !== undefined) {
            valueToStore = { _value: currentValue, _ts: Date.now() } as unknown as T;
          }
          storage.setItem(key, serializer(valueToStore));
        } catch {
          // Storage full — keep in-memory
        }
      };

      if (writeDelayMs > 0) {
        writeTimer = globalThis.setTimeout(doWrite, writeDelayMs);
      } else {
        doWrite();
      }
    });

    // ── Cross-tab sync ──
    if (syncAcrossTabs && available && typeof window !== 'undefined') {
      const handleStorageEvent = (e: StorageEvent): void => {
        if (e.key !== key || e.storageArea !== storage) return;

        if (e.newValue === null) {
          state.set(defaultValue);
        } else {
          try {
            const parsed = deserializer(e.newValue) as T;
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

    // ── Cleanup ──
    destroyRef.onDestroy(() => {
      persistEffect.destroy();
      if (writeTimer !== null) {
        globalThis.clearTimeout(writeTimer);
      }
    });

    return state;
  }
}
