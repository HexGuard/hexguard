import { computed, signal, type Signal, type WritableSignal } from '@angular/core';

// ── Public types ───────────────────────────────────────────────────

/** Options for configuring the selection state. */
export interface SelectionStateOptions {
  /**
   * Whether multiple items can be selected at once.
   * When `false`, selecting a new item deselects the previous one.
   * @default true
   */
  readonly multi?: boolean;
}

/** The return type of {@link injectSelectionState}. */
export interface SelectionStateReturn<TKey extends string = string> {
  /** Signal of the currently selected keys. */
  readonly selected: Signal<ReadonlySet<TKey>>;

  /** Number of currently selected items. */
  readonly count: Signal<number>;

  /** Whether no items are selected. */
  readonly isEmpty: Signal<boolean>;

  /**
   * Whether all visible items are selected.
   * Compare against a provided set of visible keys.
   */
  readonly isAllSelected: Signal<(visibleKeys: readonly TKey[]) => boolean>;

  /** The first selected key, or `null` if nothing is selected. */
  readonly first: Signal<TKey | null>;

  /**
   * Whether a bulk action can be performed.
   * Returns `true` when at least one item is selected.
   */
  readonly canAct: Signal<boolean>;

  // ── Mutators ──────────────────────────────────────────────────

  /** Toggle the selection of a single key. */
  toggle(key: TKey): void;

  /** Select a single key. */
  select(key: TKey): void;

  /** Deselect a single key. */
  deselect(key: TKey): void;

  /** Clear the entire selection. */
  clear(): void;

  /** Replace the entire selection with the given keys. */
  replace(keys: readonly TKey[]): void;

  /**
   * Toggle all visible keys.
   * - If nothing selected → selects all.
   * - If all selected → clears all.
   * - If partial → selects all.
   */
  toggleAll(visibleKeys: readonly TKey[]): void;

  /** Select all visible keys unconditionally. */
  selectAll(visibleKeys: readonly TKey[]): void;

  // ── Range selection (for shift-click and keyboard nav) ───────────

  /** The anchor key for range selection (the start of a shift-click range). */
  readonly anchorKey: Signal<TKey | null>;

  /**
   * Select all keys between the anchor and the given key.
   * Sets the anchor if none is set. Keys are matched by position in visibleKeys.
   */
  selectRange(visibleKeys: readonly TKey[], toKey: TKey): void;

  /** Select the next key after the last selected (arrow down). */
  selectNext(visibleKeys: readonly TKey[]): void;

  /** Select the previous key before the first selected (arrow up). */
  selectPrev(visibleKeys: readonly TKey[]): void;
}

// ── Implementation ─────────────────────────────────────────────────

/**
 * Creates a headless, signal-based selection state for keyed collections.
 *
 * Must be called within an Angular injection context.
 *
 * @example
 * ```ts
 * const selection = injectSelectionState<string>();
 *
 * // In template:
 * // &lt;input type="checkbox"
 * //   [checked]="selection.selected().has(item.id)"
 * //   (change)="selection.toggle(item.id)" /&gt;
 * //
 * // &lt;button [disabled]="!selection.canAct()"&gt;
 * //   Act on {{ selection.count() }} selected
 * // &lt;/button&gt;
 * ```
 */
