import { type EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import type { NotificationType } from './types';

/**
 * Global defaults for the notification queue service.
 *
 * Pass these to `provideHexGuardNotifications()` at the bootstrap or
 * route level to override the library defaults for all notifications
 * created in the injector tree.
 */
export interface HexGuardNotificationsOptions {
  /**
   * Default auto-dismiss duration in milliseconds.
   *
   * Individual calls to `show()` can still override this via
   * `NotificationOptions.duration`. Set to `0` or `Infinity` to
   * make notifications persistent by default.
   *
   * @default 5000
   */
  readonly defaultDuration?: number;

  /**
   * Optional limit on the number of visible notifications in the queue.
   * When the queue exceeds this count, the oldest notifications are
   * automatically dismissed (most-recent-first order is preserved).
   *
   * `0` or `undefined` means no limit.
   *
   * @default undefined (no limit)
   */
  readonly maxVisible?: number;
}

/** Injection token for global notification options. */
export const HEXGUARD_NOTIFICATION_OPTIONS = new InjectionToken<HexGuardNotificationsOptions>(
  'HEXGUARD_NOTIFICATION_OPTIONS',
);

/**
 * Registers global defaults for the notification queue.
 *
 * Call once at the bootstrap or route providers level so that all
 * `NotificationService` instances in the same tree inherit the same
 * default duration and max-visible behavior without repeating options
 * per call site.
 *
 * @param options - Partial overrides for the library defaults.
 * @returns Environment providers that can be passed to `bootstrapApplication`
 *          or `Route` provider arrays.
 */
export function provideHexGuardNotifications(
  options: HexGuardNotificationsOptions = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HEXGUARD_NOTIFICATION_OPTIONS,
      useValue: options,
    },
  ]);
}
