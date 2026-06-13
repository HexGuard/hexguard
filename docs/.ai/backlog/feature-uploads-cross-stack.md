---
id: feature-uploads-cross-stack
type: feature
status: proposed
created: 2026-06-13
package: 'HexGuard.Uploads + @hexguard/angular-upload-state'
---

# Uploads Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for upload contracts, upload progress, and
post-upload processing state.

Uploads are often a split-brain problem: Angular tracks progress and retries one way, .NET APIs
handle temporary storage and processing another way, and no shared contract exists for state,
errors, or final attachment semantics.

## Goals

- Standardize upload contract semantics across client and server.
- Support progress, cancellation, retry, and post-upload processing state.
- Keep the client and server packages compatible but independently useful.
- Compose with async-state and upload-state primitives.

## Non-Goals

- A storage-provider SDK.
- Media transformation pipelines.
- Antivirus or compliance scanning implementations.

## Decisions

- Prefer a coordinated contract for upload lifecycle and status.
- Keep provider-specific storage concerns outside the core pair.
- Treat file processing as an explicit lifecycle stage when needed.

## Implementation Plan

1. Define the upload session and result contracts.
2. Add .NET helpers for upload sessions, status, and completion metadata.
3. Add Angular helpers for progress, retry, and session-aware client flows.
4. Add tests and demos for document or import upload scenarios.
5. Revisit multipart or chunked advanced flows only after the core contract settles.

## Validation

- .NET tests for upload session and status helpers.
- Angular tests for upload-state progression and retry behavior.
- Cross-stack demos for end-to-end upload flows.

## Follow-Ups

- Decide whether chunked-upload helpers belong in the first version.
- Revisit deep storage-provider adapters only after the contract proves reusable.