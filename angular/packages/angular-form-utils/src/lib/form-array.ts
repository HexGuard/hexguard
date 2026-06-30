import { DestroyRef, computed, inject, signal, type Signal } from '@angular/core';
import { FormArray, FormControl, type AbstractControl } from '@angular/forms';

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
/**
 * Handle returned by `injectFormArray`.
 */
export interface FormArrayHandle<T extends AbstractControl> {
  /** The current controls as a signal (updates on structural changes). */
  readonly controls: Signal<T[]>;
  /** The current length of the array. */
  readonly length: Signal<number>;
  /** Whether any control in the array is dirty. */
  readonly dirty: Signal<boolean>;
  /** Whether the array is valid. */
  readonly valid: Signal<boolean>;
  /** The raw values of all controls. */
  readonly value: Signal<ReturnType<T['getRawValue']>[]>;

  /** Push a new control. */
  push(control: T): void;
  /** Remove control at index. */
  remove(index: number): void;
  /** Insert control at index. */
  insert(index: number, control: T): void;
  /** Move control from `fromIndex` to `toIndex`. */
  move(fromIndex: number, toIndex: number): void;
  /** Swap controls at `indexA` and `indexB`. */
  swap(indexA: number, indexB: number): void;
  /** Clear all controls. */
  clear(): void;
  /** Reset the array to initial state. */
  reset(): void;
  /** Get control at index, or `undefined` if out of bounds. */
  at(index: number): T | undefined;
}

/**
 * Creates a typed `FormArray` handle with signal-based state tracking.
 *
 * Provides reactive `controls`, `length`, `dirty`, `valid`, and `value`
 * signals that update automatically on structural changes. All mutation
 * methods (`push`, `remove`, `insert`, `move`, `swap`, `clear`, `reset`)
 * are type-safe and include index bounds validation.
 *
 * @example
 * ```typescript
 * interface LineItem { name: string; qty: number }
 *
 * readonly items = injectFormArray<FormGroup<{
 *   name: FormControl<string>;
 *   qty: FormControl<number>;
 * }>>(() => [new FormGroup({ name: new FormControl('', {nonNullable: true}), qty: new FormControl(1) })]);
 *
 * items.length(); // Signal<number>
 * items.push(new FormGroup({ name: new FormControl('Item', {nonNullable: true}), qty: new FormControl(2) }));
 * items.move(0, 1);
 * ```
 */
export function injectFormArray<T extends AbstractControl>(
  controlsOrFactory: T[] | (() => T[]),
): FormArrayHandle<T> {
  const destroyRef = inject(DestroyRef);
  const initial = typeof controlsOrFactory === 'function' ? controlsOrFactory() : controlsOrFactory;
  const array = new FormArray(initial);
  const version = signal(0);
  const controlsSignal = signal<T[]>(array.controls as T[]);
  const lengthSignal = signal(array.length);
  const dirtySignal = signal(array.dirty);
  const validSignal = signal(array.valid);
  const valueSignal = signal(array.getRawValue() as ReturnType<T['getRawValue']>[]);

  const refresh = () => {
    controlsSignal.set(array.controls as T[]);
    lengthSignal.set(array.length);
    dirtySignal.set(array.dirty);
    validSignal.set(array.valid);
    valueSignal.set(array.getRawValue() as ReturnType<T['getRawValue']>[]);
    version.update((v) => v + 1);
  };

  const sub = array.valueChanges.subscribe({ next: refresh });
  const statusSub = array.statusChanges.subscribe({ next: refresh });
  destroyRef.onDestroy(() => { sub.unsubscribe(); statusSub.unsubscribe(); });

  return {
    controls: controlsSignal.asReadonly(),
    length: lengthSignal.asReadonly(),
    dirty: dirtySignal.asReadonly(),
    valid: validSignal.asReadonly(),
    value: valueSignal.asReadonly(),
    push: (control: T) => { array.push(control); refresh(); },
    remove: (index: number) => { if (index >= 0 && index < array.length) { array.removeAt(index); refresh(); } },
    insert: (index: number, control: T) => { array.insert(index, control); refresh(); },
    move: (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      if (fromIndex < 0 || fromIndex >= array.length) return;
      if (toIndex < 0 || toIndex >= array.length) return;
      const ctrl = array.at(fromIndex) as T;
      array.removeAt(fromIndex);
      array.insert(toIndex, ctrl);
      refresh();
    },
    swap: (indexA: number, indexB: number) => {
      if (indexA === indexB) return;
      if (indexA < 0 || indexA >= array.length) return;
      if (indexB < 0 || indexB >= array.length) return;
      const ctrlA = array.at(indexA) as T;
      const ctrlB = array.at(indexB) as T;
      array.removeAt(Math.max(indexA, indexB));
      array.removeAt(Math.min(indexA, indexB));
      array.insert(Math.min(indexA, indexB), ctrlB);
      array.insert(Math.max(indexA, indexB), ctrlA);
      refresh();
    },
    clear: () => { array.clear(); refresh(); },
    reset: () => { array.reset(); refresh(); },
    at: (index: number) => (index >= 0 && index < array.length ? (array.at(index) as T) : undefined),
  };
}

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

