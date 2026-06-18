import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  provideBulkOperation,
  injectBulkOperation,
} from '@hexguard/angular-bulk-operations';
import type {
  BulkOperationRequest,
  BulkOperationResponse,
} from '@hexguard/angular-bulk-operations';

import { ANGULAR_BULK_OPERATIONS_API_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';

const API_BASE = 'http://127.0.0.1:5074';

interface ApiOrder {
  readonly id: string;
  readonly name: string;
  readonly status: string;
}

interface StatusUpdatePayload {
  readonly newStatus: string;
}

const API_ORDERS: ApiOrder[] = [
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
  request: BulkOperationRequest<ApiOrder>,
): Promise<BulkOperationResponse<ApiOrder>> {
  const response = await fetch(`${API_BASE}/api/bulk-operations/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: request.items }),
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return response.json() as Promise<BulkOperationResponse<ApiOrder>>;
}

async function apiApprove(
  request: BulkOperationRequest<ApiOrder>,
): Promise<BulkOperationResponse<ApiOrder>> {
  const response = await fetch(`${API_BASE}/api/bulk-operations/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: request.items }),
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return response.json() as Promise<BulkOperationResponse<ApiOrder>>;
}

async function apiUpdateStatus(
  request: BulkOperationRequest<ApiOrder, StatusUpdatePayload>,
): Promise<BulkOperationResponse<ApiOrder, string>> {
  const response = await fetch(`${API_BASE}/api/bulk-operations/update-status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: request.items, sharedPayload: request.sharedPayload }),
  });
  if (!response.ok) throw new Error(`API returned ${response.status}`);
  return response.json() as Promise<BulkOperationResponse<ApiOrder, string>>;
}

const DELETE_OP = provideBulkOperation<ApiOrder, void>({ executeFn: apiDelete });
const APPROVE_OP = provideBulkOperation<ApiOrder, void>({ executeFn: apiApprove });
const UPDATE_OP = provideBulkOperation<ApiOrder, string, StatusUpdatePayload>({
  executeFn: apiUpdateStatus,
});

@Component({
  standalone: true,
  selector: 'demo-bulk-operations-api-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  providers: [DELETE_OP.providers, APPROVE_OP.providers, UPDATE_OP.providers],
  templateUrl: './bulk-operations-api-demo-page.component.html',
  styleUrl: './bulk-operations-api-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkOperationsApiDemoPageComponent {
  readonly demo = ANGULAR_BULK_OPERATIONS_API_DEMO;
  readonly orders = API_ORDERS;
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly lastAction = signal('');
  readonly lastResponse = signal<BulkOperationResponse<ApiOrder, unknown> | null>(null);
  readonly apiError = signal<string | null>(null);

  readonly deleteOp = injectBulkOperation(DELETE_OP.token);
  readonly approveOp = injectBulkOperation(APPROVE_OP.token);
  readonly updateOp = injectBulkOperation(UPDATE_OP.token);

  readonly isBusy = computed(
    () =>
      this.deleteOp.inProgress() ||
      this.approveOp.inProgress() ||
      this.updateOp.inProgress(),
  );

  readonly apiStatus = computed(() => {
    if (this.apiError()) return 'Error';
    if (this.lastResponse()) return 'Connected';
    return 'Ready';
  });

  readonly statusSummary = computed(() => {
    if (this.isBusy()) return 'Sending request to the .NET SampleApi...';
    if (this.apiError()) return `Last call failed: ${this.apiError()}`;
    if (this.lastAction() && this.lastResponse()) {
      return `${this.lastAction()} completed. ${this.lastResponse()!.successCount}/${this.lastResponse()!.totalCount} succeeded.`;
    }
    return 'Choose an action to call the live API via the Angular library.';
  });

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      lastAction: this.lastAction(),
      apiError: this.apiError(),
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
      update: {
        inProgress: this.updateOp.inProgress(),
        summary: this.updateOp.summary(),
        results: this.updateOp.results(),
      },
    }),
  );

  readonly responseJson = computed(() => {
    const r = this.lastResponse();
    return r ? formatSnapshot(r) : '';
  });

  clearAll(): void {
    this.lastAction.set('');
    this.lastResponse.set(null);
    this.apiError.set(null);
    this.deleteOp.clearResults();
    this.approveOp.clearResults();
    this.updateOp.clearResults();
  }

  private async doAction(
    label: string,
    action: () => Promise<BulkOperationResponse<ApiOrder, unknown>>,
  ): Promise<void> {
    this.apiError.set(null);
    this.lastAction.set(label);
    try {
      const response = await action();
      this.lastResponse.set(response);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.apiError.set(message);
      this.lastResponse.set(null);
    }
  }

  async runDelete(): Promise<void> {
    await this.doAction('delete', () =>
      this.deleteOp.execute({ items: this.orders }),
    );
  }

  async runApprove(): Promise<void> {
    await this.doAction('approve', () =>
      this.approveOp.execute({ items: this.orders }),
    );
  }

  async runUpdateStatus(): Promise<void> {
    await this.doAction('update-status', () =>
      this.updateOp.execute({
        items: this.orders,
        sharedPayload: { newStatus: 'shipped' },
      }),
    );
  }
}
