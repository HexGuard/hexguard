import { type ResolvedUrlStateSchemaField, resolveUrlStateSchema } from './schema';
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
  readonly queryKey: string;
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
  resolvedSchema: readonly ResolvedUrlStateSchemaField[] = resolveUrlStateSchema(schema),
): ParsedUrlState<TSchema> {
  const state = {} as InferSchemaValue<TSchema>;
  const invalid: InvalidParamDescriptor[] = [];

  for (const field of resolvedSchema) {
    const raw = read(field.queryKey);
    const parsed = field.codec.parse(raw);

    if (parsed.ok) {
      (state as Record<string, unknown>)[field.key] = parsed.value;
      continue;
    }

    invalid.push({
      key: field.key,
      queryKey: field.queryKey,
      raw,
      reason: parsed.reason,
      fallback: parsed.fallback,
    });
    (state as Record<string, unknown>)[field.key] = parsed.fallback;
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
  resolvedSchema: readonly ResolvedUrlStateSchemaField[] = resolveUrlStateSchema(schema),
): SerializedUrlState {
  const queryParams: Record<string, string | readonly string[]> = {};
  const entries: Array<readonly [string, string]> = [];
  const snapshotRecord = snapshot as Record<string, unknown>;

  for (const field of resolvedSchema) {
    const codec = field.codec;
    const currentValue = snapshotRecord[field.key];
    const equals = codec.equals ?? defaultEquals;

    if (options.removeDefaultsFromUrl && equals(currentValue, codec.defaultValue)) {
      continue;
    }

    const serialized = codec.serialize(currentValue);

    if (serialized === null) {
      continue;
    }

    queryParams[field.queryKey] = Array.isArray(serialized) ? [...serialized] : serialized;
    appendEntries(entries, field.queryKey, serialized);
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
  managedQueryKeys: readonly string[],
  current: QueryParamSource,
  managed: SerializedUrlState,
): SerializedUrlState {
  const managedKeySet = new Set(managedQueryKeys);
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
export function readQueryString(
  current: QueryParamSource,
  managedQueryKeys: readonly string[],
): string {
  const managedKeySet = new Set(managedQueryKeys);
  const orderedKeys = [
    ...managedQueryKeys,
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
