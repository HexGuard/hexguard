import { DestroyRef, effect, inject, signal } from '@angular/core';
import type { DraftMetadata, FormDraft, FormDraftHandle, FormDraftOptions } from './types';
import { DEFAULT_DEBOUNCE_MS, DEFAULT_TTL_MS } from './types';

/**
 * Creates a localStorage-backed form draft handle.
 *
 * Automatically saves form data on changes (debounced) and provides
 * restore/clear functionality with configurable TTL expiry.
 *
 * @example
 * ```typescript
 * const draft = injectFormDraft<{ title: string; body: string }>('new-post');
 *
 * // Restore saved draft
 * const saved = draft.restore();
 * if (saved) form.patchValue(saved.data);
 *
 * // Auto-save on changes (debounced at 500ms)
 * draft.save({ title: form.value.title, body: form.value.body });
 *
 * // Check if draft exists
 * // @if (draft.hasDraft()) { <p>You have a saved draft</p> }
 * ```
 */
export function injectFormDraft<T>(key: string, options?: FormDraftOptions<T>): FormDraftHandle<T> {
  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    ttlMs = DEFAULT_TTL_MS,
    storage = typeof localStorage !== 'undefined' ? localStorage : undefined,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options ?? {};

  const storageKey = `hexguard:draft:${key}`;

  const hasDraft = signal(false);
  const metadata = signal<DraftMetadata | null>(null);
  let pendingData: T | null = null;
  let saveTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const destroyRef = inject(DestroyRef);

  /** Helper: read raw draft from storage and check expiry. */
  function readDraft(): FormDraft<T> | null {
    if (!storage) return null;
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return null;
      const draft: FormDraft<T> = deserialize(raw);
      const now = Date.now();
      const expires = new Date(draft.meta.expiresAt).getTime();
      if (isNaN(expires) || now > expires) {
        storage.removeItem(storageKey);
        return null;
      }
      return draft;
    } catch {
      return null;
    }
  }

  /** Helper: persist a draft to storage. */
  function persistDraft(data: T): void {
    if (!storage) return;
    const now = new Date();
    const expires = new Date(now.getTime() + ttlMs);
    const draft: FormDraft<T> = {
      data,
      meta: {
        savedAt: now.toISOString(),
        expiresAt: expires.toISOString(),
      },
    };
    storage.setItem(storageKey, serialize(draft));
    hasDraft.set(true);
    metadata.set(draft.meta);
  }

  // Initialize from storage on creation
  const existing = readDraft();
  if (existing) {
    hasDraft.set(true);
    metadata.set(existing.meta);
  }

  destroyRef.onDestroy(() => {
    if (saveTimeoutId !== null) {
      clearTimeout(saveTimeoutId);
      saveTimeoutId = null;
    }
  });

  return {
    hasDraft: hasDraft.asReadonly(),
    metadata: metadata.asReadonly(),

    restore(): FormDraft<T> | null {
      const draft = readDraft();
      if (draft) {
        hasDraft.set(true);
        metadata.set(draft.meta);
      } else {
        hasDraft.set(false);
        metadata.set(null);
      }
      return draft;
    },

    save(data: T): void {
      pendingData = data;
      if (saveTimeoutId !== null) {
        clearTimeout(saveTimeoutId);
      }
      saveTimeoutId = setTimeout(() => {
        saveTimeoutId = null;
        if (pendingData !== null) {
          persistDraft(pendingData);
          pendingData = null;
        }
      }, debounceMs);
    },

    clear(): void {
      if (saveTimeoutId !== null) {
        clearTimeout(saveTimeoutId);
        saveTimeoutId = null;
      }
      pendingData = null;
      if (storage) {
        storage.removeItem(storageKey);
      }
      hasDraft.set(false);
      metadata.set(null);
    },
  };
}
