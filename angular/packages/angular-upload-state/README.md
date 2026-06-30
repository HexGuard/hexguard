# @hexguard/angular-upload-state

**File upload lifecycle state for Angular.** Queue management, progress tracking, cancellation, and retry — all signal-based.

---

## Installation

```bash
pnpm add @hexguard/angular-upload-state
```

## API

### `injectUploadState()`

```typescript
const upload = injectUploadState({
  url: '/api/uploads',
  multiple: true,
  maxFileSize: 50 * 1024 * 1024,
});

upload.upload(file);
upload.cancel(itemId);
upload.retry(itemId);
upload.clearCompleted();
upload.clearAll();

upload.queue;        // Signal<readonly UploadItem[]>
upload.active;       // Signal<UploadItem | null>
upload.isUploading;  // Signal<boolean>
upload.completed;    // Signal<readonly UploadItem[]>
upload.failed;       // Signal<readonly UploadItem[]>
upload.progress;     // Signal<number> — 0–100 overall
```

Uses `XMLHttpRequest` for reliable progress tracking via `upload.onprogress`. Supports cancellation via `xhr.abort()`, and retry by creating a new upload from failed item data.

### Scope Boundaries

| Concern | Status |
|---------|--------|
| Upload queue management | ✅ |
| Progress tracking (XHR) | ✅ |
| Cancel in-progress upload | ✅ |
| Retry failed uploads | ✅ |
| maxFileSize validation | ✅ |
| Multiple/single file mode | ✅ |
| Overall progress signal | ✅ |
| Fetch with ReadableStream | ❌ future |
| Drag-and-drop helpers | ❌ separate package |

## Demo

Visit `/packages/angular-upload-state/demo` to test the upload queue with progress bars, cancel, and retry.
