import { computed, signal } from '@angular/core';

import { AsyncActionPendingError } from './errors';
import type { AsyncActionOptions } from './async-action-options';
import { toOneShotPromise } from './one-shot-source';
import type { AsyncAction, AsyncActionRunArgs, AsyncActionStatus } from './types';

function defaultMapError<TError>(error: unknown): TError {
  return error as TError;
}

/**
 * Creates a signal-first async action handle for submit or command flows.
 *
 * The default duplicate-run behavior is `reuse`, which folds basic submit-lock
 * ergonomics into the action itself without hiding the current pending state.
 */
export function asyncAction<TInput = void, TResult = void, TError = unknown>(
  options: AsyncActionOptions<TInput, TResult, TError>,
): AsyncAction<TInput, TResult, TError> {
  const { run, duplicateRunPolicy = 'reuse' } = options;
  const mapError = options.mapError ?? defaultMapError<TError>;

  const status = signal<AsyncActionStatus>('idle');
  const error = signal<TError | null>(null);
  const lastResult = signal<TResult | null>(null);

  let requestToken = 0;
  let inFlight: Promise<TResult> | null = null;

  return {
    status,
    error,
    lastResult,
    pending: computed(() => status() === 'pending'),
    isPending: computed(() => status() === 'pending'),
    isIdle: computed(() => status() === 'idle'),
    hasSucceeded: computed(() => status() === 'succeeded'),
    hasFailed: computed(() => status() === 'failed'),
    run(...args: AsyncActionRunArgs<TInput>): Promise<TResult> {
      if (inFlight) {
        if (duplicateRunPolicy === 'reuse') {
          return inFlight;
        }

        return Promise.reject(new AsyncActionPendingError());
      }

      requestToken += 1;
      const currentToken = requestToken;

      error.set(null);
      status.set('pending');

      let pendingRun: Promise<TResult>;

      try {
        pendingRun = toOneShotPromise(
          run(...args),
          'asyncAction observable completed without emitting a result.',
        );
      } catch (cause) {
        const mappedError = mapError(cause);

        error.set(mappedError);
        status.set('failed');

        return Promise.reject(mappedError);
      }

      const currentPromise = pendingRun
        .then(
          (result) => {
            if (currentToken === requestToken) {
              lastResult.set(result);
              error.set(null);
              status.set('succeeded');
            }

            return result;
          },
          (cause) => {
            const mappedError = mapError(cause);

            if (currentToken === requestToken) {
              error.set(mappedError);
              status.set('failed');
            }

            throw mappedError;
          },
        )
        .finally(() => {
          if (currentToken === requestToken) {
            inFlight = null;
          }
        });

      inFlight = currentPromise;

      return currentPromise;
    },
    reset(): void {
      requestToken += 1;
      inFlight = null;
      error.set(null);
      lastResult.set(null);
      status.set('idle');
    },
  };
}
