import { InjectionToken } from '@angular/core';

/**
 * One validation error from backend validation or business-rule evaluation.
 * Mirrors the .NET `HexGuard.ValidationContracts.ValidationError` shape.
 */
export interface ApiError {
  /** Dot-separated field path, e.g. `"address.city"` or `"items.0.name"`. Empty string for model-level errors. */
  readonly field: string;
  /** Machine-readable error code, e.g. `"Required"`, `"InvalidFormat"`, `"Duplicate"`. */
  readonly code: string;
  /** Human-readable error description suitable for display or logging. */
  readonly message: string;

  /** Returns `true` when this error targets a specific field (non-empty field path). */
  readonly isFieldError?: boolean;
}

/**
 * Aggregate validation result mirroring the .NET
 * `HexGuard.ValidationContracts.ValidationResult` shape.
 */
export interface ApiValidationResult {
  /** The list of validation errors found. Empty when the payload is valid. */
  readonly errors: readonly ApiError[];
  /** Optional correlation or trace identifier for observability. */
  readonly traceId?: string;
  /** `true` when no validation errors were produced. */
  readonly isValid: boolean;
}

/**
 * RFC 9457 Problem Details envelope with the `"errors"` extension member.
 * Mirrors the .NET `ValidationResultProblemDetails` shape for direct API response parsing.
 */
export interface ApiErrorProblemDetails {
  /** URI identifying the error type. */
  readonly type: string;
  /** Short, human-readable summary of the problem. */
  readonly title: string;
  /** HTTP status code. */
  readonly status: number;
  /** Human-readable explanation specific to this occurrence. */
  readonly detail?: string;
  /** URI identifying the specific occurrence of the problem. */
  readonly instance?: string;
  /** Trace identifier. */
  readonly traceId?: string;
  /** The list of validation errors (RFC 9457 extension member). */
  readonly errors?: readonly ApiError[];
}

/** Options for configuring the `@hexguard/angular-api-errors` providers. */
export interface HexGuardApiErrorsOptions {
  /**
   * If `true`, `ApiErrorParser.parseProblemDetails()` throws when the response
   * body does not match the expected Problem Details shape in dev mode.
   * Defaults to `true` in dev builds, `false` in production.
   */
  readonly strictParsing?: boolean;
}


