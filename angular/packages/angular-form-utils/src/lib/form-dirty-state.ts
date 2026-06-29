import { DestroyRef, inject, signal, type Signal } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import type { CanDeactivateFn } from '@angular/router';

/**
 * Handle returned by `injectFormDirtyState`.
 */
export interface FormDirtyState {
  /** Whether any tracked control is dirty. */
  readonly isDirty: Signal<boolean>;
  /** Per-control dirty state keyed by control name. */
  readonly controlStates: Signal<Record<string, boolean>>;
  /** Mark a control as clean (after saving). */
  markControlClean(name: string): void;
  /** Mark a control as dirty. */
  markControlDirty(name: string): void;
  /** Reset all dirty states. */
  resetAll(): void;
}

function hasControls(control: AbstractControl): control is AbstractControl & { controls: Record<string, AbstractControl> } {
  return 'controls' in control;
}

/**
 * Tracks dirty state of an Angular form group's controls.
 *
 * @example
 * ```typescript
 * readonly form = new FormGroup({ name: new FormControl('') });
 * readonly dirty = injectFormDirtyState(this.form);
 *
 * dirty.isDirty(); // Signal<boolean>
 * dirty.controlStates(); // Signal<Record<string, boolean>>
 * ```
 */
export function injectFormDirtyState(form: AbstractControl): FormDirtyState {
  const destroyRef = inject(DestroyRef);
  const state = signal<Record<string, boolean>>({});
  const isDirty = signal(false);

  function refresh(): void {
    const controls: Record<string, boolean> = {};
    let anyDirty = false;

    if (hasControls(form)) {
      for (const name of Object.keys(form.controls)) {
        const ctrl = form.get(name);
        const dirty = ctrl?.dirty ?? false;
        controls[name] = dirty;
        if (dirty) anyDirty = true;
      }
    } else {
      anyDirty = form.dirty;
    }

    state.set(controls);
    isDirty.set(anyDirty);
  }

  // Subscribe to valueChanges for dirty tracking
  const sub = form.valueChanges.subscribe({ next: () => refresh() });

  destroyRef.onDestroy(() => sub.unsubscribe());

  return {
    isDirty: isDirty.asReadonly(),
    controlStates: state.asReadonly(),
    markControlClean: (name: string) => {
      form.get(name)?.markAsPristine();
      refresh();
    },
    markControlDirty: (name: string) => {
      form.get(name)?.markAsDirty();
      refresh();
    },
    resetAll: () => {
      form.markAsPristine();
      form.markAsUntouched();
      refresh();
    },
  };
}

/**
 * Creates a `CanDeactivateFn` that blocks navigation when the form has unsaved changes.
 */
export function formUnsavedGuard(
  dirtyState: FormDirtyState,
  message = 'You have unsaved changes. Are you sure you want to leave?',
): CanDeactivateFn<unknown> {
  return () => {
    if (!dirtyState.isDirty()) return true;
    return typeof window !== 'undefined' ? window.confirm(message) : true;
  };
}
