import { DestroyRef, Injectable, computed, inject, signal, type Signal } from '@angular/core';

import type { Notification } from './types';

const HISTORY_KEY = 'hexguard_notification_history';

/**
 * Service that persists dismissed notifications for later review.
 *
 * Automatically captures notifications dismissed via `dismiss()`,
 * `dismissAll()`, `dismissByType()`, auto-dismiss timers, and
 * `dismiss()` via the returned `NotificationHandle`.
 *
 * @example
 * ```typescript
 * const history = inject(NotificationHistoryService);
 * const recent = history.recent(50); // Signal — last 50 notifications
 * history.clear();
 * ```
 */
@Injectable({ providedIn: 'root' })
export class NotificationHistoryService {
  private readonly history = signal<Notification[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Returns a signal of the most recently dismissed notifications,
   * limited to the given count.
   */
  recent(max: number = 50): Signal<readonly Notification[]> {
    return computed(() => this.history().slice(-max).reverse());
  }

  /**
   * All dismissed notifications as a signal (unsorted, full history).
   */
  readonly all: Signal<readonly Notification[]> = this.history.asReadonly();

  /**
   * The total number of notifications in history.
   */
  readonly count: Signal<number> = computed(() => this.history().length);

  /**
   * Clear all notification history.
   */
  clear(): void {
    this.history.set([]);
    this.persist();
  }

  /**
   * Record a dismissed notification (called by NotificationService).
   * @internal
   */
  record(notification: Notification): void {
    this.history.update((list) => {
      const updated = [...list, notification];
      // Keep only the last 200 to bound storage
      return updated.length > 200 ? updated.slice(-200) : updated;
    });
    this.persist();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Notification[];
        this.history.set(parsed);
      }
    } catch {
      // Storage unavailable or corrupt — start empty
    }
  }

  private persist(): void {
    try {
      const raw = JSON.stringify(this.history());
      localStorage.setItem(HISTORY_KEY, raw);
    } catch {
      // Storage full or unavailable — skip persistence
    }
  }
}
