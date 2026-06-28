import type { Signal } from '@angular/core';

export interface DirtyStateHandle {
  /** Whether the state has been modified since the last clean mark. */
  readonly isDirty: Signal<boolean>;

  /** Mark the state as dirty (modified). */
  markDirty(): void;

  /** Mark the state as clean (unmodified). */
  markClean(): void;

  /** Alias for markClean(). */
  reset(): void;

  /** Capture a snapshot of current values for later comparison. */
  snapshot(): Record<string, unknown>;
}

export interface DirtyGuardOptions {
  /** Custom message shown in the browser's beforeunload dialog. */
  readonly message?: string;
}
