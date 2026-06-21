import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectSelectionState } from '@hexguard/angular-selection-state';
import {
  provideBulkOperation,
  injectBulkOperation,
  selectedItemsToBulkRequest,
} from '@hexguard/angular-bulk-operations';
import type {
  BulkOperationRequest,
  BulkOperationResponse,
} from '@hexguard/angular-bulk-operations';

import { ANGULAR_BULK_OPERATIONS_LIBRARY_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../../../shared/formatting';

const API_BASE = 'http://127.0.0.1:5074';

interface OrderItem {
  readonly id: string;
  readonly name: string;
  readonly status: string;
}

const MOCK_ORDERS: OrderItem[] = [
  { id: 'ord-001', name: 'Widget A', status: 'pending' },
  { id: 'ord-002', name: 'Widget B', status: 'pending' },
  { id: 'ord-003', name: 'Widget C', status: 'shipped' },
  { id: 'ord-004', name: 'Widget D', status: 'pending' },
  { id: 'ord-005', name: 'Widget E', status: 'cancelled' },
  { id: 'ord-006', name: 'Widget F', status: 'pending' },
  { id: 'ord-007', name: 'Widget G', status: 'shipped' },
  { id: 'ord-008', name: 'Widget H', status: 'pending' },
];

async function apiDelete(
  request: BulkOperationRequest<OrderItem>,
): Promise<BulkOperationResponse<OrderItem>> {
  const response = await fetch(`${API_BASE}/api/bulk-operations/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: request.items }),
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return response.json() as Promise<BulkOperationResponse<OrderItem>>;
}

async function apiApprove(
  request: BulkOperationRequest<OrderItem>,
): Promise<BulkOperationResponse<OrderItem>> {
  const response = await fetch(`${API_BASE}/api/bulk-operations/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: request.items }),
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return response.json() as Promise<BulkOperationResponse<OrderItem>>;
}

const DELETE_OP = provideBulkOperation<OrderItem, void>({ executeFn: apiDelete });
const APPROVE_OP = provideBulkOperation<OrderItem, void>({ executeFn: apiApprove });

@Component({
  standalone: true,
  selector: 'demo-bulk-operations-library-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  providers: [DELETE_OP.providers, APPROVE_OP.providers],
  templateUrl: './bulk-operations-library-demo-page.component.html',
  styleUrl: './bulk-operations-library-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkOperationsLibraryDemoPageComponent {
  readonly demo = ANGULAR_BULK_OPERATIONS_LIBRARY_DEMO;
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);

  readonly items = signal(MOCK_ORDERS);
  readonly visibleKeys = computed(() => this.items().map((item) => item.id));
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

  readonly isBusy = computed(() => this.deleteOp.inProgress() || this.approveOp.inProgress());
  readonly apiError = signal<string | null>(null);

  readonly statusSummary = computed(() => {
    if (this.apiError()) return `API error: ${this.apiError()}`;
    if (this.isBusy()) return 'Sending request to the .NET SampleApi...';
    if (this.deleteOp.summary()) {
      const s = this.deleteOp.summary()!;
      return `Delete: ${s.succeeded} succeeded, ${s.failed} failed via POST /api/bulk-operations/delete`;
    }
    if (this.approveOp.summary()) {
      const s = this.approveOp.summary()!;
      return `Approve: ${s.succeeded} succeeded, ${s.failed} failed via POST /api/bulk-operations/approve`;
    }
    return 'Select orders and run a bulk action against the live .NET API.';
  });

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      selectedCount: this.selection.count(),
      delete: {
        inProgress: this.deleteOp.inProgress(),
        summary: this.deleteOp.summary(),
        results: this.deleteOp.results(),
      },
      approve: {
        inProgress: this.approveOp.inProgress(),
        summary: this.approveOp.summary(),
        results: this.approveOp.results(),
      },
      apiError: this.apiError(),
    }),
  );

  clearAll(): void {
    this.selection.clear();
    this.deleteOp.clearResults();
    this.approveOp.clearResults();
    this.apiError.set(null);
  }

  private async runWithErrorHandling(
    label: string,
    action: () => Promise<BulkOperationResponse<OrderItem>>,
  ): Promise<void> {
    this.apiError.set(null);
    try {
      await action();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.apiError.set(message);
    }
  }

  async runDelete(): Promise<void> {
    const request = selectedItemsToBulkRequest(this.selection.selected, this.itemsMap());
    await this.runWithErrorHandling('delete', () => this.deleteOp.execute(request));
  }

  async runApprove(): Promise<void> {
    const request = selectedItemsToBulkRequest(this.selection.selected, this.itemsMap());
    await this.runWithErrorHandling('approve', () => this.approveOp.execute(request));
  }

  async retryDelete(): Promise<void> {
    await this.deleteOp.retryFailed((failed) => ({ items: failed.map((r) => r.item) }));
  }

  async retryApprove(): Promise<void> {
    await this.approveOp.retryFailed((failed) => ({ items: failed.map((r) => r.item) }));
  }
}
