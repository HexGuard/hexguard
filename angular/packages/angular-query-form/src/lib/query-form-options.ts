import type { UrlStateOptionsInput, UrlStateSchema } from '@hexguard/angular-url-state';

import type {
  QueryFormManagedKeys,
  QueryFormResetKeysOnChange,
  QueryFormSchemaKey,
  QueryFormSyncMode,
} from './types';

/** Options accepted by `queryForm()` for URL sync and form-specific reset behavior. */
export interface QueryFormOptions<
  TSchema extends UrlStateSchema,
  TManagedKey extends QueryFormSchemaKey<TSchema> = QueryFormSchemaKey<TSchema>,
> extends UrlStateOptionsInput {
  /**
   * Limits form binding to a subset of schema keys while one urlState handle
   * still owns the full query-param schema.
   */
  readonly managedKeys?: QueryFormManagedKeys<TSchema>;

  /**
   * Resets dependent query keys to codec defaults when a source form control changes.
   *
   * A common search-page example is resetting `page` whenever `search`, `status`,
   * or another filter field changes. Source keys must be managed by this binding;
   * reset targets may be any schema keys.
   */
  readonly resetKeysOnChange?: QueryFormResetKeysOnChange<TSchema, TManagedKey>;

  /**
   * Chooses whether form edits patch the URL immediately or wait for `commit()`.
   */
  readonly syncMode?: QueryFormSyncMode;
}
