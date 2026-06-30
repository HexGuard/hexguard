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

/**
 * Creates a validator that rejects a `FormArray` containing duplicate values.
 * Compares by strict equality (`===`). Returns the first duplicate value found
 * in the error payload.
 *
 * @example
 * ```typescript
 * readonly tags = new FormArray([new FormControl('a'), new FormControl('b')], [uniqueArrayValidator()]);
 *
 * tags.push(new FormControl('a')); // array becomes invalid
 * tags.errors; // { uniqueArray: { duplicate: 'a' } }
 * ```
 */
export function uniqueArrayValidator(message?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!('controls' in control)) return null;
    const values: unknown[] = [];
    for (let i = 0; i < (control as { controls: unknown[] }).controls.length; i++) {
      const ctrl = (control as { controls: Array<{ value: unknown }> }).controls[i];
      const value = ctrl.value;
      if (values.includes(value)) {
        return { uniqueArray: { message: message ?? `Duplicate value: "${value}".`, duplicate: value } };
      }
      values.push(value);
    }
    return null;
  };
}

/**
 * Creates a validator that requires a `FormArray` to have at least `min`
 * items.
 *
 * @example
 * ```typescript
 * readonly tags = new FormArray([new FormControl('a')], [minArrayLength(2)]);
 * // tags is invalid — only 1 item
 * ```
 */
export function minArrayLength(min: number, message?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!('controls' in control)) return null;
    const len = (control as { controls: unknown[] }).controls.length;
    if (len >= min) return null;
    return { minArrayLength: { message: message ?? `At least ${min} item(s) required.`, min, actual: len } };
  };
}

/**
 * Creates a validator that limits a `FormArray` to at most `max` items.
 *
 * @example
 * ```typescript
 * readonly tags = new FormArray(
 *   [new FormControl('a'), new FormControl('b'), new FormControl('c')],
 *   [maxArrayLength(2)],
 * );
 * // tags is invalid — 3 items, max is 2
 * ```
 */
export function maxArrayLength(max: number, message?: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!('controls' in control)) return null;
    const len = (control as { controls: unknown[] }).controls.length;
    if (len <= max) return null;
    return { maxArrayLength: { message: message ?? `Maximum ${max} item(s) allowed.`, max, actual: len } };
  };
}
