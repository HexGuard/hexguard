---
id: feature-angular-selection-state
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-selection-state'
---

# Angular Selection State Package

## Summary

Design `@hexguard/angular-selection-state` as a headless package for standardizing row and item
selection across lists, tables, bulk actions, and filtered result sets.

The repeated problem is that most Angular admin apps keep reinventing selected-id sets,
select-all-visible logic, bulk-action enablement, and selection reset rules after filtering or
pagination changes.

## Goals

- Provide a reusable selection-state model for keyed collections.
- Support single-select, multi-select, select-all-visible, and clear-selection patterns.
- Keep the package headless so it composes with different table or list UIs.
- Compose naturally with table-state, query-form, and async-state.

## Non-Goals

- Rendering data tables.
- Replacing URL state or pagination state.
- Domain-specific bulk action policies.

## Decisions

- Use keyed selection as the core primitive.
- Treat select-all-visible and filtered-result selection as explicit operations, not hidden magic.
- Keep the first version focused on client-known items rather than remote “select all matching”
  semantics that require backend cooperation.

## Implementation Plan

1. Define the keyed selection model and derived helpers.
2. Implement operations for toggle, clear, replace, and select-visible behavior.
3. Add helpers for bulk-action enablement and selection summaries.
4. Define reset semantics when the underlying collection identity changes.
5. Add tests and demos for list, table, and bulk-action workflows.

## Validation

- Unit tests for selection operations and derived helpers.
- Demo coverage for table row selection and bulk actions.
- Manual checks for pagination and filter changes.

## Follow-Ups

- Revisit server-backed “select all matching filter” semantics as a separate design spike.
- Evaluate whether tree-selection behavior belongs in the same package or a separate one.
