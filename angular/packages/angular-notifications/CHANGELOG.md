# Changelog

## 0.1.0 — 2026-06-17

Initial release of `@hexguard/angular-notifications`.

### Features

- `NotificationService` — injectable notification queue with show/dismiss/dismissAll/dismissByType methods
- Convenience methods: `success()`, `error()`, `info()`, `warning()`
- Auto-dismiss with configurable duration per notification
- `HexguardNotificationOutletComponent` — standalone outlet for rendering the notification stack
- Typed notification model with `NotificationType`, `NotificationOptions`, `NotificationHandle`, and `NotificationAction` support

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-notifications.md`
- Docs-grade demo app with notification type showcase and queue management route
