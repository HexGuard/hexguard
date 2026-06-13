---
id: feature-angular-confirmation
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-confirmation'
---

# Angular Confirmation Package

## Summary

Design `@hexguard/angular-confirmation` as a headless Angular package for standardizing confirm,
cancel, and confirm-and-run flows for destructive or high-impact actions.

The repeated problem is that apps keep rebuilding small confirmation dialogs, unsafe delete flows,
and “are you sure?” action wrappers with inconsistent behavior and testing quality.

## Goals

- Standardize confirmation flow contracts without requiring one dialog UI library.
- Support simple confirm/cancel flows and confirm-then-run async actions.
- Compose with async-action state instead of duplicating request lifecycle state.
- Keep the core package headless and provider-driven.

## Non-Goals

- Shipping a mandatory modal or overlay design system.
- Replacing async-state or submit-lock.
- Handling every multi-step wizard or approval workflow in v0.1.

## Decisions

- Prefer a headless confirm contract first.
- Keep UI adapters optional.
- Treat destructive-action ergonomics as a narrow concern rather than a full workflow engine.

## Implementation Plan

1. Define the headless confirmation request and result contract.
2. Implement a provider surface for app-specific dialog rendering.
3. Add helpers for confirm-and-run async actions.
4. Define cancellation and duplicate-open behavior.
5. Add tests and demos for delete, reset, and archive flows.

## Validation

- Unit tests for confirmation outcomes and action composition.
- Demo coverage for destructive-action confirmation.
- Manual checks for cancellation and retry behavior.

## Follow-Ups

- Revisit whether an optional shared confirmation UI belongs in a companion package.
- Evaluate overlap with command-palette or page-context action systems only after the headless core settles.