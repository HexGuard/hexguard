import { Component, computed, signal } from '@angular/core';
import { injectSelectionState } from '@hexguard/angular-selection-state';

interface DemoItem {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'app-selection-state-demo-page',
  standalone: true,
  template: `
    <h1>Selection State Demo</h1>
    <p data-testid="selection-count">
      Selected: {{ selection.count() }} item(s)
      @if (selection.canAct()) {
        <button (click)="selection.clear()" data-testid="clear-selection-btn">Clear</button>
      }
    </p>

    <table data-testid="selection-table">
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              [checked]="allSelected()"
              (change)="selection.toggleAll(visibleKeys())"
              data-testid="select-all-checkbox"
            />
          </th>
          <th>ID</th>
          <th>Label</th>
        </tr>
      </thead>
      <tbody>
        @for (item of items; track item.id) {
          <tr data-testid="selection-row">
            <td>
              <input
                type="checkbox"
                [checked]="selection.selected().has(item.id)"
                (change)="selection.toggle(item.id)"
                [attr.data-testid]="'checkbox-' + item.id"
              />
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.label }}</td>
          </tr>
        }
      </tbody>
    </table>

    @if (selection.canAct()) {
      <div class="bulk-bar" data-testid="bulk-action-bar">
        <span data-testid="bulk-bar-count">{{ selection.count() }} selected</span>
        <button (click)="performBulkAction()" data-testid="bulk-action-btn">
          Perform Action on {{ selection.count() }} item(s)
        </button>
      </div>
    }

    @if (lastActionResult(); as actionResult) {
      <div class="results" data-testid="selection-action-result">
        <p>Applied to: <strong>{{ actionResult }}</strong></p>
        <button (click)="clearActionResult()" data-testid="clear-result-btn">Dismiss</button>
      </div>
    }
  `,
  styles: [
    `
      table { width: 100%; border-collapse: collapse; }
      th, td { padding: 0.5rem; border: 1px solid var(--border-color, #ccc); text-align: left; }
      .bulk-bar { padding: 0.5rem; margin-top: 0.5rem; background: #eef; border-radius: 0.25rem; display: flex; align-items: center; gap: 0.5rem; }
      .results { margin-top: 1rem; padding: 1rem; background: #f9f9f9; border-radius: 0.5rem; }
      button { cursor: pointer; }
    `,
  ],
})
export class SelectionStateDemoPageComponent {
  readonly items: DemoItem[] = [
    { id: 'item-1', label: 'First Item' },
    { id: 'item-2', label: 'Second Item' },
    { id: 'item-3', label: 'Third Item' },
    { id: 'item-4', label: 'Fourth Item' },
    { id: 'item-5', label: 'Fifth Item' },
  ];

  readonly visibleKeys = computed(() => this.items.map((i) => i.id));

  readonly selection = injectSelectionState<string>();

  readonly allSelected = computed(() => this.selection.isAllSelected()(this.visibleKeys()));

  readonly lastActionResult = signal<string | null>(null);

  clearSelection(): void {
    this.selection.clear();
  }

  performBulkAction(): void {
    const selectedIds = [...this.selection.selected()].join(', ');
    this.lastActionResult.set(selectedIds);
  }

  clearActionResult(): void {
    this.lastActionResult.set(null);
  }
}
