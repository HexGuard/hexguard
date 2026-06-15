import { computed, signal } from '@angular/core';

import type { AsyncStateOptions } from './async-state-options';
import type { AsyncState, AsyncStateStatus } from './types';

function defaultMapError<TError>(error: unknown): TError {
  return error as TError;
}

function defaultIsEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  return false;
}

/**
 * Creates a signal-first async value handle for fetch or read flows.
 *
 * Repeated `load()` or `reload()` calls while a request is already pending
 * reuse the same in-flight promise for this one handle instance.
 */
export function asyncState<TValue, TError = unknown>(
  options: AsyncStateOptions<TValue, TError>,
): AsyncState<TValue, TError> {
  const { initialValue, load, empty = defaultIsEmpty as (value: TValue) => boolean } = options;
  const mapError = options.mapError ?? defaultMapError<TError>;

  const status = signal<AsyncStateStatus>('idle');
  const value = signal(initialValue);
  const error = signal<TError | null>(null);
  const hasLoadedFlag = signal(false);

  let requestToken = 0;
  let inFlight: Promise<TValue> | null = null;

  const beginLoad = (): Promise<TValue> => {
    if (inFlight) {
      return inFlight;
    }

    requestToken += 1;
    const currentToken = requestToken;

    error.set(null);
    status.set(hasLoadedFlag() ? 'reloading' : 'loading');

    let pendingLoad: Promise<TValue>;

    try {
      pendingLoad = Promise.resolve(load());
    } catch (cause) {
      const mappedError = mapError(cause);

      error.set(mappedError);
      status.set('error');

      return Promise.reject(mappedError);
    }

    const currentPromise = pendingLoad
      .then(
        (nextValue) => {
          if (currentToken === requestToken) {
            value.set(nextValue);
            error.set(null);
            hasLoadedFlag.set(true);
            status.set('loaded');
          }

          return nextValue;
        },
        (cause) => {
          const mappedError = mapError(cause);

          if (currentToken === requestToken) {
            error.set(mappedError);
            status.set('error');
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
  };

  return {
    status,
    value,
    error,
    hasLoaded: computed(() => hasLoadedFlag()),
    hasValue: computed(() => hasLoadedFlag() && !empty(value())),
    isEmpty: computed(() => hasLoadedFlag() && empty(value())),
    isIdle: computed(() => status() === 'idle'),
    isLoading: computed(() => status() === 'loading'),
    isLoaded: computed(() => status() === 'loaded'),
    isError: computed(() => status() === 'error'),
    isReloading: computed(() => status() === 'reloading'),
    load(): Promise<TValue> {
      return beginLoad();
    },
    reload(): Promise<TValue> {
      return beginLoad();
    },
    setValue(nextValue: TValue): void {
      requestToken += 1;
      inFlight = null;
      value.set(nextValue);
      error.set(null);
      hasLoadedFlag.set(true);
      status.set('loaded');
    },
    reset(): void {
      requestToken += 1;
      inFlight = null;
      value.set(initialValue);
      error.set(null);
      hasLoadedFlag.set(false);
      status.set('idle');
    },
  };
}
