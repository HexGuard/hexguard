---
id: feature-angular-navigation-pending
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-navigation-pending'
---

# Angular Navigation Pending Package

## Summary

Design `@hexguard/angular-navigation-pending` as a package for standardizing route transition busy
state, page readiness, and navigation-pending indicators in Angular apps.

Apps frequently rebuild inconsistent global loaders, route readiness spinners, and transition
pending markers, especially when resolvers, async page setup, or lazy route data are involved.

## Goals

- Standardize route transition busy and ready state.
- Support route-level and app-level pending indicators.
- Keep the package headless and UI-agnostic.
- Compose with async-state and route-memory patterns.

## Non-Goals

- Replacing Angular router events.
- A full skeleton-loading design system.
- Owning every page-level async concern.

## Decisions

- Prefer a headless navigation-state contract.
- Keep pending and ready semantics explicit.
- Avoid blending route transition state with data-fetching state too early.

## Proposed Public API

```ts
import { injectNavigationPending } from '@hexguard/angular-navigation-pending';

@Component({ ... })
export class AppComponent {
  private readonly nav = injectNavigationPending({
    delayedIndicatorMs: 200,          // wait 200ms before showing spinner
  });

  readonly isNavigating = this.nav.isNavigating;       // Signal<boolean>
  readonly isSlowNavigation = this.nav.isSlowNavigation; // Signal<boolean> â€” true only after delayedIndicatorMs
}

// Route-level usage
@Component({ ... })
export class MyPageComponent {
  private readonly pageNav = injectNavigationPending({ routeScoped: true });

  constructor() {
    // Mark page as ready when data loads
    effect(() => {
      if (data.isLoaded()) {
        this.pageNav.markReady();
      }
    });
  }
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-navigation-pending/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Implement `injectNavigationPending()` using Angular Router `NavigationStart`/`NavigationEnd`/`NavigationCancel`/`NavigationError` events.
4. Implement `isNavigating` signal bound to router events.
5. Implement `isSlowNavigation` with configurable delay threshold.
6. Implement route-scoped mode with `markReady()` for manual control.
7. Implement `delayedIndicatorMs` to prevent flash-of-spinner on fast transitions.
8. Add unit tests for: route start/end, delay threshold, route-scoped markReady, cancellation, error transitions, cleanup.

### Phase 2: Demo & Docs

9. Add demo showing global navigation bar with slow/fast route simulation.
10. Add Playwright coverage.
11. Write docs.

### Phase 3: Release

12. Add verify script, release workflow.
13. Run validation gate.

## Validation

- `pnpm test:lib:navigation-pending`.
- `pnpm test:e2e`.

## Validation

- Unit tests for route transition pending state.
- Demo coverage for global and route-local pending indicators.

## Follow-Ups

- Revisit integration with page-context and async-state once those packages are mature.
- Decide whether skeleton-oriented helpers belong in a companion package.
