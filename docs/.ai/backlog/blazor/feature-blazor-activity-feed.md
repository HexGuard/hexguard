---
id: feature-blazor-activity-feed
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.ActivityFeed
---

# HexGuard.Blazor.ActivityFeed

## Summary

Activity feed state for Blazor — infinite-scroll list of user activity entries with filtering by entity type/action, real-time updates, and grouping. Pairs with `HexGuard.ActivityFeed` on the backend.

**Angular counterpart:** `@hexguard/angular-activity-feed`

**Competition check:** Zero Blazor activity feed packages exist.

## Why Wide Adoption

Activity feeds ("recent activity", "what's new") appear in every collaborative app: project changes, document edits, status updates, comment activity.

## Goals

1. Provide `ActivityFeedService` — infinite-scroll feed with paging, filtering, and real-time updates.
2. Support entity type, action, user, and date range filters.
3. Support grouping by time (Today, Yesterday, This Week, Earlier).
4. Support real-time push updates via SignalR.
5. Expose `OnChanged` and `OnNewEntry` events.

## Proposed Public API

```csharp
public sealed record ActivityFilter
{
    public string? EntityType { get; init; }
    public string? Action { get; init; }
    public string? UserId { get; init; }
    public DateTime? DateFrom { get; init; }
    public DateTime? DateTo { get; init; }
}

public sealed class ActivityFeedService : IDisposable
{
    public IReadOnlyList<ActivityEntry> Entries { get; private set; }
    public bool IsLoading { get; private set; }
    public bool HasMore { get; private set; }
    public int UnreadCount { get; private set; }
    public event Action? OnChanged;

    public Task LoadMoreAsync();
    public Task RefreshAsync();
    public void SetFilter(ActivityFilter filter);
    public void MarkAllRead();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.ActivityFeed/` Razor class library.
2. Implement `ActivityFeedService` with API client and pagination.
3. Implement real-time push via SignalR hub connection.
4. Test with bUnit.
5. Publish as NuGet.
