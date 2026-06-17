---
id: feature-notification-delivery-cross-stack
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.NotificationDelivery + @hexguard/angular-notification-inbox'
---

# Notification Delivery Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.NotificationDelivery` + `@hexguard/angular-notification-inbox`) for server-pushed in-app notification feeds with read/unread tracking, deep-link routing, real-time delivery signals, and preference filtering.

The repeated problem is that most SaaS products need to deliver in-app notifications — "Your report is ready," "User X commented," "Approval needed" — and teams rebuild the same notification model (id, type, message, read state, timestamp, deep link) plus polling or push delivery on every project. The Angular-only `@hexguard/angular-notifications` (already planned) covers ephemeral toast/snackbar notifications. This pair covers the persistent notification feed — the bell icon in the header, the notification dropdown, read/unread state, and server-side delivery.

## Goals

- Define a shared notification contract with id, type, title, body, deep-link URL, read state, and timestamp.
- Provide a .NET package (`HexGuard.NotificationDelivery`) for notification generation, delivery-channel abstraction (in-app, email), preference filtering, and a polling/sse endpoint.
- Provide an Angular package (`@hexguard/angular-notification-inbox`) for notification feed state, read/unread tracking, count badge, real-time updates, and deep-link routing.
- Support push (SSE) and pull (polling) delivery strategies.
- Compose the Angular side with `@hexguard/angular-notifications` for real-time toast display of new notifications.
- Keep the notification model simple — no complex content templates, attachments, or action buttons in v0.1.

## Non-Goals

- Email or push notification delivery infrastructure — those are channel implementations.
- Notification template engines or localization in the first version.
- Notification scheduling or batching (digest) — that's a future concern.
- Replacing the Angular-only toast/notification queue (`angular-notifications`) — this is the persistent inbox companion.

## Decisions

- Use a simple polling endpoint (`GET /api/notifications?since={timestamp}`) as the primary delivery mechanism, with SSE as an optional upgrade.
- The Angular inbox manages read/unread state locally and syncs to the server via a `PATCH /api/notifications/{id}/read` endpoint.
- The notification model is intentionally flat — no threading, no grouping, no categories in v0.1.
- Release-coupling: independent minor versions with opt-in coordinated major releases.

## Proposed Contracts

### .NET

```csharp
public record NotificationDto(
    Guid Id,
    string Type,              // e.g., "report_ready", "comment", "approval"
    string Title,
    string? Body,
    string? DeepLinkUrl,
    bool IsRead,
    DateTime CreatedAtUtc
);

public record NotificationFeedResponse(
    IReadOnlyList<NotificationDto> Notifications,
    int UnreadCount,
    DateTime ServerTimestamp
);

// Endpoints
// GET /api/notifications?since={timestamp}&take={count} → NotificationFeedResponse
// PATCH /api/notifications/{id}/read
// PATCH /api/notifications/read-all
// GET /api/notifications/count → { unreadCount: number }
```

### Angular

```ts
interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  deepLinkUrl?: string;
  isRead: boolean;
  createdAtUtc: string;
}

interface InboxState {
  readonly notifications: Signal<Notification[]>;
  readonly unreadCount: Signal<number>;
  readonly isLoading: Signal<boolean>;
  markRead(id: string): void;
  markAllRead(): void;
  navigateTo(notification: Notification): void;   // router.navigate by deepLink
}
```

## Implementation Plan

### Phase 0: .NET — HexGuard.NotificationDelivery

1. Scaffold the .NET project + test project.
2. Define `NotificationDto`, `NotificationFeedResponse`.
3. Implement `INotificationStore` interface and an `InMemoryNotificationStore` for development.
4. Implement minimal-API endpoints: `GET /api/notifications`, `PATCH /api/notifications/{id}/read`, `PATCH /api/notifications/read-all`, `GET /api/notifications/count`.
5. Add a `NotificationBackgroundService` that generates sample notifications periodically for demo purposes.
6. Add unit and integration tests.

### Phase 1: Angular — @hexguard/angular-notification-inbox

7. Scaffold the Angular library.
8. Define TypeScript types mirroring .NET contracts.
9. Implement `injectNotificationInbox()` with polling (configurable interval, default 30s) and signals for notifications, unreadCount, isLoading.
10. Implement `markRead()`, `markAllRead()` with PATCH calls and local signal updates.
11. Implement `navigateTo()` — extracts deep-link URL and calls `router.navigateByUrl()`.
12. Implement new-notification toast bridge: when a new notification arrives via polling, optionally push to `@hexguard/angular-notifications` for real-time toast display.
13. Add unit tests for: polling cycle, read/unread tracking, count badge updates, SSE reception, deep-link navigation, empty state, error handling, and cleanup.

### Phase 2: Demo & Docs

14. Add a demo route at `/packages/angular-notification-inbox` with a bell icon, notification dropdown, and read/unread actions.
15. Add .NET endpoint group to `HexGuard.SampleApi`.
16. Add Playwright coverage.
17. Write deep-dive docs.
18. Update READMEs.

### Phase 3: Release

19. Add build/test/verify scripts.
20. Add release workflows.
21. Run full validation gates.

## Validation

- `pnpm dotnet:test` — .NET tests.
- `pnpm test:lib:notification-inbox` — Angular tests.
- `pnpm build:lib` — builds.
- `pnpm test:e2e` — Playwright.
- `pnpm dotnet:build` — .NET builds.

## Follow-Ups

- Revisit SSE push as an alternative to polling for lower-latency notification delivery.
- Evaluate notification preference storage (which notification types the user wants) as a companion package.
- Consider group/stack notifications by type for high-volume scenarios.
