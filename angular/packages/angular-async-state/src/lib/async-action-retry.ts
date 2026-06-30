import { computed, signal } from '@angular/core';
import type { AsyncAction, AsyncActionRunArgs, AsyncActionStatus } from './types';

/** Options for `withRetry`. */
export interface RetryOptions {
  /** Maximum number of retry attempts. @default 3 */
  readonly maxRetries?: number;
  /** Base delay in milliseconds before the first retry. @default 1000 */
  readonly baseDelayMs?: number;
  /** Backoff strategy. @default 'exponential' */
  readonly backoff?: 'fixed' | 'exponential';
  /** Optional predicate to decide whether a failure should be retried. */
  readonly shouldRetry?: (error: unknown) => boolean;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps an `AsyncAction` with retry logic that re-executes the action on
 * failure up to `maxRetries` times with configurable backoff.
 *
 * The returned action exposes additional `retryCount` and `isRetrying`
 * signals so templates can show retry progress.
 *
 * @example
 * ```typescript
 * const save = injectAsyncAction({
 *   run: (data) => api.post('/items', data),
 * });
 *
 * const withRetry = withRetry(save, {
 *   maxRetries: 3,
 *   baseDelayMs: 500,
 *   backoff: 'exponential',
 *   shouldRetry: (err) => err instanceof HttpError && err.status >= 500,
 * });
 *
 * // Use like a normal AsyncAction:
 * withRetry.run(data);
 * ```
 */
export function withRetry<TInput, TResult, TError>(
  action: AsyncAction<TInput, TResult, TError>,
  options: RetryOptions = {},
): AsyncAction<TInput, TResult, TError> & {
  readonly retryCount: import('@angular/core').Signal<number>;
  readonly isRetrying: import('@angular/core').Signal<boolean>;
} {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    backoff = 'exponential',
    shouldRetry = () => true,
  } = options;

  const retryCount = signal(0);
  const isRetrying = computed(() => retryCount() > 0);

  function calculateDelay(attempt: number): number {
    if (backoff === 'fixed') return baseDelayMs;
    return baseDelayMs * Math.pow(2, attempt - 1);
  }

  async function runWithRetry(...args: AsyncActionRunArgs<TInput>): Promise<TResult> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (attempt > 0) {
        retryCount.set(attempt);
        await delay(calculateDelay(attempt));
      }

      try {
        const result = await action.run(...args);
        retryCount.set(0);
        return result;
      } catch (err) {
        lastError = err;
        if (attempt < maxRetries && shouldRetry(err)) {
          continue;
        }
        retryCount.set(0);
        throw err;
      }
    }

    // Should never reach here, but TypeScript needs it
    retryCount.set(0);
    throw lastError;
  }

  return {
    // Forward all signal properties from the original action
    get status(): import('@angular/core').Signal<AsyncActionStatus> {
      return action.status;
    },
    get error(): import('@angular/core').Signal<TError | null> {
      return action.error;
    },
    get lastResult(): import('@angular/core').Signal<TResult | null> {
      return action.lastResult;
    },
    get pending(): import('@angular/core').Signal<boolean> {
      return action.pending;
    },
    get isPending(): import('@angular/core').Signal<boolean> {
      return action.isPending;
    },
    get isIdle(): import('@angular/core').Signal<boolean> {
      return action.isIdle;
    },
    get hasSucceeded(): import('@angular/core').Signal<boolean> {
      return action.hasSucceeded;
    },
    get hasFailed(): import('@angular/core').Signal<boolean> {
      return action.hasFailed;
    },
    run: runWithRetry,
    reset: () => {
      retryCount.set(0);
      action.reset();
    },
    retryCount: retryCount.asReadonly(),
    isRetrying,
  };
}
