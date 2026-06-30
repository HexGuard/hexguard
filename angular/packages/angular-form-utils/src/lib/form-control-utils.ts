import { DestroyRef, computed, inject, signal, type Signal } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup } from '@angular/forms';

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

/**
 * Handle returned by `injectFormField`.
 */
export interface FormFieldHandle<T> {
  /** Read-only signal backed by the control's value. */
  readonly value: Signal<T>;
  /** Whether the control is touched and invalid. */
  readonly isInvalid: Signal<boolean>;
  /** The current validation errors, or null. */
  readonly errors: Signal<ValidationErrors | null>;
  /** Whether the control is dirty. */
  readonly isDirty: Signal<boolean>;
  /** Whether the control is disabled. */
  readonly isDisabled: Signal<boolean>;
  /** Whether the control is pending (async validation in progress). */
  readonly isPending: Signal<boolean>;
  /** Update the control's value. Emits via the form control so validators fire. */
  setValue(value: T): void;
  /** Mark the control as touched (shows validation errors). */
  markAsTouched(): void;
}

/**
 * Creates a typed signal-based facade for a single form control.
 *
 * Provides convenient reactive signals (`value`, `isInvalid`, `errors`,
 * `isDirty`, `isDisabled`, `isPending`) that stay in sync with the control
 * via `valueChanges` and `statusChanges` subscriptions.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({ name: new FormControl('', [Validators.required]) });
 * readonly name = injectFormField<string>(form, 'name');
 *
 * name.value();        // read current value
 * name.setValue('x');  // write — updates control, signal follows
 * name.isInvalid();    // touched && invalid
 * name.errors();       // ValidationErrors | null
 * name.markAsTouched();// show validation errors
 * ```
 */
export function injectFormField<T>(
  form: AbstractControl,
  path: string,
): FormFieldHandle<T> {
  const destroyRef = inject(DestroyRef);
  const control = form.get(path);

  if (!control) {
    throw new Error(`injectFormField: no control found at path "${path}".`);
  }

  const valueSignal = signal<T>(control.value as T);
  const errorsSignal = signal<ValidationErrors | null>(control.errors);
  const statusSignal = signal(control.status);
  const isInvalidSignal = signal<boolean>(control.touched && control.invalid);
  const isDirtySignal = signal<boolean>(control.dirty);

  const refresh = () => {
    errorsSignal.set(control.errors);
    statusSignal.set(control.status);
    isInvalidSignal.set(control.touched && control.invalid);
    isDirtySignal.set(control.dirty);
  };

  const valueSub = control.valueChanges.subscribe({
    next: (v: T) => { valueSignal.set(v); refresh(); },
  });

  const statusSub = control.statusChanges.subscribe({
    next: refresh,
  });

  destroyRef.onDestroy(() => {
    valueSub.unsubscribe();
    statusSub.unsubscribe();
  });

  const isPending = computed<boolean>(() => statusSignal() === 'PENDING');
  const isDisabled = computed<boolean>(() => statusSignal() === 'DISABLED');

  return {
    value: valueSignal.asReadonly(),
    isInvalid: isInvalidSignal.asReadonly(),
    errors: errorsSignal.asReadonly(),
    isDirty: isDirtySignal.asReadonly(),
    isDisabled,
    isPending,
    setValue: (val: T) => control.setValue(val),
    markAsTouched: () => { control.markAsTouched(); refresh(); },
  };
}

/**
 * Handle returned by `injectFormSubmission`.
 */
export interface FormSubmissionHandle {
  /** Whether a submission is currently in progress. */
  readonly submitting: Signal<boolean>;
  /** The last submission error, or `null` if the last submit succeeded. */
  readonly error: Signal<unknown>;
  /** Whether the form is disabled (submitting or form-level disabled). */
  readonly disabled: Signal<boolean>;
  /** Submit the form. Returns a promise that resolves when complete. */
  submit(): Promise<void>;
}

/**
 * Creates a form submission handler with loading state and double-submit
 * prevention.
 *
 * Marks all controls as touched, triggers validation, and calls the provided
 * action only if the form is valid. While the action is executing, `submitting`
 * is `true` and a subsequent `submit()` call is a no-op.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({ name: new FormControl('', [Validators.required]) });
 * readonly sub = injectFormSubmission(form, async () => {
 *   await this.api.save(form.value);
 * });
 *
 * // Template: <button (click)="sub.submit()" [disabled]="sub.disabled()">Save</button>
 * //           @if (sub.submitting()) { <span>Saving…</span> }
 * //           @if (sub.error(); let err) { <span class="error">{{ err }}</span> }
 * ```
 */
export function injectFormSubmission(
  form: AbstractControl,
  onSubmit: () => Promise<void>,
): FormSubmissionHandle {
  const submitting = signal(false);
  const error = signal<unknown>(null);

  const disabled = computed<boolean>(() => submitting() || form.disabled);

  async function submit(): Promise<void> {
    if (submitting()) return; // prevent double-submit

    form.markAllAsTouched();
    form.updateValueAndValidity();

    if (!form.valid) return;

    submitting.set(true);
    error.set(null);

    try {
      await onSubmit();
    } catch (err) {
      error.set(err);
      throw err;
    } finally {
      submitting.set(false);
    }
  }

  return {
    submitting: submitting.asReadonly(),
    error: error.asReadonly(),
    disabled,
    submit,
  };
}

