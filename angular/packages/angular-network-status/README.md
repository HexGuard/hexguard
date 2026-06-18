# @hexguard/angular-network-status

Signal-based connectivity monitoring for Angular — reactive online/offline state with debounced reconnection, connection-type detection, and `whenBackOnline()` composition.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-network-status.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-network-status
```

## Quickstart

```ts
import { injectNetworkStatus } from '@hexguard/angular-network-status';

@Component({ ... })
class MyComponent {
  private readonly network = injectNetworkStatus();

  // Reactive signals
  get online()            { return this.network.online(); }           // boolean
  get connectionType()    { return this.network.connectionType(); }  // "4g" | "3g" | ...
  get recentlyBackOnline(){ return this.network.recentlyBackOnline(); } // transient "just reconnected" flag

  // Promise-based helper for offline-aware workflows
  async saveWhenOnline(data: unknown): Promise<void> {
    if (!this.network.online()) {
      await this.network.whenBackOnline();
    }
    await this.save(data);
  }
}
```

## Features

| Feature                              | Status | Notes                                                |
| ------------------------------------ | ------ | ---------------------------------------------------- |
| Online/offline signals               | ✅     | Reacts to browser `online`/`offline` events          |
| Debounced offline→online transition  | ✅     | Configurable debounce window (default 1000ms)        |
| Connection type detection            | ✅     | `navigator.connection.effectiveType` (Chromium only)  |
| `recentlyBackOnline` indicator       | ✅     | Configurable duration (default 3000ms)               |
| `whenBackOnline()` promise           | ✅     | Resolves on next online transition                   |
| Automatic cleanup                    | ✅     | Via `DestroyRef`                                     |
| Zero runtime dependencies            | ✅     | Only `@angular/core` + `tslib`                       |

## Demo routes

| Route                                 | Description                                        |
| ------------------------------------- | -------------------------------------------------- |
| `/packages/angular-network-status`    | Package hub page with catalog overview             |
| `/packages/angular-network-status/demo` | Live connectivity monitor with inspector panel   |

## Public API

| Export                  | Kind     | Description                                          |
| ----------------------- | -------- | ---------------------------------------------------- |
| `injectNetworkStatus()` | Function | DI facade returning `NetworkStatus`                  |
| `NetworkStatus`         | Type     | Return shape with signals and `whenBackOnline()`     |
| `NetworkStatusOptions`  | Type     | `{ onlineDebounceMs?, backOnlineSignalDurationMs? }` |
| `EffectiveConnectionType` | Type   | Union type for connection speed                      |

## What It Owns

- Reactive online/offline state via browser events
- Connection-type detection where the Network Information API is available
- Debounced reconnection with a transient "recently back online" indicator
- Promise-based composition for offline-aware data submission

## What It Does Not Own

- Network Information API is Chromium-only; degrades to `'unknown'` elsewhere
- No network requests or fetch interception — this is connectivity state only
- No geolocation or bandwidth measurement
