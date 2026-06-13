---
id: feature-angular-optimistic-actions
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-optimistic-actions'
---

# Angular Optimistic Actions Package

## Summary

Design `@hexguard/angular-optimistic-actions` as a narrower companion to async-action flows for
confirming local success immediately and reconciling later with remote results.

This is a more focused alternative to broader optimistic state management and may be useful if the
HexGuard portfolio needs action-centric ergonomics without a larger optimistic data model.

## Goals

- Standardize optimistic command execution.
- Support rollback, retry, and optimistic side effects.
- Compose with async-action helpers.

## Non-Goals

- Full optimistic entity state management.
- Generic caching or synchronization.

## Decisions

- Keep this proposal narrower than `angular-optimistic-state`.
- Revisit whether it survives once optimistic-state is better defined.

## Implementation Plan

1. Define optimistic action result and rollback hooks.
2. Support immediate local success plus later confirmation or revert.
3. Add focused tests and demos for toggle and archive actions.

## Validation

- Unit tests for optimistic command success, failure, and rollback.
- Demo coverage for optimistic action flows.

## Follow-Ups

- Decide whether this package should merge into `angular-optimistic-state` instead of shipping separately.
