import { DestroyRef, Injectable, inject, signal, type Signal } from '@angular/core';
import type { StorageMeta, StorageOptions, TypedStorage } from './storage';

interface StorageEntry<T> {
  readonly storage: TypedStorage<T>;
  readonly changed: Signal<number>;
}

/**
 * Singleton service that manages typed storage handles per key.
 *
 * Unlike the factory function `injectStorage()` which creates new signal
 * instances on every call, `StorageService` returns the same `TypedStorage`
 * handle for the same key across all consumers. This ensures:
 *
 * - **Same-tab reactivity**: a `set()` in one component propagates to all
 *   other consumers via the shared signal
 * - **Cross-tab sync**: `storage` events are handled once and update the
 *   shared signal
 * - **Change notification**: `storage.changed` signal increments on every
 *   write, auto-dispatch, or cross-tab update
 *
 * @example
 * ```typescript
 * const svc = inject(StorageService);
 * const theme = svc.get('theme', { defaultValue: 'light' });
 *
 * theme.value();       // Signal<string>
 * theme.changed();     // Signal<number> — increments on every change
 * theme.set('dark');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly entries = new Map<string, StorageEntry<unknown>>();

  get<T>(key: string, options: StorageOptions<T>): TypedStorage<T> & { readonly changed: Signal<number> } {
    const existing = this.entries.get(key) as StorageEntry<T> | undefined;

    // If cached with TTL, the value might have expired since creation
    if (existing && options.ttlMs !== undefined) {
      const stored = this.readStoredValue(key, options);
      if (stored === 'expired') {
        // Re-check: delete the cached entry so it re-reads from storage
        this.entries.delete(key);
      }
    }

    if (!existing || !this.entries.has(key)) {
      const entry = this.createEntry(key, options);
      this.entries.set(key, entry);
      return Object.assign(entry.storage, { changed: entry.changed });
    }

    return Object.assign(existing.storage, { changed: existing.changed });
  }

  private readStoredValue<T>(key: string, options: StorageOptions<T>): 'expired' | 'valid' | 'missing' {
    try {
      const storageApi = options.storage === 'session' ? sessionStorage : localStorage;
      const raw = storageApi.getItem(key);
      if (raw === null) return 'missing';
      const parsed = JSON.parse(raw);
      const ts: number | undefined = parsed._ts;
      if (options.ttlMs !== undefined && ts !== undefined && Date.now() - ts > options.ttlMs) {
        return 'expired';
      }
      return 'valid';
    } catch { return 'missing'; }
  }

  private createEntry<T>(key: string, options: StorageOptions<T>): StorageEntry<T> {
    const destroyRef = inject(DestroyRef);
    const { defaultValue, version = 1, onUpgrade, ttlMs, storage: storageType = 'local' } = options;

    let storageApi: Storage | null = null;
    try {
      storageApi = storageType === 'local' ? localStorage : sessionStorage;
      const testKey = `__hexguard_test__`;
      storageApi.setItem(testKey, '1');
      storageApi.removeItem(testKey);
    } catch {
      storageApi = null;
    }

    // ── Read initial value ──────────────────────────────────────

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
            if (onUpgrade) {
              initialValue = onUpgrade(parsed._value ?? {}, storedVersion);
              initialMeta = 'stored';
            } else {
              initialMeta = 'versionMismatch';
            }
          } else if (ttlMs !== undefined && storedTimestamp !== undefined && Date.now() - storedTimestamp > ttlMs) {
            initialMeta = 'expired';
          } else {
            initialValue = parsed._value !== undefined ? parsed._value : defaultValue;
            initialMeta = 'stored';
          }
        }
      } catch {
        initialMeta = 'missing';
      }
    }

    const value = signal<T>(initialValue);
    const meta = signal<StorageMeta>(initialMeta);
    const changed = signal(0);

    // ── Persistence ─────────────────────────────────────────────

    function persist(newValue: T): void {
      value.set(newValue);
      meta.set('stored');
      changed.update(c => c + 1);
      if (!storageApi) return;
      try {
        const envelope: Record<string, unknown> = { _value: newValue, _v: version };
        if (ttlMs !== undefined) envelope['_ts'] = Date.now();
        storageApi.setItem(key, JSON.stringify(envelope));
        // Dispatch same-tab event for other consumers (safe in test env)
        try { window.dispatchEvent(new StorageEvent('storage', {
          key, newValue: JSON.stringify(envelope), storageArea: storageApi, url: location.href,
        })); } catch { /* testing environment — ignore */ }
      } catch { meta.set('missing'); }
    }

    // ── Cross-tab sync ──────────────────────────────────────────

    if (typeof window !== 'undefined' && storageApi) {
      const onStorage = (e: StorageEvent): void => {
        if (e.key !== key || e.storageArea !== storageApi) return;
        changed.update(c => c + 1);
        if (e.newValue === null) {
          value.set(defaultValue);
          meta.set('missing');
        } else {
          try {
            const parsed = JSON.parse(e.newValue);
            value.set(parsed._value !== undefined ? parsed._value : defaultValue);
            meta.set('stored');
          } catch { /* ignore */ }
        }
      };
      window.addEventListener('storage', onStorage);
      destroyRef.onDestroy(() => window.removeEventListener('storage', onStorage));
    }

    const storage: TypedStorage<T> = {
      value: value.asReadonly(),
      meta: meta.asReadonly(),
      changed: changed.asReadonly(),
      set: persist,
      patch: (partial) => persist({ ...value(), ...partial } as T),
      clear: () => {
        if (storageApi) try { storageApi.removeItem(key); } catch { /* ignore */ }
        value.set(defaultValue);
        meta.set('missing');
        changed.update(c => c + 1);
      },
    };

    return { storage, changed: changed.asReadonly() };
  }
}
