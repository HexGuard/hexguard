# Changelog

## 0.1.0 — 2026-06-22

Initial release of `@hexguard/angular-live-data`.

### Features

- `injectLiveData()` — visibility-aware polling with configurable cadence
- `value`, `isLoading`, `isStale`, `lastRefreshed`, `error` signals
- `refresh()`, `pause()`, `resume()` imperative controls
- `pauseWhenHidden` option using document.visibilityState
- Retry with exponential backoff
