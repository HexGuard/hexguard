---
id: feature-angular-upload-state
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-upload-state'
dependsOn:
  - '@hexguard/angular-async-state'
---

# Angular Upload State Package

## Summary

Design `@hexguard/angular-upload-state` as a package for standardizing file upload lifecycle state
such as queueing, progress, cancellation, retry, and completion in Angular apps.

Uploads are a repeated pain point across document, image, import, and attachment workflows, yet
teams commonly rebuild progress tracking, retry logic, and failed-upload UX on each screen.

## Goals

- Standardize upload lifecycle state and progress tracking.
- Support single and multi-file queues with retry and cancel behavior.
- Keep the core contract transport-agnostic.
- Compose with async-state or async-action primitives where appropriate.

## Non-Goals

- Storage-provider SDK wrappers.
- Virus scanning or backend processing pipelines.
- Media editing or preview UI.

## Decisions

- Prefer a headless upload-state model.
- Keep progress, queue, and retry semantics explicit.
- Avoid coupling the package to one HTTP or storage implementation.

## Implementation Plan

1. Define the upload item lifecycle contract.
2. Support queue, progress, cancel, retry, and completion transitions.
3. Add pluggable transport hooks for file transfer.
4. Define aggregate helpers for overall queue state.
5. Add focused tests and demos for document and bulk import flows.

## Validation

- Unit tests for progress, retry, cancel, and completion behavior.
- Demo coverage for queued and in-progress uploads.

## Follow-Ups

- Revisit direct composition with a future cross-stack uploads contract.
- Decide whether drag-and-drop helpers belong in a companion package.---
  id: feature-angular-upload-state
  type: feature
  status: proposed
  created: 2026-06-13
  package: '@hexguard/angular-upload-state'

---

# Angular Upload State Package

## Summary

Design `@hexguard/angular-upload-state` to standardize file upload lifecycle state in Angular:
queued, uploading, progress, canceled, failed, retried, and completed.

Upload flows are highly repetitive across business apps and often end up with brittle progress,
cancel, and retry state handling.

## Goals

- Standardize upload lifecycle state and progress tracking.
- Support cancellation, retry, and multi-file upload orchestration.
- Keep transport and storage providers pluggable.

## Non-Goals

- A complete file-storage backend.
- Virus scanning or media processing pipelines.

## Decisions

- Prefer signal-first upload state rather than UI-first wrappers.
- Keep single-file and multi-file flows composable from the same primitives.

## Implementation Plan

1. Define upload item and upload session contracts.
2. Support queued, progress, cancel, retry, and complete transitions.
3. Add provider adapters for transport and upload endpoints.
4. Add tests and demos for document and bulk import workflows.

## Validation

- Unit tests for progress, cancel, retry, and failure transitions.
- Demo coverage for file upload and retry behavior.

## Follow-Ups

- Revisit cross-stack composition with `HexGuard.Uploads` after the client contract settles.
