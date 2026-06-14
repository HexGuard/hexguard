import type { ParamRawValue } from './types';

function formatRawValue(raw: ParamRawValue): string {
  if (raw === null) {
    return 'null';
  }

  if (Array.isArray(raw)) {
    return `[${raw.map((value) => JSON.stringify(value)).join(', ')}]`;
  }

  return JSON.stringify(raw);
}

/**
 * Error thrown when strict invalid-param handling is enabled in dev mode and a
 * query parameter cannot be parsed safely.
 */
export class InvalidQueryParamError extends Error {
  constructor(
    readonly key: string,
    readonly raw: ParamRawValue,
    readonly reason: string,
    readonly queryKey: string = key,
  ) {
    super(
      queryKey === key
        ? `Invalid query parameter "${key}": ${reason}. Received ${formatRawValue(raw)}.`
        : `Invalid query parameter "${queryKey}" for schema key "${key}": ${reason}. Received ${formatRawValue(raw)}.`,
    );
    this.name = 'InvalidQueryParamError';
  }
}
