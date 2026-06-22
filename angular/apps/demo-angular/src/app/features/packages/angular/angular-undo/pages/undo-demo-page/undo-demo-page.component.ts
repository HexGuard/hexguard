import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectUndoStack } from '@hexguard/angular-undo';

import { ANGULAR_UNDO_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-undo-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="undo-demo-page">
      <demo-navigation-strip
        demoNavigation
        testId="undo-demo-navigation"
        [demo]="demo"
      />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Undo</p>
            <h2>Timer-based undo stack for reversible actions.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectUndoStack()</code> manages reversible action flows with configurable
          undo windows, TTL expiry, group undo, and commit-or-revert behavior.
        </p>

        <demo-status-strip
          testId="undo-demo-status"
          summary="Timer-based undo stack with TTL windows and group undo."
          currentUrl="Angular Undo — Demo"
          summaryTestId="undo-demo-summary"
          urlTestId="undo-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-undo/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="undo-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Undo Stack</p>
            <h3>Live undo demo</h3>
          </div>
        </div>

        <div class="undo-section">
          <h4 class="undo-section__title">Actions</h4>
          <div class="undo-actions">
            <button
              type="button"
              class="demo-button"
              (click)="deleteItem('item-1')"
              data-testid="undo-delete-1"
            >
              Delete Item 1
            </button>
            <button
              type="button"
              class="demo-button"
              (click)="deleteItem('item-2')"
              data-testid="undo-delete-2"
            >
              Delete Item 2
            </button>
            <button
              type="button"
              class="demo-button demo-button--ghost"
              (click)="archiveItem('report-q4')"
              data-testid="undo-archive"
            >
              Archive Report
            </button>
          </div>
        </div>

        <div class="undo-section">
          <h4 class="undo-section__title">Pending Undos</h4>
          @if (undo.hasPending()) {
            <div class="undo-pending-list">
              @for (action of undo.pendingUndos(); track action.id) {
                <div class="undo-pending-item" data-testid="undo-pending-item">
                  <span class="undo-pending-item__label">{{ action.type }}: {{ action.data.label }}</span>
                  <div class="undo-pending-item__actions">
                    <button
                      type="button"
                      class="demo-button demo-button--small"
                      (click)="undo.undo(action.id)"
                      [attr.data-testid]="'undo-btn-' + action.id"
                    >
                      Undo
                    </button>
                    <button
                      type="button"
                      class="demo-button demo-button--small demo-button--ghost"
                      (click)="undo.commit(action.id)"
                      [attr.data-testid]="'commit-btn-' + action.id"
                    >
                      Commit
                    </button>
                  </div>
                </div>
              }
            </div>
          } @else {
            <p class="undo-empty" data-testid="undo-empty">No pending undos. Try deleting an item above.</p>
          }
          @if (undo.hasPending()) {
            <div class="undo-actions">
              <button
                type="button"
                class="demo-button demo-button--danger"
                (click)="undo.clear()"
                data-testid="undo-clear-all"
              >
                Clear All
              </button>
            </div>
          }
        </div>

        <div class="undo-section">
          <h4 class="undo-section__title">Activity Log</h4>
          <div class="undo-log">
            @for (entry of log(); track entry) {
              <div class="undo-log__entry" [style.color]="entry.color">{{ entry.text }}</div>
            }
          </div>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="undo-inspector-panel"
        eyebrow="Reference"
        title="Undo Stack snapshot"
        summary="Live undo stack state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="undo-snapshot-json"
        codeTestId="undo-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .undo-section {
        margin-bottom: 1.25rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border);
      }
      .undo-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .undo-section__title {
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--color-text-strong);
      }
      .undo-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .undo-pending-list {
        display: grid;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }
      .undo-pending-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 0.8rem;
        border-radius: 0.75rem;
        border: 1px solid var(--color-border);
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .undo-pending-item__label {
        font-weight: 500;
        font-size: 0.9rem;
      }
      .undo-pending-item__actions {
        display: flex;
        gap: 0.4rem;
      }
      .undo-empty {
        color: var(--color-text-weak);
        font-style: italic;
        font-size: 0.9rem;
      }
      .undo-log {
        display: grid;
        gap: 0.25rem;
        font-size: 0.85rem;
        font-family: monospace;
        max-height: 10rem;
        overflow-y: auto;
      }
      .undo-log__entry {
        padding: 0.15rem 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UndoDemoPageComponent {
  protected readonly demo = ANGULAR_UNDO_DEMO;
  protected readonly undo = injectUndoStack<{ id: string; label: string }>({
    defaultTtlMs: 8000,
    onCommit: (action) => this.logAction(`Committed: ${action.type} ${action.data.label}`),
  });

  private readonly logEntries = signal<{ text: string; color: string }[]>([]);

  protected readonly log = computed(() => this.logEntries());

  protected deleteItem(id: string): void {
    const label = id;
    this.logAction(`Deleted: ${label} (undo window open)`);

    this.undo.push({
      id: `delete-${id}-${Date.now()}`,
      type: 'delete',
      data: { id, label },
      onUndo: () => this.logAction(`Undone: delete ${label}`, 'green'),
    });
  }

  protected archiveItem(id: string): void {
    const label = id;
    this.logAction(`Archived: ${label} (undo window open)`);

    this.undo.push({
      id: `archive-${id}-${Date.now()}`,
      type: 'archive',
      data: { id, label },
      onUndo: () => this.logAction(`Undone: archive ${label}`, 'green'),
    });
  }

  protected logAction(text: string, color = 'var(--color-text-strong)'): void {
    this.logEntries.update((prev) => [...prev, { text, color }]);
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      hasPending: this.undo.hasPending(),
      pendingCount: this.undo.pendingUndos().length,
      pendingTypes: this.undo.pendingUndos().map((a) => a.type),
      pendingIds: this.undo.pendingUndos().map((a) => a.id),
    }),
  );
}
