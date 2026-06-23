import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SelectionStateObservables<TKey extends string = string> {
  /** Emits the current set of selected keys on every change. */
  readonly selected$: Observable<ReadonlySet<TKey>>;
  /** Emits the current selection count. */
  readonly count$: Observable<number>;
  /** Emits `true` when nothing is selected. */
  readonly isEmpty$: Observable<boolean>;
  /** Emits `true` when at least one key is selected. */
  readonly canAct$: Observable<boolean>;
  toggle(key: TKey): void;
  select(key: TKey): void;
  deselect(key: TKey): void;
  clear(): void;
  replace(keys: readonly TKey[]): void;
  toggleAll(visibleKeys: readonly TKey[]): void;
  selectAll(visibleKeys: readonly TKey[]): void;
}

/**
 * Creates an observable-based selection state, mirroring
 * `injectSelectionState()` but without Angular DI.
 *
 * @param multi - When `true` (default), multiple keys can be selected
 *   simultaneously. When `false`, selecting a new key deselects the
 *   previous one.
 * @returns An object with `selected$`, `count$`, `isEmpty$`, `canAct$`
 *   observables and mutation methods (`toggle`, `select`, `deselect`,
 *   `clear`, `replace`, `toggleAll`, `selectAll`).
 *
 * @example
 * ```ts
 * import { createSelectionState } from '@hexguard/angular-selection-state';
 *
 * const sel = createSelectionState<string>();
 * sel.selected$.subscribe(keys => console.log('Selected:', [...keys]));
 * sel.toggle('item-1');
 * ```
 */
export function createSelectionState<TKey extends string = string>(
  multi: boolean = true,
): SelectionStateObservables<TKey> {
  const subject = new BehaviorSubject<Set<TKey>>(new Set());

  const selected$ = subject.asObservable();
  const count$ = selected$.pipe(map((s) => s.size));
  const isEmpty$ = selected$.pipe(map((s) => s.size === 0));
  const canAct$ = selected$.pipe(map((s) => s.size > 0));

  function toggle(key: TKey): void {
    subject.next(
      (() => {
        const set = subject.getValue();
        const next = new Set(set);
        if (next.has(key)) next.delete(key);
        else {
          if (!multi) next.clear();
          next.add(key);
        }
        return next;
      })(),
    );
  }

  function select(key: TKey): void {
    subject.next(
      (() => {
        const set = subject.getValue();
        const next = new Set(set);
        if (!multi) next.clear();
        next.add(key);
        return next;
      })(),
    );
  }

  function deselect(key: TKey): void {
    subject.next(
      (() => {
        const set = subject.getValue();
        if (!set.has(key)) return set;
        const next = new Set(set);
        next.delete(key);
        return next;
      })(),
    );
  }

  function clear(): void {
    subject.next(new Set<TKey>());
  }

  function replace(keys: readonly TKey[]): void {
    subject.next(new Set<TKey>(keys));
  }

  function toggleAll(visibleKeys: readonly TKey[]): void {
    subject.next(
      (() => {
        const set = subject.getValue();
        const allSelected = visibleKeys.every((k) => set.has(k));
        if (allSelected && visibleKeys.length > 0) {
          const visibleSet = new Set(visibleKeys);
          const next = new Set(set);
          for (const k of visibleSet) next.delete(k);
          return next;
        }
        const next = new Set(set);
        for (const k of visibleKeys) next.add(k);
        return next;
      })(),
    );
  }

  function selectAll(visibleKeys: readonly TKey[]): void {
    subject.next(
      (() => {
        const next = new Set(subject.getValue());
        for (const k of visibleKeys) next.add(k);
        return next;
      })(),
    );
  }

  return {
    selected$,
    count$,
    isEmpty$,
    canAct$,
    toggle,
    select,
    deselect,
    clear,
    replace,
    toggleAll,
    selectAll,
  };
}
