---
id: feature-activity-feed-cross-stack
type: feature
status: proposed
created: 2026-06-26
package: 'HexGuard.ActivityFeed + @hexguard/angular-activity-feed'
---

# Activity Feed Cross-Stack Package Pair

## Summary

A coordinated .NET + Angular package pair for user activity feeds — the .NET side captures user actions (created, updated, deleted, commented) and stores them as activity entries; the Angular side provides an infinite-scroll activity feed with real-time updates, entity type/action filtering, and grouping.

## Why Wide Adoption

Activity feeds ("what's new", "recent activity", "changelog") appear in virtually every collaborative app: project management, CRM, document collaboration, support ticketing, code repositories. Every team builds the same capture → store → query → display pipeline.

## Goals

### .NET (`HexGuard.ActivityFeed`)

1. Provide `IActivityStore` for recording and querying activity entries.
2. Support activity types: created, updated, deleted, commented, status-changed, assigned, etc.
3. Support entity-typed activities (e.g., "John updated task PROJ-42").
4. Provide query API with filtering (entity type, action, user, date range) and cursor-based pagination.
5. Provide EF Core store implementation.

### Angular (`@hexguard/angular-activity-feed`)

1. Provide `injectActivityFeed()` — infinite-scroll feed with filtering and real-time updates.
2. Expose signals: `entries`, `isLoading`, `hasMore`, `filter`, `unreadCount`.
3. Support entity type and action filtering.
4. Support real-time updates via optional push transport.

## Proposed Public API

### .NET

```csharp
public sealed record ActivityEntry
{
    public string Id { get; init; }
    public string ActorId { get; init; }
    public string ActorName { get; init; }
    public string Action { get; init; }           // "created", "updated", "deleted"
    public string EntityType { get; init; }       // "task", "project", "comment"
    public string EntityId { get; init; }
    public string? EntityLabel { get; init; }     // Display name of the entity
    public string? Summary { get; init; }         // Human-readable description
    public DateTime Timestamp { get; init; }
    public Dictionary<string, string>? Metadata { get; init; }
}

public interface IActivityStore
{
    Task RecordAsync(ActivityEntry entry, CancellationToken ct);
    Task<ActivityFeedResponse> QueryAsync(ActivityFeedQuery query, CancellationToken ct);
}
```

### Angular

```typescript
export function injectActivityFeed(config: {
  endpoint: string;
  pageSize?: number;
  realtime?: { transport: 'websocket' | 'polling'; url: string };
}): {
  readonly entries: Signal<ActivityEntry[]>;
  readonly isLoading: Signal<boolean>;
  readonly hasMore: Signal<boolean>;
  readonly unreadCount: Signal<number>;
  readonly filter: Signal<ActivityFilter>;

  loadMore(): Promise<void>;
  refresh(): Promise<void>;
  setFilter(filter: Partial<ActivityFilter>): void;
  markAllRead(): void;
};
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ActivityFeed/` with standard `.csproj`.
2. Implement `ActivityEntry` model and `IActivityStore` interface.
3. Create Angular package with `injectActivityFeed()`.
4. Add tests on both sides.
5. Register both packages.
