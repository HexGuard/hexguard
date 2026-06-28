---
id: feature-angular-optimistic-state
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-optimistic-state'
dependsOn:
  - '@hexguard/angular-async-state'
---

# Angular Optimistic State Package

## Summary

Design `@hexguard/angular-optimistic-state` as a package for standardizing optimistic mutation,
rollback, reconciliation, and temporary UI state for Angular apps.

Most Angular apps repeat the same patterns around optimistic toggles, inline edits, row actions,
and rollback after failed saves. Teams often reimplement these flows with inconsistent pending
markers, partial rollback logic, and brittle local reconciliation rules.

## Goals

- Standardize optimistic mutation patterns for Angular screens.
- Support optimistic patch, rollback, retry, and post-success reconciliation.
- Compose with async-action state rather than replacing it.
- Keep the package transport-agnostic and UI-agnostic.

## Non-Goals

- General caching or normalized entity stores.
- Offline-first sync in the first version.
- Replacing backend conflict handling.

## Decisions

- Prefer a headless optimistic-state engine.
- Keep rollback and reconciliation explicit.
- Compose with async-state primitives instead of duplicating them.

## Implementation Plan

1. Define the optimistic patch and rollback contract.
2. Support entity-level optimistic updates and temporary markers.
3. Add reconciliation hooks for confirmed server results.
4. Define conflict and failure behavior.
5. Add focused tests and demos for inline edits, toggles, and bulk actions.

## Validation

- Unit tests for optimistic apply, rollback, and reconciliation behavior.
- Demo coverage for toggle, inline edit, and bulk update flows.

## Follow-Ups

- Revisit offline-first concerns only if they emerge repeatedly.
- Compare overlap with selection-state and async-action once those packages exist.
