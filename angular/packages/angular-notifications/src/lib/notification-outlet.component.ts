import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';

import { NotificationService } from './notification.service';
import type { NotificationType } from './types';

/**
 * Standalone outlet component that renders the current notification stack.
 *
 * By default the outlet uses `position: fixed` in the top-right corner.
 * Set `[inline]="true"` when rendering inside a constrained container
 * (e.g. a demo preview panel) to use static flow positioning.
 *
 * Each notification is rendered as a `<div>` with the CSS class
 * `notification` and a modifier class `notification--{type}` (e.g.
 * `notification--success`, `notification--error`).
 *
 * @example
 * ```html
 * <hexguard-notification-outlet />
 * ```
 *
 * @example
 * ```html
 * <hexguard-notification-outlet [inline]="true" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'hexguard-notification-outlet',
  template: `
    <div
      class="notifications-outlet"
      [class.notifications-outlet--inline]="inline()"
      data-testid="notification-outlet"
    >
      @for (notification of service.notifications(); track notification.id) {
        <div
          class="notification notification--{{ notification.type }}"
          [attr.data-testid]="'notification-' + notification.id"
          [attr.data-notification-type]="notification.type"
        >
          <div class="notification__body">
            @if (notification.title) {
              <strong class="notification__title">{{ notification.title }}</strong>
            }
            <p class="notification__message">{{ notification.message }}</p>
          </div>
          <div class="notification__actions">
            @if (notification.action) {
              <button
                class="notification__action-btn"
                type="button"
                (click)="notification.action!.handler()"
                [attr.data-testid]="'notification-' + notification.id + '-action'"
              >
                {{ notification.action.label }}
              </button>
            }
            <button
              class="notification__dismiss-btn"
              type="button"
              (click)="service.dismiss(notification.id)"
              [attr.data-testid]="'notification-' + notification.id + '-dismiss'"
              aria-label="Dismiss"
            >
              &times;
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .notifications-outlet {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 24rem;
    }
    .notifications-outlet--inline {
      position: static;
      max-width: 100%;
    }
    .notification {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.375rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      font-size: 0.875rem;
      line-height: 1.4;
      animation: slideIn 0.2s ease-out;
    }
    .notification--success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
    .notification--error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
    .notification--info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
    .notification--warning { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; }
    .notification__body { flex: 1; }
    .notification__title { display: block; margin-bottom: 0.125rem; }
    .notification__message { margin: 0; }
    .notification__actions { display: flex; gap: 0.5rem; align-items: center; flex-shrink: 0; }
    .notification__dismiss-btn {
      background: none; border: none; cursor: pointer;
      font-size: 1.25rem; line-height: 1; padding: 0 0.25rem;
      opacity: 0.6;
    }
    .notification__dismiss-btn:hover { opacity: 1; }
    .notification__action-btn {
      background: none; border: 1px solid currentColor; border-radius: 0.25rem;
      cursor: pointer; font-size: 0.75rem; padding: 0.25rem 0.5rem;
      white-space: nowrap;
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HexguardNotificationOutletComponent {
  readonly service = inject(NotificationService);

  /** When true, renders the outlet with static positioning instead of fixed. */
  readonly inline = input(false);
}
