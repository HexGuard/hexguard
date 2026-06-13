import type { InferSchemaValue, ParamRawValue, UrlStateSchema } from './types';
import type { UrlStateOptions } from './url-state-options';

/** Minimal query-param source abstraction shared by router integration and tests. */
export interface QueryParamSource {
  readonly keys?: readonly string[];
  getAll(key: string): string[];
}

/** Captures one query-param parse failure alongside the chosen fallback. */
export interface InvalidParamDescriptor {
  readonly key: string;
  readonly raw: ParamRawValue;
  readonly reason: string;
  readonly fallback: unknown;
}

/** Parsed schema snapshot and any invalid inputs that were encountered. */
export interface ParsedUrlState<TSchema extends UrlStateSchema> {
  readonly state: InferSchemaValue<TSchema>;
  readonly invalid: readonly InvalidParamDescriptor[];
}

/** Deterministically serialized state ready for router navigation. */
export interface SerializedUrlState {
  readonly queryParams: Record<string, string | readonly string[]>;
  readonly entries: readonly (readonly [string, string])[];
  readonly queryString: string;
}

const defaultEquals = <T>(left: T, right: T): boolean => Object.is(left, right);

function appendEntries(
  entries: Array<readonly [string, string]>,
  key: string,
  raw: ParamRawValue,
): void {
  if (raw === null) {
    return;
  }

  if (Array.isArray(raw)) {
    for (const value of raw) {
      entries.push([key, value]);
    }

    return;
  }

  entries.push([key, raw as string]);
}

function entriesToQueryString(entries: readonly (readonly [string, string])[]): string {
  return entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

/** Reads one key from a query-param source and preserves repeated values. */
export function readQueryParamValue(source: QueryParamSource, key: string): ParamRawValue {
  const values = source.getAll(key);

  if (values.length === 0) {
    return null;
  }

  return values.length === 1 ? values[0] : values;
}

/** Parses every managed query-param key in schema order. */
export function parseUrlState<TSchema extends UrlStateSchema>(
  schema: TSchema,
  read: (key: string) => ParamRawValue,
): ParsedUrlState<TSchema> {
  const state = {} as InferSchemaValue<TSchema>;
  const invalid: InvalidParamDescriptor[] = [];

  for (const key of Object.keys(schema) as Array<Extract<keyof TSchema, string>>) {
    const raw = read(key);
    const parsed = schema[key].parse(raw);

    if (parsed.ok) {
      (state as Record<string, unknown>)[key] = parsed.value;
      continue;
    }

    invalid.push({
      key,
      raw,
      reason: parsed.reason,
      fallback: parsed.fallback,
    });
    (state as Record<string, unknown>)[key] = parsed.fallback;
  }

  return { state, invalid };
}

/**
 * Serializes managed state in schema order so URLs stay stable and easy to diff.
 */
export function serializeUrlState<TSchema extends UrlStateSchema>(
  schema: TSchema,
  snapshot: InferSchemaValue<TSchema>,
  options: Pick<UrlStateOptions, 'removeDefaultsFromUrl'>,
): SerializedUrlState {
  const queryParams: Record<string, string | readonly string[]> = {};
  const entries: Array<readonly [string, string]> = [];

  for (const key of Object.keys(schema) as Array<Extract<keyof TSchema, string>>) {
    const codec = schema[key];
    const currentValue = snapshot[key];
    const equals = codec.equals ?? defaultEquals;

    if (options.removeDefaultsFromUrl && equals(currentValue, codec.defaultValue)) {
      continue;
    }

    const serialized = codec.serialize(currentValue);

    if (serialized === null) {
      continue;
    }

    queryParams[key] = Array.isArray(serialized) ? [...serialized] : serialized;
    appendEntries(entries, key, serialized);
  }

  return {
    queryParams,
    entries,
    queryString: entriesToQueryString(entries),
  };
}

/**
 * Merges managed params with unmanaged params from the current URL so the
 * library only owns the keys declared in the schema.
 */
export function buildNavigationQuery(
  managedKeys: readonly string[],
  current: QueryParamSource,
  managed: SerializedUrlState,
): SerializedUrlState {
  const managedKeySet = new Set(managedKeys);
  const entries = [...managed.entries];
  const queryParams: Record<string, string | readonly string[]> = {
    ...managed.queryParams,
  };
  const unmanagedKeys = [...(current.keys ?? [])]
    .filter((key) => !managedKeySet.has(key))
    .sort((left, right) => left.localeCompare(right));

  for (const key of unmanagedKeys) {
    const raw = readQueryParamValue(current, key);

    if (raw === null) {
      continue;
    }

    queryParams[key] = Array.isArray(raw) ? [...raw] : raw;
    appendEntries(entries, key, raw);
  }

  return {
    queryParams,
    entries,
    queryString: entriesToQueryString(entries),
  };
}

/** Reads the current full query string in the same deterministic order used for writes. */
export function readQueryString(current: QueryParamSource, managedKeys: readonly string[]): string {
  const managedKeySet = new Set(managedKeys);
  const orderedKeys = [
    ...managedKeys,
    ...(current.keys ?? [])
      .filter((key) => !managedKeySet.has(key))
      .sort((left, right) => left.localeCompare(right)),
  ];
  const entries: Array<readonly [string, string]> = [];

  for (const key of orderedKeys) {
    appendEntries(entries, key, readQueryParamValue(current, key));
  }

  return entriesToQueryString(entries);
}
