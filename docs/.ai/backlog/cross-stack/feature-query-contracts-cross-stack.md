---
id: feature-query-contracts-cross-stack
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.QueryContracts + @hexguard/angular-query-contracts'
---

# Query Contracts Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for reusable query request and response
contracts around search, filter, sort, and pagination.

Angular apps often standardize client-side query state while APIs invent their own parameter names,
sort tokens, and pagination payloads independently. A shared contract would reduce repeated mapping
layers and drift between frontend and backend query models.

## Goals

- Standardize common query contracts across client and server.
- Compose naturally with url-state, query-form, table-state, and pagination.
- Keep filter and sort semantics typed and explicit.
- Reduce mapping boilerplate between Angular state and backend requests.

## Non-Goals

- A full OData replacement.
- Dynamic arbitrary query builders in the first version.
- Replacing backend search infrastructure.

## Decisions

- Keep the contract narrow around common business-app query shapes.
- Prefer explicit sort and filter models over opaque string DSLs.
- Treat the pair as complementary to, not a replacement for, pagination packages.

## Implementation Plan

1. Define common request and response models for page, sort, search, and filters.
2. Add .NET helpers for binding, validation, and consistent response metadata.
3. Add Angular helpers for mapping query state into typed requests.
4. Add tests and demos for list and table flows.
5. Revisit more advanced filtering only after the common contract proves broadly useful.

## Validation

- .NET tests for binding and response helpers.
- Angular tests for request mapping and state interoperability.
- Cross-stack demos for list and table scenarios.

## Follow-Ups

- Decide whether saved views and preferences should build on the same contract.
- Revisit server-side filter-expression helpers as a separate scope if needed.