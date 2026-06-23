/**
 * Public API for `@hexguard/angular-scroll-state`.
 *
 * The package provides:
 * - `injectScrollState()` — scroll position tracking with save/restore.
 * - `inInfiniteScroll()` — IntersectionObserver-based infinite-scroll detection.
 * - `inScrollSpy()` — scroll-spy section tracking.
 * - `scrollTo()` — imperative smooth-scroll helper.
 */
export { injectScrollState } from './lib/scroll-state';
export { inInfiniteScroll } from './lib/infinite-scroll';
export { inScrollSpy } from './lib/scroll-spy';
export { scrollTo } from './lib/scroll-to';
export {
  fromScrollPosition,
  fromInfiniteScroll,
  fromScrollSpy as fromScrollSpy$,
} from './lib/scroll-state-observable';
export type { ScrollStateOptions, ScrollStateHandle } from './lib/types';
export type { InfiniteScrollOptions, InfiniteScrollHandle } from './lib/types';
export type { ScrollSpyOptions, ScrollSpyHandle } from './lib/types';
