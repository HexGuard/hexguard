import { type Signal } from '@angular/core';

/** Status of a single upload item. */
export type UploadItemStatus = 'queued' | 'uploading' | 'completed' | 'failed' | 'cancelled';

/** A single file in the upload queue. */
export interface UploadItem {
  readonly id: string;
  readonly file: File;
  readonly status: UploadItemStatus;
  readonly progress: number; // 0–100
  readonly response?: unknown;
  readonly error?: string;
}

/** Options for configuring the upload state. */
export interface UploadOptions {
  /** Upload endpoint URL. */
  url: string;
  /** Allow multiple file selection/queuing. @default false */
  multiple?: boolean;
  /** Maximum file size in bytes. 0 = no limit. @default 0 */
  maxFileSize?: number;
  /** Custom HTTP method. @default 'POST' */
  method?: string;
  /** Custom headers. */
  headers?: Record<string, string>;
  /** Additional form fields to include. */
  formFields?: Record<string, string>;
}

/** Reactive handle returned by `injectUploadState`. */
export interface UploadState {
  /** All items currently in the queue (all statuses). */
  readonly queue: Signal<readonly UploadItem[]>;
  /** The currently uploading item, or null. */
  readonly active: Signal<UploadItem | null>;
  /** Whether any upload is in progress. */
  readonly isUploading: Signal<boolean>;
  /** Completed upload items. */
  readonly completed: Signal<readonly UploadItem[]>;
  /** Failed upload items. */
  readonly failed: Signal<readonly UploadItem[]>;
  /** Overall progress across all items (0–100). */
  readonly progress: Signal<number>;

  /** Upload a file. */
  upload(file: File): void;
  /** Retry a failed upload. */
  retry(itemId: string): void;
  /** Cancel an in-progress or queued upload. */
  cancel(itemId: string): void;
  /** Clear completed items. */
  clearCompleted(): void;
  /** Clear all items. */
  clearAll(): void;
}
