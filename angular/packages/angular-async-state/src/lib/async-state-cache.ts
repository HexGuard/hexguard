import { computed, signal, type Signal } from '@angular/core';
import type { AsyncState } from './types';

/** Options for `withCache`. */
export interface CacheOptions {
  /** Time-to-live in milliseconds. @default 30000 */
  readonly ttlMs?: number;
}

/**
 * Wraps an `AsyncState` with a TTL cache. When `load()` or `reload()` is
 * called and cached data within the TTL window exists, the cached value
 * is returned without fetching.
 *
 * @example
 * ```typescript
 * const data = asyncState({ load: () => api.getUsers() });
 * const cached = withCache(data, { ttlMs: 30_000 });
 * await cached.load(); // Fetches
 * await cached.load(); // Returns cached data (within TTL)
 * cached.isFresh(); // Signal<boolean>
 * ```
 */
export function withCache<TValue, TError>(
  state: AsyncState<TValue, TError>,
  options: CacheOptions = {},
): AsyncState<TValue, TError> & { readonly isFresh: Signal<boolean> } {
  const { ttlMs = 30000 } = options;
  const lastFetch = signal<number>(0);
  const isFresh = computed(() => Date.now() - lastFetch() < ttlMs);

  async function cachedLoad(): Promise<TValue> {
    if (isFresh()) {
      return state.value();
    }
    const result = await state.load();
    lastFetch.set(Date.now());
    return result;
  }

  async function cachedReload(): Promise<TValue> {
    const result = await state.reload();
    lastFetch.set(Date.now());
    return result;
  }

  return {
    ...state,
    load: cachedLoad,
    reload: cachedReload,
    isFresh,
  };
}
