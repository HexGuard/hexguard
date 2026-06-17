import type { Signal } from '@angular/core';

/**
 * Options for configuring debounce behavior.
 */
export interface DebounceOptions {
  /**
   * Whether to emit the source value immediately on the leading edge,
   * before the debounce timer starts.
   *
   * @default false
   */
  readonly leading?: boolean;

  /**
   * Whether to emit the source value on the trailing edge, after the
   * debounce timer has elapsed without further changes.
   *
   * @default true
   */
  readonly trailing?: boolean;
}

/**
 * Handle returned by {@link debouncedSignal}.
 */
export interface DebouncedValue<T> {
  /**
   * The debounced output signal. Updates to this signal are delayed
   * according to the configured `dueTime` and edge options.
   */
  readonly value: Signal<T>;

  /**
   * Whether a trailing emission is currently scheduled.
   *
   * `true` between the last source change and the timer firing.
   */
  readonly isPending: Signal<boolean>;

  /**
   * Writes a new value to the source signal, triggering a new
   * debounce cycle. Only available when the source is a
   * `WritableSignal`.
   */
  set(value: T): void;

  /**
   * Immediately emits the current source value, cancelling any
   * pending trailing timeout.
   */
  flush(): void;

  /**
   * Cancels a pending trailing timeout without emitting.
   */
  cancel(): void;
}
