import type {
  ParamCodec,
  UrlStateSchema,
  UrlStateSchemaField,
  UrlStateSchemaFieldConfig,
} from './types';

/** Resolved runtime schema entry with one canonical local key and one canonical query key. */
export interface ResolvedUrlStateSchemaField<T = unknown> {
  readonly key: string;
  readonly queryKey: string;
  readonly codec: ParamCodec<T>;
}

function isSchemaFieldConfig<T>(
  field: UrlStateSchemaField<T>,
): field is UrlStateSchemaFieldConfig<T> {
  return Object.prototype.hasOwnProperty.call(field, 'codec');
}

function normalizeQueryKey(key: string, queryKey: string | undefined): string {
  const normalized = (queryKey ?? key).trim();

  if (normalized.length === 0) {
    throw new Error(`The queryKey for schema key "${key}" must be a non-empty string.`);
  }

  return normalized;
}

/** Resolves a field to its codec regardless of whether it uses query-key remapping metadata. */
export function resolveSchemaCodec<T>(field: UrlStateSchemaField<T>): ParamCodec<T> {
  return isSchemaFieldConfig(field) ? field.codec : field;
}

/** Resolves query-key metadata once so serialization and parsing stay deterministic and fast. */
export function resolveUrlStateSchema<TSchema extends UrlStateSchema>(
  schema: TSchema,
): readonly ResolvedUrlStateSchemaField[] {
  const resolvedFields: ResolvedUrlStateSchemaField[] = [];
  const seenQueryKeys = new Map<string, string>();

  for (const [key, field] of Object.entries(schema) as Array<
    [Extract<keyof TSchema, string>, TSchema[keyof TSchema]]
  >) {
    const queryKey = normalizeQueryKey(
      key,
      isSchemaFieldConfig(field) ? field.queryKey : undefined,
    );
    const existingKey = seenQueryKeys.get(queryKey);

    if (existingKey !== undefined) {
      throw new Error(
        `Duplicate queryKey "${queryKey}" configured for schema keys "${existingKey}" and "${key}".`,
      );
    }

    seenQueryKeys.set(queryKey, key);
    resolvedFields.push({
      key,
      queryKey,
      codec: resolveSchemaCodec(field),
    });
  }

  return resolvedFields;
}
