/**
 * Public API for `@hexguard/angular-notifications`.
 *
 * The package provides a headless notification queue service with typed
 * notification types, auto-dismiss behavior, action support, and an
 * optional standalone outlet component.
 */
export { NotificationService } from './lib/notification.service';
export { HexguardNotificationOutletComponent } from './lib/notification-outlet.component';
export type {
  Notification,
  NotificationAction,
  NotificationHandle,
  NotificationOptions,
  NotificationType,
} from './lib/types';
