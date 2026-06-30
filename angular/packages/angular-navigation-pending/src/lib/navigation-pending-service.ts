import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

/**
 * Singleton service that subscribes to `router.events` once and exposes
 * the raw navigation state signal.
 *
 * All `injectNavigationPending()` calls share the same event listener,
 * avoiding duplicate subscriptions. Per-consumer options like
 * `delayedIndicatorMs` and `routeScoped` are handled in the factory.
 */
@Injectable({ providedIn: 'root' })
export class NavigationPendingService {
  readonly navigating = signal<boolean>(false);

  constructor() {
    const destroyRef = inject(DestroyRef);
    const router = inject(Router);

    const subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.navigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.navigating.set(false);
      }
    });

    destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
