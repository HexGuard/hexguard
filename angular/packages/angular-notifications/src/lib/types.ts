import type { Signal } from '@angular/core';

/**
 * The type of a notification, used for styling and filtering.
 */
export type NotificationType = 'success' | 'error' | 'info' | 'warning';

/**
 * An action that can be attached to a notification.
 */
export interface NotificationAction {
  /** Display label for the action button. */
  readonly label: string;
  /** Callback invoked when the action is triggered. */
  readonly handler: () => void;
}

/**
 * Optional configuration for showing a notification.
 */
export interface NotificationOptions {
  /**
   * Duration in milliseconds before auto-dismiss.
   * `0` or `Infinity` means the notification persists until manually dismissed.
   *
   * @default 5000
   */
  readonly duration?: number;

  /** Optional action attached to the notification. */
  readonly action?: NotificationAction;

  /**
   * Optional title displayed above the message.
   * Useful for grouping related notifications or adding strong emphasis.
   */
  readonly title?: string;
}

/**
 * A single notification item in the queue.
 */
export interface Notification {
  /** Unique identifier for this notification. */
  readonly id: string;
  /** The notification type. */
  readonly type: NotificationType;
  /** The main message text. */
  readonly message: string;
  /** Optional title displayed above the message. */
  readonly title?: string;
  /** Duration in milliseconds before auto-dismiss. `0` = persistent. */
  readonly duration: number;
  /** Timestamp when the notification was created (ms since epoch). */
  readonly timestamp: number;
  /** Optional action attached to this notification. */
  readonly action?: NotificationAction;
}

/**
 * Handle returned by `NotificationService.show()` and convenience methods.
 * Provides imperative control over a single notification.
 */
export interface NotificationHandle {
  /** The notification's unique ID. */
  readonly id: string;

  /** Dismiss this notification immediately. */
  dismiss(): void;

  /**
   * Update the notification's options (duration, action).
   * Changing duration restarts the auto-dismiss timer.
   */
  update(options: Partial<NotificationOptions>): void;
}
