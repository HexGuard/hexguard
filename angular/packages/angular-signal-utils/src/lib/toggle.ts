import { signal } from '@angular/core';

/**
 * Handle returned by `injectToggle`.
 */
export interface ToggleHandle {
  /** Current boolean value. */
  readonly value: import('@angular/core').Signal<boolean>;
  /** Toggle between true and false. */
  toggle(): void;
  /** Set to a specific value. */
  set(v: boolean): void;
  /** Set to true. */
  on(): void;
  /** Set to false. */
  off(): void;
}

/**
 * Creates a boolean toggle signal with convenience methods.
 *
 * @example
 * ```typescript
 * const expanded = injectToggle(true);
 *
 * expanded.value(); // true
 * expanded.toggle();
 * expanded.value(); // false
 * expanded.on();
 * expanded.value(); // true
 * expanded.off();
 * expanded.value(); // false
 * ```
 */
export function injectToggle(initial = false): ToggleHandle {
  const state = signal(initial);

  return {
    value: state.asReadonly(),
    toggle: () => state.update((v) => !v),
    set: (v: boolean) => state.set(v),
    on: () => state.set(true),
    off: () => state.set(false),
  };
}
