import { computed, signal } from '@angular/core';
import type { Subscription } from 'rxjs';

import type { ObservableStateOptions } from './observable-state-options';
import type { ObservableState, ObservableStateStatus } from './types';

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
 * Creates a signal-first async value handle for live RxJS streams.
 *
 * `observableState()` keeps one active subscription at a time. Callers own
 * when the stream connects, disconnects, reconnects, or resets.
 */
export function observableState<TValue, TError = unknown>(
  options: ObservableStateOptions<TValue, TError>,
): ObservableState<TValue, TError> {
  const { initialValue, source, empty = defaultIsEmpty as (value: TValue) => boolean } = options;
  const mapError = options.mapError ?? defaultMapError<TError>;

  const status = signal<ObservableStateStatus>('idle');
  const value = signal(initialValue);
  const error = signal<TError | null>(null);
  const hasEmittedFlag = signal(false);

  // Guards against stale emissions after disconnect, reconnect, or reset.
  let connectionToken = 0;
  let subscription: Subscription | null = null;

  const teardownActiveSubscription = (): void => {
    subscription?.unsubscribe();
    subscription = null;
  };

  const startSubscription = (): void => {
    if (subscription) {
      return;
    }

    connectionToken += 1;
    const currentToken = connectionToken;

    error.set(null);
    status.set('connecting');

    let nextSource: ReturnType<typeof source>;

    try {
      nextSource = source();
    } catch (cause) {
      const mappedError = mapError(cause);

      error.set(mappedError);
      status.set('error');

      return;
    }

    const currentSubscription = nextSource.subscribe({
      next: (nextValue) => {
        if (currentToken !== connectionToken) {
          return;
        }

        value.set(nextValue);
        error.set(null);
        hasEmittedFlag.set(true);
        status.set('live');
      },
      error: (cause) => {
        if (currentToken !== connectionToken) {
          return;
        }

        const mappedError = mapError(cause);

        subscription = null;
        error.set(mappedError);
        status.set('error');
      },
      complete: () => {
        if (currentToken !== connectionToken) {
          return;
        }

        subscription = null;
        status.set('complete');
      },
    });

    if (currentToken !== connectionToken || currentSubscription.closed) {
      currentSubscription.unsubscribe();
      subscription = null;

      return;
    }

    subscription = currentSubscription;
  };

  return {
    status,
    value,
    error,
    hasValue: computed(() => hasEmittedFlag() && !empty(value())),
    isEmpty: computed(() => hasEmittedFlag() && empty(value())),
    isIdle: computed(() => status() === 'idle'),
    isConnecting: computed(() => status() === 'connecting'),
    isLive: computed(() => status() === 'live'),
    isError: computed(() => status() === 'error'),
    isComplete: computed(() => status() === 'complete'),
    connect(): void {
      startSubscription();
    },
    disconnect(): void {
      if (!subscription) {
        return;
      }

      connectionToken += 1;
      teardownActiveSubscription();
      status.set('idle');
    },
    reconnect(): void {
      connectionToken += 1;
      teardownActiveSubscription();
      startSubscription();
    },
    reset(): void {
      connectionToken += 1;
      teardownActiveSubscription();
      value.set(initialValue);
      error.set(null);
      hasEmittedFlag.set(false);
      status.set('idle');
    },
  };
}
