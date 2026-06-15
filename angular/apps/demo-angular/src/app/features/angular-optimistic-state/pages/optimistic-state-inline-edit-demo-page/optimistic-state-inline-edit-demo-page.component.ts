import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { optimisticState } from '@hexguard/angular-optimistic-state';

import { ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  createInlineEditDraftRows,
  type InlineEditDraftRow,
} from '../../data/optimistic-state-demo.data';

type MutationOutcome = 'error' | 'success';

interface InlineEditInput {
  readonly id: string;
  readonly title: string;
}

interface InlineEditResult {
  readonly id: string;
  readonly canonicalTitle: string;
  readonly auditNote: string;
}

const INITIAL_DRAFT_ROWS = createInlineEditDraftRows();
const DEFAULT_QUEUE_SUMMARY = 'No queued follow-up save has been attempted yet.';

function mapDemoError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown optimistic inline-edit error.';
}

function normalizeTitle(title: string): string {
  return title
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

@Component({
  standalone: true,
  selector: 'demo-optimistic-state-inline-edit-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
  ],
  templateUrl: './optimistic-state-inline-edit-demo-page.component.html',
  styleUrl: './optimistic-state-inline-edit-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimisticStateInlineEditDemoPageComponent {
  readonly demo = ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO;

  readonly selectedRowId = signal(INITIAL_DRAFT_ROWS[0]?.id ?? '');
  readonly draftTitle = signal(INITIAL_DRAFT_ROWS[0]?.title ?? '');
  private readonly nextOutcome = signal<MutationOutcome>('success');
  readonly queueSummary = signal(DEFAULT_QUEUE_SUMMARY);

  // demo-snippet:start optimistic-state-inline-edit-demo
  readonly draftEdits = optimisticState<
    readonly InlineEditDraftRow[],
    InlineEditInput,
    InlineEditResult,
    string
  >({
    initialValue: INITIAL_DRAFT_ROWS,
    conflictPolicy: 'queue',
    getTarget: (input) => input.id,
    apply: (rows, input) =>
      rows.map((row) =>
        row.id === input.id ? { ...row, title: input.title, pending: true } : row,
      ),
    reconcile: (rows, result) =>
      rows.map((row) =>
        row.id === result.id ? { ...row, title: result.canonicalTitle, pending: false } : row,
      ),
    run: (input) => this.simulateInlineEdit(input),
    mapError: mapDemoError,
  });
  readonly selectedRow = computed(
    () =>
      this.draftEdits.value().find((row) => row.id === this.selectedRowId()) ??
      this.draftEdits.value()[0],
  );
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly statusSummary = computed(() => {
    if (this.draftEdits.isPending()) {
      return `Saving the draft title for ${this.selectedRow()?.owner ?? 'the selected row'}.`;
    }

    if (this.draftEdits.isError()) {
      return this.draftEdits.error() ?? 'The last optimistic edit failed.';
    }

    return (
      this.draftEdits.lastResult()?.auditNote ??
      'This demo fixes the conflict policy to queue so follow-up edits wait their turn.'
    );
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.draftEdits.status(),
      conflictPolicy: this.draftEdits.conflictPolicy(),
      error: this.draftEdits.error(),
      lastResult: this.draftEdits.lastResult(),
      pendingCount: this.draftEdits.pendingCount(),
      queuedCount: this.draftEdits.queuedCount(),
      queueSummary: this.queueSummary(),
      selectedRowId: this.selectedRowId(),
      draftTitle: this.draftTitle(),
      entries: this.draftEdits.entries(),
      settledValue: this.draftEdits.settledValue(),
      value: this.draftEdits.value(),
    }),
  );
  // demo-snippet:end optimistic-state-inline-edit-demo

  updateSelectedRow(id: string): void {
    this.selectedRowId.set(id);
    const selectedRow =
      this.draftEdits.value().find((row) => row.id === id) ?? this.draftEdits.value()[0];

    this.draftTitle.set(selectedRow?.title ?? '');
  }

  saveDraft(): void {
    this.runCurrentDraft('success');
  }

  failDraft(): void {
    this.runCurrentDraft('error');
  }

  queueFollowUpSave(): void {
    const selectedRow = this.selectedRow();

    if (!selectedRow) {
      return;
    }

    const firstTitle = this.draftTitle().trim() || selectedRow.title;
    const secondTitle = `${firstTitle} follow-up`;

    this.nextOutcome.set('success');
    this.queueSummary.set(
      'Second save queued behind the first and will reconcile to the server-canonical title next.',
    );
    this.draftTitle.set(secondTitle);

    const firstRun = this.draftEdits.run({
      id: selectedRow.id,
      title: firstTitle,
    });
    const secondRun = this.draftEdits.run({
      id: selectedRow.id,
      title: secondTitle,
    });

    void firstRun.catch(() => undefined);
    void secondRun.catch(() => undefined);
  }

  resetDemo(): void {
    const nextRows = createInlineEditDraftRows();

    this.draftEdits.reset(nextRows);
    this.selectedRowId.set(nextRows[0]?.id ?? '');
    this.draftTitle.set(nextRows[0]?.title ?? '');
    this.nextOutcome.set('success');
    this.queueSummary.set(DEFAULT_QUEUE_SUMMARY);
  }

  private runCurrentDraft(outcome: MutationOutcome): void {
    const selectedRow = this.selectedRow();

    if (!selectedRow) {
      return;
    }

    this.nextOutcome.set(outcome);

    const promise = this.draftEdits.run({
      id: selectedRow.id,
      title: this.draftTitle().trim() || selectedRow.title,
    });

    void promise.catch(() => undefined);
  }

  private simulateInlineEdit(input: InlineEditInput): Promise<InlineEditResult> {
    const row =
      this.draftEdits.value().find((candidate) => candidate.id === input.id) ??
      this.draftEdits.settledValue().find((candidate) => candidate.id === input.id);
    const owner = row?.owner ?? input.id;

    return new Promise<InlineEditResult>((resolve, reject) => {
      setTimeout(() => {
        if (this.nextOutcome() === 'error') {
          reject(
            new Error(
              `Saving ${owner}'s draft failed and the optimistic title rolled back to the committed value.`,
            ),
          );

          return;
        }

        const canonicalTitle = normalizeTitle(input.title);

        resolve({
          id: input.id,
          canonicalTitle,
          auditNote: `Server normalized the title to “${canonicalTitle}” and committed the draft.`,
        });
      }, 520);
    });
  }
}
