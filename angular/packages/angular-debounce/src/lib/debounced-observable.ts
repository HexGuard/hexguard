import { Observable, type Subscription } from 'rxjs';
import type { DebounceOptions } from './types';

const DEFAULT_OPTIONS: Required<DebounceOptions> = {
  leading: false,
  trailing: true,
};

/**
 * Creates an observable that debounces emissions from a source observable.
 *
 * Supports the same edge modes as {@link debouncedSignal}: trailing-only
 * (default), leading-only, and both edges.
 *
 * @param source$ - Source observable whose emissions will be debounced.
 * @param dueTime - Debounce delay in milliseconds.
 * @param options - Edge behavior configuration: `leading` and/or
 *   `trailing` (default: trailing-only).
 * @returns A cold `Observable<T>` that emits the debounced value from
 *   the source. Completes when the source completes (after flushing any
 *   pending value).
 *
 * @example
 * ```ts
 * import { debouncedObservable } from '@hexguard/angular-debounce';
 * import { Subject } from 'rxjs';
 *
 * const source$ = new Subject<string>();
 * const debounced$ = debouncedObservable(source$, 300);
 *
 * debounced$.subscribe(value => console.log(value));
 * source$.next('a');
 * source$.next('b');
 * // After 300ms: logs 'b'
 * ```
 */
export function debouncedObservable<T>(
  source$: Observable<T>,
  dueTime: number,
  options?: DebounceOptions,
): Observable<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options } as Required<DebounceOptions>;

  return new Observable<T>((subscriber) => {
    let timerId: ReturnType<typeof globalThis.setTimeout> | null = null;
    let lastValue: T;
    let hasValue = false;

    function clearTimer(): void {
      if (timerId !== null) {
        globalThis.clearTimeout(timerId);
        timerId = null;
      }
    }

    function flush(): void {
      clearTimer();
      if (hasValue) {
        subscriber.next(lastValue);
        hasValue = false;
      }
    }

    function cancel(): void {
      clearTimer();
      hasValue = false;
    }

    const subscription: Subscription = source$.subscribe({
      next(value: T) {
        lastValue = value;
        hasValue = true;

        if (opts.leading && !opts.trailing) {
          // leading-only: emit immediately, cancel any pending timer
          clearTimer();
          subscriber.next(value);
          hasValue = false;
        } else if (opts.leading && opts.trailing) {
          // both edges: emit immediately, schedule trailing
          clearTimer();
          subscriber.next(value);
          timerId = globalThis.setTimeout(() => {
            timerId = null;
            if (hasValue) {
              subscriber.next(lastValue);
              hasValue = false;
            }
          }, dueTime);
        } else {
          // trailing-only (default): restart timer
          clearTimer();
          timerId = globalThis.setTimeout(() => {
            timerId = null;
            if (hasValue) {
              subscriber.next(lastValue);
              hasValue = false;
            }
          }, dueTime);
        }
      },
      error(err) {
        cancel();
        subscriber.error(err);
      },
      complete() {
        flush();
        subscriber.complete();
      },
    });

    return () => {
      cancel();
      subscription.unsubscribe();
    };
  });
}
