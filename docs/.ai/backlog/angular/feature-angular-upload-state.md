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

## Proposed Public API

```ts
import { injectUploadState } from '@hexguard/angular-upload-state';

const upload = injectUploadState({
  url: '/api/uploads',
  multiple: true,
  maxFileSize: 50 * 1024 * 1024,
});

upload.queue; // Signal<UploadItem[]>
upload.active; // Signal<UploadItem | null>
upload.isUploading; // Signal<boolean>
upload.completed; // Signal<UploadItem[]>
upload.failed; // Signal<UploadItem[]>
upload.progress; // Signal<number> — 0–100 overall

upload.upload(file);
upload.retry(itemId);
upload.cancel(itemId);
upload.clearCompleted();
upload.clearAll();

// UploadItem
interface UploadItem {
  id: string;
  file: File;
  status: 'queued' | 'uploading' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0–100
  response?: unknown;
  error?: string;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-upload-state/`.
2. Add build/test scripts.

### Phase 1: Core Implementation

3. Define `UploadItem`, `UploadState` types with status enum.
4. Implement `injectUploadState()` — manages queue, active upload, progress tracking.
5. Implement `upload()` — creates UploadItem, sends via `XMLHttpRequest` with `upload.onprogress`.
6. Implement `cancel()` — aborts `XMLHttpRequest`.
7. Implement `retry()` — creates new UploadItem from failed item data.
8. Implement aggregate signals: `isUploading`, `progress` (overall), `completed`, `failed`.
9. Add unit tests for: queue management, progress updates, cancel, retry, completion, failure, clear, concurrent uploads.

### Phase 2: Demo & Docs

10. Add demo route with file picker, upload queue, progress bars, retry/cancel buttons.
11. Add Playwright coverage.
12. Write docs.

### Phase 3: Release

13. Add verify script, release workflow.
14. Run validation gate.

## Validation

- `pnpm test:lib:upload-state`.
- `pnpm test:e2e`.

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
