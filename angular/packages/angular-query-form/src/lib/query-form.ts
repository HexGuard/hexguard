import { DestroyRef, assertInInjectionContext, effect, inject, signal } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';
import {
  type InferSchemaValue,
  type UrlStateSchema,
  type UrlStateSchemaField,
  type UrlStateSchemaFieldConfig,
  urlState,
} from '@hexguard/angular-url-state';

import {
  QueryFormControlMissingError,
  QueryFormManagedKeyError,
  QueryFormResetKeyError,
} from './errors';
import type { QueryFormOptions } from './query-form-options';
import type { QueryForm, QueryFormControls, QueryFormSchemaKey } from './types';

const defaultEquals = <T>(left: T, right: T): boolean => Object.is(left, right);

type AnySchema = UrlStateSchema;
type AnySnapshot = Record<string, unknown>;
type ManagedControlMap = ReadonlyMap<string, AbstractControl<unknown>>;

function isSchemaFieldConfig<T>(
  field: UrlStateSchemaField<T>,
): field is UrlStateSchemaFieldConfig<T> {
  return Object.prototype.hasOwnProperty.call(field, 'codec');
}

function resolveSchemaCodec<T>(field: UrlStateSchemaField<T>) {
  return isSchemaFieldConfig(field) ? field.codec : field;
}

function readControl(form: FormGroup, key: string): AbstractControl<unknown> {
  const control = (form.controls as Record<string, AbstractControl<unknown> | undefined>)[key];

  if (!control) {
    throw new QueryFormControlMissingError(key);
  }

  return control;
}

function hasSchemaKey(schemaKeys: ReadonlySet<string>, key: string): boolean {
  return schemaKeys.has(key);
}

function createManagedControls<TSchema extends AnySchema>(
  form: FormGroup,
  managedKeys: readonly QueryFormSchemaKey<TSchema>[],
): ManagedControlMap {
  const controls = new Map<string, AbstractControl<unknown>>();

  for (const key of managedKeys) {
    controls.set(key, readControl(form, key));
  }

  return controls;
}

function normalizeManagedKeys<TSchema extends AnySchema>(
  schemaKeys: readonly QueryFormSchemaKey<TSchema>[],
  configuredManagedKeys: QueryFormOptions<TSchema>['managedKeys'],
): readonly QueryFormSchemaKey<TSchema>[] {
  if (configuredManagedKeys === undefined) {
    return schemaKeys;
  }

  const schemaKeySet = new Set<string>(schemaKeys);
  const seenManagedKeys = new Set<string>();
  const normalized: QueryFormSchemaKey<TSchema>[] = [];

  for (const key of configuredManagedKeys as readonly QueryFormSchemaKey<TSchema>[]) {
    if (!hasSchemaKey(schemaKeySet, key)) {
      throw new QueryFormManagedKeyError(key);
    }

    if (seenManagedKeys.has(key)) {
      throw new QueryFormManagedKeyError(
        key,
        `queryForm managedKeys contains duplicate key "${key}".`,
      );
    }

    seenManagedKeys.add(key);
    normalized.push(key);
  }

  return normalized;
}

function normalizeResetKeys<TSchema extends AnySchema>(
  schemaKeys: readonly QueryFormSchemaKey<TSchema>[],
  managedKeys: readonly QueryFormSchemaKey<TSchema>[],
  resetKeysOnChange: QueryFormOptions<TSchema>['resetKeysOnChange'],
): ReadonlyMap<QueryFormSchemaKey<TSchema>, readonly QueryFormSchemaKey<TSchema>[]> {
  const schemaKeySet = new Set<string>(schemaKeys);
  const managedKeySet = new Set<string>(managedKeys);
  const normalized = new Map<QueryFormSchemaKey<TSchema>, readonly QueryFormSchemaKey<TSchema>[]>();

  for (const [sourceKey, resetKeys] of Object.entries(resetKeysOnChange ?? {}) as Array<
    [QueryFormSchemaKey<TSchema>, readonly QueryFormSchemaKey<TSchema>[] | undefined]
  >) {
    if (!hasSchemaKey(schemaKeySet, sourceKey)) {
      throw new QueryFormResetKeyError(sourceKey);
    }

    if (!managedKeySet.has(sourceKey)) {
      throw new QueryFormResetKeyError(
        sourceKey,
        `queryForm resetKeysOnChange source key "${sourceKey}" is not managed by this binding.`,
      );
    }

    const safeResetKeys: QueryFormSchemaKey<TSchema>[] = [];

    for (const resetKey of resetKeys ?? []) {
      if (!hasSchemaKey(schemaKeySet, resetKey)) {
        throw new QueryFormResetKeyError(resetKey);
      }

      safeResetKeys.push(resetKey);
    }

    normalized.set(sourceKey, safeResetKeys);
  }

  return normalized;
}

