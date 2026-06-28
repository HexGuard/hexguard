import type { Signal } from '@angular/core';

export type PermissionState = 'granted' | 'denied' | 'prompt' | 'unsupported';

export interface ClipboardConfig {
  /** Maximum number of history entries to retain. Default: 10. */
  readonly historySize?: number;
}

export interface ClipboardHandle {
  /** Signal with the last successfully copied text. */
  readonly lastCopied: Signal<string | null>;
  /** Signal with the last successfully pasted text. */
  readonly lastPasted: Signal<string | null>;
  /** Signal with the in-memory copy history (most recent first). */
  readonly history: Signal<readonly string[]>;
  /** Signal indicating whether a copy operation is in progress. */
  readonly isCopying: Signal<boolean>;
  /** Signal with the last copy error message, or null. */
  readonly copyError: Signal<string | null>;
  /** Signal with the current clipboard permission state. */
  readonly permissionState: Signal<PermissionState>;

  /** Copy text to clipboard. Returns true on success. Falls back to execCommand. */
  copy(text: string): Promise<boolean>;
  /** Read text from clipboard. Returns null on failure or denial. */
  paste(): Promise<string | null>;
  /** Clear the in-memory copy history. */
  clearHistory(): void;
}
