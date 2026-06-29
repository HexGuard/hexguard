import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Creates a validator that checks if two fields have equal values.
 * Useful for confirm-password or confirm-email fields.
 */
export function fieldsEqual(fieldA: string, fieldB: string, message?: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(fieldA)?.value;
    const b = group.get(fieldB)?.value;
    if (a === b) return null;
    return { fieldsEqual: { message: message ?? `${fieldA} and ${fieldB} must match.` } };
  };
}

/**
 * Creates a validator that checks if two fields have different values.
 */
export function fieldsNotEqual(fieldA: string, fieldB: string, message?: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(fieldA)?.value;
    const b = group.get(fieldB)?.value;
    if (a !== b) return null;
    return { fieldsNotEqual: { message: message ?? `${fieldA} and ${fieldB} must be different.` } };
  };
}

/**
 * Creates a validator that requires a field to have a value when a condition
 * on another field is met.
 */
export function requiredIf(
  field: string,
  condition: (value: unknown) => boolean,
  message?: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(field);
    if (!control) return null;
    const dependentValue = condition(control.value);
    if (!dependentValue) return null;
    if (control.value === null || control.value === undefined || control.value === '') {
      return { requiredIf: { message: message ?? `${field} is required.` } };
    }
    return null;
  };
}

/**
 * Creates a validator that requires at least one of the given fields to have a value.
 */
export function requiresAtLeastOne(fields: string[], message?: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasValue = fields.some((f) => {
      const value = group.get(f)?.value;
      return value !== null && value !== undefined && value !== '';
    });
    if (hasValue) return null;
    return { requiresAtLeastOne: { message: message ?? `At least one of [${fields.join(', ')}] is required.` } };
  };
}
