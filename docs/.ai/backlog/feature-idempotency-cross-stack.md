---
id: feature-idempotency-cross-stack
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.Idempotency + @hexguard/angular-idempotency'
---

# Idempotency Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for idempotent client-server action flows.

Duplicate POSTs, retries after network failures, double-click submits, and uncertain completion are
repeated cross-stack problems. Standardizing request IDs, replay-safe responses, and client-side
idempotency helpers would solve a real correctness issue rather than a convenience issue.

## Goals

- Standardize idempotency key generation and transmission on the client.
- Standardize idempotency key handling and replay-safe responses on the server.
- Compose with async action and submit-state tooling.
- Keep transport semantics explicit and testable.

## Non-Goals

- Replacing full transactional guarantees.
- Solving every distributed workflow duplication problem.
- Building a queue system.

## Decisions

- Treat client and server packages as a coordinated contract.
- Keep key generation and replay policies explicit.
- Compose with submit and optimistic-action tooling instead of replacing them.

## Implementation Plan

1. Define the idempotency key contract and response semantics.
2. Add .NET helpers for request handling, replay detection, and stored outcomes.
3. Add Angular helpers for key generation, header attachment, and retry-aware action flows.
4. Add tests for duplicate submit, retry after failure, and replay-safe response behavior.
5. Add end-to-end demos for a create or submit workflow.

## Validation

- .NET tests for replay detection and response reuse.
- Angular tests for key propagation and retry behavior.
- Cross-stack demo coverage for duplicate action prevention.

## Follow-Ups

- Revisit storage abstractions and expiration strategies after the core contract is proven.
- Decide whether command or mutation wrappers belong in the Angular package.