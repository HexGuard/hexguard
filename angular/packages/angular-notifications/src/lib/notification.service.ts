import { computed, DestroyRef, inject, Injectable, signal, type Optional } from '@angular/core';

import { HEXGUARD_NOTIFICATION_OPTIONS } from './notification-options';
import type { HexGuardNotificationsOptions } from './notification-options';
import { NotificationHistoryService } from './notification-history.service';
import type {
  Notification,
  NotificationHandle,
  NotificationOptions,
  NotificationType,
} from './types';

let nextNotificationId = 0;

const BUILTIN_DEFAULT_DURATION_MS = 5000;

/**
 * Injectable notification queue service.
 *
 * Manages a signal-based list of notifications with auto-dismiss,
 * typed convenience methods, and imperative dismiss control.
 *
 * Global defaults can be configured via `provideHexGuardNotifications()`
 * at the bootstrap or route level.
 *
 * @example
 * ```ts
 * constructor(private readonly notifications: NotificationService) {}
 *
 * this.notifications.success('Order saved!');
 * this.notifications.error('Failed to save order.', { duration: 0 });
 * this.notifications.dismissAll();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSignal = signal<readonly Notification[]>([]);
  private readonly timerMap = new Map<string, ReturnType<typeof globalThis.setTimeout>>();
  private readonly globalOptions: HexGuardNotificationsOptions;

  /** All active notifications, most recent first. */
  readonly notifications = this.notificationsSignal.asReadonly();

  /** The number of active notifications. */
  readonly count = computed(() => this.notificationsSignal().length);

  /** Automatic cleanup on destroy when created through Angular DI. */
  constructor() {
    this.globalOptions = inject(HEXGUARD_NOTIFICATION_OPTIONS, { optional: true }) ?? {};
    this.historyService = inject(NotificationHistoryService, { optional: true }) ?? null;

    try {
      const destroyRef = inject(DestroyRef);
      destroyRef.onDestroy(() => this.clearAllTimers());
    } catch {
      // Outside injection context — no auto-cleanup. Call dismissAll() manually if needed.
    }
  }

  private readonly historyService: NotificationHistoryService | null;

  /**
   * Show a notification of the given type.
   *
   * @param message - The notification message.
   * @param type - The notification type.
   * @param options - Optional duration, title, and action configuration.
   * @returns A handle for imperative dismiss and update.
   */
  show(
    message: string,
    type: NotificationType = 'info',
    options?: NotificationOptions,
  ): NotificationHandle {
    const id = this.generateId();
    const duration =
      options?.duration ?? this.globalOptions.defaultDuration ?? BUILTIN_DEFAULT_DURATION_MS;
    const groupKey = options?.groupKey;

    // If groupKey is set, try to find and increment an existing notification
    if (groupKey) {
      const existing = this.notificationsSignal().find((n) => n.groupKey === groupKey);
      if (existing) {
        const currentCount = (existing.groupCount ?? 1) + 1;
        this.updateNotification(existing.id, {
          duration: options?.duration,
          title: options?.title ? options.title : existing.title,
        });
        // Override the message and count
        this.notificationsSignal.update((list) =>
          list.map((n) =>
            n.id === existing.id
              ? { ...n, message, groupCount: currentCount, timestamp: Date.now() }
              : n,
          ),
        );
        // Return handle for the updated notification
        return {
          id: existing.id,
          dismiss: () => this.dismiss(existing.id),
          update: (updateOptions: Partial<NotificationOptions>) => {
            this.updateNotification(existing.id, updateOptions);
          },
        };
      }
    }

    const notification: Notification = {
      id,
      type,
      message,
      duration,
      timestamp: Date.now(),
      groupKey,
      groupCount: 1,
      ...(options?.title ? { title: options.title } : {}),
      ...(options?.action ? { action: options.action } : {}),
    };

    this.notificationsSignal.update((list) => {
      const updated = [notification, ...list];
      const maxVisible = this.globalOptions.maxVisible;
      if (maxVisible !== undefined && maxVisible > 0 && updated.length > maxVisible) {
        const toRemove = updated.slice(maxVisible);
        for (const n of toRemove) {
          this.cancelTimer(n.id);
        }
        return updated.slice(0, maxVisible);
      }
      return updated;
    });

    if (duration > 0 && Number.isFinite(duration)) {
      this.scheduleDismiss(id, duration);
    }

    const handle: NotificationHandle = {
      id,
      dismiss: () => this.dismiss(id),
      update: (updateOptions: Partial<NotificationOptions>) => {
        this.updateNotification(id, updateOptions);
      },
    };

    return handle;
  }

  /** Show a success notification. */
  success(message: string, options?: NotificationOptions): NotificationHandle {
    return this.show(message, 'success', options);
  }

  /** Show an error notification. */
  error(message: string, options?: NotificationOptions): NotificationHandle {
    return this.show(message, 'error', options);
  }

  /** Show an info notification. */
  info(message: string, options?: NotificationOptions): NotificationHandle {
    return this.show(message, 'info', options);
  }

  /** Show a warning notification. */
  warning(message: string, options?: NotificationOptions): NotificationHandle {
    return this.show(message, 'warning', options);
  }

  /**
   * Dismiss a notification by ID.
   * No-op if the notification has already been dismissed.
   */
  dismiss(id: string): void {
    this.cancelTimer(id);
    this.notificationsSignal.update((list) => {
      const target = list.find((n) => n.id === id);
      if (target && this.historyService) {
        this.historyService.record(target);
      }
      return list.filter((n) => n.id !== id);
    });
  }

  /** Dismiss all active notifications. */
  dismissAll(): void {
    if (this.historyService) {
      for (const n of this.notificationsSignal()) {
        this.historyService.record(n);
      }
    }
    this.clearAllTimers();
    this.notificationsSignal.set([]);
  }

  /** Dismiss all notifications of the given type. */
  dismissByType(type: NotificationType): void {
    this.notificationsSignal.update((list) => {
      const remaining: Notification[] = [];
      for (const n of list) {
        if (n.type === type) {
          if (this.historyService) {
            this.historyService.record(n);
          }
          this.cancelTimer(n.id);
        } else {
          remaining.push(n);
        }
      }
      return remaining;
    });
  }

  private generateId(): string {
    return `notification-${++nextNotificationId}`;
  }

  private scheduleDismiss(id: string, durationMs: number): void {
    const timer = globalThis.setTimeout(() => {
      this.timerMap.delete(id);
      this.dismiss(id);
    }, durationMs);
    this.timerMap.set(id, timer);
  }

  private cancelTimer(id: string): void {
    const timer = this.timerMap.get(id);
    if (timer !== undefined) {
      globalThis.clearTimeout(timer);
      this.timerMap.delete(id);
    }
  }

  private clearAllTimers(): void {
    for (const timer of this.timerMap.values()) {
      globalThis.clearTimeout(timer);
    }
    this.timerMap.clear();
  }

  private updateNotification(id: string, options: Partial<NotificationOptions>): void {
    this.notificationsSignal.update((list) =>
      list.map((n) => {
        if (n.id !== id) return n;

        const updated = {
          ...n,
          ...(options.duration !== undefined ? { duration: options.duration } : {}),
          ...(options.title !== undefined ? { title: options.title } : {}),
          ...(options.action ? { action: options.action } : {}),
        };

        // Restart the auto-dismiss timer if duration changed
        if (options.duration !== undefined) {
          this.cancelTimer(id);
          if (options.duration > 0 && Number.isFinite(options.duration)) {
            this.scheduleDismiss(id, options.duration);
          }
        }

        return updated;
      }),
    );
  }
}
