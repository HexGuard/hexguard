import { Observable, Subject, Subscription } from 'rxjs';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

export interface NavigationPendingObservables {
  /** Emits `true` while a route transition is in progress. */
  readonly isNavigating$: Observable<boolean>;
  /** Emits `true` when a transition exceeds the delay threshold. */
  readonly isSlowNavigation$: Observable<boolean>;
  /** Clean up the router subscription and timers. */
  destroy(): void;
}

/**
 * Creates observables for Angular Router navigation state.
 *
 * Unlike the signal-based `injectNavigationPending()`, this variant
 * does NOT support route-scoped mode — it emits global navigation
 * state changes only.
 *
 * Call `destroy()` to clean up the router subscription, e.g. in
 * `OnDestroy` or via `DestroyRef.onDestroy()`.
 *
 * @param router - The Angular Router instance.
 * @param delayedIndicatorMs - Milliseconds before a transition is
 *   considered "slow". Default `200`.
 * @returns An object with `isNavigating$`, `isSlowNavigation$`
 *   observables and a `destroy()` cleanup function.
 *
 * @example
 * ```ts
 * import { fromRouterNavigation } from '@hexguard/angular-navigation-pending';
 *
 * const { isNavigating$, destroy } = fromRouterNavigation(router);
 * isNavigating$.subscribe(busy => showLoadingBar(busy));
 * destroy();
 * ```
 */
export function fromRouterNavigation(
  router: Router,
  delayedIndicatorMs: number = 200,
): NavigationPendingObservables {
  const isNavigatingSubject = new Subject<boolean>();
  const isSlowNavigationSubject = new Subject<boolean>();
  let slowTimerId: ReturnType<typeof setTimeout> | null = null;

  function clearSlowTimer(): void {
    if (slowTimerId !== null) {
      clearTimeout(slowTimerId);
      slowTimerId = null;
    }
  }

  const routerSub: Subscription = router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      isNavigatingSubject.next(true);
      if (delayedIndicatorMs > 0) {
        slowTimerId = setTimeout(() => {
          slowTimerId = null;
          isSlowNavigationSubject.next(true);
        }, delayedIndicatorMs);
      } else {
        isSlowNavigationSubject.next(true);
      }
    } else if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      isNavigatingSubject.next(false);
      isSlowNavigationSubject.next(false);
      clearSlowTimer();
    }
  });

  return {
    isNavigating$: isNavigatingSubject.asObservable(),
    isSlowNavigation$: isSlowNavigationSubject.asObservable(),
    destroy() {
      routerSub.unsubscribe();
      clearSlowTimer();
      isNavigatingSubject.complete();
      isSlowNavigationSubject.complete();
    },
  };
}
