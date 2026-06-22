# @hexguard/angular-live-data

**Visibility-aware polling for Angular.** Configurable refresh cadence, stale indicators, pause-on-hidden, and retry with backoff — no RxJS required.

**[Deep package notes](docs/packages/angular-live-data.md)** · **[Demo](/packages/angular-live-data/demo)**

---

## Problem

Dashboard KPIs, status indicators, and auto-refreshing data need periodic polling — but raw `setInterval` lacks integration with Angular's lifecycle, doesn't pause when the tab is hidden, and provides no stale detection or retry logic for transient failures.

**`@hexguard/angular-live-data`** provides a signal-based polling factory with auto-pause on tab hidden, stale data detection, and exponential-backoff retry.

## Installation

```bash
pnpm add @hexguard/angular-live-data
```

## Quickstart

```typescript
import { injectLiveData } from '@hexguard/angular-live-data';

const live = injectLiveData({
  pollInterval: 15_000,
  fetcher: () => fetch('/api/dashboard/stats').then((r) => r.json()),
});

live.data(); // Signal<T | undefined>
live.loading(); // Signal<boolean>
live.stale(); // Signal<boolean>
live.error(); // Signal<unknown>
live.pause(); // pause polling
live.resume(); // resume polling
live.refresh(); // immediate fetch
```

## Use Cases

### Dashboard with stale badge

```html
@if (live.stale()) {
<span class="badge badge--stale">Data may be outdated</span>
} @if (live.loading()) {
<span class="spinner"></span>
} @if (live.data(); as metrics) {
<kpi-card [value]="metrics.activeUsers" />
}
```

### Error recovery

```typescript
effect(() => {
  if (live.error()) {
    this.toast.show('Connection lost, retrying…');
  }
});
```

### Custom retry config

```typescript
const live = injectLiveData({
  pollInterval: 10_000,
  fetcher: () => api.fetch(),
  staleAfter: 30_000,
  retryConfig: { maxRetries: 5, baseDelayMs: 500, maxDelayMs: 10_000 },
});
```

## API

### `injectLiveData<T>(options)`

| Option            | Type               | Default                                              | Description                             |
| ----------------- | ------------------ | ---------------------------------------------------- | --------------------------------------- |
| `pollInterval`    | `number`           | required                                             | Polling interval in ms                  |
| `fetcher`         | `() => Promise<T>` | required                                             | Async data fetcher                      |
| `staleAfter`      | `number`           | `pollInterval * 2`                                   | Ms without success before data is stale |
| `retryConfig`     | `RetryConfig`      | `{maxRetries:3, baseDelayMs:1000, maxDelayMs:30000}` | Retry on failure                        |
| `visibilityAware` | `boolean`          | `true`                                               | Auto-pause when tab hidden              |

### `LiveDataHandle<T>`

| Signal                 | Type                     | Description                            |
| ---------------------- | ------------------------ | -------------------------------------- |
| `data`                 | `Signal<T \| undefined>` | Latest fetched value                   |
| `stale`                | `Signal<boolean>`        | True if no success within `staleAfter` |
| `loading`              | `Signal<boolean>`        | True while a fetch is in progress      |
| `error`                | `Signal<unknown>`        | Last fetch error                       |
| `isPaused`             | `Signal<boolean>`        | True if polling is paused              |
| `pause()` / `resume()` | `() => void`             | Toggle polling                         |
| `refresh()`            | `() => Promise<void>`    | Trigger immediate fetch                |

## Scope Boundaries

| Concern                        | Status                 |
| ------------------------------ | ---------------------- |
| Periodic HTTP polling          | ✅                     |
| Visibility-aware pause/resume  | ✅                     |
| Stale detection                | ✅                     |
| Retry with exponential backoff | ✅                     |
| WebSocket/SSE subscriptions    | ❌ (planned)           |
| Offline queue                  | ❌                     |
| Data transformation            | ❌ (handle externally) |

## Demo

Visit `/packages/angular-live-data/demo` for a live KPI dashboard with pause/resume controls, stale badge, and error recovery.
