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

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pollInterval` | `number` | required | Interval in ms between successive polls |
| `fetcher` | `() => Promise<T>` | required | Async function fetching current data |
| `staleAfter` | `number` | `pollInterval * 2` | Ms after which data is considered stale |
| `retryConfig` | `RetryConfig` | `{maxRetries:3, baseDelayMs:1000, maxDelayMs:30000}` | Retry on fetch failure |
| `visibilityAware` | `boolean` | `true` | Auto-pause when tab hidden |

### `LiveDataHandle<T>`

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Signal<T \| undefined>` | Latest fetched value |
| `stale` | `Signal<boolean>` | True if no success within `staleAfter` |
| `loading` | `Signal<boolean>` | True while fetch is in progress |
| `error` | `Signal<unknown>` | Last fetch error |
| `isPaused` | `Signal<boolean>` | True if polling is paused |
| `pause()` | `() => void` | Pause polling |
| `resume()` | `() => void` | Resume polling, triggers immediate fetch |
| `refresh()` | `() => Promise<void>` | Trigger immediate fetch |

### `RetryConfig`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `maxRetries` | `number` | `3` | Max consecutive retry attempts |
| `baseDelayMs` | `number` | `1_000` | Base delay for first retry (doubles each attempt) |
| `maxDelayMs` | `number` | `30_000` | Maximum delay cap |

---

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Periodic HTTP polling | ✅ |
| WebSocket/SSE subscriptions | ❌ (planned) |
| Offline queue | ❌ |
| Data transformation | ❌ (handle externally) |

## Demo

Visit `/packages/angular-live-data/demo` in the demo app to see a live KPI dashboard with pause/resume controls, stale badge, and error recovery.
