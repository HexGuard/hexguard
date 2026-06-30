import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import type { LiveDataHandle, LiveDataOptions, RetryConfig } from './types';
import { DEFAULT_RETRY_CONFIG } from './types';

/**
 * Singleton service that manages live-data polling instances.
 *
 * Each call to `createHandle()` returns an independent `LiveDataHandle`
 * scoped to the consumer's injection context with its own signals, timers,
 * and fetcher.
 */
@Injectable({ providedIn: 'root' })
export class LiveDataService {
  /**
   * Creates a new reactive live-data polling handle.
   *
   * @param options - Configuration including poll interval, fetcher, and retry settings.
   * @returns A `LiveDataHandle` with `data`, `loading`, `error`, `stale`, and `isPaused` signals.
   */
  createHandle<T>(options: LiveDataOptions<T>): LiveDataHandle<T> {
    const {
      pollInterval,
      fetcher,
      staleAfter = pollInterval * 2,
      retryConfig = DEFAULT_RETRY_CONFIG,
      visibilityAware = true,
    } = options;

    const data = signal<T | undefined>(undefined);
    const loading = signal(false);
    const error = signal<unknown>(null);
    const isPaused = signal(false);
    const stale = signal(false);

    let staleCheckMsAccumulator = 0;
    let staleCheckIntervalId: ReturnType<typeof setInterval> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isDestroyed = false;
    let consecutiveFailures = 0;
    let retryTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let pendingExecution: Promise<void> | null = null;

    const destroyRef = inject(DestroyRef);

    const calculateRetryDelay = (): number => {
      const delay = retryConfig.baseDelayMs * Math.pow(2, consecutiveFailures - 1);
      return Math.min(delay, retryConfig.maxDelayMs);
    };

    const executeFetch = async (): Promise<void> => {
      if (isDestroyed || isPaused()) return;
      if (pendingExecution) return pendingExecution;
      loading.set(true);
      const execution = (async () => {
        try {
          const result = await fetcher();
          if (!isDestroyed) {
            data.set(result);
            staleCheckMsAccumulator = 0;
            stale.set(false);
            error.set(null);
            consecutiveFailures = 0;
          }
        } catch (err) {
          if (!isDestroyed) {
            error.set(err);
            consecutiveFailures++;
            if (consecutiveFailures < retryConfig.maxRetries) {
              const delay = calculateRetryDelay();
              retryTimeoutId = setTimeout(() => {
                retryTimeoutId = null;
                void executeFetch();
              }, delay);
            }
          }
        } finally {
          if (!isDestroyed) {
            loading.set(false);
          }
          pendingExecution = null;
        }
      })();
      pendingExecution = execution;
      return execution;
    };

    const startPolling = (): void => {
      stopPolling();
      if (isDestroyed) return;
      intervalId = setInterval(() => void executeFetch(), pollInterval);
      staleCheckIntervalId = setInterval(() => {
        if (!isDestroyed) {
          staleCheckMsAccumulator += 1_000;
          if (staleCheckMsAccumulator >= staleAfter) {
            stale.set(true);
          }
        }
      }, 1_000);
    };

    const stopPolling = (): void => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      if (staleCheckIntervalId !== null) {
        clearInterval(staleCheckIntervalId);
        staleCheckIntervalId = null;
      }
      if (retryTimeoutId !== null) {
        clearTimeout(retryTimeoutId);
        retryTimeoutId = null;
      }
    };

    // Visibility handling
    if (visibilityAware && typeof document !== 'undefined') {
      const onVisibilityChange = (): void => {
        if (document.hidden) {
          isPaused.set(true);
        } else {
          isPaused.set(false);
          void executeFetch();
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange);
      destroyRef.onDestroy(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      });
    }

    // Initial fetch + start polling
    void executeFetch();
    startPolling();

    destroyRef.onDestroy(() => {
      isDestroyed = true;
      stopPolling();
    });

    return {
      data: data.asReadonly(),
      stale: stale.asReadonly(),
      loading: loading.asReadonly(),
      error: error.asReadonly(),
      isPaused: isPaused.asReadonly(),
      pause(): void {
        if (!isPaused()) {
          isPaused.set(true);
        }
      },
      resume(): void {
        if (isPaused()) {
          isPaused.set(false);
          void executeFetch();
        }
      },
      async refresh(): Promise<void> {
        await executeFetch();
      },
    };
  }
}
