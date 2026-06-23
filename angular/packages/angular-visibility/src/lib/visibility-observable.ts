import { Observable } from 'rxjs';
import { DEFAULT_IDLE_TIMEOUT_MS, DEFAULT_ACTIVITY_EVENTS } from './types';

/**
 * Creates an observable that emits the page visibility state on every
 * `visibilitychange` event.
 *
 * @returns A cold `Observable<boolean>` — emits the current state on
 *   subscribe, then `true` (visible) / `false` (hidden) on each change.
 *
 * @example
 * ```ts
 * import { fromVisibilityChanges } from '@hexguard/angular-visibility';
 *
 * fromVisibilityChanges().subscribe(isVisible => {
 *   if (isVisible) console.log('Tab became visible');
 * });
 * ```
 */
export function fromVisibilityChanges(): Observable<boolean> {
  return new Observable<boolean>((subscriber) => {
    subscriber.next(document.visibilityState === 'visible');

    const handler = (): void => {
      subscriber.next(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  });
}

/**
 * Creates an observable that emits when the user becomes idle, based on
 * a configurable inactivity timeout and set of activity events.
 *
 * Emits `true` when the idle threshold is crossed, and `false` when user
 * activity is detected (resets the timer).
 *
 * @param idleTimeoutMs - Inactivity threshold in milliseconds.
 *   Default `60_000` (1 minute).
 * @param activityEvents - DOM events that reset the idle timer.
 *   Defaults to `['mousemove', 'keydown', 'mousedown', 'touchstart',
 *   'scroll', 'wheel']`.
 * @returns A cold `Observable<boolean>` emitting `true` on idle
 *   detection and `false` on activity.
 *
 * @example
 * ```ts
 * import { fromIdleState } from '@hexguard/angular-visibility';
 *
 * fromIdleState().subscribe(isIdle => {
 *   if (isIdle) console.log('User is idle');
 * });
 * ```
 */
export function fromIdleState(
  idleTimeoutMs: number = DEFAULT_IDLE_TIMEOUT_MS,
  activityEvents: readonly string[] = DEFAULT_ACTIVITY_EVENTS,
): Observable<boolean> {
  return new Observable<boolean>((subscriber) => {
    let isIdle = false;
    let idleTimerId: ReturnType<typeof setTimeout> | null = null;

    // Emit the initial state
    subscriber.next(false);

    function resetIdleTimer(): void {
      if (idleTimerId !== null) clearTimeout(idleTimerId);
      if (isIdle) {
        isIdle = false;
        subscriber.next(false);
      }
      idleTimerId = setTimeout(() => {
        isIdle = true;
        subscriber.next(true);
      }, idleTimeoutMs);
    }

    resetIdleTimer();

    for (const eventName of activityEvents) {
      document.addEventListener(eventName, resetIdleTimer, { passive: true });
    }

    return () => {
      if (idleTimerId !== null) clearTimeout(idleTimerId);
      for (const eventName of activityEvents) {
        document.removeEventListener(eventName, resetIdleTimer);
      }
    };
  });
}

/**
 * Creates an observable that emits the intersection state of a target
 * element relative to the viewport. Emits `true` when the element enters
 * the viewport, `false` when it leaves.
 *
 * @param element - The DOM element to observe for visibility.
 * @param rootMargin - IntersectionObserver rootMargin. Optional.
 * @param threshold - IntersectionObserver threshold (single or array).
 *   Optional.
 * @returns A cold `Observable<boolean>` — emits on every intersection
 *   ratio change.
 *
 * @example
 * ```ts
 * import { fromElementVisibility } from '@hexguard/angular-visibility';
 *
 * fromElementVisibility(document.getElementById('target')!).subscribe(
 *   isVisible => console.log('Element visible:', isVisible)
 * );
 * ```
 */
export function fromElementVisibility(
  element: HTMLElement,
  rootMargin?: string,
  threshold?: number | number[],
): Observable<boolean> {
  return new Observable<boolean>((subscriber) => {
    const observer = new IntersectionObserver(
      (entries) => {
        subscriber.next(entries[0]?.isIntersecting ?? false);
      },
      { rootMargin, threshold },
    );

    observer.observe(element);

    return () => observer.disconnect();
  });
}
