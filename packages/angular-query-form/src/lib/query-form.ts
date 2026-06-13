import { DestroyRef, assertInInjectionContext, effect, inject } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';
import { type InferSchemaValue, type UrlStateSchema, urlState } from '@hexguard/angular-url-state';

import { QueryFormControlMissingError, QueryFormResetKeyError } from './errors';
import type { QueryFormOptions } from './query-form-options';
import type { QueryForm, QueryFormControls, QueryFormSchemaKey } from './types';

const defaultEquals = <T>(left: T, right: T): boolean => Object.is(left, right);

type AnySchema = UrlStateSchema;
type AnySnapshot = Record<string, unknown>;
type ManagedControlMap = ReadonlyMap<string, AbstractControl<unknown>>;

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
  schemaKeys: readonly QueryFormSchemaKey<TSchema>[],
): ManagedControlMap {
  const controls = new Map<string, AbstractControl<unknown>>();

  for (const key of schemaKeys) {
    controls.set(key, readControl(form, key));
  }

  return controls;
}

function normalizeResetKeys<TSchema extends AnySchema>(
  schemaKeys: readonly QueryFormSchemaKey<TSchema>[],
  resetKeysOnChange: QueryFormOptions<TSchema>['resetKeysOnChange'],
): ReadonlyMap<QueryFormSchemaKey<TSchema>, readonly QueryFormSchemaKey<TSchema>[]> {
  const schemaKeySet = new Set<string>(schemaKeys);
  const normalized = new Map<QueryFormSchemaKey<TSchema>, readonly QueryFormSchemaKey<TSchema>[]>();

  for (const [sourceKey, resetKeys] of Object.entries(resetKeysOnChange ?? {}) as Array<
    [QueryFormSchemaKey<TSchema>, readonly QueryFormSchemaKey<TSchema>[] | undefined]
  >) {
    if (!hasSchemaKey(schemaKeySet, sourceKey)) {
      throw new QueryFormResetKeyError(sourceKey);
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
  const codec = schema[key];
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

/**
 * Creates a Reactive Forms binding backed by typed URL query state.
 *
 * `queryForm()` must run inside an Angular injection context. The schema keys
 * must match top-level controls in the supplied `FormGroup`; extra controls are
 * left unmanaged in v0.1.
 */
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
  const { resetKeysOnChange, ...urlStateOptions } = options;
  const state = urlState(schema, urlStateOptions);
  const schemaKeys = Object.keys(schema) as QueryFormSchemaKey<TSchema>[];
  const controls = createManagedControls(form, schemaKeys);
  const normalizedResetKeys = normalizeResetKeys(schemaKeys, resetKeysOnChange);

  let applyingStateToForm = false;

  const syncControlsFromSnapshot = (snapshot: InferSchemaValue<TSchema>): void => {
    applyingStateToForm = true;

    try {
      for (const key of schemaKeys) {
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

  const buildFormPatch = (): Partial<InferSchemaValue<TSchema>> => {
    const currentState = state.snapshot();
    const rawValues = readRawFormValues(form);
    const changedKeys = new Set<QueryFormSchemaKey<TSchema>>();
    const patch: Partial<InferSchemaValue<TSchema>> = {};

    for (const key of schemaKeys) {
      const nextValue = rawValues[key];

      if (!valuesEqual(schema, key, currentState[key], nextValue)) {
        changedKeys.add(key);
        setPatchValue(patch, key, nextValue);
      }
    }

    for (const changedKey of changedKeys) {
      for (const resetKey of normalizedResetKeys.get(changedKey) ?? []) {
        if (changedKeys.has(resetKey)) {
          continue;
        }

        const defaultValue = schema[resetKey].defaultValue;
        const currentValue = hasPatchValue(patch, resetKey)
          ? readPatchValue(patch, resetKey)
          : currentState[resetKey];

        if (!valuesEqual(schema, resetKey, currentValue, defaultValue)) {
          setPatchValue(patch, resetKey, defaultValue);
        }
      }
    }

    return patch;
  };

  const applyStatePatch = (patch: Partial<InferSchemaValue<TSchema>>): void => {
    if (Object.keys(patch).length === 0) {
      return;
    }

    state.patch(patch);
    syncControlsFromSnapshot(state.snapshot());
  };

  syncControlsFromSnapshot(state.snapshot());

  const stateSyncEffect = effect(() => {
    syncControlsFromSnapshot(state.snapshot());
  });

  const formSubscription = form.valueChanges.subscribe(() => {
    if (applyingStateToForm) {
      return;
    }

    applyStatePatch(buildFormPatch());
  });

  destroyRef.onDestroy(() => {
    stateSyncEffect.destroy();
    formSubscription.unsubscribe();
  });

  return {
    form,
    urlState: state,
    snapshot(): InferSchemaValue<TSchema> {
      return state.snapshot();
    },
    patch(value: Partial<InferSchemaValue<TSchema>>): void {
      applyStatePatch(value);
    },
    reset(): void {
      state.reset();
      syncControlsFromSnapshot(state.snapshot());
    },
  };
}
