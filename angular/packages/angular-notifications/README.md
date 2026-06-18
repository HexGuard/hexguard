# @hexguard/angular-notifications

Headless toast/notification queue for Angular: signal-based notification management with auto-dismiss, typed notification types, and an optional outlet component.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-notifications.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-notifications
```

## Quickstart

```ts
import { Component, inject } from '@angular/core';
import { NotificationService } from '@hexguard/angular-notifications';

@Component({...})
export class MyComponent {
  readonly notifications = inject(NotificationService);

  saveOrder(): void {
    this.notifications.success('Order saved!');
    this.notifications.info('Processing...', { duration: 0 });
    this.notifications.error('Failed.', { action: { label: 'Retry', handler: () => this.saveOrder() }});
  }
}
```

## Features

| Feature                       | Status | Notes                                                                 |
| ----------------------------- | ------ | --------------------------------------------------------------------- |
| Typed notification types      | ✅     | success, error, info, warning                                         |
| Auto-dismiss                  | ✅     | Configurable duration per notification                                |
| Persistent notifications      | ✅     | duration `0` = no auto-dismiss                                        |
| Convenience methods           | ✅     | `success()`, `error()`, `info()`, `warning()`                         |
| `dismiss()` / `dismissAll()`  | ✅     | Imperative dismiss by ID or bulk                                      |
| `dismissByType()`             | ✅     | Dismiss all notifications of a type                                   |
| Action buttons                | ✅     | Optional action with label and callback                               |
| Outlet component              | ✅     | `HexguardNotificationOutletComponent` for rendering                   |
| Global defaults configuration | ✅     | `provideHexGuardNotifications()` for default duration and max visible |
| Max visible limit             | ✅     | Auto-dismiss oldest when queue exceeds configured limit               |
| Zero dependencies             | ✅     | Only `@angular/core` + `tslib`                                        |

## Demo routes

| Route                             | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| `/packages/angular-notifications` | Notification showcase with all types and controls |

## What It Owns

- Injected notification queue with signal-based state
- Auto-dismiss lifecycle with configurable duration
- Typed notification types and action support
- Optional outlet component for rendering

## What It Does Not Own

- Custom toast/notification visual themes — the outlet provides basic styling; replace it with your own template
- Server-side or persistent notification history — queue is in-memory only
- Slide/animation customization — the outlet has a simple slide-in animation; override with your CSS

## Global Configuration

Set app-wide defaults for the notification queue using `provideHexGuardNotifications()`:

```typescript
import { provideHexGuardNotifications } from '@hexguard/angular-notifications';

bootstrapApplication(AppComponent, {
  providers: [
    provideHexGuardNotifications({
      defaultDuration: 7000, // All notifications dismiss after 7s by default
      maxVisible: 5, // Keep at most 5 notifications visible
    }),
  ],
});
```

| Option            | Type     | Default | Description                                                     |
| ----------------- | -------- | ------- | --------------------------------------------------------------- |
| `defaultDuration` | `number` | `5000`  | Default auto-dismiss delay (ms). `0` or `Infinity` = persistent |
| `maxVisible`      | `number` | —       | Auto-dismiss oldest notifications when queue exceeds this count |

## API Reference

### `NotificationService`

```ts
class NotificationService {
  readonly notifications: Signal<readonly Notification[]>;
  readonly count: Signal<number>;
  show(msg: string, type?: NotificationType, options?: NotificationOptions): NotificationHandle;
  success(msg: string, options?: NotificationOptions): NotificationHandle;
  error(msg: string, options?: NotificationOptions): NotificationHandle;
  info(msg: string, options?: NotificationOptions): NotificationHandle;
  warning(msg: string, options?: NotificationOptions): NotificationHandle;
  dismiss(id: string): void;
  dismissAll(): void;
  dismissByType(type: NotificationType): void;
}
```
