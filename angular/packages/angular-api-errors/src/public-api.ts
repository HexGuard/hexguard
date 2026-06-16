/**
 * Public API for `@hexguard/angular-api-errors`.
 *
 * The package normalizes backend validation, business-rule failures, and
 * RFC 9457 problem-details payloads into a consistent Angular-facing error
 * surface with field-level form binding and page-level error state.
 */
export { ApiErrorParser, provideHexGuardApiErrors } from './lib/api-error-parser';
export { apiFormErrors, injectApiFormErrors } from './lib/api-form-errors';
export { injectApiErrorState, type ApiErrorState } from './lib/api-error-state';
export { FieldPath } from './lib/field-path';
export { ApiErrorCode } from './lib/api-error-codes';
export type {
  ApiError,
  ApiValidationResult,
  ApiErrorProblemDetails,
  HexGuardApiErrorsOptions,
} from './lib/types';
