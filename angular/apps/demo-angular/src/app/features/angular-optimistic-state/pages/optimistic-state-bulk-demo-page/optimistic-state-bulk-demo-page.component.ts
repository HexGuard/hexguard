import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { optimisticState } from '@hexguard/angular-optimistic-state';

import { ANGULAR_OPTIMISTIC_STATE_BULK_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  createBulkPublishRows,
  type BulkPublishRow,
  type BulkPublishStatus,
} from '../../data/optimistic-state-demo.data';

type MutationOutcome = 'error' | 'success';

interface BulkMutationInput {
  readonly ids: readonly string[];
  readonly status: BulkPublishStatus;
}

interface BulkMutationResult {
  readonly ids: readonly string[];
  readonly status: BulkPublishStatus;
  readonly note: string;
}

const INITIAL_BULK_ROWS = createBulkPublishRows();
const DEFAULT_REPLACE_SUMMARY = 'No replacement bulk run has been attempted yet.';

function mapDemoError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown optimistic bulk action error.';
}

@Component({
  standalone: true,
  selector: 'demo-optimistic-state-bulk-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  templateUrl: './optimistic-state-bulk-demo-page.component.html',
  styleUrl: './optimistic-state-bulk-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimisticStateBulkDemoPageComponent {
  readonly demo = ANGULAR_OPTIMISTIC_STATE_BULK_DEMO;

  readonly selectedIds = signal<readonly string[]>(['campaign-201', 'campaign-219']);
  private readonly nextOutcome = signal<MutationOutcome>('success');
  readonly replaceSummary = signal(DEFAULT_REPLACE_SUMMARY);

  // demo-snippet:start optimistic-state-bulk-demo
  readonly bulkChanges = optimisticState<
    readonly BulkPublishRow[],
    BulkMutationInput,
    BulkMutationResult,
    string,
    'bulk-publish'
  >({
    initialValue: INITIAL_BULK_ROWS,
    conflictPolicy: 'replace',
    getTarget: () => 'bulk-publish',
    apply: (rows, input) =>
      rows.map((row) =>
        input.ids.includes(row.id) ? { ...row, status: input.status, pending: true } : row,
      ),
    reconcile: (rows, result) =>
      rows.map((row) =>
        result.ids.includes(row.id) ? { ...row, status: result.status, pending: false } : row,
      ),
    run: (input) => this.simulateBulkChange(input),
    mapError: mapDemoError,
  });
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly selectedCount = computed(() => this.selectedIds().length);
  readonly publishedCount = computed(
    () => this.bulkChanges.value().filter((row) => row.status === 'published').length,
  );
  readonly statusSummary = computed(() => {
    if (this.bulkChanges.isPending()) {
      return `Applying an optimistic bulk change across ${this.selectedCount()} selected rows.`;
    }

    if (this.bulkChanges.isError()) {
      return this.bulkChanges.error() ?? 'The last bulk optimistic change failed.';
    }

    return (
      this.bulkChanges.lastResult()?.note ??
      'This route fixes the conflict policy to replace so the latest bulk intent wins visually.'
    );
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.bulkChanges.status(),
      conflictPolicy: this.bulkChanges.conflictPolicy(),
      error: this.bulkChanges.error(),
      lastResult: this.bulkChanges.lastResult(),
      pendingCount: this.bulkChanges.pendingCount(),
      queuedCount: this.bulkChanges.queuedCount(),
      replaceSummary: this.replaceSummary(),
      selectedIds: this.selectedIds(),
      entries: this.bulkChanges.entries(),
      settledValue: this.bulkChanges.settledValue(),
      value: this.bulkChanges.value(),
    }),
  );
  // demo-snippet:end optimistic-state-bulk-demo

  toggleSelection(id: string, checked: boolean): void {
    this.selectedIds.update((currentIds) => {
      if (checked) {
        return currentIds.includes(id) ? currentIds : [...currentIds, id];
      }

      return currentIds.filter((currentId) => currentId !== id);
    });
  }

  publishSelected(): void {
    this.runSelectedBulkChange('published', 'success');
  }

  revertSelected(): void {
    this.runSelectedBulkChange('draft', 'success');
  }

  failSelected(): void {
    const nextStatus = this.bulkChanges.value().some((row) => this.selectedIds().includes(row.id))
      ? 'published'
      : 'draft';

    this.runSelectedBulkChange(nextStatus, 'error');
  }

  runReplacementSequence(): void {
    if (!this.selectedIds().length) {
      return;
    }

    this.nextOutcome.set('success');
    this.replaceSummary.set(
      'Second bulk mutation replaced the active optimistic overlay immediately and the stale completion will be ignored.',
    );

    const firstRun = this.bulkChanges.run({
      ids: this.selectedIds(),
      status: 'published',
    });
    const secondRun = this.bulkChanges.run({
      ids: this.selectedIds(),
      status: 'draft',
    });

    void firstRun.catch(() => undefined);
    void secondRun.catch(() => undefined);
  }

  resetDemo(): void {
    this.bulkChanges.reset(createBulkPublishRows());
    this.selectedIds.set(['campaign-201', 'campaign-219']);
    this.nextOutcome.set('success');
    this.replaceSummary.set(DEFAULT_REPLACE_SUMMARY);
  }

  private runSelectedBulkChange(status: BulkPublishStatus, outcome: MutationOutcome): void {
    if (!this.selectedIds().length) {
      return;
    }

    this.nextOutcome.set(outcome);

    const promise = this.bulkChanges.run({
      ids: this.selectedIds(),
      status,
    });

    void promise.catch(() => undefined);
  }

  private simulateBulkChange(input: BulkMutationInput): Promise<BulkMutationResult> {
    return new Promise<BulkMutationResult>((resolve, reject) => {
      setTimeout(() => {
        if (this.nextOutcome() === 'error') {
          reject(
            new Error(
              `Publishing ${input.ids.length} selected rows failed and the optimistic bulk overlay rolled back.`,
            ),
          );

          return;
        }

        resolve({
          ids: input.ids,
          status: input.status,
          note: `${input.status === 'published' ? 'Published' : 'Returned'} ${input.ids.length} rows on the committed server copy.`,
        });
      }, 560);
    });
  }
}
