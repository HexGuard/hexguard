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

## Implementation Plan

1. Define the route transition lifecycle contract.
2. Support app-level and route-level pending signals.
3. Add helpers for delayed or non-flickering indicators.
4. Define compatibility with async page setup and resolvers.
5. Add tests and demos for pending and ready route transitions.

## Validation

- Unit tests for route transition pending state.
- Demo coverage for global and route-local pending indicators.

## Follow-Ups

- Revisit integration with page-context and async-state once those packages are mature.
- Decide whether skeleton-oriented helpers belong in a companion package.---
  id: feature-angular-navigation-pending
  type: feature
  status: proposed
  created: 2026-06-13
  package: '@hexguard/angular-navigation-pending'

---

# Angular Navigation Pending Package

## Summary

Design `@hexguard/angular-navigation-pending` to standardize route transition busy state, page
readiness, and route-level pending indicators.

Many apps need a consistent answer to “is this page still loading?” and keep rebuilding fragile
global spinners and navigation guards around async route transitions.

## Goals

- Standardize route transition pending state.
- Support global and route-scoped pending indicators.
- Compose with async-state and router events.

## Non-Goals

- Replacing Angular routing.
- Owning data fetching itself.

## Decisions

- Prefer headless pending-state signals first.
- Keep rendering concerns outside the core package.

## Implementation Plan

1. Define pending, ready, and failed navigation semantics.
2. Support route-scoped and app-scoped pending signals.
3. Add tests and demos for async route transitions and page readiness.

## Validation

- Unit tests for transition and readiness state.
- Demo coverage for route-level pending UX.

## Follow-Ups

- Revisit overlap with page-context and async-state if route readiness depends on both.
