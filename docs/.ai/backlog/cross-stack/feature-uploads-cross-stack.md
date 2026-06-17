---
id: feature-uploads-cross-stack
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.Uploads + @hexguard/angular-upload-state'
---

# Uploads Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for upload contracts, upload progress, and post-upload processing state.

Uploads are often a split-brain problem: Angular tracks progress and retries one way, .NET APIs handle temporary storage and processing another way, and no shared contract exists for state, errors, or final attachment semantics.

## Goals

- Standardize upload contract semantics across client and server.
- Support progress, cancellation, retry, and post-upload processing state.
- Keep the client and server packages compatible but independently useful.
- Compose with async-state and `@hexguard/angular-file-picker`.

## Non-Goals

- A storage-provider SDK.
- Media transformation pipelines.
- Antivirus or compliance scanning implementations.

## Decisions

- Prefer a coordinated contract for upload lifecycle and status.
- Keep provider-specific storage concerns outside the core pair.
- Treat file processing as an explicit lifecycle stage when needed.
- Upload progress via `XMLHttpRequest` `upload.onprogress` or `fetch` with `ReadableStream`.

## Proposed Public API

### .NET

```csharp
public record UploadSession(
    Guid SessionId,
    string FileName,
    long FileSize,
    string Status,              // "Uploading" | "Processing" | "Completed" | "Failed"
    string? Url,                // final download URL when completed
    string? ErrorMessage
);

// Endpoints
// POST /api/uploads          → create session, receive file → UploadSession
// GET  /api/uploads/{id}     → UploadSession (status poll)
// DELETE /api/uploads/{id}   → cancel
```

### Angular

```ts
import { injectUploadState } from '@hexguard/angular-upload-state';

// Composes with @hexguard/angular-file-picker
const upload = injectUploadState({
  url: '/api/uploads',
  multiple: true,
});

upload.queue;              // Signal<UploadItem[]>
upload.active;             // Signal<UploadItem | null>
upload.isUploading;        // Signal<boolean>
upload.completed;          // Signal<UploadItem[]>
upload.failed;             // Signal<UploadItem[]>

upload.upload(file);       // starts upload with progress tracking
upload.retry(itemId);      // retries a failed upload
upload.cancel(itemId);     // cancels an in-progress upload
upload.clearCompleted();   // removes completed items from state
```

## Implementation Plan

### Phase 0: .NET — HexGuard.Uploads

1. Scaffold project + tests under `dotnet/src/HexGuard.Uploads/`.
2. Define `UploadSession` record, `IUploadStore`, `InMemoryUploadStore`.
3. Implement upload endpoint — receives `multipart/form-data`, streams to temp storage, returns session.
4. Implement status-poll endpoint and cancel endpoint.
5. Add unit + integration tests.

### Phase 1: Angular — @hexguard/angular-upload-state

6. Scaffold `angular/packages/angular-upload-state/`.
7. Define TypeScript types mirroring .NET contracts.
8. Implement `injectUploadState()` with `XMLHttpRequest`-based progress tracking.
9. Implement queue management, retry, cancel, and completion tracking.
10. Add unit tests for: progress, retry, cancel, queue, cleanup.

### Phase 2: Demo & Docs

11. Add .NET endpoint group to `HexGuard.SampleApi`.
12. Add Angular demo route with file picker, upload progress bar, retry, success links.
13. Add Playwright coverage.
14. Write deep-dive docs.

### Phase 3: Release

15. Add build/test/verify scripts.
16. Add release workflows.
17. Run full validation gates.

## Validation

- `pnpm dotnet:test`.
- `pnpm test:lib:upload-state`.
- `pnpm test:e2e`.

