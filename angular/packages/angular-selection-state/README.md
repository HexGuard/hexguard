# @hexguard/angular-selection-state

Headless keyed selection state for Angular tables, lists, and bulk-action flows.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-selection-state.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-selection-state
```

## Quickstart

```ts
import { injectSelectionState } from '@hexguard/angular-selection-state';

@Component({ ... })
export class MyTableComponent {
  readonly selection = injectSelectionState<string>();

  readonly items = signal([
    { id: 'a', label: 'Item A' },
    { id: 'b', label: 'Item B' },
  ]);

  toggleAll() {
    this.selection.toggleAll(this.items().map(i => i.id));
  }
}
```

```html
<table>
  <thead>
    <tr>
      <th>
        <input
          type="checkbox"
          [checked]="selection.isAllSelected()(visibleKeys())"
          (change)="selection.toggleAll(visibleKeys())"
        />
      </th>
      <th>Label</th>
    </tr>
  </thead>
  <tbody>
    @for (item of items(); track item.id) {
    <tr>
      <td>
        <input
          type="checkbox"
          [checked]="selection.selected().has(item.id)"
          (change)="selection.toggle(item.id)"
        />
      </td>
      <td>{{ item.label }}</td>
    </tr>
    }
  </tbody>
</table>

@if (selection.canAct()) {
<button (click)="performAction()">Act on {{ selection.count() }} selected</button>
}
```

## Features

| Feature                              | Status | Notes                                        |
| ------------------------------------ | ------ | -------------------------------------------- |
| Multi-selection                      | ✅     | Default — toggle individual keys             |
| Single-selection                     | ✅     | `{ multi: false }` — auto-deselects previous |
| `toggle`, `select`, `deselect`       | ✅     | Individual key operations                    |
| `toggleAll`, `selectAll`             | ✅     | Visible-row selection helpers                |
| `clear`, `replace`                   | ✅     | Bulk operations on selection set             |
| `count`, `isEmpty`, `canAct` signals | ✅     | Derived state for UI enablement              |
| `isAllSelected(visibleKeys)`         | ✅     | Check-all-header logic                       |
| `first` signal                       | ✅     | Quick access to first selected key           |
| Zero dependencies                    | ✅     | Only `@angular/core` + `tslib`               |

## Demo routes

| Route                                    | Description                                                  |
| ---------------------------------------- | ------------------------------------------------------------ |
| `/packages/angular-selection-state`      | Package overview                                             |
| `/packages/angular-selection-state/demo` | Table selection with checkboxes, select-all, bulk action bar |

## What It Owns

- Keyed selection state with multi/single modes
- All toggle, select, deselect, clear, replace operations
- `toggleAll` and `selectAll` for visible-row patterns
- Derived signals: count, isEmpty, isAllSelected, first, canAct

## What It Does Not Own

- Data table rendering — this is a headless state model
- Server-backed "select all matching filter" semantics
- Tree-selection or hierarchical selection behavior
- URL persistence of selection state
