import type { WritableSignal } from '@angular/core';

export type ParamRawValue = string | readonly string[] | null;

export type UrlStateHistoryMode = 'replace' | 'push';

export type InvalidParamBehavior = 'fallbackToDefault' | 'removeInvalid' | 'throwInDev';

export interface ParamParseSuccess<T> {
  readonly ok: true;
  readonly value: T;
}

export interface ParamParseFailure<T> {
  readonly ok: false;
  readonly reason: string;
  readonly fallback: T;
}

export type ParamParseResult<T> = ParamParseSuccess<T> | ParamParseFailure<T>;

export interface ParamCodec<T> {
  readonly defaultValue: T;
  parse(raw: ParamRawValue): ParamParseResult<T>;
  serialize(value: T): ParamRawValue;
  equals?(left: T, right: T): boolean;
}

export type UrlStateSchema = Record<string, ParamCodec<unknown>>;

export type InferCodecValue<TCodec> = TCodec extends ParamCodec<infer TValue> ? TValue : never;

export type InferSchemaValue<TSchema extends UrlStateSchema> = {
  [K in keyof TSchema]: InferCodecValue<TSchema[K]>;
};

export type UrlStateSignalMap<TSchema extends UrlStateSchema> = {
  [K in keyof TSchema]: WritableSignal<InferCodecValue<TSchema[K]>>;
};

export type UrlState<TSchema extends UrlStateSchema> = UrlStateSignalMap<TSchema> & {
  reset(): void;
  snapshot(): InferSchemaValue<TSchema>;
  patch(value: Partial<InferSchemaValue<TSchema>>): void;
};
