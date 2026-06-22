import type { Signal } from '@angular/core';

/**
 * Options for configuring navigation pending detection.
 */
export interface NavigationPendingOptions {
  /**
   * Delay in milliseconds before `isSlowNavigation` becomes `true`.
   * Set to `0` for immediate transition tracking.
   *
   * @default 200
   */
  readonly delayedIndicatorMs?: number;

  /**
   * When `true`, enables route-scoped mode with manual `markReady()` control.
   * The consumer must call `markReady()` to signal that the page is ready.
   *
   * @default false
   */
  readonly routeScoped?: boolean;
}

/**
 * Handle returned by {@link injectNavigationPending}.
 */
export interface NavigationPendingState {
  /**
   * Whether a route transition is currently in progress.
   * Bound to Angular Router's `NavigationStart` / `NavigationEnd` /
   * `NavigationCancel` / `NavigationError` events.
   */
  readonly isNavigating: Signal<boolean>;

  /**
   * Whether navigation has been in progress longer than the configured
   * `delayedIndicatorMs`. Useful for showing a spinner only during
   * slow transitions, preventing flash on fast navigations.
   */
  readonly isSlowNavigation: Signal<boolean>;

  /**
   * In route-scoped mode, call this to mark the page as ready.
   * In non-scoped mode (default), this is a no-op.
   */
  markReady(): void;
}

/** @internal Default delay before showing slow-navigation indicator. */
export const DEFAULT_DELAY_MS = 200;
