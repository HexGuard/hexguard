import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { defer, map, timer } from 'rxjs';

import { HexguardAsyncActionOutletComponent, asyncAction } from '@hexguard/angular-async-state';

import { ANGULAR_ASYNC_STATE_ACTION_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  ASYNC_ACTION_ORDER_OPTIONS,
  formatAsyncActionCurrency,
} from '../../data/async-state-demo.data';

type ActionOutcome = 'success' | 'error';
type DuplicateSummary = 'none' | 'reused' | 'distinct';

interface ApprovalResult {
  readonly orderId: string;
  readonly message: string;
}

interface ApprovalPayload {
  readonly orderId: string;
}

function mapDemoError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown async-action demo error.';
}

@Component({
  standalone: true,
  selector: 'demo-async-state-action-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    HexguardAsyncActionOutletComponent,
  ],
  templateUrl: './async-state-action-demo-page.component.html',
  styleUrl: './async-state-action-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncStateActionDemoPageComponent {
  readonly demo = ANGULAR_ASYNC_STATE_ACTION_DEMO;
  readonly orderOptions = ASYNC_ACTION_ORDER_OPTIONS;
  readonly currency = formatAsyncActionCurrency;

  // demo-snippet:start async-state-action-demo
  readonly selectedOrderId = signal(this.orderOptions[0]?.id ?? '');
  private readonly nextOutcome = signal<ActionOutcome>('success');
  readonly backendCallCount = signal(0);
  readonly duplicateSummary = signal<DuplicateSummary>('none');
  readonly selectedOrder = computed(
    () =>
      this.orderOptions.find((order) => order.id === this.selectedOrderId()) ??
      this.orderOptions[0],
  );
  readonly approval = asyncAction<ApprovalPayload, ApprovalResult, string>({
    run: ({ orderId }) =>
      defer(() => {
        this.backendCallCount.update((count) => count + 1);
        const order = this.selectedOrder();
        const outcome = this.nextOutcome();

        return timer(450).pipe(
          map(() => {
            if (outcome === 'error') {
              throw new Error(`Approval service rejected ${orderId} and kept the queue unchanged.`);
            }

            return {
              orderId,
              message: `${orderId} for ${order.customer} was approved and queued for downstream sync.`,
            };
          }),
        );
      }),
    mapError: mapDemoError,
  });
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly statusSummary = computed(() => {
    if (this.approval.isIdle()) {
      return 'Idle. Trigger an approval to see pending, success, failure, and duplicate-run reuse.';
    }

    if (this.approval.isPending()) {
      return `Submitting approval for ${this.selectedOrder().id}.`;
    }

    if (this.approval.hasFailed()) {
      return this.approval.error() ?? 'The last approval attempt failed.';
    }

    return this.approval.lastResult()?.message ?? 'The last approval completed successfully.';
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.approval.status(),
      error: this.approval.error(),
      lastResult: this.approval.lastResult(),
      backendCallCount: this.backendCallCount(),
      duplicateSummary: this.duplicateSummary(),
      selectedOrderId: this.selectedOrderId(),
    }),
  );
  // demo-snippet:end async-state-action-demo

  readonly duplicateSummaryText = computed(() => {
    switch (this.duplicateSummary()) {
      case 'reused':
        return 'Reused the same in-flight promise.';
      case 'distinct':
        return 'Started a second in-flight promise.';
      default:
        return 'No duplicate run has been attempted yet.';
    }
  });

  runSuccess(): void {
    this.startAction('success');
  }

  runFailure(): void {
    this.startAction('error');
  }

  runDoubleSubmit(): void {
    this.nextOutcome.set('success');
    this.duplicateSummary.set('none');
    const payload = { orderId: this.selectedOrderId() };
    const firstRun = this.approval.run(payload);
    const secondRun = this.approval.run(payload);

    this.duplicateSummary.set(firstRun === secondRun ? 'reused' : 'distinct');

    void firstRun.catch(() => undefined);
    void secondRun.catch(() => undefined);
  }

  updateSelectedOrder(id: string): void {
    this.selectedOrderId.set(id);
  }

  resetAction(): void {
    this.nextOutcome.set('success');
    this.backendCallCount.set(0);
    this.duplicateSummary.set('none');
    this.approval.reset();
  }

  private startAction(outcome: ActionOutcome): void {
    this.nextOutcome.set(outcome);
    this.duplicateSummary.set('none');

    const promise = this.approval.run({ orderId: this.selectedOrderId() });

    void promise.catch(() => undefined);
  }
}
