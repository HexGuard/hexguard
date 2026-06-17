---
id: feature-angular-selection-state
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-selection-state'
---

# Angular Selection State Package

## Summary

Design `@hexguard/angular-selection-state` as a headless package for standardizing row and item
selection across lists, tables, bulk actions, and filtered result sets.

The repeated problem is that most Angular admin apps keep reinventing selected-id sets,
select-all-visible logic, bulk-action enablement, and selection reset rules after filtering or
pagination changes.

## Goals

- Provide a reusable selection-state model for keyed collections.
- Support single-select, multi-select, select-all-visible, and clear-selection patterns.
- Keep the package headless so it composes with different table or list UIs.
- Compose naturally with table-state, query-form, and async-state.

## Non-Goals

- Rendering data tables.
- Replacing URL state or pagination state.
- Domain-specific bulk action policies.

## Decisions

- Use keyed selection as the core primitive.
- Treat select-all-visible and filtered-result selection as explicit operations, not hidden magic.
- Keep the first version focused on client-known items rather than remote “select all matching”
  semantics that require backend cooperation.

## Implementation Plan

1. Define the keyed selection model and derived helpers.
2. Implement operations for toggle, clear, replace, and select-visible behavior.
3. Add helpers for bulk-action enablement and selection summaries.
4. Define reset semantics when the underlying collection identity changes.
5. Add tests and demos for list, table, and bulk-action workflows.

## Validation

- Unit tests for selection operations and derived helpers.
- Demo coverage for table row selection and bulk actions.
- Manual checks for pagination and filter changes.

## Follow-Ups

- Revisit server-backed "select all matching filter" semantics as a separate design spike.
- Evaluate whether tree-selection behavior belongs in the same package or a separate one.

---

## Expanded Implementation Plan

### Proposed Public API

```ts
import { injectSelectionState } from '@hexguard/angular-selection-state';

const selection = injectSelectionState<string>({
  multi: true,
});

selection.selected;        // Signal<Set<string>>
selection.count;           // Signal<number>
selection.isEmpty;         // Signal<boolean>
selection.isAllSelected;   // Signal<boolean>
selection.first;           // Signal<string | null>

selection.toggle(key);
selection.select(key);
selection.deselect(key);
selection.toggleAll(visibleKeys: string[]);
selection.selectAll(visibleKeys: string[]);
selection.clear();
selection.replace(keys: string[]);

selection.canAct;          // Signal<boolean>
```

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-selection-state/` following existing conventions (package.json, ng-package.json, tsconfig.lib.json, tsconfig.lib.prod.json, tsconfig.spec.json, `angular.json` project registration).
2. Add scripts to `angular/package.json`: `build:lib:selection-state`, `test:lib:selection-state`.

### Phase 1: Core Implementation

3. Implement `injectSelectionState<TKey>()` with `WritableSignal<Set<TKey>>` as the backing store.
4. Implement `toggle()`, `select()`, `deselect()`, `clear()`, `replace()` operations.
5. Implement `toggleAll(visibleKeys)` — selects all visible if none/partial selected, clears if all selected.
6. Implement `selectAll(visibleKeys)` — selects all visible keys unconditionally.
7. Implement derived signals: `count`, `isEmpty`, `isAllSelected`, `first`, `canAct`.
8. Implement optional `selectedItems(itemsMap)` helper for resolving selected keys to objects.
9. Add unit tests for: all operations, toggleAll edge cases, clear on collection change, single-selection mode, empty array, rapid toggles.

### Phase 2: Demo & Docs

10. Add demo route at `/packages/angular-selection-state` with a mock table, checkbox column, select-all header, bulk action bar showing selected count, and clear button.
11. Add Playwright coverage for checkbox toggle, select-all, pagination reset.
12. Write `docs/packages/angular-selection-state.md`.
13. Update npm-facing `README.md`.

### Phase 3: Release

14. Add `verify:package:selection-state` to `angular/package.json`.
15. Add `.github/workflows/release-angular-selection-state.yml`.
16. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:selection-state` — unit tests.
- `pnpm build:lib` — builds.
- `pnpm test:e2e` — Playwright.
- `pnpm verify:package:selection-state` — tarball smoke test.
