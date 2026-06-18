import { DestroyRef, inject, signal } from '@angular/core';

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
  const { defaultValue, version = 1, ttlMs, storage: storageType = 'local' } = options;

  const destroyRef = inject(DestroyRef);
  let storageApi: Storage | null = null;

  // Attempt to access the storage API (may throw in private browsing)
  try {
    storageApi = storageType === 'local' ? localStorage : sessionStorage;
    // Probe by writing a test value
    const testKey = `__hexguard_storage_test__`;
    storageApi.setItem(testKey, '1');
    storageApi.removeItem(testKey);
  } catch {
    storageApi = null;
  }

  // ── Read initial value from storage ──────────────────────────

  let initialValue: T = defaultValue;
  let initialMeta: StorageMeta = 'missing';

  if (storageApi) {
    try {
      const raw = storageApi.getItem(key);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        const storedVersion: number = parsed._v ?? 1;
        const storedTimestamp: number | undefined = parsed._ts;

        if (storedVersion !== version) {
          initialMeta = 'versionMismatch';
        } else if (
          ttlMs !== undefined &&
          storedTimestamp !== undefined &&
          Date.now() - storedTimestamp > ttlMs
        ) {
          initialMeta = 'expired';
        } else {
          initialValue = parsed._value !== undefined ? parsed._value : defaultValue;
          initialMeta = 'stored';
        }
      }
    } catch {
      // Malformed JSON or other read error — use default
      initialMeta = 'missing';
    }
  }

  const value = signal<T>(initialValue);
  const meta = signal<StorageMeta>(initialMeta);

  // ── Persistence helper ───────────────────────────────────────

  function persist(newValue: T): void {
    value.set(newValue);
    meta.set('stored');

    if (!storageApi) return;

    try {
      const envelope: Record<string, unknown> = {
        _value: newValue,
        _v: version,
      };
      if (ttlMs !== undefined) {
        envelope['_ts'] = Date.now();
      }
      storageApi.setItem(key, JSON.stringify(envelope));
    } catch {
      // Storage full or unavailable — keep in-memory value
      meta.set('missing');
    }
  }

  // ── Cross-tab synchronization ────────────────────────────────

  if (typeof window !== 'undefined' && storageApi) {
    const handleStorageEvent = (e: StorageEvent): void => {
      if (e.key !== key || e.storageArea !== storageApi) return;

      if (e.newValue === null) {
        // Key was removed in another tab
        value.set(defaultValue);
        meta.set('missing');
      } else {
        try {
          const parsed = JSON.parse(e.newValue);
          value.set(parsed._value !== undefined ? parsed._value : defaultValue);
          meta.set('stored');
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

  // ── Public API ────────────────────────────────────────────────

  return {
    value: value.asReadonly(),
    meta: meta.asReadonly(),
    set: persist,
    patch: (partial) => persist({ ...value(), ...partial } as T),
    clear: () => {
      if (storageApi) {
        try {
          storageApi.removeItem(key);
        } catch {
          /* ignore */
        }
      }
      value.set(defaultValue);
      meta.set('missing');
    },
  };
}