function valuesEqual<TSchema extends AnySchema>(
  schema: TSchema,
  key: QueryFormSchemaKey<TSchema>,
  left: unknown,
  right: unknown,
): boolean {
  const codec = resolveSchemaCodec(schema[key]);
  const equals = codec.equals ?? defaultEquals;

  return equals(left, right);
}

function setPatchValue<TSchema extends AnySchema>(
  patch: Partial<InferSchemaValue<TSchema>>,
  key: QueryFormSchemaKey<TSchema>,
  value: unknown,
): void {
  (patch as Record<string, unknown>)[key] = value;
}

function hasPatchValue<TSchema extends AnySchema>(
  patch: Partial<InferSchemaValue<TSchema>>,
  key: QueryFormSchemaKey<TSchema>,
): boolean {
  return Object.prototype.hasOwnProperty.call(patch, key);
}

function readPatchValue<TSchema extends AnySchema>(
  patch: Partial<InferSchemaValue<TSchema>>,
  key: QueryFormSchemaKey<TSchema>,
): unknown {
  return (patch as Record<string, unknown>)[key];
}

function readRawFormValues(form: FormGroup): AnySnapshot {
  return form.getRawValue() as AnySnapshot;
}

function snapshotsEqual<TSchema extends AnySchema>(
  schema: TSchema,
  schemaKeys: readonly QueryFormSchemaKey<TSchema>[],
  left: InferSchemaValue<TSchema>,
  right: InferSchemaValue<TSchema>,
): boolean {
  for (const key of schemaKeys) {
    if (!valuesEqual(schema, key, left[key], right[key])) {
      return false;
    }
  }

  return true;
}

function diffSnapshots<TSchema extends AnySchema>(
  schema: TSchema,
  schemaKeys: readonly QueryFormSchemaKey<TSchema>[],
  left: InferSchemaValue<TSchema>,
  right: InferSchemaValue<TSchema>,
): Partial<InferSchemaValue<TSchema>> {
  const patch: Partial<InferSchemaValue<TSchema>> = {};

  for (const key of schemaKeys) {
    if (!valuesEqual(schema, key, left[key], right[key])) {
      setPatchValue(patch, key, right[key]);
    }
  }

  return patch;
}

/**
 * Creates a Reactive Forms binding backed by typed URL query state.
 *
 * `queryForm()` must run inside an Angular injection context because it creates
 * one underlying `urlState()` handle.
 *
 * By default every schema key must have a matching top-level control in the
 * supplied `FormGroup`. When `managedKeys` is provided, only that subset needs
 * matching controls and the remaining schema keys stay URL-owned through
 * `query.urlState`.
 *
 * `syncMode: 'live'` writes managed form edits through immediately. `syncMode:
 * 'manual'` stages managed edits locally until `commit()` and exposes
 * `hasPendingChanges` plus `revert()`.
 */
export function queryForm<
  TSchema extends UrlStateSchema,
  TManagedKey extends QueryFormSchemaKey<TSchema>,
  TControls extends QueryFormControls<TSchema, TManagedKey>,
>(
  form: FormGroup<TControls>,
  schema: TSchema,
  options: QueryFormOptions<TSchema, TManagedKey> & { managedKeys: readonly TManagedKey[] },
): QueryForm<TSchema, FormGroup<TControls>>;
export function queryForm<
  TSchema extends UrlStateSchema,
  TControls extends QueryFormControls<TSchema>,
