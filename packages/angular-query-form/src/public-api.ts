/**
 * Public API for `@hexguard/angular-query-form`.
 *
 * The package deliberately keeps form behavior narrow: a Reactive Forms
 * binding factory, public handle/options types, configuration errors, and
 * ergonomic re-exports for the URL-state codecs it builds on.
 */
export {
  arrayParam,
  booleanParam,
  dateIsoParam,
  enumParam,
  nullableParam,
  numberParam,
  provideHexGuardUrlState,
  stringParam,
} from '@hexguard/angular-url-state';
export type {
  InferCodecValue,
  InferSchemaValue,
  InvalidParamBehavior,
  ParamCodec,
  ParamParseFailure,
  ParamParseResult,
  ParamParseSuccess,
  ParamRawValue,
  UrlState,
  UrlStateHistoryMode,
  UrlStateOptions,
  UrlStateOptionsInput,
  UrlStateSchema,
} from '@hexguard/angular-url-state';

export { QueryFormControlMissingError, QueryFormResetKeyError } from './lib/errors';
export { queryForm } from './lib/query-form';
export type { QueryFormOptions } from './lib/query-form-options';
export type { QueryForm, QueryFormControls, QueryFormResetKeysOnChange } from './lib/types';
