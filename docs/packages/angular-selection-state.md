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

| Export | Role |
|--------|------|
| `injectSelectionState()` | Creates selection state with signals + operations |
| `SelectionStateOptions` | Configures `multi` mode and `onCollectionChange` callback |
| `SelectionStateReturn` | The return type with signals and mutators |

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

| Signal | Description |
|--------|-------------|
| `selected` | The current `Set<TKey>` of selected keys |
| `count` | Number of selected keys |
| `isEmpty` | `true` when nothing is selected |
| `isAllSelected` | Function that checks if all provided keys are selected |
| `first` | The first selected key, or `null` |
| `canAct` | `true` when at least one key is selected (for bulk action enablement) |

### Collection Change Handling

The `onCollectionChange` callback fires when the consumer detects a collection identity change (e.g., after filtering or pagination). The callback receives the previous selected keys so the consumer can reconcile — for example, by clearing or re-mapping selection after a filter change.

## Option Resolution

```ts
const defaults: Required<SelectionStateOptions> = {
  multi: true,
  onCollectionChange: undefined,
};
```

## Cross-Stack Pairing

This package is an Angular-only standalone package. It composes with `@hexguard/angular-bulk-operations` via the `selectedItemsToBulkRequest()` helper.

## Scope Boundaries

**Included** — keyed selection state with multi/single modes, toggle/select/deselect/clear/replace/toggleAll/selectAll operations, derived signals for counts and enablement.

**Excluded** — server-backed "select all matching filter" semantics, tree-selection behavior, data table rendering, URL persistence of selection state.
