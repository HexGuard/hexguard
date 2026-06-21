import type { Signal } from '@angular/core';

/**
 * Default breakpoint map matching common Tailwind / PostCSS conventions.
 * Each key is a breakpoint name; the value is the minimum viewport width in
 * CSS pixels at which the breakpoint becomes active.
 */
export const DEFAULT_BREAKPOINTS: Record<string, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Options for configuring the breakpoint observer.
 */
export interface BreakpointObserverOptions {
  /**
   * Custom breakpoint map.
   * Each key is a breakpoint name; the value is the minimum viewport width
   * in CSS pixels.
   *
   * @default `{ sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536 }`
   */
  readonly breakpoints?: Record<string, number>;
}

/**
 * Handle returned by {@link injectBreakpointObserver}.
 */
export interface BreakpointObserver {
  /**
   * The name of the largest matching breakpoint.
   * Returns an empty string when no breakpoint matches (viewport narrower
   * than the smallest defined breakpoint).
   */
  readonly active: Signal<string>;

  /**
   * Per-breakpoint boolean signals. Each signal is `true` when the
   * viewport's `min-width` matches that breakpoint.
   */
  readonly breakpoints: Record<string, Signal<boolean>>;

  /**
   * Returns a signal that is `true` when the viewport width is at or above
   * the named breakpoint's minimum width.
   */
  above(name: string): Signal<boolean>;

  /**
   * Returns a signal that is `true` when the viewport width is strictly
   * below the named breakpoint's minimum width.
   */
  below(name: string): Signal<boolean>;

  /**
   * Returns a signal for an arbitrary CSS media query string.
   * The signal updates reactively when the query match state changes.
   */
  matches(query: string): Signal<boolean>;
}
