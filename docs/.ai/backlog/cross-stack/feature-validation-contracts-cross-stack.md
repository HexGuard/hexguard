---
id: feature-validation-contracts-cross-stack
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.ValidationContracts + @hexguard/angular-api-errors'
---

# Validation Contracts Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for consistent field-path, validation-code, and
machine-readable form-error payload contracts.

Many apps have a backend problem-details or validation payload, but the frontend still spends time
mapping field paths, error codes, and display structures by hand. A shared contract would make
Angular error handling and .NET validation output align much more predictably.

## Goals

- Standardize field path, code, and validation payload conventions across client and server.
- Complement `angular-api-errors` rather than replace it.
- Reduce repeated validation mapping logic in forms and page actions.
- Keep the contract backend-agnostic enough for common .NET validation stacks.

## Non-Goals

- Replacing all validation libraries.
- Owning localized error-message rendering.
- Solving business-rule workflows beyond error contract shape.

## Decisions

- Treat this as a cross-stack contract layer, not a UI package.
- Keep field-path and code semantics explicit.
- Compose with problem-details and Angular error packages.

## Implementation Plan

1. Define common payload and field-path conventions.
2. Add .NET helpers for mapping validation failures into the contract.
3. Add Angular helpers for binding field errors and page-level messages.
4. Add tests and demos for form-validation flows.
5. Revisit localized message catalogs only after the structural contract is settled.

## Validation

- .NET tests for payload mapping.
- Angular tests for field-level and form-level binding helpers.
- Cross-stack demos for validation-heavy forms.

## Follow-Ups

- Decide whether this should stay inside `angular-api-errors` or split into a clearer companion package.
- Revisit nested collection-path conventions after first real consumers appear.