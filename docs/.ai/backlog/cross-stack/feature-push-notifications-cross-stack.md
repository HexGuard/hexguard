---
id: feature-push-notifications-cross-stack
type: feature
status: proposed
created: 2026-06-25
package: 'HexGuard.PushNotifications + @hexguard/angular-push-notifications'
---

# Push Notifications Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair (`HexGuard.PushNotifications` + `@hexguard/angular-push-notifications`) for Web Push notification subscription management, server-side push sending with VAPID authentication, and Angular-side push notification state with permission tracking and subscription lifecycle.

**Promoted from sidenote** to a full planned cross-stack brief.

## Why Wide Adoption

Web Push is the standard way to re-engage users outside the browser tab: notify of new messages, alerts, updates, and reminders. Every SaaS app with any engagement model needs push notifications. The Web Push API stack is complex (VAPID keys, Service Workers, Push API, Notification API) — teams spend days wiring it up.

## Goals

### .NET (`HexGuard.PushNotifications`)

1. Provide VAPID key pair generation and management.
2. Provide `PushSubscriptionStore` — stores/retrieves user push subscriptions (EF Core optional).
3. Provide `PushNotificationSender` — sends push messages via Web Push protocol (RFC 8292).
4. Support single and batch notification sending.
5. Support notification payload with title, body, icon, data, actions.

### Angular (`@hexguard/angular-push-notifications`)

1. Provide `injectPushNotifications()` — permission state, subscription lifecycle, and notification handling.
2. Expose signals: `permission`, `isSubscribed`, `subscription`, `supported`, `lastNotification`.
3. Provide `subscribe()` / `unsubscribe()` methods.
4. Handle incoming notifications in the Service Worker and route click events to the app.
5. Support notification permission request timing (not on load — on user gesture).

## Non-Goals

- No Service Worker generation (consumer provides their own `sw.js`; the package provides the install/activate/push event listeners to merge into it).
- No analytics or delivery tracking.

## Decisions

1. **VAPID required**: All push notifications use VAPID (Voluntary Application Server Identification) for security.
2. **Angular Service Worker**: Integrates with `@angular/service-worker` `SwPush` service where available, with a standalone fallback.
3. **Independent releases**: Server and client can version independently; contract is the Web Push API standard.

## Proposed API

### .NET — Server

```csharp
// ── VAPID Keys ───────────────────────────────────────────

public sealed record VapidKeys
{
    public string PublicKey { get; init; }
    public string PrivateKey { get; init; }
}

public static class VapidKeyGenerator
{
    public static VapidKeys Generate();
}

// ── Subscription Store ───────────────────────────────────

public interface IPushSubscriptionStore
{
    Task SaveSubscriptionAsync(PushSubscription subscription, string userId);
    Task RemoveSubscriptionAsync(string endpoint);
    Task<IReadOnlyList<PushSubscription>> GetSubscriptionsAsync(string userId);
    Task<IReadOnlyList<PushSubscription>> GetAllSubscriptionsAsync();
}

// ── Push Sender ──────────────────────────────────────────

public sealed record NotificationPayload
{
    public required string Title { get; init; }
    public string? Body { get; init; }
    public string? Icon { get; init; }
    public string? Image { get; init; }
    public string? Badge { get; init; }
    public string? Data { get; init; }        // JSON string
    public NotificationAction[]? Actions { get; init; }
}

public sealed record NotificationAction
{
    public required string Action { get; init; }
    public required string Title { get; init; }
}

public sealed class PushNotificationSender
{
    public PushNotificationSender(VapidKeys keys);
    public Task<SendResult> SendAsync(PushSubscription subscription, NotificationPayload payload);
    public Task<IReadOnlyList<SendResult>> SendBatchAsync(
        IReadOnlyList<PushSubscription> subscriptions, NotificationPayload payload);
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddPushNotifications(vapidKeys);
```

### Angular — Client

```typescript
// ── Types ─────────────────────────────────────────────────

export type NotificationPermission = 'granted' | 'denied' | 'default';

export interface PushNotificationState {
  readonly permission: Signal<NotificationPermission>;
  readonly isSubscribed: Signal<boolean>;
  readonly subscription: Signal<PushSubscriptionJSON | null>;
  readonly supported: Signal<boolean>;
  readonly lastNotification: Signal<NotificationEvent | null>;

  /** Request permission (call on user gesture, not on load) */
  requestPermission(): Promise<NotificationPermission>;

  /** Subscribe to push notifications */
  subscribe(serverPublicKey: string): Promise<void>;

  /** Unsubscribe */
  unsubscribe(): Promise<void>;
}

// ── Factory ───────────────────────────────────────────────

export function injectPushNotifications(
  options?: { serviceWorkerUrl?: string }
): PushNotificationState;
```

## Implementation Plan

### .NET

1. Create `dotnet/src/HexGuard.PushNotifications/` with standard `.csproj`.
2. Implement VAPID key generation and signing.
3. Implement `PushNotificationSender` with Web Push protocol support.
4. Implement `IPushSubscriptionStore` interface with in-memory default.
5. Create test project with xUnit.
6. Register in `HexGuard.slnx`.
7. Publish as NuGet package `HexGuard.PushNotifications`.

### Angular

1. Scaffold `angular/packages/angular-push-notifications/` following the standard pattern.
2. Implement `injectPushNotifications()` with permission state and subscription lifecycle.
3. Implement Service Worker message handling for click events.
4. Add tests: permission states, subscribe/unsubscribe flow, error handling.
5. Create demo page.
6. Register in workspace, build scripts, and catalog.
