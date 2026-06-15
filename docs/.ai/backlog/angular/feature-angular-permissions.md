---
id: feature-angular-permissions
type: feature
status: in-progress
created: 2026-06-13
package: '@hexguard/angular-permissions'
---

# Angular Permissions Package

## Summary

Design `@hexguard/angular-permissions` as a headless Angular package for standardizing capability,
role, and policy checks across routes, templates, page actions, and feature code.

The repeated problem is that most Angular apps scatter access rules across guards, components,
template conditionals, and menu builders. A reusable contract would make permission checks typed,
centralized, and consistent.

## Goals

- Standardize permission and capability evaluation in Angular apps.
- Support route guards, template helpers, and imperative checks from one policy contract.
- Stay provider-agnostic so apps can adapt claims, roles, or backend policy payloads.
- Keep the first version headless and logic-first rather than UI-first.

## Non-Goals

- Replacing authentication providers or token parsing.
- Performing backend authorization for the server.
- Shipping opinionated menus or page shells in the core package.

## Decisions

- Prefer a policy-first headless API.
- Add template and route helpers only as thin adapters over the core evaluator.
- Keep the permission model explicit rather than hiding checks inside large declarative config.
- The first implementation stays limited to capabilities and roles. Resource predicates and a broader DSL remain out of scope.
- Feature flags remain orthogonal; the package does not compose feature-flag checks into permission decisions in `0.1.0`.

## Implementation Plan

1. Define the minimal permission model for capabilities and roles.
2. Implement the pure evaluator plus signal-friendly current-context integration.
3. Add imperative checks for services and component logic.
4. Add route guard helpers and a structural template directive.
5. Add tests covering capability checks, route gating, and template composition.
6. Add package-home and permissions demo routes to the Angular demo app.

## Validation

- Unit tests for capability evaluation and policy composition.
- Guard-level tests for route access decisions.
- Demo coverage proving route and action gating behavior.

## Follow-Ups

- Decide later whether resource predicates deserve a separate extension surface.
- Revisit page-context integration once page actions and permissions are both defined.
