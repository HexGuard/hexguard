import { DestroyRef, inject, signal, type Signal } from '@angular/core';
import type { AbstractControl } from '@angular/forms';

/**
 * Creates a typed `Signal<T>` that tracks the value of a form control at the
 * given dotted path. The signal updates automatically when the control's value
 * changes, and unsubscribes on destroy.
 *
 * Useful in signal-based components for reacting to nested form control values
 * without manually subscribing to `valueChanges`.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({
 *   address: new FormGroup({
 *     street: new FormControl(''),
 *     city: new FormControl(''),
 *   }),
 * });
 *
 * const street = controlSignal(form, 'address.street');
 * effect(() => console.log('Street changed:', street()));
 * ```
 */
export function controlSignal<T>(form: AbstractControl, path: string): Signal<T> {
  const destroyRef = inject(DestroyRef);
  const control = form.get(path);

  if (!control) {
    throw new Error(`controlSignal: no control found at path "${path}".`);
  }

  const result = signal(control.value as T);

  const sub = control.valueChanges.subscribe({
    next: (value: T) => result.set(value),
  });

  destroyRef.onDestroy(() => sub.unsubscribe());

  return result.asReadonly();
}

/**
 * Returns `true` when the control has been interacted with (`touched`) and
 * is currently invalid. The most common template pattern for showing validation
 * errors.
 *
 * @example
 * ```typescript
 * // Template: @if (isControlInvalid(form.get('name'))) { <p>Name is required</p> }
 * ```
 */
export function isControlInvalid(control: AbstractControl | null | undefined): boolean {
  if (!control) return false;
  return control.touched && control.invalid;
}

/**
 * Deeply compares two form value snapshots and returns a partial object
 * containing only the keys whose values differ. The returned values are the
 * current (second argument) values.
 *
 * Handles nested objects, arrays, and primitive values. Useful for detecting
 * what changed between form submissions, partial API payloads, or change
 * highlighting in complex nested forms.
 *
 * @example
 * ```typescript
 * const initial = { name: 'Alice', address: { city: 'NYC' }, tags: ['a'] };
 * const current = { name: 'Alice', address: { city: 'LA' }, tags: ['a', 'b'] };
 *
 * formDiff(initial, current);
 * // → { address: { city: 'LA' }, tags: ['a', 'b'] }
 * ```
 */
export function formDiff<T extends Record<string, unknown>>(
  initial: T,
  current: T,
): Partial<T> {
  const diff: Partial<T> = {};

  for (const key of new Set([...Object.keys(initial), ...Object.keys(current)])) {
    const a = initial[key];
    const b = current[key];

    if (a === b) continue;

    // Deep-compare objects (but not arrays — compare arrays by reference/value)
    if (
      a !== null &&
      b !== null &&
      typeof a === 'object' &&
      typeof b === 'object' &&
      !Array.isArray(a) &&
      !Array.isArray(b)
    ) {
      const nestedDiff = formDiff(a as Record<string, unknown>, b as Record<string, unknown>);
      if (Object.keys(nestedDiff).length > 0) {
        (diff as Record<string, unknown>)[key] = nestedDiff;
      }
      continue;
    }

    (diff as Record<string, unknown>)[key] = b;
  }

  return diff;
}
