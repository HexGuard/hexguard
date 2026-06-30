import { computed, DestroyRef, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import type { NavigationPendingOptions, NavigationPendingState } from './types';
import { NavigationPendingService } from './navigation-pending-service';

/**
 * Injects a navigation pending handle that tracks route transition state
 * via Angular Router events.
 *
 * @param options - Optional configuration for delay threshold and route scoping.
 *
 * @example
 * ```ts
 * // App-level: show a spinner only during slow navigations
 * const nav = injectNavigationPending({ delayedIndicatorMs: 200 });
 * effect(() => {
 *   if (nav.isSlowNavigation()) showSpinner();
 *   else hideSpinner();
 * });
 * ```
 *
 * @example
 * ```ts
 * // Route-scoped: mark page as ready when data loads
 * const pageNav = injectNavigationPending({ routeScoped: true });
 * effect(() => {
 *   if (data.isLoaded()) pageNav.markReady();
 * });
 * ```
 */
export function injectNavigationPending(
  options?: NavigationPendingOptions,
): NavigationPendingState {
  const service = inject(NavigationPendingService);
  const destroyRef = inject(DestroyRef);
  const delayedIndicatorMs = options?.delayedIndicatorMs ?? 200;
  const routeScoped = options?.routeScoped ?? false;

  const ready = signal(false);
  const slowTimerActive = signal(false);
  let slowTimerId: ReturnType<typeof setTimeout> | null = null;

  // Per-consumer: listen for navigation start to manage slow timer
  const router = inject(Router);
  const sub = router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      slowTimerActive.set(false);
      ready.set(false);

      if (delayedIndicatorMs > 0) {
        slowTimerId = setTimeout(() => {
          slowTimerActive.set(true);
          slowTimerId = null;
        }, delayedIndicatorMs);
      } else {
        slowTimerActive.set(true);
      }
    } else if (
      event instanceof NavigationEnd ||
      event instanceof NavigationCancel ||
      event instanceof NavigationError
    ) {
      slowTimerActive.set(false);
      if (slowTimerId !== null) {
        clearTimeout(slowTimerId);
        slowTimerId = null;
      }
    }
  });

  destroyRef.onDestroy(() => {
    sub.unsubscribe();
    if (slowTimerId !== null) {
      clearTimeout(slowTimerId);
    }
  });

  const isNavigatingSignal = computed<boolean>(() => {
    if (!routeScoped) {
      return service.navigating();
    }
    return service.navigating() && !ready();
  });

  const isSlowNavigationSignal = computed<boolean>(() => {
    if (!service.navigating()) {
      return false;
    }
    if (delayedIndicatorMs === 0) {
      return true;
    }
    return slowTimerActive();
  });

  return {
    isNavigating: isNavigatingSignal,
    isSlowNavigation: isSlowNavigationSignal,
    markReady: () => {
      if (routeScoped) {
        ready.set(true);
      }
    },
  };
}
