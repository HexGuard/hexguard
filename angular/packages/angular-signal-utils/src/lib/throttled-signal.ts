import { signal, type Signal, type WritableSignal } from '@angular/core';

/**
 * Options for `throttledSignal`.
 */
export interface ThrottleOptions {
  /**
   * Emit the leading edge immediately.
   * @default true
   */
  readonly leading?: boolean;

  /**
   * Emit the trailing edge after the delay.
   * @default true
   */
  readonly trailing?: boolean;
}

/**
 * Handle returned by `throttledSignal`.
 */
export interface ThrottledValue<T> {
  /** The throttled output signal. */
  readonly value: Signal<T>;
  /** Whether a trailing emission is pending. */
  readonly isPending: Signal<boolean>;
  /** Write to the source signal. */
  set(value: T): void;
  /** Emit the last pending value immediately and cancel any pending timer. */
  flush(): void;
  /** Cancel the pending trailing emission without emitting. */
  cancel(): void;
}

const DEFAULT_THROTTLE_OPTIONS: Required<ThrottleOptions> = {
  leading: true,
  trailing: true,
};

/**
 * Creates a throttled signal that rate-limits emissions to at most one
 * per `delayMs` window.
 *
 * Follows the same handle-return pattern as `angular-debounce`'s `DebouncedValue`.
 *
 * @example
 * ```typescript
 * const throttled = throttledSignal(source, 200);
 *
 * throttled.value(); // current throttled value
 * throttled.isPending(); // trailing write pending?
 * throttled.set('new'); // write to source
 * throttled.flush(); // emit immediately
 * throttled.cancel(); // cancel pending
 * ```
 */
export function throttledSignal<T>(
  initialValue: T,
  delayMs: number,
  options?: ThrottleOptions,
): ThrottledValue<T> {
  const opts = { ...DEFAULT_THROTTLE_OPTIONS, ...options } as Required<ThrottleOptions>;
  const throttled = signal<T>(initialValue);
  const pending = signal(false);
  const source = signal<T>(initialValue);

  let lastEmitTime = 0;
  let trailingTimer: ReturnType<typeof globalThis.setTimeout> | null = null;
  let lastTrailingValue: T = initialValue;

  function emit(value: T): void {
    throttled.set(value);
    lastEmitTime = Date.now();
  }

  function scheduleTrailing(): void {
    if (!opts.trailing) return;
    cancelTrailing();
    trailingTimer = globalThis.setTimeout(() => {
      trailingTimer = null;
      pending.set(false);
      emit(lastTrailingValue);
    }, delayMs);
  }

  function cancelTrailing(): void {
    if (trailingTimer !== null) {
      globalThis.clearTimeout(trailingTimer);
      trailingTimer = null;
    }
  }

  function set(value: T): void {
    source.set(value);
    lastTrailingValue = value;

    const now = Date.now();
    const elapsed = now - lastEmitTime;

    if (elapsed >= delayMs) {
      // Enough time has passed — emit immediately
      cancelTrailing();
      if (opts.leading) {
        emit(value);
      }
      scheduleTrailing();
    } else {
      // Within throttle window — schedule trailing
      if (opts.leading && lastEmitTime === 0) {
        emit(value);
      }
      pending.set(true);
      scheduleTrailing();
    }
  }

  return {
    value: throttled.asReadonly(),
    isPending: pending.asReadonly(),
    set,
    flush: () => {
      cancelTrailing();
      pending.set(false);
      emit(lastTrailingValue);
    },
    cancel: () => {
      cancelTrailing();
      pending.set(false);
    },
  };
}
