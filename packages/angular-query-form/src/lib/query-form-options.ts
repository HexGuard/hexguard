import type { UrlStateOptionsInput, UrlStateSchema } from '@hexguard/angular-url-state';

import type { QueryFormResetKeysOnChange } from './types';

/** Options accepted by `queryForm()` for URL sync and form-specific reset behavior. */
export interface QueryFormOptions<TSchema extends UrlStateSchema> extends UrlStateOptionsInput {
  /**
   * Resets dependent query keys to codec defaults when a source form control changes.
   *
   * A common search-page example is resetting `page` whenever `search`, `status`,
   * or another filter field changes.
   */
  readonly resetKeysOnChange?: QueryFormResetKeysOnChange<TSchema>;
}
