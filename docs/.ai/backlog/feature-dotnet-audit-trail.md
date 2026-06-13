---
id: feature-dotnet-audit-trail
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.AuditTrail'
---

# .NET Audit Trail Package

## Summary

Design `HexGuard.AuditTrail` as a .NET package for standardizing audit event capture, actor and
context metadata, and change summaries for business-critical operations.

## Goals

- Standardize audit event shape and capture semantics.
- Support actor, target, change summary, and context metadata.
- Keep persistence pluggable.

## Non-Goals

- A compliance product.
- A logging framework replacement.

## Decisions

- Prefer an explicit audit event contract.
- Keep persistence and storage concerns adapter-based.

## Implementation Plan

1. Define the core audit event model.
2. Add helpers for event capture and enrichment.
3. Add tests and examples for business action auditing.

## Validation

- Unit tests for audit event creation and enrichment.

## Follow-Ups

- Revisit integration with webhooks or background jobs if those packages land.