---
id: feature-notification-preferences-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.NotificationPreferences + @hexguard/angular-notification-prefs'
---

# Notification Preferences Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for notification channel preferences — the .NET side stores per-user notification preferences (which event types → which channels), the Angular side provides preference editing state with dirty tracking and save. Different from `@hexguard/angular-notifications` (toast queue) and `HexGuard.PushNotifications` (Web Push sending), this is about **preference management** — what notifications you want and how you want to receive them.

## Why Wide Adoption

Every SaaS app with notifications needs a "Notification Settings" page where users choose: "Send me email when someone mentions me", "Push notification when task is assigned", "In-app toast when comment is added". Every team rebuilds the same preference data model and save/load pattern.

## Goals

### .NET (`HexGuard.NotificationPreferences`)

1. Provide preference model: event type → channels (in-app, email, push, sms).
2. Provide `INotificationPreferenceStore` for loading/saving preferences per user.
3. Provide sensible defaults per event type.
4. Provide bulk update API.

### Angular (`@hexguard/angular-notification-prefs`)

1. Provide `injectNotificationPrefs()` — preference editing state.
2. Expose signals: `preferences`, `isLoading`, `hasChanges`, `isSaving`.
3. Provide `setChannels(eventType, channels)` and `save()`.
4. Support grouping by category (e.g., "Tasks", "Comments", "Admin").

## Proposed Public API

### .NET

```csharp
public sealed record NotificationPreference
{
    public string EventType { get; init; }     // "comment.mention", "task.assigned"
    public string Category { get; init; }      // "comments", "tasks", "admin"
    public bool InApp { get; init; }
    public bool Email { get; init; }
    public bool Push { get; init; }
    public bool Sms { get; init; }
}

public interface INotificationPreferenceStore
{
    Task<IReadOnlyList<NotificationPreference>> GetAsync(string userId, CancellationToken ct);
    Task SetAsync(string userId, NotificationPreference pref, CancellationToken ct);
    Task SetBulkAsync(string userId, IReadOnlyList<NotificationPreference> prefs, CancellationToken ct);
}
```

### Angular

```typescript
export type NotificationChannel = 'inApp' | 'email' | 'push' | 'sms';

export function injectNotificationPrefs(config: {
  endpoint: string;
}): {
  readonly preferences: Signal<NotificationPreference[]>;
  readonly groupedByCategory: Signal<Record<string, NotificationPreference[]>>;
  readonly isLoading: Signal<boolean>;
  readonly isSaving: Signal<boolean>;
  readonly hasChanges: Signal<boolean>;
  readonly error: Signal<string | null>;

  getPref(eventType: string): Signal<NotificationPreference | undefined>;
  setChannel(eventType: string, channel: NotificationChannel, enabled: boolean): void;
  setChannels(eventType: string, channels: Partial<Record<NotificationChannel, boolean>>): void;
  save(): Promise<void>;
  reset(): void;
};
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.NotificationPreferences/` with standard `.csproj`.
2. Implement `NotificationPreference` model and `INotificationPreferenceStore`.
3. Create Angular package with `injectNotificationPrefs()`.
4. Add tests on both sides.
5. Register both packages.
