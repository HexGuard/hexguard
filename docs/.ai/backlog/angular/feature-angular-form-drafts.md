---
id: feature-angular-form-drafts
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-form-drafts'
---

# Angular Form Drafts Package

## Summary

Design `@hexguard/angular-form-drafts` as a package for standardizing draft persistence, restore,
discard, and autosave ergonomics for Angular edit flows.

The repeated problem is that complex forms often need local draft recovery, but teams implement
storage keys, schema changes, restore prompts, and discard behavior differently on every screen.

## Goals

- Standardize draft lifecycle state for edit forms.
- Support explicit save, discard, restore, and autosave-driven workflows.
- Allow pluggable storage such as memory, session storage, local storage, or app-defined adapters.
- Compose with dirty-state and async-state rather than duplicating them.

## Non-Goals

- Collaborative editing or live conflict resolution.
- Server-side draft synchronization in the first version.
- Validation-rule ownership.

## Decisions

- Prefer a storage-agnostic core contract.
- Keep draft identity explicit so apps can scope drafts by route, entity, or user.
- Avoid tying the package only to one Angular form model in v0.1.

## Implementation Plan

1. Define draft identity, serialization, and versioning rules.
2. Implement a headless draft controller with save, restore, discard, and clear operations.
3. Add storage adapter interfaces for local and session persistence.
4. Define migration behavior for draft schema changes.
5. Add tests for autosave, restore prompts, version mismatch, and discard flows.

## Validation

- Unit tests for storage adapters and draft lifecycle transitions.
- Demo coverage for autosave, restore, and discard behavior.
- Manual checks for route changes and entity-scoped draft isolation.

## Follow-Ups

- Decide whether Reactive Forms and Signal Forms adapters should live here or in companion packages.
- Revisit server-backed draft workflows only after local-first drafts prove broadly useful.
