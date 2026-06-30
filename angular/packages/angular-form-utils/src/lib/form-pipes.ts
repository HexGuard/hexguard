import { Pipe, type PipeTransform } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { isControlInvalid } from './form-control-utils';

/**
 * Pure pipe that returns `true` when the given form control is touched and
 * invalid. A declarative template shorthand for the most common validation
 * display pattern.
 *
 * @example
 * ```html
 * @if (form.get('name') | isInvalid) {
 *   <p class="error">Name is required.</p>
 * }
 * ```
 */
@Pipe({
  name: 'isInvalid',
  standalone: true,
  pure: true,
})
export class IsInvalidPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined): boolean {
    return isControlInvalid(control);
  }
}

/**
 * Pure pipe that extracts validation errors from a form control. When an
 * `errorKey` is provided, returns only the matching error entry; otherwise
 * returns the full `ValidationErrors` map.
 *
 * Works particularly well with Angular's `@if ... as` syntax for displaying
 * error messages.
 *
 * @example
 * ```html
 * {{ form.get('email') | formError | json }}
 *
 * @if (form.get('name') | formError:'required'; as err) {
 *   <p>{{ err.message }}</p>
 * }
 * ```
 */
@Pipe({
  name: 'formError',
  standalone: true,
  pure: true,
})
export class FormErrorPipe implements PipeTransform {
  transform(control: AbstractControl | null | undefined, errorKey?: string): ValidationErrors | null {
    if (!control) return null;
    if (errorKey) return control.errors?.[errorKey] ?? null;
    return control.errors;
  }
}
