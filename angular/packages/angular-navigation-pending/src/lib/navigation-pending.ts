import { computed, DestroyRef, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

import { DEFAULT_DELAY_MS, type NavigationPendingOptions, type NavigationPendingState } from './types';

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
export function injectNavigationPending(options?: NavigationPendingOptions): NavigationPendingState {
  const router = inject(Router);
  const destroyRef = inject(DestroyRef);
  const delayedIndicatorMs = options?.delayedIndicatorMs ?? DEFAULT_DELAY_MS;
  const routeScoped = options?.routeScoped ?? false;

  const navigating = signal<boolean>(false);
  const slowTimerActive = signal<boolean>(false);
  const ready = signal<boolean>(false);
  let slowTimerId: ReturnType<typeof setTimeout> | null = null;

  const subscription = router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      navigating.set(true);
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
      navigating.set(false);
      slowTimerActive.set(false);
      if (slowTimerId !== null) {
        clearTimeout(slowTimerId);
        slowTimerId = null;
      }
    }
  });

  destroyRef.onDestroy(() => {
    subscription.unsubscribe();
    if (slowTimerId !== null) {
      clearTimeout(slowTimerId);
    }
  });

  function markReady(): void {
    if (routeScoped) {
      ready.set(true);
    }
  }

  const isNavigatingSignal = computed<boolean>(() => {
    if (!routeScoped) {
      return navigating();
    }
    return navigating() && !ready();
  });

  const isSlowNavigationSignal = computed<boolean>(() => {
    if (!navigating()) {
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
    markReady,
  };
}
