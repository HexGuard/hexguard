import { signal } from '@angular/core';

import type { DebounceOptions, DebouncedValue } from './types';

const DEFAULT_OPTIONS: Required<DebounceOptions> = {
  leading: false,
  trailing: true,
};

/**
 * Creates a debounced signal primitive.
 *
 * The returned handle provides a debounced output signal, configurable
 * leading/trailing edge behavior, and imperative flush/cancel control.
 *
 * Use {@link DebouncedValue.set} to write values; the output signal
 * updates according to the configured `dueTime` and edge options.
 *
 * @param initialValue - The initial value for the debounced signal.
 * @param dueTime - Debounce delay in milliseconds.
 * @param options - Optional leading/trailing edge configuration.
 *
 * @example
 * ```ts
 * const debounced = debouncedSignal('', 300);
 *
 * // Later, in a click/input handler:
 * debounced.set('search term');
 *
 * // Read the debounced value reactively:
 * effect(() => console.log('Debounced:', debounced.value()));
 * ```
 *
 * @example
 * ```ts
 * // Two-way binding with leading edge
 * const name = debouncedSignal('', 500, { leading: true, trailing: true });
 *
 * name.set('hello'); // emits 'hello' immediately (leading)
 * // After 500ms without changes: emits 'hello' again (trailing)
 * ```
 */
export function debouncedSignal<T>(
  initialValue: T,
  dueTime: number,
  options?: DebounceOptions,
): DebouncedValue<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options } as Required<DebounceOptions>;

  const debounced = signal<T>(initialValue);
  const pending = signal(false);

  let timerId: ReturnType<typeof globalThis.setTimeout> | null = null;
  let lastSetValue: T = initialValue;

  function clearTimer(): void {
    if (timerId !== null) {
      globalThis.clearTimeout(timerId);
      timerId = null;
    }
  }

  function flush(): void {
    clearTimer();
    pending.set(false);
    debounced.set(lastSetValue);
  }

  function cancel(): void {
    clearTimer();
    pending.set(false);
  }

  function set(value: T): void {
    lastSetValue = value;

    if (opts.leading && !opts.trailing) {
      // Leading-only: emit immediately each time, no trailing
      clearTimer();
      debounced.set(value);
      pending.set(false);
    } else if (opts.leading && opts.trailing) {
      // Both edges: emit immediately on every set(), then schedule trailing
      clearTimer();
      debounced.set(value);
      pending.set(true);
      timerId = globalThis.setTimeout(() => {
        timerId = null;
        pending.set(false);
        debounced.set(lastSetValue);
      }, dueTime);
    } else {
      // Trailing-only (default): cancel previous, re-schedule
      clearTimer();
      timerId = globalThis.setTimeout(() => {
        timerId = null;
        pending.set(false);
        debounced.set(value);
      }, dueTime);
      if (!pending()) {
        pending.set(true);
      }
    }
  }

  return {
    value: debounced.asReadonly(),
    isPending: pending.asReadonly(),
    set,
    flush,
    cancel,
  };
}
