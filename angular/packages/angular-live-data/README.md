# @hexguard/angular-live-data
Visibility-aware polling for Angular: configurable refresh cadence, stale indicators, pause-on-hidden, and retry with backoff.

## Installation
```bash
pnpm add @hexguard/angular-live-data
```

## Quickstart
```ts
const live = injectLiveData({
  fetch: () => fetch('/api/metrics').then(r => r.json()),
  intervalMs: 30_000,
  staleAfterMs: 60_000,
});

live.value;         // Signal<T | null>
live.isLoading;     // Signal<boolean>
live.isStale;       // Signal<boolean>
live.refresh();     // manual refresh
live.pause();       // pause polling
live.resume();      // resume polling
```
