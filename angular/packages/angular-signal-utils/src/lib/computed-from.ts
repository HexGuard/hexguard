import { computed, type Signal } from '@angular/core';

/**
 * Options for `computedFrom`.
 */
export interface ComputedFromOptions<T> {
  /**
   * Custom equality function for the derived value.
   */
  readonly equal?: (a: T, b: T) => boolean;
}

/**
 * Creates a derived signal that watches multiple dependency signals and
 * recomputes when any of them changes.
 *
 * @example
 * ```typescript
 * const firstName = signal('Jane');
 * const lastName = signal('Doe');
 * const fullName = computedFrom([firstName, lastName], (first, last) =>
 *   `${first} ${last}`
 * );
 * ```
 */
export function computedFrom<T>(
  deps: (Signal<unknown> | (() => unknown))[],
  project: (...values: unknown[]) => T,
  options?: ComputedFromOptions<T>,
): Signal<T> {
  return computed(
    () => project(...deps.map((dep) => dep())),
    options,
  );
}
