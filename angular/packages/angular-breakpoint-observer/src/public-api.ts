/**
 * Public API for `@hexguard/angular-breakpoint-observer`.
 *
 * The package provides a single injectable — `injectBreakpointObserver()` —
 * that wraps `window.matchMedia` into typed, signal-based breakpoint detection
 * with `active`, `above`, `below`, `matches`, and per-breakpoint helpers.
 */
export { injectBreakpointObserver } from './lib/breakpoint-observer';
export { BreakpointObserverService } from './lib/breakpoint-observer-service';
export { fromBreakpointChanges } from './lib/breakpoint-observer-observable';
export { DEFAULT_BREAKPOINTS } from './lib/types';
export type { BreakpointObserverOptions, BreakpointObserver } from './lib/types';
export type { BreakpointChange } from './lib/breakpoint-observer-observable';