export function injectSelectionState<TKey extends string = string>(
  options: SelectionStateOptions = {},
): SelectionStateReturn<TKey> {
  const multi = options.multi ?? true;
  const selectedSet: WritableSignal<Set<TKey>> = signal(new Set<TKey>());

  // ── Derived signals ───────────────────────────────────────────

  const selected = computed(() => selectedSet());

  const count = computed(() => selectedSet().size);

  const isEmpty = computed(() => selectedSet().size === 0);

  const isAllSelected = computed(() => (visibleKeys: readonly TKey[]) => {
    if (visibleKeys.length === 0) return false;
    const set = selectedSet();
    return visibleKeys.every((k) => set.has(k));
  });

  const first = computed<TKey | null>(() => {
    const set = selectedSet();
    return set.size > 0 ? (set.values().next().value ?? null) : null;
  });

  const canAct = computed(() => selectedSet().size > 0);

  // ── Mutators ──────────────────────────────────────────────────

  function toggle(key: TKey): void {
    selectedSet.update((set) => {
      const next = new Set(set);
      if (next.has(key)) {
        next.delete(key);
      } else {
        if (!multi) {
          next.clear();
        }
        next.add(key);
      }
      return next;
    });
  }

  function select(key: TKey): void {
    selectedSet.update((set) => {
      const next = new Set(set);
      if (!multi) {
        next.clear();
      }
      next.add(key);
      return next;
    });
  }

  function deselect(key: TKey): void {
    selectedSet.update((set) => {
      if (!set.has(key)) return set;
      const next = new Set(set);
      next.delete(key);
      return next;
    });
  }

  function clear(): void {
    selectedSet.set(new Set<TKey>());
  }

  function replace(keys: readonly TKey[]): void {
    selectedSet.set(new Set<TKey>(keys));
  }

  function toggleAll(visibleKeys: readonly TKey[]): void {
    const set = selectedSet();
    const allSelected = visibleKeys.every((k) => set.has(k));

    if (allSelected && visibleKeys.length > 0) {
      // Everything visible is selected → clear visible keys from selection
      const visibleSet = new Set(visibleKeys);
      selectedSet.update((s) => {
        const next = new Set(s);
        for (const k of visibleSet) {
          next.delete(k);
        }
        return next;
      });
    } else {
      // Partial or none → select all visible
      selectedSet.update((s) => {
        const next = new Set(s);
        for (const k of visibleKeys) {
          next.add(k);
        }
        return next;
      });
    }
  }

  function selectAll(visibleKeys: readonly TKey[]): void {
    selectedSet.update((s) => {
      const next = new Set(s);
      for (const k of visibleKeys) {
        next.add(k);
      }
      return next;
    });
  }

  // ── Range selection ──────────────────────────────────────────

  const anchorKey = signal<TKey | null>(null);

  function selectRange(visibleKeys: readonly TKey[], toKey: TKey): void {
    const currentAnchor = anchorKey();
    if (currentAnchor === null || !multi) {
      // First click or single-select: just set anchor and select the key
      anchorKey.set(toKey);
      select(toKey);
      return;
    }

    const fromIdx = visibleKeys.indexOf(currentAnchor);
    const toIdx = visibleKeys.indexOf(toKey);
    if (fromIdx === -1 || toIdx === -1) {
      // Key not in visible list — fall back to single select
      select(toKey);
      return;
    }

    const start = Math.min(fromIdx, toIdx);
    const end = Math.max(fromIdx, toIdx);

    selectedSet.update((set) => {
      const next = new Set(set);
      for (let i = start; i <= end; i++) {
        next.add(visibleKeys[i]);
      }
      return next;
    });
  }

  function selectNext(visibleKeys: readonly TKey[]): void {
    const current = first();
    if (current === null) {
      if (visibleKeys.length > 0) select(visibleKeys[0]);
      return;
    }
    const idx = visibleKeys.indexOf(current);
    if (idx >= 0 && idx < visibleKeys.length - 1) {
      if (multi) clear();
      select(visibleKeys[idx + 1]);
      anchorKey.set(visibleKeys[idx + 1]);
    }
  }

  function selectPrev(visibleKeys: readonly TKey[]): void {
    const current = first();
    if (current === null) {
      if (visibleKeys.length > 0) select(visibleKeys[visibleKeys.length - 1]);
      return;
    }
    const idx = visibleKeys.indexOf(current);
    if (idx > 0) {
      if (multi) clear();
      select(visibleKeys[idx - 1]);
      anchorKey.set(visibleKeys[idx - 1]);
    }
  }

  return {
    selected,
    count,
    isEmpty,
    isAllSelected,
    first,
    canAct,
    toggle,
    select,
    deselect,
    clear,
    replace,
    toggleAll,
    selectAll,
    anchorKey: anchorKey.asReadonly(),
    selectRange,
    selectNext,
    selectPrev,
  };
}
