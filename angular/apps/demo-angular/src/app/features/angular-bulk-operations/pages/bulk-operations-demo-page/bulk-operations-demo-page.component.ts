import { Component, computed, signal } from '@angular/core';
import { injectSelectionState } from '@hexguard/angular-selection-state';
import {
  provideBulkOperation,
  injectBulkOperation,
  selectedItemsToBulkRequest,
} from '@hexguard/angular-bulk-operations';
import {
  getMockOrders,
  mockBulkDelete,
  mockBulkApprove,
  type OrderItem,
} from '../../data/bulk-operations-demo.data';

const DELETE_OP = provideBulkOperation<OrderItem, void>({ executeFn: mockBulkDelete });
const APPROVE_OP = provideBulkOperation<OrderItem, void>({ executeFn: mockBulkApprove });

@Component({
  selector: 'app-bulk-operations-demo-page',
  standalone: true,
  providers: [DELETE_OP.providers, APPROVE_OP.providers],
  template: `
    <h1>Bulk Operations Demo</h1>

    <div class="toolbar">
      <p data-testid="selection-count">Selected: {{ selection.count() }} item(s)</p>
      <div class="actions">
        <button
          [disabled]="!selection.canAct() || deleteOp.inProgress()"
          (click)="runDelete()"
          data-testid="bulk-delete-btn"
        >
          @if (deleteOp.inProgress()) {
            Deleting...
          } @else {
            Delete Selected
          }
        </button>
        <button
          [disabled]="!selection.canAct() || approveOp.inProgress()"
          (click)="runApprove()"
          data-testid="bulk-approve-btn"
        >
          @if (approveOp.inProgress()) {
            Approving...
          } @else {
            Approve Selected
          }
        </button>
        <button (click)="clearAll()" data-testid="clear-btn">Clear</button>
      </div>
    </div>

    <!-- Data table -->
    <table data-testid="orders-table">
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
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        @for (item of items(); track item.id) {
          <tr data-testid="order-row">
            <td>
              <input
                type="checkbox"
                [checked]="selection.selected().has(item.id)"
                (change)="selection.toggle(item.id)"
                [attr.data-testid]="'checkbox-' + item.id"
              />
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.status }}</td>
          </tr>
        }
      </tbody>
    </table>

    <!-- Results summary -->
    @if (deleteOp.summary() || approveOp.summary()) {
      <div class="results" data-testid="results-panel">
        <h3>Last Operation Results</h3>

        @if (deleteOp.summary(); as summary) {
          <div>
            <p>Delete: {{ summary.succeeded }} succeeded, {{ summary.failed }} failed</p>
            <ul>
              @for (r of deleteOp.results(); track r.item.id) {
                <li [attr.data-testid]="'result-' + r.item.id">
                  {{ r.item.id }}: {{ r.succeeded ? '✓' : '✗' }}
                  @if (r.error) {
                    <span class="error">({{ r.error.code }}: {{ r.error.message }})</span>
                  }
                </li>
              }
            </ul>
            @if (summary.failed > 0) {
              <button (click)="retryDelete()" data-testid="retry-delete-btn">Retry Failed</button>
            }
          </div>
        }

        @if (approveOp.summary(); as summary) {
          <div>
            <p>Approve: {{ summary.succeeded }} succeeded, {{ summary.failed }} failed</p>
            <ul>
              @for (r of approveOp.results(); track r.item.id) {
                <li [attr.data-testid]="'approve-result-' + r.item.id">
                  {{ r.item.id }}: {{ r.succeeded ? '✓' : '✗' }}
                  @if (r.error) {
                    <span class="error">({{ r.error.code }}: {{ r.error.message }})</span>
                  }
                </li>
              }
            </ul>
            @if (summary.failed > 0) {
              <button (click)="retryApprove()" data-testid="retry-approve-btn">Retry Failed</button>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [
    `
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
      }
      th,
      td {
        padding: 0.5rem;
        border: 1px solid #ccc;
        text-align: left;
      }
      .toolbar {
        margin-bottom: 0.5rem;
      }
      .actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }
      .results {
        margin-top: 1rem;
        padding: 1rem;
        background: #f9f9f9;
        border-radius: 0.5rem;
      }
      .error {
        color: #c00;
        font-size: 0.9em;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `,
  ],
})
export class BulkOperationsDemoPageComponent {
  readonly items = signal(getMockOrders());
  readonly visibleKeys = computed(() => this.items().map((item: OrderItem) => item.id));
  readonly itemsMap = computed<Record<string, OrderItem>>(() => {
    const map: Record<string, OrderItem> = {};
    for (const item of this.items()) {
      map[item.id] = item;
    }
    return map;
  });

  readonly selection = injectSelectionState<string>();

  readonly allSelected = computed(() => this.selection.isAllSelected()(this.visibleKeys()));

  readonly deleteOp = injectBulkOperation(DELETE_OP.token);
  readonly approveOp = injectBulkOperation(APPROVE_OP.token);

  clearAll(): void {
    this.selection.clear();
    this.deleteOp.clearResults();
    this.approveOp.clearResults();
  }

  async runDelete(): Promise<void> {
    const request = selectedItemsToBulkRequest(this.selection.selected, this.itemsMap());
    await this.deleteOp.execute(request);
  }

  async runApprove(): Promise<void> {
    const request = selectedItemsToBulkRequest(this.selection.selected, this.itemsMap());
    await this.approveOp.execute(request);
  }

  async retryDelete(): Promise<void> {
    await this.deleteOp.retryFailed((failed) => ({
      items: failed.map((r) => r.item),
    }));
  }

  async retryApprove(): Promise<void> {
    await this.approveOp.retryFailed((failed) => ({
      items: failed.map((r) => r.item),
    }));
  }
}
