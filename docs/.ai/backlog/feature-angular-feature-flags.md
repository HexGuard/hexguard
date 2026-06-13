---
id: feature-angular-feature-flags
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-feature-flags'
---

# Angular Feature Flags Package

## Summary

Design `@hexguard/angular-feature-flags` as a package for standardizing typed feature-flag checks
across routes, templates, page actions, and service logic.

The repeated problem is that feature checks quickly spread into raw string literals, nested `if`
conditions, and inconsistent rollout rules across Angular apps.

## Goals

- Standardize typed feature-flag evaluation in Angular apps.
- Support route, template, and imperative feature checks.
- Stay provider-agnostic so apps can adapt remote config, environment flags, or experimentation
  services.
- Keep the first version focused on evaluation, not analytics.

## Non-Goals

- Building a remote flag management service.
- Shipping experimentation dashboards or analytics.
- Replacing permissions or role-based access control.

## Decisions

- Prefer typed flag contracts over raw string lookups.
- Treat template and guard helpers as thin wrappers over a headless flag evaluator.
- Keep targeting and user-context rules explicit rather than hidden in opaque expressions.

## Implementation Plan

1. Define the typed flag contract and provider adapter surface.
2. Implement imperative checks and signal-friendly flag access.
3. Add route and template helpers.
4. Define local override support for development and testing.
5. Add tests and demos for gating and rollout behavior.

## Validation

- Unit tests for flag evaluation and overrides.
- Route and template tests for feature gating.
- Demo coverage proving rollout-sensitive UI behavior.

## Follow-Ups

- Revisit overlap and composition with permissions once both packages exist.
- Decide whether experimentation-specific helpers deserve a separate package later.