/**
 * Creates a typed signal-based facade for a single form control, given the
 * control reference directly (unlike `injectFormField` which takes a path).
 *
 * @example
 * ```typescript
 * readonly nameControl = new FormControl('', [Validators.required]);
 * readonly name = injectFormControl(this.nameControl);
 *
 * name.value();       // Signal<string>
 * name.setValue('x'); // updates the control
 * name.isInvalid();   // touched && invalid
 * ```
 */
export function injectFormControl<T>(
  control: FormControl<T>,
): FormFieldHandle<T> {
  const destroyRef = inject(DestroyRef);
  const valueSignal = signal<T>(control.value as T);
  const errorsSignal = signal<ValidationErrors | null>(control.errors);
  const statusSignal = signal(control.status);
  const isInvalidSignal = signal<boolean>(control.touched && control.invalid);
  const isDirtySignal = signal<boolean>(control.dirty);

  const refresh = () => {
    errorsSignal.set(control.errors);
    statusSignal.set(control.status);
    isInvalidSignal.set(control.touched && control.invalid);
    isDirtySignal.set(control.dirty);
  };

  const valueSub = control.valueChanges.subscribe({
    next: (v: T) => { valueSignal.set(v); refresh(); },
  });

  const statusSub = control.statusChanges.subscribe({ next: refresh });
  destroyRef.onDestroy(() => { valueSub.unsubscribe(); statusSub.unsubscribe(); });

  const isPending = computed<boolean>(() => statusSignal() === 'PENDING');
  const isDisabled = computed<boolean>(() => statusSignal() === 'DISABLED');

  return {
    value: valueSignal.asReadonly(),
    isInvalid: isInvalidSignal.asReadonly(),
    errors: errorsSignal.asReadonly(),
    isDirty: isDirtySignal.asReadonly(),
    isDisabled,
    isPending,
    setValue: (val: T) => control.setValue(val),
    markAsTouched: () => { control.markAsTouched(); refresh(); },
  };
}

/**
 * Creates a signal that tracks whether a form control has been touched.
 * Updates reactively when `markAsTouched()` is called.
 *
 * @example
 * ```typescript
 * readonly name = new FormControl('', [Validators.required]);
 * readonly touched = injectControlTouched(this.name);
 *
 * // Template:
 * // <input [class.touched]="touched()" (blur)="name.markAsTouched()" />
 * ```
 */
export function injectControlTouched(control: AbstractControl): Signal<boolean> {
  const touchedSignal = signal<boolean>(control.touched);

  const sub = control.statusChanges.subscribe(() => {
    touchedSignal.set(control.touched);
  });

  try {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => sub.unsubscribe());
  } catch {}

  return touchedSignal.asReadonly();
}

/**
 * Typed version of `patchValue` that preserves the form's type signature.
 *
 * Unlike raw `patchValue`, this provides full type inference so you can
 * only pass valid keys for the form group.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({
 *   name: new FormControl(''),
 *   email: new FormControl(''),
 * });
 *
 * formPatch(form, { name: 'Alice' }); // Only 'name' patched — fully typed
 * ```
 */
export function formPatch<T extends FormGroup>(
  group: T,
  value: Partial<ReturnType<T['getRawValue']>>,
): void {
  group.patchValue(value);
}

/**
 * Creates a reactive signal that maps a form control's `ValidationErrors` to
 * user-readable error message strings, using a provided message map.
 *
 * The returned signal updates automatically when the control's errors change
 * (via `statusChanges` subscription). Message values can be a static string
 * or a function receiving the error entry for dynamic messages.
 *
 * @param control - The form control to watch.
 * @param messages - A record mapping error keys to message strings or
 *   `(errorValue) => string` functions.
 * @returns A signal emitting an array of resolved error message strings.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({
 *   email: new FormControl('', [Validators.required, Validators.email]),
 * });
 * readonly emailErrors = controlErrorMessages(form.get('email')!, {
 *   required: 'Email is required.',
 *   email: 'Enter a valid email address.',
 * });
 *
 * // Template:
 * // @for (msg of emailErrors(); track msg) {
 * //   <p class="error">{{ msg }}</p>
 * // }
 * ```
 */
export function controlErrorMessages(
  control: AbstractControl,
  messages: Record<string, string | ((errorValue: unknown) => string)>,
): Signal<string[]> {
  const errorsSignal = signal<string[]>(resolveMessages(control.errors, messages));

  // Subscribe to statusChanges for reactive updates
  const sub = control.statusChanges.subscribe(() => {
    errorsSignal.set(resolveMessages(control.errors, messages));
  });

  // Attempt to register cleanup with DestroyRef if in injection context
  try {
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => sub.unsubscribe());
  } catch {
    // Not in an injection context — no cleanup needed (e.g., short-lived test)
  }

  return errorsSignal.asReadonly();
}

function resolveMessages(
  errors: Record<string, unknown> | null,
  messages: Record<string, string | ((errorValue: unknown) => string)>,
): string[] {
  if (!errors) return [];
  const result: string[] = [];
  for (const [key, errorValue] of Object.entries(errors)) {
    const msg = messages[key];
    if (typeof msg === 'function') {
      result.push(msg(errorValue));
    } else if (msg !== undefined) {
      result.push(msg);
    }
  }
  return result;
}
