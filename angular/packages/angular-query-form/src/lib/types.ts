import type { AbstractControl, FormGroup } from '@angular/forms';
import type { InferSchemaValue, UrlState, UrlStateSchema } from '@hexguard/angular-url-state';

/** String key owned by a query-form schema. */
export type QueryFormSchemaKey<TSchema extends UrlStateSchema> = Extract<keyof TSchema, string>;

/** Reactive Forms controls whose values match the URL-state schema values. */
export type QueryFormControls<TSchema extends UrlStateSchema> = {
  [K in QueryFormSchemaKey<TSchema>]: AbstractControl<InferSchemaValue<TSchema>[K]>;
};

/** Maps changed schema keys to dependent schema keys that should reset to codec defaults. */
export type QueryFormResetKeysOnChange<TSchema extends UrlStateSchema> = Partial<{
  readonly [K in QueryFormSchemaKey<TSchema>]: readonly QueryFormSchemaKey<TSchema>[];
}>;

/** High-level handle returned by `queryForm()`. */
export interface QueryForm<TSchema extends UrlStateSchema, TForm extends FormGroup = FormGroup> {
  readonly form: TForm;
  /** Low-level escape hatch for direct signal access when the form surface is not enough. */
  readonly urlState: UrlState<TSchema>;
  snapshot(): InferSchemaValue<TSchema>;
  patch(value: Partial<InferSchemaValue<TSchema>>): void;
  reset(): void;
}
