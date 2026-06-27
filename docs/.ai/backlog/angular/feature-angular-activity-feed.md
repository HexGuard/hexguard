---
id: feature-angular-activity-feed
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-activity-feed'
---

# @hexguard/angular-activity-feed

## Summary

Headless activity/event feed state — aggregated timeline of user and system events with grouping, filtering, and real-time insertion. For social feeds, audit timelines, notification histories, and dashboard activity widgets.

## Goals

- Signal-based activity event list with pagination and cursor-based loading
- Event grouping (by date, user, type) with collapsible groups
- Real-time event insertion at the top of the feed
- Filter by event type, actor, date range
- Mark-as-read tracking per event
- WebSocket/SSE adapter for live updates

## Non-Goals

- No rendered feed UI components
- No push notification delivery (that's `@hexguard/angular-notifications`)
- No persistence (delegates to storage or server)

## Proposed Public API

```typescript
export function injectActivityFeed(config: {
  endpoint: string;
  grouping?: 'date' | 'actor' | 'type' | 'none';
  live?: { transport: 'sse' | 'websocket'; url: string };
}): {
  readonly events: Signal<ActivityEvent[]>;
  readonly groups: Signal<ActivityGroup[]>;
  readonly filters: Signal<ActivityFilters>;
  readonly unreadCount: Signal<number>;
  readonly isLoading: Signal<boolean>;
  readonly hasMore: Signal<boolean>;
  setFilters(f: Partial<ActivityFilters>): void;
  loadMore(): Promise<void>;
  markRead(eventId: string): void;
  markAllRead(): void;
  refresh(): Promise<void>;
};

export interface ActivityEvent {
  id: string;
  type: string;
  actor: { id: string; name: string; avatar?: string };
  target?: { type: string; id: string; label: string };
  summary: string;
  timestamp: Date;
  isRead: boolean;
  metadata?: Record<string, unknown>;
}

export interface ActivityFilters {
  types: string[];
  actorId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ActivityGroup {
  key: string;
  label: string;
  events: ActivityEvent[];
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-activity-feed/`.
2. Implement event list, grouping, filtering, pagination with signals.
3. Add SSE/WebSocket live adapter.
4. Add tests for all operations including live insertion.
5. Register in workspace, add demo page.
