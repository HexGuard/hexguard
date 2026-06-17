# `@hexguard/angular-notifications` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-notifications` provides a headless notification queue for Angular apps that need typed toast management without coupling to a specific UI library. The core is an injectable service with signal-based state; an optional outlet component handles rendering.

The package is intentionally narrow:

- typed notification queue with `success`, `error`, `info`, and `warning` types
- configurable auto-dismiss with per-notification duration
- persistent (non-dismissing) notifications via `duration: 0` or `Infinity`
- optional action button support on individual notifications
- optional `HexguardNotificationOutletComponent` for rendering
- no UI-kit coupling, no animation library, no server-side persistence

## Feature Matrix

| Capability                          | Status    | Notes                                                      |
| ----------------------------------- | --------- | ---------------------------------------------------------- |
| Typed notification types            | Available | `success`, `error`, `info`, `warning`                      |
| Auto-dismiss                        | Available | Default 5000ms, configurable per notification               |
| Persistent notifications            | Available | `duration: 0` or `Infinity` = no auto-dismiss              |
| Convenience methods                 | Available | `success()`, `error()`, `info()`, `warning()`              |
| `dismiss()` / `dismissAll()`        | Available | Imperative dismiss by ID or bulk                            |
| `dismissByType()`                   | Available | Dismiss all notifications of a specific type                |
| Action buttons                      | Available | Optional `NotificationAction` with label and callback       |
| `NotificationHandle.update()`       | Available | Update duration, title, or action after creation            |
| Outlet component                    | Available | `HexguardNotificationOutletComponent` for rendering         |
| Notification title                  | Available | Optional title field via `NotificationOptions.title`        |
| Zero dependencies                   | ✅        | Only `@angular/core` + `tslib`                              |

## Public API Map

| Export                               | Role                                           |
| ------------------------------------ | ---------------------------------------------- |
| `NotificationService`                | Injectable queue service (providedIn: root)    |
| `HexguardNotificationOutletComponent` | Standalone outlet for rendering the queue      |
| `Notification`                       | Single notification item shape                 |
| `NotificationType`                   | Union: `'success' \| 'error' \| 'info' \| 'warning'` |
| `NotificationOptions`                | Configuration for `show()` and `update()`      |
| `NotificationHandle`                 | Imperative handle returned by `show()`         |
| `NotificationAction`                 | Action button model                            |

## Behavior Details

### Queue Order

Notifications are added to the **front** of the array (most recent first). The queue is a flat array — no grouping or deduplication is applied.

### Auto-Dismiss Lifecycle

1. `show()` is called → notification is prepended to the queue
2. If `duration > 0 && isFinite(duration)`, a `setTimeout` schedules automatic dismissal
3. When the timer fires: `dismiss(id)` is called, removing the notification
4. If `duration === 0` or `duration === Infinity`: no timer is set — the notification persists until manual `dismiss()` or `dismissAll()`
5. Calling `dismiss(id)` or removing the notification by other means cancels any pending timer
6. When the service is destroyed (via Angular DI): all timers are cancelled

### NotificationHandle

Each call to `show()` returns a `NotificationHandle` with imperative control:

- `handle.dismiss()` — dismiss this specific notification
- `handle.update(options)` — update duration, title, or action. Changing duration restarts the auto-dismiss timer

### Title Support

The optional `title` field on `Notification` provides a bold heading above the message. Set it via `NotificationOptions.title`:

```ts
service.show('Order 1042 has been shipped.', 'success', {
  title: 'Shipment confirmed',
});
```

### Action Support

The optional `action` field attaches a button to the notification:

```ts
service.error('Failed to save.', 'error', {
  action: { label: 'Retry', handler: () => this.save() },
  duration: 0, // keep visible until user acts
});
```

## Option Resolution and Defaults

```ts
const duration = options?.duration ?? 5000;
```

If `duration > 0 && Number.isFinite(duration)`, auto-dismiss is scheduled.

Default duration: 5000ms.

## Cleanup

When `NotificationService` is created through Angular DI (the normal case with `providedIn: 'root'`), `DestroyRef` is available and all timers are cleaned up on service destruction. If the service is manually instantiated outside DI (e.g., in tests), timers are not auto-cleaned — call `dismissAll()` or let JavaScript garbage collection handle them.

## Configuration Reference

### `NotificationService`

```ts
class NotificationService {
  readonly notifications: Signal<readonly Notification[]>;
  readonly count: Signal<number>;

  show(message: string, type?: NotificationType, options?: NotificationOptions): NotificationHandle;
  success(message: string, options?: NotificationOptions): NotificationHandle;
  error(message: string, options?: NotificationOptions): NotificationHandle;
  info(message: string, options?: NotificationOptions): NotificationHandle;
  warning(message: string, options?: NotificationOptions): NotificationHandle;

  dismiss(id: string): void;
  dismissAll(): void;
  dismissByType(type: NotificationType): void;
}
```

### `NotificationOptions`

| Field      | Type                  | Default | Description                                        |
| ---------- | --------------------- | ------- | -------------------------------------------------- |
| `duration` | `number`              | `5000`  | Auto-dismiss delay. `0` or `Infinity` = persistent |
| `title`    | `string`              | —       | Optional bold heading above the message             |
| `action`   | `NotificationAction`  | —       | Optional action button                             |

### `Notification`

```ts
interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration: number;
  timestamp: number;
  action?: NotificationAction;
}
```

### `HexguardNotificationOutletComponent`

A standalone component that renders the current notification stack. Each notification is rendered as a `<div class="notification notification--{type}">` with a title (optional), message, action button (optional), and dismiss button. The outlet is positioned fixed in the top-right corner with a slide-in animation.

Override the styling by targeting CSS classes: `.notifications-outlet`, `.notification`, `.notification--success`, `.notification--error`, `.notification--info`, `.notification--warning`, `.notification__title`, `.notification__message`, `.notification__action-btn`, `.notification__dismiss-btn`.
