---
id: feature-dotnet-concurrency
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.Concurrency'
---

# .NET Concurrency Package

## Summary

Design `HexGuard.Concurrency` as a .NET package for standardizing optimistic concurrency,
conflict detection, ETag or version handling, and conflict response contracts.

## Goals

- Standardize optimistic concurrency handling in .NET APIs.
- Support ETag or version-based conflict contracts.
- Make conflict responses consistent and testable.

## Non-Goals

- ORM-specific locking abstractions in the first version.
- Full distributed consistency semantics.

## Decisions

- Prefer HTTP-friendly concurrency helpers.
- Keep version and conflict semantics explicit.

## Implementation Plan

1. Define version or ETag and conflict response contracts.
2. Add middleware or helper APIs for If-Match-style flows.
3. Add tests and examples for update conflict scenarios.

## Validation

- Unit and integration tests for conflict detection and response shape.

## Follow-Ups

- Revisit deeper ORM adapters only if the base contract proves reusable.