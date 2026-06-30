import { DestroyRef, inject, signal, computed } from '@angular/core';
import type { UploadItem, UploadOptions, UploadState } from './types';

let nextId = 0;

/**
 * Injects a headless file upload state handle.
 *
 * Manages a queue of files with progress tracking, cancellation, and retry.
 * Uses `XMLHttpRequest` for reliable progress reporting.
 *
 * @example
 * ```typescript
 * const upload = injectUploadState({ url: '/api/uploads', multiple: true });
 *
 * // In template:
 * // <input type="file" (change)="upload.upload($any($event.target).files[0])" />
 * // @for (item of upload.queue(); track item.id) {
 * //   <div>{{ item.file.name }} — {{ item.progress }}%</div>
 * // }
 * ```
 */
export function injectUploadState(options: UploadOptions): UploadState {
  const {
    url,
    multiple = false,
    maxFileSize = 0,
    method = 'POST',
    headers = {},
    formFields = {},
  } = options;

  const destroyRef = inject(DestroyRef);

  // ── State ────────────────────────────────────────────────────

  const items = signal<UploadItem[]>([]);
  const xhrMap = new Map<string, XMLHttpRequest>();

  // ── Derived signals ──────────────────────────────────────────

  const active = computed<UploadItem | null>(() => {
    return items().find((i) => i.status === 'uploading') ?? null;
  });

  const isUploading = computed<boolean>(() => items().some((i) => i.status === 'uploading'));

  const completed = computed<readonly UploadItem[]>(() => {
    return items().filter((i) => i.status === 'completed');
  });

  const failed = computed<readonly UploadItem[]>(() => {
    return items().filter((i) => i.status === 'failed');
  });

  const progress = computed<number>(() => {
    const all = items();
    if (all.length === 0) return 0;
    const total = all.reduce((sum, i) => sum + i.progress, 0);
    return Math.round(total / all.length);
  });

  // ── Core logic ───────────────────────────────────────────────

  function updateItem(id: string, changes: Partial<UploadItem>): void {
    items.update((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...changes } : i)),
    );
  }

  function startUpload(item: UploadItem): void {
    updateItem(item.id, { status: 'uploading', progress: 0 });

    const xhr = new XMLHttpRequest();
    xhrMap.set(item.id, xhr);

    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const pct = Math.round((event.loaded / event.total) * 100);
        updateItem(item.id, { progress: pct });
      }
    };

    xhr.onload = () => {
      xhrMap.delete(item.id);
      if (xhr.status >= 200 && xhr.status < 300) {
        let response: unknown = undefined;
        try { response = JSON.parse(xhr.responseText); } catch { response = xhr.responseText; }
        updateItem(item.id, { status: 'completed', progress: 100, response });
      } else {
        updateItem(item.id, { status: 'failed', error: `HTTP ${xhr.status}: ${xhr.statusText}` });
      }
    };

    xhr.onerror = () => {
      xhrMap.delete(item.id);
      updateItem(item.id, { status: 'failed', error: 'Network error' });
    };

    xhr.onabort = () => {
      xhrMap.delete(item.id);
    };

    xhr.open(method, url, true);

    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    const formData = new FormData();
    formData.append('file', item.file);
    for (const [key, value] of Object.entries(formFields)) {
      formData.append(key, value);
    }

    xhr.send(formData);
  }

  // ── Public API ───────────────────────────────────────────────

  function upload(file: File): void {
    if (maxFileSize > 0 && file.size > maxFileSize) {
      const id = `upload-${++nextId}`;
      const failedItem: UploadItem = { id, file, status: 'failed', progress: 0, error: `File exceeds maximum size of ${(maxFileSize / (1024 * 1024)).toFixed(1)} MB.` };
      items.update((prev) => [...prev, failedItem]);
      return;
    }

    if (!multiple) {
      // Cancel any queued/uploading items
      for (const item of items()) {
        cancel(item.id);
      }
    }

    const id = `upload-${++nextId}`;
    const item: UploadItem = { id, file, status: 'queued', progress: 0 };
    items.update((prev) => [...prev, item]);

    // Start immediately (no separate queue processing needed for v0.1)
    startUpload(item);
  }

  function retry(itemId: string): void {
    const item = items().find((i) => i.id === itemId);
    if (!item || (item.status !== 'failed' && item.status !== 'cancelled')) return;

    const retryItem: UploadItem = {
      id: `upload-${++nextId}`,
      file: item.file,
      status: 'queued',
      progress: 0,
    };
    items.update((prev) => [...prev, retryItem]);
    startUpload(retryItem);
  }

  function cancel(itemId: string): void {
    const xhr = xhrMap.get(itemId);
    if (xhr) {
      xhr.abort();
      xhrMap.delete(itemId);
    }
    updateItem(itemId, { status: 'cancelled', progress: 0 });
  }

  function clearCompleted(): void {
    items.update((prev) => prev.filter((i) => i.status !== 'completed'));
  }

  function clearAll(): void {
    // Cancel any in-flight
    for (const [id, xhr] of xhrMap) {
      xhr.abort();
      xhrMap.delete(id);
    }
    items.set([]);
  }

  destroyRef.onDestroy(() => {
    for (const [, xhr] of xhrMap) {
      xhr.abort();
    }
    xhrMap.clear();
  });

  return {
    queue: items.asReadonly(),
    active,
    isUploading,
    completed,
    failed,
    progress,
    upload,
    retry,
    cancel,
    clearCompleted,
    clearAll,
  };
}
