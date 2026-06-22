# @hexguard/angular-live-data

**Reactive polling with visibility awareness.** Provides `injectLiveData()` — a signal-based factory that periodically invokes an async fetcher, automatically pauses when the tab is hidden, detects stale data, and retries with exponential backoff.

---

## Installation

```bash
pnpm add @hexguard/angular-live-data
```

## Quick Start

```typescript
import { injectLiveData } from '@hexguard/angular-live-data';

@Component({ ... })
class DashboardComponent {
  readonly live = injectLiveData({
    pollInterval: 15_000,
    fetcher: () => fetch('/api/dashboard/stats').then(r => r.json()),
  });

  // In template:
  // {{ live.data() }}
  // @if (live.loading()) { ... }
  // @if (live.stale()) { ... }
}
```

## API

### `injectLiveData<T>(options: LiveDataOptions<T>): LiveDataHandle<T>`

Creates a reactive live-data polling handle. Must be called in an injection context.

### `LiveDataOptions<T>`

| Option            | Type               | Default                                              | Description                             |
| ----------------- | ------------------ | ---------------------------------------------------- | --------------------------------------- |
| `pollInterval`    | `number`           | required                                             | Interval in ms between successive polls |
| `fetcher`         | `() => Promise<T>` | required                                             | Async function fetching current data    |
| `staleAfter`      | `number`           | `pollInterval * 2`                                   | Ms after which data is considered stale |
| `retryConfig`     | `RetryConfig`      | `{maxRetries:3, baseDelayMs:1000, maxDelayMs:30000}` | Retry on fetch failure                  |
| `visibilityAware` | `boolean`          | `true`                                               | Auto-pause when tab hidden              |

### `LiveDataHandle<T>`

| Property    | Type                     | Description                              |
| ----------- | ------------------------ | ---------------------------------------- |
| `data`      | `Signal<T \| undefined>` | Latest fetched value                     |
| `stale`     | `Signal<boolean>`        | True if no success within `staleAfter`   |
| `loading`   | `Signal<boolean>`        | True while fetch is in progress          |
| `error`     | `Signal<unknown>`        | Last fetch error                         |
| `isPaused`  | `Signal<boolean>`        | True if polling is paused                |
| `pause()`   | `() => void`             | Pause polling                            |
| `resume()`  | `() => void`             | Resume polling, triggers immediate fetch |
| `refresh()` | `() => Promise<void>`    | Trigger immediate fetch                  |

### `RetryConfig`

| Property      | Type     | Default  | Description                                       |
| ------------- | -------- | -------- | ------------------------------------------------- |
| `maxRetries`  | `number` | `3`      | Max consecutive retry attempts                    |
| `baseDelayMs` | `number` | `1_000`  | Base delay for first retry (doubles each attempt) |
| `maxDelayMs`  | `number` | `30_000` | Maximum delay cap                                 |

---

## Scope Boundaries

| Concern                     | Status                 |
| --------------------------- | ---------------------- |
| Periodic HTTP polling       | ✅                     |
| WebSocket/SSE subscriptions | ❌ (planned)           |
| Offline queue               | ❌                     |
| Data transformation         | ❌ (handle externally) |

## Demo

Visit `/packages/angular-live-data/demo` in the demo app to see a live KPI dashboard with pause/resume controls, stale badge, and error recovery.

---

## Assessment: Potential Improvements

| Area            | Suggestion                                                                                                                                                       | Priority |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| API             | The `error` signal is typed as `Signal<unknown>` — consider a discriminated union `{ type: 'network' \| 'parse', message: string }`                              | Low      |
| API             | Consider adding a configurable `onError` callback for side-effects (logging, toast)                                                                              | Low      |
| API             | Consider an `initialFetch` option to skip the immediate first fetch (useful when data is provided externally)                                                    | Low      |
| API             | `refresh()` awaits the fetch, but consumers may want to know when the refresh completes — currently returns `Promise<void>` but the resolved data isn't returned | Low      |
| Stale Detection | Uses a 1-second interval accumulator — consider using `Date.now()` with a `computed()` that re-evaluates via a periodic signal update for cleaner reactivity     | Low      |
| WebSocket/SSE   | The README scope boundaries note WebSocket/SSE as planned — consider an `injectLiveStream()` companion for push-based data                                       | Medium   |

---

## API Review Findings

