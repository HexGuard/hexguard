/**
 * Public API for `@hexguard/angular-notifications`.
 *
 * The package provides a headless notification queue service with typed
 * notification types, auto-dismiss behavior, action support, an optional
 * standalone outlet component, and global defaults configuration.
 */
export { NotificationService } from './lib/notification.service';
export { HexguardNotificationOutletComponent } from './lib/notification-outlet.component';
export {
  provideHexGuardNotifications,
  HEXGUARD_NOTIFICATION_OPTIONS,
} from './lib/notification-options';
export type { HexGuardNotificationsOptions } from './lib/notification-options';
export type {
  Notification,
  NotificationAction,
  NotificationHandle,
  NotificationOptions,
  NotificationType,
} from './lib/types';
