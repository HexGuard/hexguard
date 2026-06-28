import { computed, signal, type Signal } from '@angular/core';

/**
 * Options for `memoized`.
 */
export interface MemoizedOptions<T> {
  /**
   * Time-to-live in milliseconds.
   * After this duration, the next read triggers a recomputation.
   * @default undefined (no expiry — cached indefinitely)
   */
  readonly ttlMs?: number;

  /**
   * Custom equality function for the cached value.
   */
  readonly equal?: (a: T, b: T) => boolean;
}

/**
 * Creates a cached computed signal that re-evaluates the factory on first read
 * and optionally re-evaluates after a configurable TTL.
 *
 * Without TTL, this is equivalent to `computed(factory)`.
 * With TTL, a background timer marks the cached value as stale after the
 * specified duration, triggering recomputation on the next read.
 *
 * @example
 * ```typescript
 * const expensive = memoized(() => computeHeavyValue(), { ttlMs: 5000 });
 *
 * expensive(); // calls factory
 * expensive(); // returns cached (within TTL)
 * // after 5s:
 * expensive(); // calls factory again
 * ```
 */
export function memoized<T>(
  factory: () => T,
  options?: MemoizedOptions<T>,
): Signal<T> {
  const { ttlMs, equal } = options ?? {};

  if (ttlMs === undefined) {
    // No expiry: simple computed (glitch-free, cached indefinitely)
    return computed(factory, { equal });
  }

  // With TTL: stale signal triggers re-evaluation; timer marks it stale
  const stale = signal(0);
  let timerId: ReturnType<typeof globalThis.setTimeout> | null = null;

  function scheduleRefresh(): void {
    if (timerId !== null) {
      globalThis.clearTimeout(timerId);
    }
    timerId = globalThis.setTimeout(() => {
      stale.set(stale() + 1);
      timerId = null;
    }, ttlMs);
  }

  return computed(() => {
    stale(); // track — computed re-evaluates when timer fires
    const result = factory();
    scheduleRefresh();
    return result;
  }, { equal });
}
