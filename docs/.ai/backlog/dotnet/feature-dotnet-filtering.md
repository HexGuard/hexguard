---
id: feature-dotnet-filtering
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.Filtering'
---

# .NET Filtering Package

## Summary

Design `HexGuard.Filtering` as a .NET package for standardizing safe filter, sort, and search
binding plus reusable API-side query helpers.

## Goals

- Standardize common filtering and sorting contracts for .NET APIs.
- Reduce duplicated binding and validation logic.
- Compose with pagination and any future query-contract packages.

## Non-Goals

- A full OData replacement.
- Arbitrary user-authored query languages.

## Decisions

- Prefer narrow, typed query helpers.
- Keep sort and filter semantics explicit.

## Implementation Plan

1. Define common filter and sort models.
2. Add binding and validation helpers.
3. Add tests and examples for API list endpoints.

## Validation

- Unit tests for filter and sort binding and validation.

## Follow-Ups

- Revisit advanced expression trees only if the common contract proves insufficient.
