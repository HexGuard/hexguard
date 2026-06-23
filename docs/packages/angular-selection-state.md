# `@hexguard/angular-selection-state` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-selection-state` provides a headless, signal-based keyed selection model for Angular tables, lists, and bulk-action flows.

The package is intentionally focused:

- one `injectSelectionState()` factory function
- multi-selection (default) and single-selection modes
- 7 operations: `toggle`, `select`, `deselect`, `clear`, `replace`, `toggleAll`, `selectAll`
- 6 derived signals: `selected`, `count`, `isEmpty`, `isAllSelected`, `first`, `canAct`
- no UI dependencies, no component wrappers, no directives

## Public API Map

| Export                   | Role                                              |
| ------------------------ | ------------------------------------------------- |
| `injectSelectionState()` | Creates selection state with signals + operations |
| `SelectionStateOptions`  | Configures `multi` mode                           |
| `SelectionStateReturn`   | The return type with signals and mutators         |

## Behavior Details

### Multi vs Single Selection

- **Multi** (default): multiple keys can be selected simultaneously. `toggle()` adds/removes individual keys without clearing others.
- **Single** (`multi: false`): selecting a new key automatically deselects the previous one. `toggle()` replaces.

### toggleAll Semantics

`toggleAll(visibleKeys)` follows standard checkbox header behavior:

- If none selected → selects all visible keys
- If all selected → clears all visible keys
- If partial → selects all visible keys

### selectAll vs toggleAll

- `selectAll(visibleKeys)` unconditionally adds all visible keys to the selection
- `toggleAll(visibleKeys)` conditionally toggles based on current state

### Derived Signals

| Signal          | Description                                                           |
| --------------- | --------------------------------------------------------------------- |
| `selected`      | The current `Set<TKey>` of selected keys                              |
| `count`         | Number of selected keys                                               |
| `isEmpty`       | `true` when nothing is selected                                       |
| `isAllSelected` | Function that checks if all provided keys are selected                |
| `first`         | The first selected key, or `null`                                     |
| `canAct`        | `true` when at least one key is selected (for bulk action enablement) |

## Option Resolution

```ts
const defaults: Required<SelectionStateOptions> = {
  multi: true,
};
```

## Cross-Stack Pairing

This package is an Angular-only standalone package. It composes with `@hexguard/angular-bulk-operations` via the `selectedItemsToBulkRequest()` helper.

## Scope Boundaries

**Included** — keyed selection state with multi/single modes, toggle/select/deselect/clear/replace/toggleAll/selectAll operations, derived signals for counts and enablement.

**Excluded** — server-backed "select all matching filter" semantics, tree-selection behavior, data table rendering, URL persistence of selection state.

## RxJS Observable API

For RxJS consumers, `createSelectionState()` returns observable-based selection state without Angular DI:

```ts
import { createSelectionState } from '@hexguard/angular-selection-state';
import { combineLatest } from 'rxjs';

const sel = createSelectionState<string>();

// React to selection changes
sel.selected$.subscribe((keys) => console.log('Selected:', [...keys]));
sel.count$.subscribe((n) => updateCount(n));
sel.canAct$.subscribe((canAct) => btnEnabled(canAct));

// Combine with data streams
const bulkPayload$ = combineLatest([sel.selected$, items$]).pipe(
  map(([selected, items]) => items.filter((item) => selected.has(item.id))),
);

// Mutate
sel.toggle('item-1');
sel.selectAll(['a', 'b', 'c']);
sel.clear();
```

## Related Resources

- [Package README](../../angular/packages/angular-selection-state/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-selection-state/)
- [Source Code](../../angular/packages/angular-selection-state/src/)
- [Consumed by: `@hexguard/angular-bulk-operations`](./angular-bulk-operations.md)

## Assessment: Potential Improvements

| Area | Suggestion                                                                                                                                                                                | Priority    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| API  | ✅ Added RxJS observable alternative — `createSelectionState()` returns `{ selected$, count$, isEmpty$, canAct$, toggle, select, ... }`. Import from `@hexguard/angular-selection-state`. | Implemented |

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                                    | Severity |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Simplest package in the workspace — 1 function (`injectSelectionState`), 2 types. Textbook narrow public API.                                              | praise   |
| Public API Design         | JSDoc on `injectSelectionState()` with `@example`. Types have field-level JSDoc.                                                                           | praise   |
| Implementation Quality    | Signal-first, immutable updates (never mutates the internal `Set`). Comprehensive derived signals: `count`, `isEmpty`, `isAllSelected`, `first`, `canAct`. | praise   |
| Implementation Quality    | Zero external deps beyond `@angular/core` + `tslib`. Minimal reference implementation for all sibling packages.                                            | praise   |
| Test Coverage             | 19 tests covering all operations in both multi and single modes.                                                                                           | praise   |
| Documentation             | Deep-dive doc references `onCollectionChange` callback which does not exist in the implementation — stale doc.                                             | minor    |
| Cross-package Consistency | Consumed by `angular-bulk-operations` via `selection.selected` signal — minimal, well-defined integration point.                                           | praise   |
| Cross-package Consistency | Build scripts, release workflow, catalog entry all present.                                                                                                | praise   |
