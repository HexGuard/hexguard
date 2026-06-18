# `@hexguard/angular-network-status` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-network-status` provides signal-based connectivity monitoring for Angular apps. It bridges the browser's `navigator.onLine` and `window` `online`/`offline` events into reactive Angular signals.

## Feature Matrix

| Capability                       | Status    | Notes                                                         |
| -------------------------------- | --------- | ------------------------------------------------------------- |
| Online/offline signals           | Available | Reacts to browser `online`/`offline` events                   |
| Debounced offline→online transition | Available | Configurable debounce window (default 1000ms)               |
| Connection type detection        | Available | `navigator.connection.effectiveType` (Chromium only)          |
| `recentlyBackOnline` indicator   | Available | Configurable duration (default 3000ms)                        |
| `whenBackOnline()` promise       | Available | Resolves on next online transition; resolves immediately if already online |
| Automatic cleanup                | ✅        | Via `DestroyRef`                                              |
| Zero runtime dependencies        | ✅        | Only `@angular/core` + `tslib`                                |

## Public API Map

| Export                  | Kind     | Role                                                  |
| ----------------------- | -------- | ----------------------------------------------------- |
| `injectNetworkStatus()` | Function | Creates the network status signals and event listeners |
| `NetworkStatus`         | Type     | Return shape with signals and `whenBackOnline()`       |
| `NetworkStatusOptions`  | Type     | `{ onlineDebounceMs?, backOnlineSignalDurationMs? }`  |
| `EffectiveConnectionType` | Type   | `'slow-2g' \| '2g' \| '3g' \| '4g' \| 'unknown'`    |

## Behavior Details

### Online/Offline Detection

The package listens to `window` `online` and `offline` events:

- **Offline transition**: Immediate — `online` signal flips to `false` and `recentlyBackOnline` clears.
- **Online transition**: Debounced — the `online` signal only flips to `true` after a quiet period (`onlineDebounceMs`, default 1000ms) without an intervening offline event.

### Connection Type Detection

Uses the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation) (`navigator.connection.effectiveType`) available in Chromium-based browsers. The value is read on init and updated via the `change` event. When unavailable, `connectionType` defaults to `'unknown'`.

### `recentlyBackOnline` Lifecycle

1. `online` event fires → debounce timer starts
2. Debounce timer fires → `online` signal becomes `true`, `recentlyBackOnline` becomes `true`
3. After `backOnlineSignalDurationMs` (default 3000ms) → `recentlyBackOnline` reverts to `false`
4. If an offline event fires before step 2 → `recentlyBackOnline` clears and the cycle restarts

### `whenBackOnline()` Promise

- If currently online → resolves immediately
- If currently offline → returns a promise that resolves on the next debounced online transition
- Only the most recent caller's promise is tracked — multiple concurrent calls share the same resolution

## Edge Cases

| Scenario                          | Behavior                                                        |
| --------------------------------- | --------------------------------------------------------------- |
| Browser doesn't support `online`/`offline` events | `online` signal stays at its initial value (`navigator.onLine`) |
| Private browsing without localStorage | Not applicable — this package does not use storage           |
| Rapid online/offline toggling     | Debounce prevents flickering; trailing offline always wins      |
| Multiple `whenBackOnline()` calls | Only the most recent promise is tracked; earlier promises never resolve |
| DestroyRef cleanup                | All event listeners and pending timers are cleaned up           |

## DOM Dependency

This package requires the `window` and `navigator` globals. In SSR environments where these are not available, the package degrades gracefully:
- `online` signal initializes to `true`
- `connectionType` signal initializes to `'unknown'`
- No event listeners are registered
- `whenBackOnline()` returns a resolved promise

## Test Coverage

Tests use `vi.useFakeTimers()` and mock `window`/`navigator` globals via `Object.defineProperty`. Covered scenarios:

- Initial state: online true, online false
- Offline transition: immediate
- Online transition: debounce window respected
- `recentlyBackOnline`: lifecycle with configurable duration
- Interrupted online transition: offline during debounce
- Connection type: initial value, change event, missing API
- `whenBackOnline()`: immediate resolution, deferred resolution
