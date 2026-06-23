import { Observable } from 'rxjs';

/**
 * Creates an observable that emits storage values for a given key,
 * reacting to both programmatic changes and cross-tab synchronization.
 *
 * Each subscription begins by reading the current value from storage,
 * then emits on every `StorageEvent` for the matching key.
 *
 * @param key - The storage key to observe.
 * @param storage - Storage backend: `'local'` (default) or `'session'`.
 * @returns A cold `Observable<T | null>`. Emits `null` when the key is
 *   missing, removed, malformed, or storage is unavailable.
 *
 * @example
 * ```ts
 * import { fromStorageKey } from '@hexguard/angular-storage';
 *
 * fromStorageKey<string>('user-preferences').subscribe(value => {
 *   console.log('Storage changed:', value);
 * });
 * ```
 */
export function fromStorageKey<T = unknown>(
  key: string,
  storage: 'local' | 'session' = 'local',
): Observable<T | null> {
  return new Observable<T | null>((subscriber) => {
    let storageApi: Storage | null = null;

    try {
      storageApi = storage === 'local' ? localStorage : sessionStorage;
      const testKey = `__hexguard_test__`;
      storageApi.setItem(testKey, '1');
      storageApi.removeItem(testKey);
    } catch {
      storageApi = null;
    }

    // Emit current value on subscribe
    if (storageApi) {
      try {
        const raw = storageApi.getItem(key);
        if (raw !== null) {
          const parsed = JSON.parse(raw);
          subscriber.next(parsed._value ?? (parsed as T));
        } else {
          subscriber.next(null);
        }
      } catch {
        subscriber.next(null);
      }
    } else {
      subscriber.next(null);
    }

    if (typeof window === 'undefined' || !storageApi) {
      subscriber.complete();
      return;
    }

    const handleStorageEvent = (e: StorageEvent): void => {
      if (e.key !== key || e.storageArea !== storageApi) return;
      if (e.newValue === null) {
        subscriber.next(null);
      } else {
        try {
          const parsed = JSON.parse(e.newValue);
          subscriber.next(parsed._value ?? (parsed as T));
        } catch {
          subscriber.next(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  });
}
