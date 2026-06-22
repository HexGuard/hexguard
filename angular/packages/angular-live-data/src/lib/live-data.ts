import { DestroyRef, inject, signal } from '@angular/core';
import type { LiveDataHandle, LiveDataOptions, RetryConfig } from './types';
import { DEFAULT_RETRY_CONFIG } from './types';

/**
 * Creates a reactive live-data polling handle.
 *
 * Periodically invokes `fetcher` at the configured `pollInterval`, exposing
 * the result as a readonly signal. Polling automatically pauses when the
 * document is hidden (Page Visibility API) and resumes when visible.
 *
 * @example
 * ```typescript
 * const live = injectLiveData({
 *   pollInterval: 15_000,
 *   fetcher: () => fetch('/api/dashboard/stats').then(r => r.json()),
 * });
 *
 * // In template:
 * // @if (live.loading()) { <span>Loading…</span> }
 * // @if (live.stale()) { <span class="badge">Stale</span> }
 * // {{ live.data() }}
 * ```
 *
 * @example
 * ```typescript
 * // With custom retry configuration
 * const live = injectLiveData({
 *   pollInterval: 30_000,
 *   fetcher: myApi.fetch,
 *   retryConfig: { maxRetries: 5, baseDelayMs: 500, maxDelayMs: 10_000 },
 * });
 * ```
 */
export function injectLiveData<T>(options: LiveDataOptions<T>): LiveDataHandle<T> {
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

  const destroyRef = inject(DestroyRef);

  function calculateRetryDelay(): number {
    const delay = retryConfig.baseDelayMs * Math.pow(2, consecutiveFailures - 1);
    return Math.min(delay, retryConfig.maxDelayMs);
  }

  async function executeFetch(): Promise<void> {
    if (isDestroyed || isPaused()) return;
    loading.set(true);
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
    }
  }

  function startPolling(): void {
    stopPolling();
    if (isDestroyed) return;
    intervalId = setInterval(() => void executeFetch(), pollInterval);

    // Periodically check for staleness using a shorter interval than the poll
    staleCheckIntervalId = setInterval(() => {
      if (!isDestroyed) {
        staleCheckMsAccumulator += 1_000;
        if (staleCheckMsAccumulator >= staleAfter) {
          stale.set(true);
        }
      }
    }, 1_000);
  }

  function stopPolling(): void {
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
  }

  // Visibility handling
  if (visibilityAware && typeof document !== 'undefined') {
    const onVisibilityChange = (): void => {
      if (document.hidden) {
        isPaused.set(true);
      } else {
        isPaused.set(false);
        // Trigger an immediate fetch when coming back to visible tab
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
