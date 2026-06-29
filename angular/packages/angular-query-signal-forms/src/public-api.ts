/**
 * Public API for `@hexguard/angular-query-signal-forms`.
 *
 * Binds typed query parameters to signal form models through `@hexguard/angular-url-state`.
 */
export { querySignalForm } from './lib/query-signal-form';
export type { QuerySignalForm, QuerySignalFormOptions } from './lib/query-signal-form';

// Re-export url-state codecs for single-package import
export { stringParam, numberParam, booleanParam, enumParam, arrayParam, dateIsoParam, nullableParam } from '@hexguard/angular-url-state';
export type { ParamCodec, ParamRawValue, ParamParseResult, ParamParseSuccess, ParamParseFailure, InferCodecValue, InferSchemaValue, InvalidParamBehavior, UrlStateHistoryMode } from '@hexguard/angular-url-state';
