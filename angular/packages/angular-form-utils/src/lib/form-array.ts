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

/**
 * Moves an item within a `FormArray` from one index to another, shifting
 * other items as necessary. A no-op if both indices are the same or out of
 * bounds.
 *
 * @example
 * ```typescript
 * const items = new FormArray([
 *   new FormControl('a'),
 *   new FormControl('b'),
 *   new FormControl('c'),
 * ]);
 *
 * moveArrayItem(items, 0, 2); // → ['b', 'c', 'a']
 * moveArrayItem(items, 2, 0); // → ['a', 'b', 'c']
 * ```
 */
export function moveArrayItem<T>(
  array: FormArray<FormControl<T>>,
  fromIndex: number,
  toIndex: number,
): void {
  if (fromIndex === toIndex) return;
  if (fromIndex < 0 || fromIndex >= array.length) return;
  if (toIndex < 0 || toIndex >= array.length) return;

  const control = array.at(fromIndex);
  array.removeAt(fromIndex);
  array.insert(toIndex, control);
}

/**
 * Syncs a `FormArray`'s item values to match a given ordered list of values.
 *
 * Existing controls whose value is still in the new set are preserved (keeping
 * their dirty/pristine state). Controls whose value is no longer in the set
 * are removed. New controls are created for values not previously present.
 *
 * @example
 * ```typescript
 * const tags = new FormArray([new FormControl('a'), new FormControl('b')]);
 *
 * syncArrayValues(tags, ['c', 'a'], (v) => new FormControl(v));
 * // tags now has ['c', 'a'] — 'b' was removed, 'c' was added, 'a' was kept
 * ```
 */
export function syncArrayValues<T>(
  array: FormArray<FormControl<T>>,
  values: T[],
  toControl?: (value: T) => FormControl<T>,
): void {
  // Map existing controls by value so we can preserve them
  const existing = new Map<T, FormControl<T>>();
  for (let i = 0; i < array.length; i++) {
    const ctrl = array.at(i);
    existing.set(ctrl.value, ctrl);
  }

  array.clear();

  for (const value of values) {
    const ctrl = existing.get(value);
    if (ctrl) {
      array.push(ctrl);
      existing.delete(value);
    } else {
      array.push(toControl?.(value) ?? new FormControl(value, { nonNullable: true }));
    }
  }
}
