import type { Signal } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';
import type { InferSchemaValue, UrlState, UrlStateSchema } from '@hexguard/angular-url-state';

/** String key owned by a query-form schema. */
export type QueryFormSchemaKey<TSchema extends UrlStateSchema> = Extract<keyof TSchema, string>;

/** Ordered subset of schema keys whose matching form controls are managed by queryForm(). */
export type QueryFormManagedKeys<TSchema extends UrlStateSchema> =
  readonly QueryFormSchemaKey<TSchema>[];

/** Controls whether query-form writes stay live or wait for an explicit commit. */
export type QueryFormSyncMode = 'live' | 'manual';

/** Reactive Forms controls whose values match the URL-state schema values. */
export type QueryFormControls<
  TSchema extends UrlStateSchema,
  TManagedKey extends QueryFormSchemaKey<TSchema> = QueryFormSchemaKey<TSchema>,
> = {
  [K in TManagedKey]: AbstractControl<InferSchemaValue<TSchema>[K]>;
};

/** Maps changed schema keys to dependent schema keys that should reset to codec defaults. */
export type QueryFormResetKeysOnChange<
  TSchema extends UrlStateSchema,
  TManagedKey extends QueryFormSchemaKey<TSchema> = QueryFormSchemaKey<TSchema>,
> = Partial<{
  readonly [K in TManagedKey]: readonly QueryFormSchemaKey<TSchema>[];
}>;

/** High-level handle returned by `queryForm()`. */
export interface QueryForm<TSchema extends UrlStateSchema, TForm extends FormGroup = FormGroup> {
  readonly form: TForm;
  /** Low-level escape hatch for direct signal access when the form surface is not enough. */
  readonly urlState: UrlState<TSchema>;
  /** Indicates whether staged form edits differ from the committed URL state. */
  readonly hasPendingChanges: Signal<boolean>;
  /** Current committed URL-backed snapshot. Manual mode excludes staged edits until commit(). */
  snapshot(): InferSchemaValue<TSchema>;
  /** Immediately patches the committed URL-backed state. */
  patch(value: Partial<InferSchemaValue<TSchema>>): void;
  /** Resets the committed URL-backed state to codec defaults and clears staged edits. */
  reset(): void;
  /** Commits staged manual edits. This is a no-op when syncMode is 'live'. */
  commit(): void;
  /** Reverts staged manual edits back to the current committed URL state. */
  revert(): void;
}
