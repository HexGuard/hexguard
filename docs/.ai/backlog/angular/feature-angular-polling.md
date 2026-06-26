---
id: feature-angular-polling
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-polling'
---

# @hexguard/angular-polling'

## Summary

Lightweight polling state for Angular — poll a callback on a configurable interval with auto-pause on tab hidden, consecutive error tracking, and manual tick control. Lower-level than `@hexguard/angular-live-data` (which adds stale detection, manual refresh triggers, and visibility-aware pause on top of polling). This is the pure polling primitive: interval → tick → wait → repeat.

**Relationship to `angular-live-data`:** `live-data` is a higher-level abstraction (polling + stale-while-revalidate + manual refresh). `angular-polling` is the underlying polling engine — useful when you just need "call this function every N seconds."

## Competition Check

No standalone Angular polling package exists. Apps either use `setInterval` directly or pull in `angular-live-data` for what might be a simpler polling need.

## Why Wide Adoption

Polling is everywhere: auto-refresh dashboards, check notification count, sync status indicators, update currency rates, refresh auth tokens before expiry, check job completion status. Many of these are simpler than `live-data` — they don't need stale detection or refresh triggers.

## Goals

1. Provide `injectPolling()` — polling state with configurable interval and tick callback.
2. Support auto-pause when browser tab is hidden (via `document.visibilityState`).
3. Track consecutive error count — stop after `maxRetries` consecutive failures.
4. Expose signals: `isPolling`, `isPaused`, `tickCount`, `lastSuccess`, `consecutiveErrors`.
5. Support manual immediate tick.
6. Auto-cleanup on destroy.

## Proposed Public API

```typescript
export interface PollingConfig {
  interval: number | Signal<number>;        // ms between ticks
  onTick: () => Promise<void>;              // The polling function
  autoStopOnHidden?: boolean;               // Pause when tab hidden (default: true)
  maxRetries?: number;                      // Stop after N consecutive errors (default: Infinity)
  onError?: (error: unknown) => void;
}

export interface PollingState {
  readonly isPolling: Signal<boolean>;
  readonly isPaused: Signal<boolean>;
  readonly tickCount: Signal<number>;
  readonly lastSuccess: Signal<Date | null>;
  readonly lastTick: Signal<Date | null>;
  readonly consecutiveErrors: Signal<number>;

  start(): void;
  stop(): void;
  pause(): void;
  resume(): void;
  tick(): Promise<void>;                   // Manual immediate tick
}

export function injectPolling(config: PollingConfig): PollingState;

// Usage
const poller = injectPolling({
  interval: 10_000,
  onTick: () => checkNotificationCount(),
  onError: (err) => console.warn('Poll failed', err),
});

// Start polling
poller.start();

// Later, manual refresh
await poller.tick();
```

## Implementation Plan

1. Scaffold `angular/packages/angular-polling/`.
2. Implement `injectPolling()` with `setInterval`-based tick loop.
3. Implement `autoStopOnHidden` via `document.visibilityState` listener.
4. Implement consecutive error tracking and `maxRetries` stop.
5. Add cleanup via `DestroyRef`.
6. Add tests: polling ticks, pause/resume, tab hidden, error tracking, manual tick.
7. Register in workspace.
