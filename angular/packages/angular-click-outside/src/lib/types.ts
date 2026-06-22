import type { Signal } from '@angular/core';

/**
 * Options for configuring click-outside detection.
 */
export interface ClickOutsideOptions {
  /**
   * When `false`, click-outside detection is paused.
   * Useful for temporarily disabling detection (e.g., when a modal is closing).
   *
   * @default signal(true)
   */
  readonly enabled?: Signal<boolean>;

  /**
   * CSS selectors for elements that should be excluded from outside-click detection.
   * Clicks on elements matching any of these selectors will not trigger an outside event.
   */
  readonly exclude?: readonly string[];
}

/**
 * Handle returned by {@link injectClickOutside}.
 */
export interface ClickOutsideHandle {
  /**
   * A signal that emits a `PointerEvent` when a click occurs outside the
   * target element, or `null` when no outside click has been detected.
   *
   * The event resets to `null` after each detection cycle (a new outside
   * click or the next interaction).
   */
  readonly clickOutside: Signal<PointerEvent | null>;
}
