import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import type { DraftMetadata, FormDraft } from './types';
import { DEFAULT_DEBOUNCE_MS, DEFAULT_TTL_MS } from './types';

export interface FormDraftObservables<T> {
  /** Emits `true` when a draft exists for the key. */
  readonly hasDraft$: Observable<boolean>;
  /** Emits the current draft metadata, or `null`. */
  readonly metadata$: Observable<DraftMetadata | null>;
  /** Emits the current draft data, or `null` if no draft exists. */
  readonly draft$: Observable<FormDraft<T> | null>;
  /** Save data as a draft (debounced via debounceTime). */
  save(data: T): void;
  /** Clear the draft. */
  clear(): void;
}

/**
 * Creates an observable-based form draft manager, mirroring
 * `injectFormDraft()` but without Angular DI.
 *
 * Drafts are persisted to `localStorage` and debounced using RxJS's
 * `debounceTime` operator.
 *
 * @param key - Unique draft identifier (used as localStorage key
 *   prefix).
 * @param options.debounceMs - Debounce delay before persisting.
 *   Default `500`.
 * @param options.ttlMs - Time-to-live for the draft in milliseconds.
 *   Default `86_400_000` (24 hours).
 * @param options.storage - Custom Storage implementation. Defaults
 *   to `localStorage`.
 * @returns An object with `draft$`, `hasDraft$`, `metadata$`
 *   observables and `save`/`clear` methods.
 *
 * @example
 * ```ts
 * import { watchFormDraft } from '@hexguard/angular-form-drafts';
 *
 * const draft = watchFormDraft<{ title: string }>('new-post');
 * draft.draft$.subscribe(d => { if (d) restoreForm(d.data); });
 * draft.save({ title: 'Hello' });
 * ```
 */
export function watchFormDraft<T>(
  key: string,
  options?: {
    readonly debounceMs?: number;
    readonly ttlMs?: number;
    readonly storage?: Storage;
  },
): FormDraftObservables<T> {
  const {
    debounceMs = DEFAULT_DEBOUNCE_MS,
    ttlMs = DEFAULT_TTL_MS,
    storage = typeof localStorage !== 'undefined' ? localStorage : undefined,
  } = options ?? {};

  const storageKey = `hexguard:draft:${key}`;
  const saveSubject = new Subject<T>();
  const draftSubject = new BehaviorSubject<FormDraft<T> | null>(readExistingDraft());

  function readExistingDraft(): FormDraft<T> | null {
    if (!storage) return null;
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) return null;
      const draft: FormDraft<T> = JSON.parse(raw);
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
    storage.setItem(storageKey, JSON.stringify(draft));
    draftSubject.next(draft);
  }

  // Wire up debounced persistence
  const subscription = saveSubject
    .pipe(debounceTime(debounceMs))
    .subscribe((data) => persistDraft(data));

  const hasDraft$ = draftSubject.pipe(
    map((d) => d !== null),
    distinctUntilChanged(),
  );

  const metadata$ = draftSubject.pipe(
    map((d) => d?.meta ?? null),
    distinctUntilChanged(),
  );

  return {
    draft$: draftSubject.asObservable(),
    hasDraft$,
    metadata$,
    save: (data: T) => saveSubject.next(data),
    clear: () => {
      saveSubject.complete();
      subscription.unsubscribe();
      if (storage) storage.removeItem(storageKey);
      draftSubject.next(null);
    },
  };
}
