/** Metadata associated with a saved draft. */
export interface DraftMetadata {
  /** ISO timestamp when the draft was last saved. */
  readonly savedAt: string;
  /** ISO timestamp when the draft expires and should be considered stale. */
  readonly expiresAt: string;
}

/** A saved form draft including data and metadata. */
export interface FormDraft<T> {
  /** The form data payload. */
  readonly data: T;
  /** Draft metadata. */
  readonly meta: DraftMetadata;
}

/** Options for configuring a form draft instance. */
export interface FormDraftOptions<T> {
  /**
   * Auto-save debounce in milliseconds.
   * @default 500
   */
  readonly debounceMs?: number;
  /**
   * Draft TTL (time-to-live) in milliseconds. Drafts older than this are
   * considered stale and won't be restored.
   * @default 86_400_000 (24 hours)
   */
  readonly ttlMs?: number;
  /**
   * Optional custom storage backend. Defaults to `localStorage`.
   */
  readonly storage?: Storage;
  /**
   * Optional serialization function. Defaults to `JSON.stringify`.
   */
  readonly serialize?: (value: FormDraft<T>) => string;
  /**
   * Optional deserialization function. Defaults to `JSON.parse`.
   */
  readonly deserialize?: (raw: string) => FormDraft<T>;
}

export const DEFAULT_DEBOUNCE_MS = 500;
export const DEFAULT_TTL_MS = 86_400_000; // 24 hours

/** Reactive handle returned by {@link injectFormDraft}. */
export interface FormDraftHandle<T> {
  /** Whether a saved draft exists and is not expired. */
  readonly hasDraft: import('@angular/core').Signal<boolean>;
  /** Restore the saved draft data, or `null` if none exists or it's expired. */
  restore(): FormDraft<T> | null;
  /** Save the current form data as a draft. */
  save(data: T): void;
  /** Delete the saved draft. */
  clear(): void;
  /** Get the draft metadata, or `null` if no draft exists. */
  readonly metadata: import('@angular/core').Signal<DraftMetadata | null>;
}
