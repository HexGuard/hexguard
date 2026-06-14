import type { WritableSignal } from '@angular/core';

/** Raw query-param shape as exposed by Angular's query-param map APIs. */
export type ParamRawValue = string | readonly string[] | null;

/** Chooses whether URL writes replace or push browser history entries. */
export type UrlStateHistoryMode = 'replace' | 'push';

/** Controls what happens when incoming query params fail to parse. */
export type InvalidParamBehavior = 'fallbackToDefault' | 'removeInvalid' | 'throwInDev';

/** Successful param parse result. */
export interface ParamParseSuccess<T> {
  readonly ok: true;
  readonly value: T;
}

/** Failed param parse result with a safe fallback value. */
export interface ParamParseFailure<T> {
  readonly ok: false;
  readonly reason: string;
  readonly fallback: T;
}

/** Result of parsing one query parameter into an application value. */
export type ParamParseResult<T> = ParamParseSuccess<T> | ParamParseFailure<T>;

/**
 * Bidirectional translator between a typed application value and query-param
 * strings.
 */
export interface ParamCodec<T> {
  readonly defaultValue: T;
  parse(raw: ParamRawValue): ParamParseResult<T>;
  serialize(value: T): ParamRawValue;
  /**
   * Optional semantic equality used to suppress redundant signal writes and
   * router navigations for codecs that produce fresh arrays, dates, or object
   * values on every parse.
   */
  equals?(left: T, right: T): boolean;
}

/** Optional schema metadata for remapping one local field to a different query key. */
export interface UrlStateSchemaFieldConfig<T> {
  readonly codec: ParamCodec<T>;
  readonly queryKey?: string;
}

/** One schema field, expressed as either a bare codec or a remapped query-key config. */
export type UrlStateSchemaField<T> = ParamCodec<T> | UrlStateSchemaFieldConfig<T>;

/** Object schema used by `urlState()` to map local state keys to query-param codecs. */
export type UrlStateSchema = Record<string, UrlStateSchemaField<unknown>>;

/** Infers the application value type produced by one codec. */
export type InferCodecValue<TCodec> =
  TCodec extends ParamCodec<infer TValue>
    ? TValue
    : TCodec extends UrlStateSchemaFieldConfig<infer TValue>
      ? TValue
      : never;

/** Infers the snapshot object shape represented by a schema. */
export type InferSchemaValue<TSchema extends UrlStateSchema> = {
  [K in keyof TSchema]: InferCodecValue<TSchema[K]>;
};

/** Maps a schema to writable Angular signals for each query-param key. */
export type UrlStateSignalMap<TSchema extends UrlStateSchema> = {
  [K in keyof TSchema]: WritableSignal<InferCodecValue<TSchema[K]>>;
};

/** High-level state handle returned by `urlState()`. */
export type UrlState<TSchema extends UrlStateSchema> = UrlStateSignalMap<TSchema> & {
  reset(): void;
  snapshot(): InferSchemaValue<TSchema>;
  patch(value: Partial<InferSchemaValue<TSchema>>): void;
};
