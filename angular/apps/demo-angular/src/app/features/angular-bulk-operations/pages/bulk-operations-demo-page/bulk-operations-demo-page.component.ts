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
  BulkOperationResult,
} from '@hexguard/angular-bulk-operations';

import {
  getMockOrders,
  mockBulkDelete,
  mockBulkApprove,
  type OrderItem,
} from '../../data/bulk-operations-demo.data';

import { ANGULAR_BULK_OPERATIONS_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';

const API_BASE = 'http://127.0.0.1:5074';

// Module-level flag toggled by the component for mock vs live API
let _useLiveApiRef = false;

async function apiBulkDelete(
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

async function apiBulkApprove(
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

async function executeDelete(
  request: BulkOperationRequest<OrderItem>,
): Promise<BulkOperationResponse<OrderItem>> {
  return _useLiveApiRef ? apiBulkDelete(request) : mockBulkDelete(request);
}

async function executeApprove(
  request: BulkOperationRequest<OrderItem>,
): Promise<BulkOperationResponse<OrderItem>> {
  return _useLiveApiRef ? apiBulkApprove(request) : mockBulkApprove(request);
}

const DELETE_OP = provideBulkOperation<OrderItem, void>({ executeFn: executeDelete });
const APPROVE_OP = provideBulkOperation<OrderItem, void>({ executeFn: executeApprove });

@Component({
  selector: 'app-bulk-operations-demo-page',
  standalone: true,
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  providers: [DELETE_OP.providers, APPROVE_OP.providers],
  templateUrl: './bulk-operations-demo-page.component.html',
  styleUrl: './bulk-operations-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkOperationsDemoPageComponent {
  readonly demo = ANGULAR_BULK_OPERATIONS_DEMO;
  readonly useLiveApi = signal(false);
  readonly items = signal(getMockOrders());
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

  readonly isLoading = computed(() => this.deleteOp.inProgress() || this.approveOp.inProgress());
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);

  readonly statusSummary = computed(() => {
    if (this.useLiveApi()) {
      if (this.deleteOp.summary() || this.approveOp.summary()) {
        return 'Live API results shown below. Switch to mock to test offline.';
      }
      return 'Waiting for action. Live API mode connects to the .NET SampleApi.';
    }
    if (this.deleteOp.summary() || this.approveOp.summary()) {
      return 'Mock results shown below. Toggle to live API when the .NET backend is running.';
    }
    return 'Select items and run an action. Toggle to live API for backend interaction.';
  });

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      useLiveApi: this.useLiveApi(),
      selectedCount: this.selection.count(),
      deleteInProgress: this.deleteOp.inProgress(),
      approveInProgress: this.approveOp.inProgress(),
      deleteSummary: this.deleteOp.summary(),
      approveSummary: this.approveOp.summary(),
      deleteResults: this.deleteOp.results(),
      approveResults: this.approveOp.results(),
    }),
  );

  clearAll(): void {
    this.selection.clear();
    this.deleteOp.clearResults();
    this.approveOp.clearResults();
  }

  toggleApi(): void {
    _useLiveApiRef = !_useLiveApiRef;
    this.useLiveApi.set(_useLiveApiRef);
    this.deleteOp.clearResults();
    this.approveOp.clearResults();
    this.selection.clear();
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

