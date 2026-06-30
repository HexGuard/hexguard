import { DestroyRef, inject, signal, type Signal } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';

/**
 * Handle returned by `injectFormArrayDirtyState`.
 */
export interface FormArrayDirtyState {
  /** Whether any array item is dirty. */
  readonly isDirty: Signal<boolean>;
  /** Per-item dirty state keyed by index. */
  readonly itemStates: Signal<Record<number, boolean>>;
  /** Mark an item at the given index as clean. */
  markItemClean(index: number): void;
  /** Mark an item at the given index as dirty. */
  markItemDirty(index: number): void;
  /** Reset all dirty states in the array. */
  resetAll(): void;
}

/**
 * Tracks dirty state of a `FormArray`'s items with index-based access.
 *
 * @example
 * ```typescript
 * readonly tags = new FormArray([new FormControl(''), new FormControl('')]);
 * readonly dirty = injectFormArrayDirtyState(this.tags);
 *
 * dirty.isDirty();       // Signal<boolean>
 * dirty.itemStates();    // Signal<Record<number, boolean>>
 * dirty.markItemClean(0);
 * ```
 */
export function injectFormArrayDirtyState(array: FormArray): FormArrayDirtyState {
  const destroyRef = inject(DestroyRef);
  const state = signal<Record<number, boolean>>({});
  const isDirty = signal(false);

  function refresh(): void {
    const items: Record<number, boolean> = {};
    let anyDirty = false;

    for (let i = 0; i < array.length; i++) {
      const dirty = array.at(i)?.dirty ?? false;
      items[i] = dirty;
      if (dirty) anyDirty = true;
    }

    state.set(items);
    isDirty.set(anyDirty);
  }

  const sub = array.valueChanges.subscribe({ next: () => refresh() });
  destroyRef.onDestroy(() => sub.unsubscribe());

  return {
    isDirty: isDirty.asReadonly(),
    itemStates: state.asReadonly(),
    markItemClean: (index: number) => {
      array.at(index)?.markAsPristine();
      refresh();
    },
    markItemDirty: (index: number) => {
      array.at(index)?.markAsDirty();
      refresh();
    },
    resetAll: () => {
      for (let i = 0; i < array.length; i++) {
        array.at(i)?.markAsPristine();
        array.at(i)?.markAsUntouched();
      }
      refresh();
    },
  };
}

/**
 * Toggles a value in a `FormArray` of `FormControl`s.
 *
 * If the value is already present, removes it. Otherwise, adds it using the
 * optional `toControl` factory. Useful for checkbox groups, tag pickers, and
 * multi-select interfaces.
 *
 * @example
 * ```typescript
 * const selected = new FormArray([new FormControl('a'), new FormControl('b')]);
 *
 * // Remove 'a', add 'c' → ['b', 'c']
 * arrayToggleItem(selected, 'a');
 * arrayToggleItem(selected, 'c', (v) => new FormControl(v));
 * ```
 */
export function arrayToggleItem<T>(
  array: FormArray<FormControl<T>>,
  value: T,
  toControl?: (value: T) => FormControl<T>,
): void {
  const index = array.controls.findIndex((c) => c.value === value);

  if (index >= 0) {
    array.removeAt(index);
  } else {
    array.push(toControl?.(value) ?? new FormControl(value, { nonNullable: true }));
  }
}
