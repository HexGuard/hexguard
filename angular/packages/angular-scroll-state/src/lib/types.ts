import type { ElementRef, Signal } from '@angular/core';

export interface ScrollStateOptions {
  /** Scroll container element — defaults to window. */
  scrollContainer?: ElementRef;
  /** Unique key for save/restore across navigations. */
  saveKey?: string;
  /** Debounce for scroll save in ms — default 100. */
  debounceMs?: number;
}

export interface ScrollStateHandle {
  /** Current vertical scroll position. */
  readonly scrollY: Signal<number>;
  /** Save current scroll position under the given key. */
  save(key: string): void;
  /** Restore a previously saved scroll position. */
  restore(key: string): number | null;
}

export interface InfiniteScrollOptions {
  /** IntersectionObserver root margin — default '200px'. */
  rootMargin?: string;
  /** IntersectionObserver threshold — default 0. */
  threshold?: number;
}

export interface InfiniteScrollHandle {
  /** Signal that becomes true when the sentinel enters the viewport. */
  readonly isTriggered: Signal<boolean>;
  /** Whether more items are being loaded — set by consumer. */
  readonly isLoading: Signal<boolean>;
  /** Whether all items have been loaded — set by consumer. */
  readonly isExhausted: Signal<boolean>;
}

export interface ScrollSpyOptions {
  /** IntersectionObserver root margin — default '-80px 0px -60% 0px'. */
  rootMargin?: string;
  /** IntersectionObserver threshold array — default [0, 0.5, 1]. */
  threshold?: readonly number[];
}

export interface ScrollSpyHandle {
  /** The ID of the currently most-visible section, or null. */
  readonly activeSection: Signal<string | null>;
}
