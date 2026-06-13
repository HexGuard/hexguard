import type { ParamCodec, ParamParseResult, ParamRawValue } from './types';

/** Additional options for repeated query-param codecs. */
export interface ArrayParamOptions<T> {
  readonly defaultValue?: readonly T[];
}

const defaultEquals = <T>(left: T, right: T): boolean => Object.is(left, right);

const ok = <T>(value: T): ParamParseResult<T> => ({ ok: true, value });

const invalid = <T>(reason: string, fallback: T): ParamParseResult<T> => ({
  ok: false,
  reason,
  fallback,
});

const cloneArray = <T>(value: readonly T[]): T[] => [...value];

const cloneDate = (value: Date | null): Date | null =>
  value === null ? null : new Date(value.getTime());

function parseSingle(raw: ParamRawValue, reason: string): ParamParseResult<string | null> {
  if (raw === null) {
    return ok(null);
  }

  if (Array.isArray(raw)) {
    return invalid(reason, null);
  }

  return ok(raw as string);
}

/** Creates a string codec backed by a single query parameter. */
export function stringParam(defaultValue = ''): ParamCodec<string> {
  return {
    defaultValue,
    parse(raw) {
      const single = parseSingle(raw, 'Expected a single string value.');
      if (!single.ok) {
        return invalid(single.reason, defaultValue);
      }

      return ok(single.value ?? defaultValue);
    },
    serialize(value) {
      return value;
    },
  };
}

/** Creates a finite-number codec backed by a single query parameter. */
export function numberParam(defaultValue: number): ParamCodec<number> {
  return {
    defaultValue,
    parse(raw) {
      const single = parseSingle(raw, 'Expected a single numeric value.');
      if (!single.ok) {
        return invalid(single.reason, defaultValue);
      }

      if (single.value === null) {
        return ok(defaultValue);
      }

      if (single.value.trim().length === 0) {
        return invalid('Expected a non-empty numeric value.', defaultValue);
      }

      const parsed = Number(single.value);

      if (!Number.isFinite(parsed)) {
        return invalid(`Expected a finite number but received "${single.value}".`, defaultValue);
      }

      return ok(parsed);
    },
    serialize(value) {
      return Number.isFinite(value) ? String(value) : null;
    },
  };
}

/** Creates a boolean codec that accepts `true/false` and `1/0` in the URL. */
export function booleanParam(defaultValue: boolean): ParamCodec<boolean> {
  return {
    defaultValue,
    parse(raw) {
      const single = parseSingle(raw, 'Expected a single boolean value.');
      if (!single.ok) {
        return invalid(single.reason, defaultValue);
      }

      if (single.value === null) {
        return ok(defaultValue);
      }

      if (single.value === 'true' || single.value === '1') {
        return ok(true);
      }

      if (single.value === 'false' || single.value === '0') {
        return ok(false);
      }

      return invalid(
        `Expected "true", "false", "1", or "0" but received "${single.value}".`,
        defaultValue,
      );
    },
    serialize(value) {
      return value ? 'true' : 'false';
    },
  };
}

/** Creates a codec constrained to one of a fixed list of string literals. */
export function enumParam<const TValues extends readonly [string, ...string[]]>(
  values: TValues,
  defaultValue: TValues[number],
): ParamCodec<TValues[number]> {
  if (!values.includes(defaultValue)) {
    throw new Error('enumParam defaultValue must be included in the allowed values list.');
  }

  const allowedValues = new Set<string>(values);

  return {
    defaultValue,
    parse(raw) {
      const single = parseSingle(raw, 'Expected a single enum value.');
      if (!single.ok) {
        return invalid(single.reason, defaultValue);
      }

      if (single.value === null) {
        return ok(defaultValue);
      }

      if (!allowedValues.has(single.value)) {
        return invalid(
          `Expected one of ${values.map((value) => JSON.stringify(value)).join(', ')}.`,
          defaultValue,
        );
      }

      return ok(single.value as TValues[number]);
    },
    serialize(value) {
      return value;
    },
  };
}

/**
 * Creates a codec for repeated query params.
 *
 * Values are parsed item-by-item through `innerCodec` so array validation stays
 * deterministic and testable.
 */
export function arrayParam<T>(
  innerCodec: ParamCodec<T>,
  options: ArrayParamOptions<T> = {},
): ParamCodec<T[]> {
  const defaultValue = cloneArray(options.defaultValue ?? []);
  const equals = innerCodec.equals ?? defaultEquals;

  return {
    defaultValue,
    parse(raw) {
      if (raw === null) {
        return ok(cloneArray(defaultValue));
      }

      const rawValues = Array.isArray(raw) ? raw : [raw];
      const parsedValues: T[] = [];

      for (let index = 0; index < rawValues.length; index += 1) {
        const parsedItem = innerCodec.parse(rawValues[index]);

        if (!parsedItem.ok) {
          return invalid(
            `Invalid array item at index ${index}: ${parsedItem.reason}`,
            cloneArray(defaultValue),
          );
        }

        parsedValues.push(parsedItem.value);
      }

      return ok(parsedValues);
    },
    serialize(value) {
      const serializedValues: string[] = [];

      for (const item of value) {
        const serializedItem = innerCodec.serialize(item);

        if (serializedItem === null) {
          continue;
        }

        if (Array.isArray(serializedItem)) {
          serializedValues.push(...serializedItem);
          continue;
        }

        serializedValues.push(serializedItem as string);
      }

      return serializedValues.length === 0 ? null : serializedValues;
    },
    equals(left, right) {
      if (left.length !== right.length) {
        return false;
      }

      for (let index = 0; index < left.length; index += 1) {
        if (!equals(left[index], right[index])) {
          return false;
        }
      }

      return true;
    },
  };
}

/** Creates a codec for ISO-8601 dates stored as query-param strings. */
export function dateIsoParam(defaultValue: Date | null = null): ParamCodec<Date | null> {
  const normalizedDefault = cloneDate(defaultValue);

  return {
    defaultValue: normalizedDefault,
    parse(raw) {
      const single = parseSingle(raw, 'Expected a single ISO date value.');
      if (!single.ok) {
        return invalid(single.reason, cloneDate(normalizedDefault));
      }

      if (single.value === null) {
        return ok(cloneDate(normalizedDefault));
      }

      const parsed = new Date(single.value);

      if (Number.isNaN(parsed.getTime())) {
        return invalid(
          `Expected a valid ISO 8601 date string but received "${single.value}".`,
          cloneDate(normalizedDefault),
        );
      }

      return ok(parsed);
    },
    serialize(value) {
      return value === null ? null : value.toISOString();
    },
    equals(left, right) {
      if (left === right) {
        return true;
      }

      if (left === null || right === null) {
        return false;
      }

      return left.getTime() === right.getTime();
    },
  };
}

/** Wraps another codec so `null` becomes an explicit legal value. */
export function nullableParam<T>(innerCodec: ParamCodec<T>): ParamCodec<T | null> {
  const equals = innerCodec.equals ?? defaultEquals;

  return {
    defaultValue: null,
    parse(raw) {
      if (raw === null) {
        return ok(null);
      }

      const parsed = innerCodec.parse(raw);

      if (!parsed.ok) {
        return invalid(parsed.reason, null);
      }

      return ok(parsed.value);
    },
    serialize(value) {
      return value === null ? null : innerCodec.serialize(value);
    },
    equals(left, right) {
      if (left === right) {
        return true;
      }

      if (left === null || right === null) {
        return false;
      }

      return equals(left, right);
    },
  };
}
