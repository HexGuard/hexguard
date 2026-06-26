---
id: feature-angular-router-signals
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-router-signals'
---

# @hexguard/angular-router-signals

## Summary

Signal-based access to Angular Router params, query params, route data, and resolved data — wrapped as typed signals that update reactively on navigation. Angular's `ActivatedRoute` provides `params`, `queryParams`, and `data` as observables; this package wraps them as signals with synchronous access and type safety.

**Promoted from sidenote.** With Angular's increasing signal-first direction, a signal-based router data access layer is a natural companion to the existing signal ecosystem.

**Competition check:** Angular's built-in `input()` with `routerParams` (Angular 22+) solves part of this for component inputs, but there's no standalone signal wrapper for classic `ActivatedRoute` observables.

## Why Wide Adoption

Every Angular component that reads route params, query params, or resolved data currently subscribes to `ActivatedRoute` observables or uses `async` pipe. Converting to signals eliminates boilerplate subscriptions and integrates naturally with the signal-based component model.

## Goals

1. Provide `injectRouteParam(name)` — typed signal for a single route param.
2. Provide `injectRouteQueryParam(name)` — typed signal for a single query param.
3. Provide `injectRouteData<T>()` — typed signal for resolved route data.
4. Provide `injectRouteParams<T>()` — typed signal for all route params.
5. Provide `injectRouteQueryParams<T>()` — typed signal for all query params.
6. Auto-cleanup on destroy — no manual subscription management.
7. Support default values for missing params.

## Proposed Public API

```typescript
export function injectRouteParam<T = string>(
  name: string,
  defaultValue?: T,
  options?: { transform?: (value: string | null) => T }
): Signal<T>;

export function injectRouteQueryParam<T = string>(
  name: string,
  defaultValue?: T,
  options?: { transform?: (value: string | null) => T }
): Signal<T>;

export function injectRouteParams<T extends Record<string, string>>(): Signal<T>;

export function injectRouteQueryParams<T extends Record<string, string>>(): Signal<T>;

export function injectRouteData<T>(): Signal<T>;

// Usage
@Component({})
class ProductDetailComponent {
  readonly id = injectRouteParam('id');                // Signal<string>
  readonly page = injectRouteQueryParam('page', 1, {   // Signal<number>
    transform: v => v ? parseInt(v) : 1,
  });
  readonly product = injectRouteData<Product>();       // Signal<Product>
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-router-signals/`.
2. Implement wrappers around `ActivatedRoute.paramMap`, `queryParamMap`, and `data` observables → signals.
3. Add cleanup via `DestroyRef`.
4. Add tests: param changes on navigation, query param updates, default values, cleanup.
5. Register in workspace.
