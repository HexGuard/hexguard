# @hexguard/angular-navigation-pending

**Route transition busy state for Angular.** Signal-based `isNavigating` and `isSlowNavigation` indicators with configurable delay threshold and route-scoped mode — no RxJS required.

**[Deep package notes](docs/packages/angular-navigation-pending.md)** · **[Demo](/packages/angular-navigation-pending/demo)**

---

## Problem

When users navigate between routes, Angular loads new data, resolves guards, and boots components. During this time the UI appears unresponsive — users may click again or think the app is broken. Showing a loading indicator on every navigation (even fast ones < 200ms) causes distracting flashes. Pages with complex initialization need to delay the "ready" signal until their data loads.

**`@hexguard/angular-navigation-pending`** provides a signal-based navigation busy state with a configurable delay threshold to prevent spinner flash, plus route-scoped mode for page-level readiness signals.

## Installation

```bash
pnpm add @hexguard/angular-navigation-pending
```

## Quickstart

```typescript
import { injectNavigationPending } from '@hexguard/angular-navigation-pending';

@Component({...})
class AppComponent {
  private readonly nav = injectNavigationPending({ delayedIndicatorMs: 200 });

  readonly isNavigating = this.nav.isNavigating;          // Signal<boolean>
  readonly isSlowNavigation = this.nav.isSlowNavigation;  // Signal<boolean> — after 200ms
}
```

## Use Cases

### App-level navigation spinner (no flash on fast transitions)

```html
@if (nav.isSlowNavigation()) {
<div class="loading-bar">Loading…</div>
}
```

### Page-level readiness with route-scoped mode

```typescript
// In the routed component:
const nav = injectNavigationPending({ routeScoped: true, delayedIndicatorMs: 300 });

async ngOnInit() {
  await this.loadDashboardData();
  nav.markReady(); // Hide spinner once data is ready
}
```

## API

### `injectNavigationPending(options?)`

| Option               | Type      | Default | Description                                                |
| -------------------- | --------- | ------- | ---------------------------------------------------------- |
| `delayedIndicatorMs` | `number`  | `200`   | Delay before `isSlowNavigation` activates. `0` = immediate |
| `routeScoped`        | `boolean` | `false` | Enable manual `markReady()` for page-level readiness       |

### `NavigationPendingState`

| Member             | Type              | Description                                                   |
| ------------------ | ----------------- | ------------------------------------------------------------- |
| `isNavigating`     | `Signal<boolean>` | True during any route transition                              |
| `isSlowNavigation` | `Signal<boolean>` | True only after `delayedIndicatorMs` of continuous navigation |
| `markReady()`      | `() => void`      | Signals page readiness (route-scoped mode only)               |

## Scope Boundaries

| Concern                                 | Status                                   |
| --------------------------------------- | ---------------------------------------- |
| App-level route transition busy state   | ✅                                       |
| Slow-navigation detection with debounce | ✅                                       |
| Route-scoped readiness control          | ✅                                       |
| Route resolvers or data loading         | ❌ (use `@hexguard/angular-async-state`) |
| Skeleton/spinner components             | ❌ (headless — compose your own UI)      |

## Demo

Visit `/packages/angular-navigation-pending/demo` for navigation transitions with slow/fast simulation and route-scoped control.
