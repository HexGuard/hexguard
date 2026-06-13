---
id: feature-angular-route-memory
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-route-memory'
---

# Angular Route Memory Package

## Summary

Design `@hexguard/angular-route-memory` as a package for standardizing repeated route memory
patterns such as return-to-list flows, preserved filters, last active tab, and route-scoped scroll
or page context restoration.

The repeated problem is that feature flows often lose user context when navigating between list,
detail, edit, and modal routes, and teams rebuild their own back-link and restoration behavior.

## Goals

- Standardize route-to-route memory and restore flows.
- Support return links, remembered tabs, remembered filters, and optional scroll restoration.
- Keep the package route-scoped and explicit.
- Compose with url-state and page-context packages.

## Non-Goals

- Replacing Angular router.
- Global browser-history replacement.
- Owning all navigation policies.

## Decisions

- Prefer explicit remembered context contracts over implicit magic.
- Keep route restoration state serializable and testable.
- Compose with URL state rather than duplicating it.

## Implementation Plan

1. Define the route-memory contract and restore triggers.
2. Support explicit save and restore of route-scoped context.
3. Add helpers for list-detail-return and tab restore patterns.
4. Define cleanup and expiration behavior.
5. Add focused tests and demos for list-detail-edit flows.

## Validation

- Unit tests for restore behavior and cleanup semantics.
- Demo coverage for list-detail-edit navigation loops.

## Follow-Ups

- Revisit scroll restoration only if it stays deterministic and framework-friendly.
- Compare overlap with page-context once both proposals mature.---
id: feature-angular-route-memory
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-route-memory'
---

# Angular Route Memory Package

## Summary

Design `@hexguard/angular-route-memory` to standardize back-link intent, list-detail return flows,
scroll restoration, and route-scoped view memory in Angular apps.

Apps repeatedly need to preserve search results context, tabs, and scroll position when users move
between list, detail, and edit views.

## Goals

- Standardize route-scoped return context and memory.
- Support remembered query state, scroll position, and navigation intent.
- Compose with url-state and query-form rather than replacing them.

## Non-Goals

- Replacing router history itself.
- Owning every navigation transition in the app.

## Decisions

- Prefer explicit route-memory scopes.
- Keep restored state observable and debuggable.

## Implementation Plan

1. Define route-memory entries and identity rules.
2. Support save, restore, clear, and expiration behavior.
3. Add scroll and view-state restoration helpers.
4. Add tests and demos for list-detail-edit flows.

## Validation

- Unit tests for route-memory save and restore behavior.
- Demo coverage for list return and scroll restoration.

## Follow-Ups

- Revisit overlap with preferences if long-lived route memory becomes a user setting.