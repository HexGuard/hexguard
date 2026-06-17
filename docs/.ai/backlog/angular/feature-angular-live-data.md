---
id: feature-angular-live-data
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-live-data'
---

# Angular Live Data Package

## Summary

Design `@hexguard/angular-live-data` as a package for standardizing visibility-aware polling,
refresh cadence, stale indicators, and refresh controls for dashboards and operational views.

The repeated problem is that apps rebuild their own polling loops, pause-on-hidden behavior,
refresh buttons, and stale-data indicators for every dashboard or queue screen.

## Goals

- Standardize live-data refresh behavior for Angular screens.
- Support polling, manual refresh, stale markers, and pause-on-hidden semantics.
- Compose with async-state rather than replacing it.
- Keep the first version transport-agnostic.

## Non-Goals

- A general cache or query library.
- WebSocket streaming abstractions in the first version.
- Replacing HTTP dedupe or resource-debug tooling.

## Decisions

- Prefer refresh orchestration over transport ownership.
- Keep visibility and cadence behavior explicit.
- Treat stale indicators and refresh state as first-class outputs.

## Proposed Public API

```ts
import { injectLiveData } from '@hexguard/angular-live-data';

const live = injectLiveData({
  fetch: () => fetch('/api/metrics'),
  intervalMs: 30_000,
  pauseWhenHidden: true,           // uses @hexguard/angular-visibility
  staleAfterMs: 60_000,
  retryPolicy: { maxRetries: 3, backoffMs: 1000 },
});

live.value;              // Signal<T | null>
live.isLoading;          // Signal<boolean>
live.isStale;            // Signal<boolean>
live.lastRefreshed;      // Signal<Date | null>
live.error;              // Signal<Error | null>

live.refresh();          // manual refresh
live.pause();            // pause polling
live.resume();           // resume polling
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-live-data/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Implement `injectLiveData()` with `setInterval`-based polling and `DestroyRef` cleanup.
4. Implement `pauseWhenHidden` via `document.visibilityState` (or optional `@hexguard/angular-visibility` peer).
5. Implement `isStale` — true if no refresh within `staleAfterMs`.
6. Implement retry with exponential backoff.
7. Implement `pause()`/`resume()`/`refresh()` controls.
8. Add unit tests for: polling cycle, pause/resume, hidden pause, stale detection, retry, error recovery, manual refresh, cleanup.

### Phase 2: Demo & Docs

9. Add demo route showing dashboard KPI cards with live updates, stale badge, pause button.
10. Add Playwright coverage.
11. Write docs.

### Phase 3: Release

12. Add verify script, release workflow.
13. Run validation gate.

## Validation

- `pnpm test:lib:live-data`.
- `pnpm test:e2e`.

## Validation

- Unit tests for cadence, pause, and stale-state behavior.
- Demo coverage for dashboard and operational refresh flows.
- Manual checks for visibility changes and navigation cleanup.

## Follow-Ups

- Revisit streaming or push-based data as a separate concern if polling proves too narrow.
- Compare overlap with HTTP dedupe once both contracts are clearer.