/**
 * Handle returned by `injectFormArrayItem`.
 */
export interface FormArrayItemHandle {
  /** The current index of this item in the array. */
  readonly index: Signal<number>;
  /** Whether this is the first item (index === 0). */
  readonly isFirst: Signal<boolean>;
  /** Whether this is the last item. */
  readonly isLast: Signal<boolean>;
  /** Remove this item from the array. */
  removeSelf(): void;
  /** Move this item one position up (toward index 0). No-op if already first. */
  moveUp(): void;
  /** Move this item one position down (toward the end). No-op if already last. */
  moveDown(): void;
}

/**
 * Creates a context handle for an item rendered inside a `FormArray`'s
 * iteration (e.g., `@for`). Provides the item's index, boundary checks,
 * and remove/move-up/move-down operations.
 *
 * @param array - The parent FormArray.
 * @param index - A signal or number for the item's current index.
 *
 * @example
 * ```typescript
 * @Component({
 *   template: `
 *     @for (item of items.controls(); track $index; let idx = $index) {
 *       <app-line-item [array]="items" [index]="idx" />
 *     }
 *   `,
 * })
 * class LineItemComponent {
 *   readonly array = input<FormArrayHandle<FormControl<string>>>(undefined!);
 *   readonly index = input<number>(0);
 *   readonly ctx = injectFormArrayItem(this.array(), computed(() => this.index()));
 *
 *   // Template: <button (click)="ctx.removeSelf()">Remove</button>
 *   //           <button (click)="ctx.moveUp()" [disabled]="ctx.isFirst()">↑</button>
 * }
 * ```
 */
export function injectFormArrayItem(
  array: FormArray,
  index: Signal<number> | number,
): FormArrayItemHandle {
  const indexSignal: Signal<number> = typeof index === 'number' ? signal(index).asReadonly() : index;
  const destroyRef = inject(DestroyRef);

  const isFirst = computed(() => indexSignal() === 0);
  const isLast = computed(() => indexSignal() === array.length - 1);

  return {
    index: indexSignal,
    isFirst,
    isLast,
    removeSelf() {
      const idx = indexSignal();
      if (idx >= 0 && idx < array.length) {
        array.removeAt(idx);
      }
    },
    moveUp() {
      const idx = indexSignal();
      if (idx > 0) {
        const ctrl = array.at(idx);
        array.removeAt(idx);
        array.insert(idx - 1, ctrl);
      }
    },
    moveDown() {
      const idx = indexSignal();
      if (idx < array.length - 1) {
        const ctrl = array.at(idx);
        array.removeAt(idx);
        array.insert(idx + 1, ctrl);
      }
    },
  };
}
