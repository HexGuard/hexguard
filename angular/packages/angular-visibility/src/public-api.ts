/**
 * Public API for `@hexguard/angular-visibility`.
 *
 * The package provides two exports:
 * - `injectVisibility()` — document/tab visibility and idle detection signals.
 * - `inElementVisibility()` — IntersectionObserver-based element visibility as a signal.
 */
export { injectVisibility, inElementVisibility } from './lib/visibility';
export type { VisibilityOptions, VisibilityState } from './lib/types';
