import { Component, computed, signal } from '@angular/core';
import { injectSelectionState } from '@hexguard/angular-selection-state';

import { ANGULAR_SELECTION_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

interface DemoItem {
  readonly id: string;
  readonly label: string;
}

@Component({
  selector: 'app-selection-state-demo-page',
  standalone: true,
  imports: [DemoInspectorPanelComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  template: `
    <demo-page-layout testId="selection-state-demo-page">
      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Selection State</p>
            <h2>Headless keyed selection with checkbox table.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectSelectionState()</code> provides multi/single-selection with toggle,
          select-all, clear, and derived signals. Use the checkboxes below to see each operation in
          action.
        </p>

        <demo-status-strip
          testId="selection-state-demo-status"
          summary="Selection state with multi-select, toggleAll, and derived signals."
          currentUrl="Selection State Demo"
          summaryTestId="selection-state-demo-summary"
          urlTestId="selection-state-demo-url"
        />
      </article>

      <article demoPrimary class="demo-card demo-card--stack">
        <p data-testid="selection-count">
          Selected: <strong>{{ selection.count() }}</strong> item(s)
          @if (selection.canAct()) {
            <button
              class="demo-button demo-button--sm"
              (click)="selection.clear()"
              data-testid="clear-selection-btn"
            >
              Clear all
            </button>
          }
        </p>

        <div class="demo-table-wrap">
          <table class="demo-table" data-testid="selection-table">
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
        </div>

        @if (selection.canAct()) {
          <div class="demo-actions-row" style="margin-top: 0.75rem;" data-testid="bulk-action-bar">
            <span data-testid="bulk-bar-count">{{ selection.count() }} selected</span>
            <button
              class="demo-button demo-button--sm"
              (click)="performBulkAction()"
              data-testid="bulk-action-btn"
            >
              Perform Action
            </button>
          </div>
        }

        @if (lastActionResult(); as actionResult) {
          <div
            class="demo-card demo-card--stack"
            style="margin-top: 1rem;"
            data-testid="selection-action-result"
          >
            <p>
              Applied to: <strong>{{ actionResult }}</strong>
            </p>
            <button
              class="demo-button demo-button--ghost demo-button--sm"
              (click)="clearActionResult()"
              data-testid="clear-result-btn"
            >
              Dismiss
            </button>
          </div>
        }
      </article>

      <demo-inspector-panel
        demoAside
        panelTestId="selection-state-inspector-panel"
        eyebrow="Reference"
        title="Selection state snapshot"
        summary="Current selection state and key operation results."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="selection-state-snapshot-json"
        codeTestId="selection-state-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 0.75rem;
      }
      th,
      td {
        padding: 0.5rem;
        border: 1px solid var(--border-color, #ccc);
        text-align: left;
      }
    `,
  ],
})
export class SelectionStateDemoPageComponent {
  readonly demo = ANGULAR_SELECTION_STATE_DEMO;

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

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      selected: [...this.selection.selected()],
      count: this.selection.count(),
      isEmpty: this.selection.isEmpty(),
      canAct: this.selection.canAct(),
      allSelected: this.allSelected(),
      first: this.selection.first(),
    }),
  );

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
