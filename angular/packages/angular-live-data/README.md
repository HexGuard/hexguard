# @hexguard/angular-live-data
Visibility-aware polling for Angular: configurable refresh cadence, stale indicators, pause-on-hidden, and retry with backoff.

## Installation
```bash
pnpm add @hexguard/angular-live-data
```

## Quickstart
```ts
const live = injectLiveData({
  pollInterval: 30_000,
  fetcher: () => fetch('/api/metrics').then(r => r.json()),
});

live.data();        // Signal<T | undefined>
live.loading();     // Signal<boolean>
live.stale();       // Signal<boolean>
live.refresh();     // manual refresh
live.pause();       // pause polling
live.resume();      // resume polling
```
