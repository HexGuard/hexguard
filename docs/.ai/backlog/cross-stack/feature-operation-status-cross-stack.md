---
id: feature-operation-status-cross-stack
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.OperationStatus + @hexguard/angular-operation-status'
---

# Operation Status Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for long-running operation contracts such as
imports, exports, sync jobs, rebuilds, or background tasks that expose progress, current stage,
completion, failure, and cancellation.

This is a strong repeated cross-stack problem: APIs invent job IDs and progress payloads one way,
Angular clients poll them another way, and no shared contract exists for operation lifecycle state.

## Goals

- Standardize long-running operation contracts across backend and frontend.
- Provide a .NET package for operation result models, status endpoints, and helper contracts.
- Provide an Angular package for polling, progress, and operation-state rendering.
- Keep progress, completion, and cancellation semantics explicit and typed.

## Non-Goals

- A job scheduler implementation.
- Queue infrastructure.
- Transport-specific real-time streaming in the first version.

## Decisions

- Treat the pair as a coordinated contract, not unrelated packages.
- Prefer polling-first support with later real-time extensions if needed.
- Keep progress payloads backend-defined but strongly typed.

## Implementation Plan

1. Define shared conceptual lifecycle states for long-running operations.
2. Design the .NET contract for operation IDs, status, progress, and final result shape.
3. Design the Angular contract for polling, cancellation, and progress rendering.
4. Add end-to-end demos and tests for import or export workflows.
5. Revisit real-time delivery only after the polling contract proves out.

## Validation

- .NET tests for status models and endpoint helpers.
- Angular tests for polling and progress rendering.
- Cross-stack demo flow proving one real long-running job lifecycle.

## Follow-Ups

- Decide whether cancellation is mandatory in the first version.
- Revisit SignalR or SSE support only after the contract is stable.
