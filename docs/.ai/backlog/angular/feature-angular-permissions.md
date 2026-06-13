---
id: feature-angular-permissions
type: feature
status: proposed
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

## Implementation Plan

1. Define the minimal permission model for capabilities, roles, and optional resource context.
2. Implement a signal-friendly evaluator or store for current access context.
3. Add imperative checks for services and component logic.
4. Add route guard helpers and optional structural template directives.
5. Add tests covering capability checks, route gating, and template composition.

## Validation

- Unit tests for capability evaluation and policy composition.
- Guard-level tests for route access decisions.
- Demo coverage proving route and action gating behavior.

## Follow-Ups

- Decide whether feature flags should compose with permissions or stay orthogonal.
- Revisit page-context integration once page actions and permissions are both defined.
