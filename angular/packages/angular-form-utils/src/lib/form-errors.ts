import type { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

function hasControls(control: AbstractControl): control is AbstractControl & { controls: Record<string, AbstractControl> } {
  return 'controls' in control;
}

/**
 * Collects all validation errors from a form tree into a flat map keyed by
 * control path (e.g., `"address.street"`). The root form's own errors appear
 * under the key `"(root)"`.
 *
 * Handles nested `FormGroup` and `FormArray` structures recursively.
 *
 * @example
 * ```typescript
 * const form = new FormGroup({
 *   name: new FormControl('', [Validators.required]),
 *   email: new FormControl('invalid', [Validators.email]),
 * });
 *
 * const errors = aggregateFormErrors(form);
 * // { name: { required: true }, email: { email: true } }
 * ```
 */
export function aggregateFormErrors(form: AbstractControl): Record<string, ValidationErrors | null> {
  const result: Record<string, ValidationErrors | null> = {};
  collectErrors(form, '', result);
  return result;
}

function collectErrors(
  control: AbstractControl,
  path: string,
  result: Record<string, ValidationErrors | null>,
): void {
  if (control.errors) {
    result[path || '(root)'] = control.errors;
  }

  if (hasControls(control)) {
    for (const key of Object.keys(control.controls)) {
      const child = control.get(key);
      if (child) {
        collectErrors(child, path ? `${path}.${key}` : key, result);
      }
    }
  }
}

/**
 * Wraps an async validation function into an Angular `AsyncValidatorFn`. Useful for server-side checks (e.g., username uniqueness) where
 * the validation function receives the current control value and returns errors
 * or `null`.
 *
 * @example
 * ```typescript
 * const uniqueUsername = asyncFieldValidator(async (value: string) => {
 *   const exists = await checkUsername(value);
 *   return exists ? { uniqueUsername: { message: 'Username taken.' } } : null;
 * });
 *
 * const form = new FormGroup({
 *   username: new FormControl('', { asyncValidators: uniqueUsername }),
 * });
 * ```
 */
export function asyncFieldValidator<T>(
  validateFn: (value: T, control: AbstractControl) => Promise<ValidationErrors | null>,
): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    return validateFn(control.value as T, control);
  };
}
