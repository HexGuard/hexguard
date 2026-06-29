import { computed, inject, type Signal } from '@angular/core';
import { injectStorage, type TypedStorage } from '@hexguard/angular-storage';

const DEFAULT_MAX_ITEMS = 20;
const DEFAULT_STORAGE_KEY = 'hexguard-recently-viewed';

/**
 * A recently-viewed item.
 */
export interface RecentlyViewedItem<TMeta = Record<string, unknown>> {
  /** Unique identifier. */
  readonly id: string;
  /** Display label. */
  readonly label: string;
  /** Optional route for navigation. */
  readonly route?: string;
  /** Timestamp when viewed. */
  readonly viewedAt: number;
  /** Optional metadata. */
  readonly meta?: TMeta;
}

/**
 * Options for `injectRecentlyViewed`.
 */
export interface RecentlyViewedOptions<TMeta = Record<string, unknown>> {
  /** Maximum items to keep. @default 20 */
  readonly maxItems?: number;
  /** Storage key. @default 'hexguard-recently-viewed' */
  readonly storageKey?: string;
  /**
   * Items older than this (ms) are filtered out on read.
   * @default undefined (no expiry)
   */
  readonly ttlMs?: number;
  /**
   * Deduplication strategy when an existing item is re-viewed.
   * - `'replace'`: move to front, update label/route/timestamp
   * - `'ignore'`: keep original position and timestamp
   * - `'allow-duplicates'`: prepend new entry regardless
   * @default 'replace'
   */
  readonly dedup?: 'replace' | 'ignore' | 'allow-duplicates';
}

/**
 * Handle returned by `injectRecentlyViewed`.
 */
export interface RecentlyViewedHandle<TMeta = Record<string, unknown>> {
  /** Reactive list (most recent first). */
  readonly items: Signal<readonly RecentlyViewedItem<TMeta>[]>;
  /** Number of items. */
  readonly count: Signal<number>;
  /** Add or update an item (deduplication based on config). */
  add(item: RecentlyViewedItem<TMeta>): void;
  /** Remove an item by ID. */
  remove(id: string): void;
  /** Clear all items. */
  clear(): void;
}

/**
 * Injects a recently-viewed item tracker backed by `@hexguard/angular-storage`.
 *
 * @example
 * ```typescript
 * const recent = injectRecentlyViewed({ maxItems: 10 });
 *
 * recent.add({ id: 'order-42', label: 'Order #42', route: '/orders/42', viewedAt: Date.now() });
 * recent.items(); // most recent first
 * recent.remove('order-42');
 * recent.clear();
 * ```
 */
export function injectRecentlyViewed<TMeta = Record<string, unknown>>(
  options?: RecentlyViewedOptions<TMeta>,
): RecentlyViewedHandle<TMeta> {
  const {
    maxItems = DEFAULT_MAX_ITEMS,
    storageKey = DEFAULT_STORAGE_KEY,
    ttlMs,
    dedup = 'replace',
  } = options ?? {};

  const storage = injectStorage<RecentlyViewedItem<TMeta>[]>(storageKey, {
    defaultValue: [],
  }) as TypedStorage<RecentlyViewedItem<TMeta>[]>;

  const items = computed<readonly RecentlyViewedItem<TMeta>[]>(() => {
    const all = storage.value();
    if (ttlMs === undefined) return all;
    const cutoff = Date.now() - ttlMs;
    return all.filter((item) => item.viewedAt >= cutoff);
  });

  const count = computed(() => items().length);

  function add(item: RecentlyViewedItem<TMeta>): void {
    const current = [...storage.value()];
    const existingIdx = current.findIndex((i) => i.id === item.id);

    if (existingIdx !== -1) {
      switch (dedup) {
        case 'ignore':
          return; // keep original
        case 'allow-duplicates':
          break; // fall through to prepend
        case 'replace':
          current.splice(existingIdx, 1);
          break;
      }
    }

    current.unshift(item);
    if (current.length > maxItems) {
      current.length = maxItems;
    }
    storage.set(current);
  }

  function remove(id: string): void {
    const current = storage.value().filter((i) => i.id !== id);
    storage.set(current);
  }

  function clear(): void {
    storage.set([]);
  }

  return { items, count, add, remove, clear };
}
