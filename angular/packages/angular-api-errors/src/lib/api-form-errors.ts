import { inject, Injectable, InjectionToken } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';
import type { ApiError, ApiValidationResult } from './types';

/**
 * Pure function that maps validation errors onto a `FormGroup`.
 *
 * Sets `setErrors()` on each matching form control with the error code and
 * message. Returns the list of page-level (non-field) errors that could not
 * be mapped to any control.
 *
 * @param form The form group to apply errors to.
 * @param result The validation result from the API.
 * @param setControlError Optional override for setting control errors.
 *   Defaults to `control.setErrors(...)` with `{ [errorCode]: message }`.
 * @returns The list of model-level errors that were not mapped to any control.
 */
export function apiFormErrors(
  form: FormGroup,
  result: ApiValidationResult,
  setControlError?: (control: AbstractControl, error: ApiError) => void,
): readonly ApiError[] {
  const pageErrors: ApiError[] = [];

  for (const error of result.errors) {
    if (error.field.length === 0) {
      pageErrors.push(error);
      continue;
    }

    const control = form.get(error.field);
    if (control) {
      if (setControlError) {
        setControlError(control, error);
      } else {
        control.setErrors({ [error.code]: error.message });
        control.markAsTouched();
      }
    } else {
      // Field path doesn't match any control — treat as page-level
      pageErrors.push(error);
    }
  }

  return pageErrors;
}

/**
 * Injection token for configuring form error binding behavior.
 */
export const API_FORM_ERRORS_OPTIONS = new InjectionToken<ApiFormErrorsOptions>(
  'API_FORM_ERRORS_OPTIONS',
);

/** Options for `injectApiFormErrors()`. */
export interface ApiFormErrorsOptions {
  /**
   * If `true`, field errors also mark the control as `dirty`.
   * Defaults to `false` (only marks as `touched`).
   */
  readonly markAsDirty?: boolean;
}

/**
 * Injectable helper for applying API validation errors to Angular forms.
 *
 * Use in components that need to map backend validation errors onto form
 * controls after a failed submission.
 */
@Injectable({ providedIn: 'root' })
export class ApiFormErrors {
  private readonly _options = inject(API_FORM_ERRORS_OPTIONS, { optional: true }) ?? {};

  /**
   * Applies validation errors from an `ApiValidationResult` to the given form.
   * Returns page-level errors that could not be mapped to any form control.
   */
  applyToForm(form: FormGroup, result: ApiValidationResult): readonly ApiError[] {
    return apiFormErrors(form, result, (control, error) => {
      control.setErrors({ [error.code]: error.message });
      control.markAsTouched();
      if (this._options.markAsDirty) {
        control.markAsDirty();
      }
    });
  }
}

/**
 * Injection function that returns an `ApiFormErrors` instance.
 * Convenience wrapper for `inject(ApiFormErrors)`.
 */
export function injectApiFormErrors(): ApiFormErrors {
  return inject(ApiFormErrors);
}
