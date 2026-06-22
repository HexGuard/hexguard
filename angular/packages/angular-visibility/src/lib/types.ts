import type { Signal } from '@angular/core';

/**
 * Options for configuring visibility and idle detection.
 */
export interface VisibilityOptions {
  /**
   * Inactivity threshold in milliseconds.
   * When no user activity is detected for this duration, `isIdle` becomes `true`.
   * Set to `0` to disable idle tracking entirely.
   *
   * @default 60000
   */
  readonly idleTimeoutMs?: number;

  /**
   * DOM events that reset the idle timer.
   *
   * @default ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'wheel']
   */
  readonly activityEvents?: readonly string[];
}

/**
 * Handle returned by {@link injectVisibility}.
 */
export interface VisibilityState {
  /**
   * Whether the browser tab is currently visible.
   * Tracks `document.visibilityState`.
   */
  readonly isVisible: Signal<boolean>;

  /**
   * Whether the user has been inactive for longer than the configured
   * `idleTimeoutMs`.
   */
  readonly isIdle: Signal<boolean>;

  /**
   * Duration in milliseconds since the last detected user activity.
   * Updates periodically while the user is idle.
   */
  readonly idleDuration: Signal<number>;

  /**
   * Timestamp (ms since epoch) of the last detected user interaction.
   * `0` if no activity has been detected yet.
   */
  readonly lastActivity: Signal<number>;
}

/** @internal Default activity events used when no custom list is provided. */
export const DEFAULT_ACTIVITY_EVENTS: readonly string[] = [
  'mousemove',
  'keydown',
  'mousedown',
  'touchstart',
  'scroll',
  'wheel',
];

/** @internal Default idle timeout in milliseconds. */
export const DEFAULT_IDLE_TIMEOUT_MS = 60_000;

/** @internal Interval for updating idle duration while idle. */
export const IDLE_DURATION_UPDATE_MS = 1_000;
