# @hexguard/angular-navigation-pending

Route transition busy state for Angular: signal-based `isNavigating` and `isSlowNavigation` indicators with configurable delay threshold and route-scoped mode.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-navigation-pending.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-navigation-pending
# No RxJS dependency required
```

## Quickstart

```ts
import { injectNavigationPending } from '@hexguard/angular-navigation-pending';

@Component({ ... })
export class AppComponent {
  private readonly nav = injectNavigationPending({ delayedIndicatorMs: 200 });

  readonly isNavigating = this.nav.isNavigating;           // Signal<boolean>
  readonly isSlowNavigation = this.nav.isSlowNavigation;   // Signal<boolean>
}
```

## Features

| Feature                         | Status | Notes                                              |
| ------------------------------- | ------ | -------------------------------------------------- |
| App-level navigation state      | ✅     | Wraps Angular Router events                        |
| `isSlowNavigation` signal       | ✅     | True only after configurable delay threshold       |
| Route-scoped mode               | ✅     | Manual `markReady()` for page-level readiness       |
| Zero unnecessary flash          | ✅     | `delayedIndicatorMs` prevents flash-of-spinner     |
| Automatic cleanup               | ✅     | Via Angular `DestroyRef`                           |
| Zero extra dependencies         | ✅     | Only `@angular/core`, `@angular/router`, `tslib`   |

## Demo routes

| Route                                                         | Description                                                   |
| ------------------------------------------------------------- | ------------------------------------------------------------- |
| `/packages/angular-navigation-pending`                        | Navigation Pending package overview                            |
| `/packages/angular-navigation-pending/demo`                   | Navigation transitions with slow/fast simulation               |

## What It Owns

- One injectable for route transition pending state
- Configurable delay threshold to prevent spinner flash
- Route-scoped mode for page-level readiness control
- Automatic `DestroyRef` cleanup

## What It Does Not Own

- Route resolvers or data loading — that's async-state
- Skeleton loading or spinner components — headless only
- Scroll restoration or navigation memory — see route-memory

## API Reference

### `injectNavigationPending(options?)`

Creates a navigation pending handle.

**Parameters:**

- `options.delayedIndicatorMs?: number` — Delay before `isSlowNavigation` becomes true (default 200, 0 = immediate).
- `options.routeScoped?: boolean` — When true, enables manual `markReady()` control (default false).

**Returns:** `NavigationPendingState`

### `NavigationPendingState`

```ts
interface NavigationPendingState {
  readonly isNavigating: Signal<boolean>;
  readonly isSlowNavigation: Signal<boolean>;
  markReady(): void;
}
```
