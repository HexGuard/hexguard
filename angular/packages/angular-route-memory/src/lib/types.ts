import type { Signal } from '@angular/core';

export interface RouteMemoryOptions {
  /**
   * Optional serialized mode — JSON-roundtrips context through sessionStorage
   * to survive hard navigations and browser refreshes.
   */
  serialized?: boolean;
}

export interface RouteMemoryHandle {
  /** Signal indicating whether a value exists for the given key. */
  hasMemory(key: string): Signal<boolean>;

  /** Save route-scoped context under the given key. */
  save(key: string, context: Record<string, unknown>): void;

  /** Restore previously saved context, or null if nothing was saved. */
  restore(key: string): Record<string, unknown> | null;

  /** Clear saved context for a specific key. */
  clear(key: string): void;

  /** Clear all saved route memory. */
  clearAll(): void;

  /**
   * Auto-save the context returned by `factory` when the current
   * injection scope is destroyed.
   */
  autoSave(key: string, factory: () => Record<string, unknown>): void;
}