>(
  form: FormGroup<TControls>,
  schema: TSchema,
  options?: QueryFormOptions<TSchema>,
): QueryForm<TSchema, FormGroup<TControls>>;
export function queryForm<TSchema extends UrlStateSchema>(
  form: FormGroup,
  schema: TSchema,
  options?: QueryFormOptions<TSchema>,
): QueryForm<TSchema>;
export function queryForm<TSchema extends UrlStateSchema>(
  form: FormGroup,
  schema: TSchema,
  options: QueryFormOptions<TSchema> = {},
): QueryForm<TSchema> {
  assertInInjectionContext(queryForm);

  const destroyRef = inject(DestroyRef);
  const {
    managedKeys: configuredManagedKeys,
    resetKeysOnChange,
    syncMode = 'live',
    ...urlStateOptions
  } = options;
  const state = urlState(schema, urlStateOptions);
  const schemaKeys = Object.keys(schema) as QueryFormSchemaKey<TSchema>[];
  const managedKeys = normalizeManagedKeys(schemaKeys, configuredManagedKeys);
  const controls = createManagedControls(form, managedKeys);
  const normalizedResetKeys = normalizeResetKeys(schemaKeys, managedKeys, resetKeysOnChange);
  const hasPendingChanges = signal(false);

  let applyingStateToForm = false;
  let stagedState = state.snapshot();

  const syncControlsFromSnapshot = (snapshot: InferSchemaValue<TSchema>): void => {
    applyingStateToForm = true;

    try {
      for (const key of managedKeys) {
        const control = controls.get(key);

        if (!control) {
          continue;
        }

        const nextValue = snapshot[key];

        if (!valuesEqual(schema, key, control.value, nextValue)) {
          control.setValue(nextValue, { emitEvent: false });
        }
      }
    } finally {
      applyingStateToForm = false;
    }
  };

  const syncCommittedState = (snapshot: InferSchemaValue<TSchema>): void => {
    stagedState = snapshot;
    hasPendingChanges.set(false);
    syncControlsFromSnapshot(snapshot);
  };

  const buildFormPatch = (
    baseState: InferSchemaValue<TSchema>,
  ): Partial<InferSchemaValue<TSchema>> => {
    const rawValues = readRawFormValues(form);
    const changedKeys = new Set<QueryFormSchemaKey<TSchema>>();
    const patch: Partial<InferSchemaValue<TSchema>> = {};

    for (const key of managedKeys) {
      const nextValue = rawValues[key];

      if (!valuesEqual(schema, key, baseState[key], nextValue)) {
        changedKeys.add(key);
        setPatchValue(patch, key, nextValue);
      }
    }

    for (const changedKey of changedKeys) {
      for (const resetKey of normalizedResetKeys.get(changedKey) ?? []) {
        if (changedKeys.has(resetKey)) {
          continue;
        }

        const defaultValue = resolveSchemaCodec(schema[resetKey]).defaultValue;
        const currentValue = hasPatchValue(patch, resetKey)
          ? readPatchValue(patch, resetKey)
          : baseState[resetKey];

        if (!valuesEqual(schema, resetKey, currentValue, defaultValue)) {
          setPatchValue(patch, resetKey, defaultValue);
        }
      }
    }

    return patch;
  };

  const applyCommittedPatch = (patch: Partial<InferSchemaValue<TSchema>>): void => {
    if (Object.keys(patch).length === 0) {
      return;
    }

    state.patch(patch);
    syncCommittedState(state.snapshot());
  };

  syncCommittedState(state.snapshot());

  const stateSyncEffect = effect(() => {
    syncCommittedState(state.snapshot());
  });

  const formSubscription = form.valueChanges.subscribe(() => {
    if (applyingStateToForm) {
      return;
    }

    if (syncMode === 'manual') {
      const patch = buildFormPatch(stagedState);

      if (Object.keys(patch).length === 0) {
        hasPendingChanges.set(!snapshotsEqual(schema, schemaKeys, stagedState, state.snapshot()));
        return;
      }

      stagedState = {
        ...stagedState,
        ...patch,
      };
      hasPendingChanges.set(!snapshotsEqual(schema, schemaKeys, stagedState, state.snapshot()));
      syncControlsFromSnapshot(stagedState);
      return;
    }

    applyCommittedPatch(buildFormPatch(state.snapshot()));
  });

  destroyRef.onDestroy(() => {
    stateSyncEffect.destroy();
    formSubscription.unsubscribe();
  });

  return {
    form,
    urlState: state,
    hasPendingChanges,
    snapshot(): InferSchemaValue<TSchema> {
      return state.snapshot();
    },
    patch(value: Partial<InferSchemaValue<TSchema>>): void {
      applyCommittedPatch(value);
    },
    reset(): void {
      state.reset();
      syncCommittedState(state.snapshot());
    },
    commit(): void {
      if (syncMode !== 'manual') {
        return;
      }

      applyCommittedPatch(diffSnapshots(schema, schemaKeys, state.snapshot(), stagedState));
    },
    revert(): void {
      syncCommittedState(state.snapshot());
    },
  };
}
