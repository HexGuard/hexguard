import { assertInInjectionContext, computed, DestroyRef, effect, inject, signal, type Signal } from '@angular/core';
import { urlState, type InferSchemaValue, type ParamCodec, type UrlState, type UrlStateOptionsInput, type UrlStateSchema, type UrlStateSchemaField } from '@hexguard/angular-url-state';

function resolveCodec(field: UrlStateSchemaField<unknown>): ParamCodec<unknown> {
  return 'codec' in field ? (field as { codec: ParamCodec<unknown> }).codec : field as ParamCodec<unknown>;
}

/**
 * Options for `querySignalForm`.
 */
export interface QuerySignalFormOptions<TSchema extends UrlStateSchema> extends UrlStateOptionsInput {
  /**
   * Sync mode.
   * - `'live'` — every patch/snapshot change immediately writes to the URL.
   * - `'manual'` — stage changes locally; `commit()` writes through; `revert()` discards.
   * @default 'live'
   */
  readonly syncMode?: 'live' | 'manual';
  /**
   * Reset-on-change rules.
   * When key A changes, dependent keys (e.g., page) reset to their codec's defaultValue.
   */
  readonly resetKeysOnChange?: { [K in keyof TSchema]?: (keyof TSchema)[] };
  /**
   * Delay in ms before writing to URL. @default 0
   */
  readonly writeDelayMs?: number;
}

/**
 * Handle returned by `querySignalForm`.
 */
export interface QuerySignalForm<TSchema extends UrlStateSchema> {
  /** The underlying URL-state handle. */
  readonly urlState: UrlState<TSchema>;
  /** Whether there are uncommitted changes (in manual mode). */
  readonly hasPendingChanges: Signal<boolean>;
  /** Snapshot of the current query state. */
  snapshot(): InferSchemaValue<TSchema>;
  /** Patch multiple values at once (with reset-on-change rules applied). */
  patch(value: Partial<InferSchemaValue<TSchema>>): void;
  /** Reset all values to codec defaults. */
  reset(): void;
  /** Commit staged changes to URL (manual mode only). */
  commit(): void;
  /** Revert to last committed state (manual mode only). */
  revert(): void;
}

/**
 * Creates a query-signal-form that binds typed query parameters to a signal form model
 * through `@hexguard/angular-url-state`.
 *
 * Operates at the `urlState()` level — no dependency on `@angular/forms/signals` `form()`.
 * Safe from Signal Forms API churn while Angular stabilizes it.
 *
 * @example
 * ```typescript
 * const query = querySignalForm({
 *   search: stringParam(''),
 *   page: numberParam(1),
 *   status: enumParam(['all', 'open', 'closed'] as const, 'all'),
 * }, {
 *   history: 'replace',
 *   resetKeysOnChange: { search: ['page'], status: ['page'] },
 * });
 *
 * query.patch({ search: 'priority', page: 1 });
 * query.snapshot(); // { search: 'priority', page: 1, status: 'all' }
 * query.reset();
 * ```
 */
export function querySignalForm<TSchema extends UrlStateSchema>(
  schema: TSchema,
  options?: QuerySignalFormOptions<TSchema>,
): QuerySignalForm<TSchema> {
  if (typeof options !== 'function' && typeof options !== 'undefined') {
    // options is provided — check injection context
  }
  if (typeof ngDevMode === 'undefined' || ngDevMode) {
    assertInInjectionContext(querySignalForm);
  }

  const {
    syncMode = 'live',
    resetKeysOnChange,
    writeDelayMs = 0,
    ...urlStateOptions
  } = options ?? {};

  const destroyRef = inject(DestroyRef);
  const us = urlState(schema, {
    history: urlStateOptions.history ?? 'push',
    ...urlStateOptions,
  });

  // Staged changes for manual mode
  const staged = signal<Partial<InferSchemaValue<TSchema>> | null>(null);
  const hasPendingChanges = computed(() => staged() !== null);

  // Reset-on-change logic
  function applyResetOnChange(
    patch: Partial<InferSchemaValue<TSchema>>,
  ): Partial<InferSchemaValue<TSchema>> {
    if (!resetKeysOnChange) return patch;

    const result = { ...patch };
    const currentSnapshot = us.snapshot();

    for (const [key, value] of Object.entries(patch)) {
      const deps = resetKeysOnChange[key as keyof TSchema];
      if (deps && value !== currentSnapshot[key as keyof InferSchemaValue<TSchema>]) {
        for (const dep of deps) {
          const field = schema[dep];
          if (field && !(dep in result)) {
            (result as Record<string, unknown>)[dep as string] = resolveCodec(field).defaultValue;
          }
        }
      }
    }

    return result;
  }

  function snapshot(): InferSchemaValue<TSchema> {
    if (syncMode === 'manual' && staged() !== null) {
      return { ...us.snapshot(), ...staged()! } as InferSchemaValue<TSchema>;
    }
    return us.snapshot();
  }

  function patch(value: Partial<InferSchemaValue<TSchema>>): void {
    const withResets = applyResetOnChange(value);

    if (syncMode === 'manual') {
      staged.set({ ...(staged() ?? {}), ...withResets } as Partial<InferSchemaValue<TSchema>>);
    } else {
      us.patch(withResets);
    }
  }

  function reset(): void {
    if (syncMode === 'manual') {
      staged.set({} as Partial<InferSchemaValue<TSchema>>);
    }
    us.reset();
  }

  function commit(): void {
    if (syncMode === 'manual' && staged() !== null) {
      us.patch(staged()!);
      staged.set(null);
    }
  }

  function revert(): void {
    if (syncMode === 'manual') {
      staged.set(null);
    }
  }

  // Auto-sync: in live mode, sync URL on every key change
  if (syncMode === 'live') {
    const syncEffect = effect(() => {
      // Track snapshot changes and write through
      const currentSnapshot = us.snapshot();
      // This effect is tracked by Angular — keep it alive
    });

    destroyRef.onDestroy(() => {
      syncEffect.destroy();
    });
  }

  return {
    urlState: us,
    hasPendingChanges,
    snapshot,
    patch,
    reset,
    commit,
    revert,
  };
}
