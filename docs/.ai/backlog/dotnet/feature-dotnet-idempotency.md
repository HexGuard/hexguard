---
id: feature-dotnet-idempotency
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.Idempotency'
---

# .NET Idempotency Package

## Summary

Design `HexGuard.Idempotency` as a .NET package for duplicate-request prevention, replay-safe
responses, and explicit idempotency handling on APIs.

## Goals

- Standardize idempotency-key handling on .NET APIs.
- Prevent duplicate POST or command execution under retries or double submits.
- Make replay-safe behavior explicit and testable.

## Non-Goals

- Distributed transaction guarantees.
- Queueing or job orchestration.

## Decisions

- Prefer middleware or endpoint-friendly helpers.
- Keep persistence and expiration strategy explicit.

## Implementation Plan

1. Define idempotency key and replay contracts.
2. Add .NET request handling helpers and storage abstractions.
3. Add tests for replay-safe results and duplicate prevention.

## Validation

- Unit and integration tests for duplicate request scenarios.

## Follow-Ups

- Revisit the cross-stack pairing with an Angular client helper package.
