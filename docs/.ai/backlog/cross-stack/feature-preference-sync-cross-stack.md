---
id: feature-preference-sync-cross-stack
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.PreferenceSync + @hexguard/angular-preferences'
---

# Preference Sync Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for synchronizing user preferences such as
saved filters, dashboard defaults, hidden columns, and preferred views.

Local preference state is common, but many products eventually need those settings to roam with
the user. A shared contract would reduce drift between client preference models and backend
storage or migration behavior.

## Goals

- Standardize a common preference contract across frontend and backend.
- Support saved views, dashboard defaults, hidden columns, and user-level settings.
- Compose with local-first Angular preferences while enabling server sync.
- Keep migrations and versioning explicit.

## Non-Goals

- A full settings management product.
- CMS-like user personalization.
- Authentication or user-profile systems.

## Decisions

- Prefer a local-first Angular package with optional server sync contract.
- Keep the sync pair explicit rather than hiding network behavior.
- Treat saved views and defaults as first-class preference scenarios.

## Implementation Plan

1. Define shared preference models and versioning rules.
2. Add .NET helpers for persistence, versioning, and conflict strategies.
3. Add Angular helpers for sync-aware preference loading and saving.
4. Add tests and demos for saved views and dashboard defaults.
5. Revisit conflict resolution only after simple sync workflows prove valuable.

## Validation

- .NET tests for persistence and versioning helpers.
- Angular tests for sync-aware preference flows.
- Cross-stack demos for saved-view restoration.

## Follow-Ups

- Decide whether view-sharing belongs in the same package or a separate contract.
- Revisit offline or merge strategies only after the base sync model proves out.
