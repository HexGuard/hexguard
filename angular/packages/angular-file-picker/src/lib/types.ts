/** Read modes for file content extraction. */
export type FileReadMode = 'text' | 'dataUrl' | 'buffer' | 'none';

/** Configuration for the file picker. */
export interface FilePickerOptions {
  /**
   * Accepted MIME types or file extensions, e.g. `'image/*'`, `['.pdf', '.docx']`.
   * Applied to both the file input `accept` attribute and client-side validation.
   */
  readonly accept?: string | readonly string[];
  /**
   * Maximum file size in bytes. Files exceeding this size are rejected with an error.
   * @default 10_485_760 (10 MB)
   */
  readonly maxFileSize?: number;
  /** Allow multiple file selection. */
  readonly multiple?: boolean;
  /**
   * How to read each selected file's content.
   * - `'text'`: read as UTF-8 text string
   * - `'dataUrl'`: read as data URL (base64-encoded)
   * - `'buffer'`: read as ArrayBuffer
   * - `'none'`: do not read — file metadata only
   * @default 'text'
   */
  readonly readMode?: FileReadMode;
}

export const DEFAULT_MAX_FILE_SIZE = 10_485_760; // 10 MB

/** Descriptor for a single selected file, including its content. */
export interface FileHandle<T = string | ArrayBuffer | null> {
  /** File name. */
  readonly name: string;
  /** File size in bytes. */
  readonly size: number;
  /** MIME type of the file. */
  readonly type: string;
  /** The file's content, read according to the configured `readMode`. */
  readonly content: T;
}

/** Reactive handle returned by {@link injectFilePicker}. */
export interface FilePickerHandle<T = string | ArrayBuffer | null> {
  /** List of selected files with their contents. */
  readonly files: import('@angular/core').Signal<readonly FileHandle<T>[]>;
  /** Whether file reading is in progress. */
  readonly loading: import('@angular/core').Signal<boolean>;
  /** Last validation or read error, or `null`. */
  readonly error: import('@angular/core').Signal<string | null>;
  /**
   * Current read mode. Changing this affects subsequent file selections.
   * Does not re-read already-loaded files.
   */
  readonly readMode: import('@angular/core').WritableSignal<FileReadMode>;
  /** Open the native file picker dialog. */
  open(): void;
  /** Clear all selected files. */
  clear(): void;
  /**
   * Process files from a drag-and-drop event.
   * Call this from a drop zone's `(drop)` handler.
   */
  acceptDrop(event: DragEvent): void;
}
