import {
  inject,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
  type EnvironmentProviders,
} from '@angular/core';
import type {
  ApiError,
  ApiErrorProblemDetails,
  ApiValidationResult,
  HexGuardApiErrorsOptions,
} from './types';

/** Injection token for `HexGuardApiErrorsOptions`. */
export const HEXGUARD_API_ERRORS_OPTIONS: InjectionToken<HexGuardApiErrorsOptions> =
  new InjectionToken<HexGuardApiErrorsOptions>('HEXGUARD_API_ERRORS_OPTIONS');

/**
 * Configures the `@hexguard/angular-api-errors` providers.
 * @param options Configuration options.
 */
export function provideHexGuardApiErrors(
  options: HexGuardApiErrorsOptions = {},
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HEXGUARD_API_ERRORS_OPTIONS,
      useValue: options,
    },
  ]);
}

/**
 * Parses backend API error responses (RFC 9457 Problem Details, validation
 * payloads) into typed `ApiValidationResult` contracts for field-level and
 * page-level error binding.
 */
@Injectable({ providedIn: 'root' })
export class ApiErrorParser {
  private readonly _options = inject(HEXGUARD_API_ERRORS_OPTIONS, { optional: true }) ?? {};

  /**
   * Parses an RFC 9457 Problem Details response body into an `ApiValidationResult`.
   *
   * Extracts the `"errors"` extension member as the error list.
   * Falls back to the `title`/`detail` fields for model-level errors when
   * no `"errors"` extension is present.
   */
  parseProblemDetails(body: unknown): ApiValidationResult {
    if (!isRecord(body)) {
      return { errors: [], isValid: true };
    }

    const pd = body as unknown as ApiErrorProblemDetails;
    const pdRecord = body as Record<string, unknown>;
    const errors: ApiError[] = [];

    // Collect field-level errors from the "errors" extension
    const rawErrors = pdRecord['errors'];
    if (Array.isArray(rawErrors)) {
      for (const raw of rawErrors) {
        if (isValidationError(raw)) {
          errors.push({
            field: raw['field'],
            code: raw['code'],
            message: raw['message'],
            isFieldError: raw['field'].length > 0,
          });
        }
      }
    }

    // If there are no structured errors but we got a problem-details response
    // with a title, generate a model-level error
    const title = pdRecord['title'];
    const detail = pdRecord['detail'];
    if (errors.length === 0 && typeof title === 'string') {
      errors.push({
        field: '',
        code: 'ProblemDetails',
        message: typeof detail === 'string' ? detail : title,
        isFieldError: false,
      });
    }

    return {
      errors,
      traceId: pd.traceId,
      isValid: errors.length === 0,
    };
  }

  /**
   * Parses a raw `{ errors: ApiError[] }` response body into an `ApiValidationResult`.
   * Useful when the API returns a simpler validation envelope without the full
   * Problem Details shape.
   */
  parseValidationErrors(body: unknown): ApiValidationResult {
    if (!isRecord(body)) {
      return { errors: [], isValid: true };
    }

    const rawErrors = (body as Record<string, unknown>)['errors'];
    const errors: ApiError[] = [];

    if (Array.isArray(rawErrors)) {
      for (const raw of rawErrors) {
        if (isValidationError(raw)) {
          errors.push({
            field: raw['field'],
            code: raw['code'],
            message: raw['message'],
            isFieldError: raw['field'].length > 0,
          });
        }
      }
    }

    return {
      errors,
      isValid: errors.length === 0,
    };
  }

  /**
   * Extracts the first field-level error matching a specific field path.
   * Returns `null` when no matching error is found.
   */
  extractFieldError(result: ApiValidationResult, fieldPath: string): ApiError | null {
    return result.errors.find((e) => e.field === fieldPath) ?? null;
  }

  /**
   * Returns all model-level (non-field) errors.
   */
  extractPageErrors(result: ApiValidationResult): readonly ApiError[] {
    return result.errors.filter((e) => !e.isFieldError || e.field.length === 0);
  }

  /**
   * Returns all errors matching the given field path.
   */
  errorsForField(result: ApiValidationResult, fieldPath: string): readonly ApiError[] {
    return result.errors.filter((e) => e.field === fieldPath);
  }

  /**
   * Returns all errors whose field path starts with the given prefix,
   * for nested or collection-path matching such as `"items.0"`.
   */
  errorsForFieldPrefix(result: ApiValidationResult, fieldPrefix: string): readonly ApiError[] {
    return result.errors.filter(
      (e) =>
        e.field.length > fieldPrefix.length &&
        e.field.startsWith(fieldPrefix) &&
        e.field[fieldPrefix.length] === '.',
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidationError(
  value: unknown,
): value is { field: string; code: string; message: string } {
  return (
    isRecord(value) &&
    typeof (value as Record<string, unknown>)['field'] === 'string' &&
    typeof (value as Record<string, unknown>)['code'] === 'string' &&
    typeof (value as Record<string, unknown>)['message'] === 'string'
  );
}
