# @hexguard/angular-upload-state

**File upload lifecycle state for Angular** — queue management, progress tracking, cancellation, retry, and completion signals.

---

## Why

File upload screens (documents, images, imports, attachments) are a repeated pain point. Every team rebuilds progress tracking, retry logic, and failed-upload UX on each screen. This package provides a headless, signal-based upload state that works with any UI.

## API

### `injectUploadState(options)`

```typescript
interface UploadOptions {
  url: string;                    // Upload endpoint URL
  multiple?: boolean;             // Allow multiple files (default: false)
  maxFileSize?: number;           // Max file size in bytes (0 = no limit)
  method?: string;                // HTTP method (default: 'POST')
  headers?: Record<string, string>; // Custom HTTP headers
  formFields?: Record<string, string>; // Additional form fields
}

interface UploadState {
  readonly queue: Signal<readonly UploadItem[]>;      // All items
  readonly active: Signal<UploadItem | null>;          // Currently uploading
  readonly isUploading: Signal<boolean>;
  readonly completed: Signal<readonly UploadItem[]>;
  readonly failed: Signal<readonly UploadItem[]>;
  readonly progress: Signal<number>;                  // 0-100 overall

  upload(file: File): void;
  retry(itemId: string): void;
  cancel(itemId: string): void;
  clearCompleted(): void;
  clearAll(): void;
}

interface UploadItem {
  id: string;
  file: File;
  status: 'queued' | 'uploading' | 'completed' | 'failed' | 'cancelled';
  progress: number;   // 0-100
  response?: unknown; // Server response on completion
  error?: string;
}
```

## Design Decisions

- Uses **`XMLHttpRequest`** for progress tracking (`upload.onprogress`) — reliable across all browsers. `fetch` with `ReadableStream` is too new and breaks in older polyfills.
- **`multiple: false`** cancels the previous queued/uploading file when a new file is added (single-file mode).
- **`maxFileSize`** rejects oversized files immediately, setting status to `'failed'` with a descriptive error message.
- **Retry** creates a brand-new `UploadItem` from the failed item's `File` reference, so retried items get fresh tracking.
- Cleanup via `DestroyRef` — cancels all in-flight XHRs on component destroy.

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Queue management | ✅ |
| Per-file progress tracking | ✅ |
| Overall progress signal | ✅ |
| Cancel via xhr.abort() | ✅ |
| Retry from failed data | ✅ |
| maxFileSize validation | ✅ |
| Single/multiple file modes | ✅ |
| Custom HTTP headers and form fields | ✅ |
| Fetch with ReadableStream | ❌ future |
| Drag-and-drop zone helpers | ❌ companion package |
| Direct composition with `angular-file-picker` | ❌ future |

## Demo

- Hub: `/packages/angular-upload-state`
- Demo: `/packages/angular-upload-state/demo`
