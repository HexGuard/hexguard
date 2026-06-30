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

/**
 * Creates a `Signal<'valid' | 'invalid' | 'pending' | 'disabled'>` that tracks
 * the validation status of a form control. The signal updates automatically
 * when the control's status changes, and unsubscribes on destroy.
 *
 * Useful in signal-based components for reacting to form validity changes
 * (e.g., enabling/disabling submit buttons).
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({ name: new FormControl('', [Validators.required]) });
 * readonly status = formStatusSignal(this.form);
 *
 * effect(() => {
 *   console.log('Form status:', status());
 *   submitBtnDisabled.set(status() !== 'valid');
 * });
 * ```
 */
export function formStatusSignal(form: AbstractControl): Signal<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'> {
  const destroyRef = inject(DestroyRef);
  const result = signal<'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'>(form.status as 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED');

  const sub = form.statusChanges.subscribe({
    next: (status) => result.set(status as 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED'),
  });

  destroyRef.onDestroy(() => sub.unsubscribe());

  return result.asReadonly();
}

/**
 * Creates a form submission handler that marks all controls as touched and
 * triggers validation, then calls the provided action only if the form is
 * valid. Returns a function suitable for use as a `(click)` or `(ngSubmit)`
 * handler.
 *
 * This is the single most common form boilerplate — marking all fields as
 * touched on submit so validation errors display, then conditionally executing
 * the submit logic.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({ name: new FormControl('', [Validators.required]) });
 * readonly submit = formSubmitHandler(form, () => this.save());
 *
 * // Template: <button (click)="submit()">Save</button>
 *
 * // With async action:
 * readonly submit = formSubmitHandler(form, async () => {
 *   await this.api.save(form.value);
 * });
 * ```
 */
export function formSubmitHandler(
  form: AbstractControl,
  onValid: () => void | Promise<void>,
): () => void {
  return () => {
    form.markAllAsTouched();

    // Trigger validation for all controls
    form.updateValueAndValidity();

    if (form.valid) {
      const result = onValid();
      if (result instanceof Promise) {
        result.catch((err) => {
          // Re-throw so consumer error handling still works
          throw err;
        });
      }
    }
  };
}
