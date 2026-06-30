import type { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Provider, inject } from '@angular/core';
import { NG_VALIDATORS, NG_ASYNC_VALIDATORS } from '@angular/forms';

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

/**
 * Creates a debounced async validator that waits for the user to stop typing
 * before calling the validation function.
 *
 * Cancels the previous pending request when a new value is emitted, making it
 * safe for server-side uniqueness checks. The validation function receives
 * the current control value and should return `null` for valid or a
 * `ValidationErrors` object for invalid.
 *
 * @param validateFn - Async validation function.
 * @param debounceMs - Debounce delay in milliseconds. Default: 400ms.
 *
 * @example
 * ```typescript
 * const validator = debouncedServerValidator<string>(async (username) => {
 *   const taken = await checkUsername(username);
 *   return taken ? { usernameTaken: true } : null;
 * }, 500);
 *
 * const form = new FormGroup({
 *   username: new FormControl('', { asyncValidators: validator }),
 * });
 * ```
 */
export function debouncedServerValidator<T>(
  validateFn: (value: T, control: AbstractControl) => Promise<ValidationErrors | null>,
  debounceMs = 400,
): AsyncValidatorFn {
  // Track the latest debounce timer and pending promise per control instance
  const state = new WeakMap<
    AbstractControl,
    { timer: ReturnType<typeof setTimeout> | null; reject: ((reason: unknown) => void) | null }
  >();

  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    // Cancel previous timer and reject pending promise
    const existing = state.get(control);
    if (existing) {
      if (existing.timer !== null) clearTimeout(existing.timer);
      if (existing.reject !== null) {
        existing.reject(new DOMException('Aborted', 'AbortError'));
      }
    }

    return new Promise<ValidationErrors | null>((resolve, reject) => {
      const timer = setTimeout(async () => {
        try {
          const result = await validateFn(control.value as T, control);
          state.delete(control);
          resolve(result);
        } catch (err) {
          state.delete(control);
          reject(err);
        }
      }, debounceMs);

      state.set(control, { timer, reject });
    });
  };
}

/**
 * Handle returned by `injectValidator`.
 */
export interface ValidatorHandle {
  /** Provider array for `NG_VALIDATORS`. Spread or merge into `@Component.providers`. */
  readonly providers: Provider[];

  /** The validator function — call from your `validate()` method. */
  validate(control: AbstractControl): ValidationErrors | null;

  /** The async validator function — call from your `asyncValidator()` method. */
  readonly asyncValidator?: (control: AbstractControl) => Promise<ValidationErrors | null>;
}

/**
 * Creates a validator that a custom form control can inject to implement
 * `Validator` without manual `NG_VALIDATORS` boilerplate.
 *
 * The returned `providers` array registers the validator with Angular's forms.
 * The component must implement `Validator` and delegate `validate()` and
 * `asyncValidator()` to the handle.
 *
 * @param validateFn - Synchronous validation function.
 * @param asyncValidateFn - Optional async validation function.
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-color-picker',
 *   standalone: true,
 *   providers: [validators.providers],
 *   template: `...`,
 * })
 * class ColorPickerComponent implements Validator {
 *   readonly validators = injectValidator<string>(
 *     (value) => ALLOWED_COLORS.includes(value) ? null : { invalidColor: true },
 *   );
 *
 *   validate(control: AbstractControl): ValidationErrors | null {
 *     return this.validators.validate(control);
 *   }
 * }
 * ```
 */
export function injectValidator<T>(
  validateFn: (value: T, control: AbstractControl) => ValidationErrors | null,
  asyncValidateFn?: (value: T, control: AbstractControl) => Promise<ValidationErrors | null>,
): ValidatorHandle {
  const providers: Provider[] = [
    { provide: NG_VALIDATORS, useFactory: () => validatorFn, multi: true },
  ];

  const validatorFn: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return validateFn(control.value as T, control);
  };

  let asyncValidatorFn: ((control: AbstractControl) => Promise<ValidationErrors | null>) | undefined;

  if (asyncValidateFn) {
    asyncValidatorFn = (control: AbstractControl): Promise<ValidationErrors | null> => {
      return asyncValidateFn!(control.value as T, control);
    };
    providers.push({ provide: NG_ASYNC_VALIDATORS, useFactory: () => asyncValidatorFn, multi: true });
  }

  return {
    providers,
    validate: validatorFn,
    ...(asyncValidatorFn ? { asyncValidator: asyncValidatorFn } : {}),
  };
}
