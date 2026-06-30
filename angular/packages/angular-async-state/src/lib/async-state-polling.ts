import { computed, signal, type Signal } from '@angular/core';
import type { AsyncState } from './types';

/** Options for `withPolling`. */
export interface PollingOptions {
  /** Polling interval in milliseconds. @default 10000 */
  readonly intervalMs?: number;
  /** Whether to start polling immediately. @default true */
  readonly autoStart?: boolean;
}

/**
 * Wraps an `AsyncState` with automatic polling at the given interval.
 *
 * @example
 * ```typescript
 * const data = asyncState({ load: () => api.getStatus() });
 * const polling = withPolling(data, { intervalMs: 30_000 });
 * // Auto-starts by default — calls reload() every 30s
 * polling.stop();
 * polling.start();
 * polling.isPolling(); // Signal<boolean>
 * ```
 */
export function withPolling<TValue, TError>(
  state: AsyncState<TValue, TError>,
  options: PollingOptions = {},
): AsyncState<TValue, TError> & {
  readonly isPolling: Signal<boolean>;
  start(): void;
  stop(): void;
} {
  const { intervalMs = 10000, autoStart = true } = options;
  const polling = signal(false);
  let timerId: ReturnType<typeof setInterval> | null = null;

  function start(): void {
    if (timerId !== null) return;
    polling.set(true);
    timerId = setInterval(() => {
      state.reload().catch(() => {});
    }, intervalMs);
  }

  function stop(): void {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    polling.set(false);
  }

  if (autoStart) start();

  return {
    ...state,
    isPolling: polling.asReadonly(),
    start,
    stop,
  };
}
