import { Observable, Subject } from 'rxjs';
import { DEFAULT_RETRY_CONFIG, type RetryConfig } from './types';

export interface LiveDataStream<T> {
  /** Emits each successfully fetched value. */
  readonly data$: Observable<T>;
  /** Emits a boolean indicating whether a fetch is in progress. */
  readonly loading$: Observable<boolean>;
  /** Emits error values when fetches fail. Does NOT emit on successful fetch. */
  readonly error$: Observable<unknown>;
  /** Emits `true` when the data is stale (past the `staleAfter` threshold). */
  readonly stale$: Observable<boolean>;
  /** Manually trigger a refresh. */
  refresh(): void;
  /** Stop the polling stream. */
  stop(): void;
}

/**
 * Creates an observable-based polling stream with configurable interval,
 * retry with exponential backoff, and stale detection.
 *
 * Unlike the signal-based `injectLiveData()`, this variant does NOT
 * automatically pause on tab hidden — consumers control the lifecycle
 * via the returned `start()` / `stop()` or by unsubscribing.
 *
 * @param options.pollInterval - Polling interval in milliseconds.
 * @param options.fetcher - Async function returning fresh data.
 * @param options.staleAfter - Milliseconds after which data is stale.
 *   Defaults to `pollInterval * 2`.
 * @param options.retryConfig - Exponential backoff retry configuration.
 * @returns A `LiveDataStream<T>` with `data$`, `loading$`, `error$`,
 *   `stale$` observables and `refresh()`/`stop()` methods.
 *
 * @example
 * ```ts
 * import { liveData$ } from '@hexguard/angular-live-data';
 *
 * const stream = liveData$({
 *   pollInterval: 30_000,
 *   fetcher: () => fetch('/api/data').then(r => r.json()),
 * });
 *
 * const sub = stream.data$.subscribe(data => updateUI(data));
 * // Later: stream.stop() or sub.unsubscribe()
 * ```
 */
export function liveData$<T>(options: {
  readonly pollInterval: number;
  readonly fetcher: () => Promise<T>;
  readonly staleAfter?: number;
  readonly retryConfig?: RetryConfig;
}): LiveDataStream<T> {
  const {
    pollInterval,
    fetcher,
    staleAfter = pollInterval * 2,
    retryConfig = DEFAULT_RETRY_CONFIG,
  } = options;

  const dataSubject = new Subject<T>();
  const loadingSubject = new Subject<boolean>();
  const errorSubject = new Subject<unknown>();
  const staleSubject = new Subject<boolean>();

  let active = true;
  let consecutiveFailures = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
  let staleAccumulator = 0;
  let staleIntervalId: ReturnType<typeof setInterval> | null = null;

  function calculateRetryDelay(): number {
    return Math.min(
      retryConfig.baseDelayMs * Math.pow(2, consecutiveFailures - 1),
      retryConfig.maxDelayMs,
    );
  }

  function stopTimers(): void {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (staleIntervalId !== null) {
      clearInterval(staleIntervalId);
      staleIntervalId = null;
    }
    if (retryTimeoutId !== null) {
      clearTimeout(retryTimeoutId);
      retryTimeoutId = null;
    }
  }

  async function executeFetch(): Promise<void> {
    if (!active) return;
    loadingSubject.next(true);

    try {
      const result = await fetcher();
      if (!active) return;
      dataSubject.next(result);
      staleAccumulator = 0;
      staleSubject.next(false);
      consecutiveFailures = 0;
    } catch (err) {
      if (!active) return;
      errorSubject.next(err);
      consecutiveFailures++;

      if (consecutiveFailures < retryConfig.maxRetries) {
        const delay = calculateRetryDelay();
        retryTimeoutId = setTimeout(() => {
          retryTimeoutId = null;
          void executeFetch();
        }, delay);
      }
    } finally {
      if (active) {
        loadingSubject.next(false);
      }
    }
  }

  function startPolling(): void {
    stopTimers();

    intervalId = setInterval(() => void executeFetch(), pollInterval);

    staleIntervalId = setInterval(() => {
      if (!active) return;
      staleAccumulator += 1000;
      if (staleAccumulator >= staleAfter) {
        staleSubject.next(true);
      }
    }, 1000);
  }

  // Initial fetch
  void executeFetch();
  startPolling();

  return {
    data$: dataSubject.asObservable(),
    loading$: loadingSubject.asObservable(),
    error$: errorSubject.asObservable(),
    stale$: staleSubject.asObservable(),
    refresh() {
      void executeFetch();
    },
    stop() {
      active = false;
      stopTimers();
      dataSubject.complete();
      loadingSubject.complete();
      errorSubject.complete();
      staleSubject.complete();
    },
  };
}