Review date: 2026-06-22. Findings are observational — no code has been changed.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                           | Severity |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Clean, focused API — 1 function (`injectLiveData()`), 3 interfaces, 1 constant. No internal helpers leaked.                                                                                                       | praise   |
| Public API Design         | `injectLiveData()` has JSDoc with two `@example` blocks. `LiveDataOptions`, `LiveDataHandle`, `RetryConfig` have clear JSDoc.                                                                                     | praise   |
| Public API Design         | Error signal typed `Signal<unknown>` — inconsistent with sibling packages `async-state` and `optimistic-state` which use generic `TError`.                                                                        | moderate |
| Implementation Quality    | Signal-first: all state via `signal()`, exposed as `.asReadonly()`. No RxJS dependency.                                                                                                                           | praise   |
| Implementation Quality    | Visibility-aware polling with `document.visibilitychange` listener. Proper DestroyRef cleanup. SSR-safe via `typeof document !== 'undefined'` guard.                                                              | praise   |
| Implementation Quality    | Exponential backoff retry: `baseDelayMs * 2^(consecutiveFailures-1)` capped at `maxDelayMs`. Well implemented.                                                                                                    | praise   |
| Implementation Quality    | **No in-flight deduplication** — overlapping `setInterval` ticks while a fetch is pending can cause concurrent fetches. Should guard with `_pendingExecution` pattern per workflow instructions.                  | moderate |
| Implementation Quality    | `refresh()` silently no-ops when paused — `executeFetch()` checks `isPaused()` at entry, so a paused `refresh()` does nothing. May be intentional but undocumented.                                               | minor    |
| Implementation Quality    | Staleness detection uses 1-second `setInterval` accumulator rather than a more reactive approach — functional but slightly imprecise.                                                                             | minor    |
| Documentation             | README covers problem statement, quickstart, full API tables, scope boundaries, demo link.                                                                                                                        | praise   |
| Documentation             | Deep-dive doc has a thorough "Assessment: Potential Improvements" with 7 prioritized suggestions.                                                                                                                 | praise   |
| Test Coverage             | 12 tests covering: initial state, first fetch success, data updates on poll, stale detection, stale→fresh transition, fetch failure, retry recovery, pause/resume, refresh, DestroyRef cleanup, retry exhaustion. | praise   |
| Test Coverage             | Not tested: `visibilityAware` option (no `document.hidden` mock), in-flight deduplication, `staleAfter` custom value, `refresh()` while paused, SSR guard, zero retries, overlapping fast polls.                  | moderate |
| Demo Integration          | Interactive demo with healthy/failing polling instances, pause/resume controls, live inspector snapshots.                                                                                                         | praise   |
| Demo Integration          | No Playwright E2E tests for the live-data demo page.                                                                                                                                                              | minor    |
| Cross-package Consistency | Uses `inject*()` pattern (like `angular-pagination`, `angular-storage`) rather than headless-state factory — appropriate since it needs `DestroyRef` and `inject()` for lifecycle.                                | praise   |
| Cross-package Consistency | No outlet component (unlike `async-state` and `optimistic-state`). Justified — simpler pattern without template branching needs.                                                                                  | praise   |
| Cross-package Consistency | Build scripts, release workflow, angular.json registration, catalog entry all present and correct. Scope boundaries table slightly differs between README and deep-dive doc.                                      | minor    |

### Improvement & Extension Opportunities

| Area          | Suggestion                                                                                                        | Type        | Difficulty |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | ----------- | ---------- |
| API           | Add generic `TError` parameter to `injectLiveData<T, TE = unknown>` for consistency with sibling packages.        | improvement | easy       |
| Robustness    | Add in-flight deduplication guard (`_pendingExecution` pattern) to prevent overlapping fetches on slow responses. | improvement | medium     |
| Robustness    | Document `refresh()` no-op behavior when paused, or make `refresh()` bypass pause state.                          | improvement | easy       |
| Tests         | Add `visibilityAware` test with `document.hidden` mock.                                                           | improvement | easy       |
| Tests         | Add in-flight deduplication test with slow fetcher.                                                               | improvement | medium     |
| Tests         | Add `refresh()` while paused test.                                                                                | improvement | easy       |
| Tests         | Add overlapping fast poll test.                                                                                   | improvement | easy       |
| Tests         | Add Playwright E2E test for live-data demo.                                                                       | improvement | medium     |
| Documentation | Sync scope boundaries table between README and deep-dive doc.                                                     | improvement | easy       |
| Extension     | WebSocket/SSE support via `injectLiveStream()` companion (noted as planned).                                      | extension   | hard       |
