import { inject } from '@angular/core';

import {
  type BreakpointObserver,
  type BreakpointObserverOptions,
} from './types';
import { BreakpointObserverService } from './breakpoint-observer-service';

/**
 * Injects a reactive breakpoint observer that wraps `window.matchMedia`
 * into typed signals.
 *
 * @param options - Optional breakpoint configuration.
 *
 * @example
 * ```ts
 * const bp = injectBreakpointObserver();
 *
 * // Reactive signals
 * const active = bp.active;            // e.g. 'lg' at 1024px
 * const isMobile = bp.below('md');     // viewport < 768px
 * const isDesktop = bp.above('lg');    // viewport >= 1024px
 *
 * // Per-breakpoint booleans
 * const isMd = bp.breakpoints['md'];
 *
 * // Arbitrary media query
 * const isTablet = bp.matches('(min-width: 768px) and (max-width: 1023px)');
 * ```
 */
export function injectBreakpointObserver(options?: BreakpointObserverOptions): BreakpointObserver {
  return inject(BreakpointObserverService).createObserver(options);
}
