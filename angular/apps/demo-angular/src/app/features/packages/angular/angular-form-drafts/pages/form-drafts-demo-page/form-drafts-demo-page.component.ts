import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectFormDraft } from '@hexguard/angular-form-drafts';
import { ANGULAR_FORM_DRAFTS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-form-drafts-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    DatePipe,
  ],
  template: `
    <demo-page-layout testId="form-drafts-demo-page">
      <demo-navigation-strip demoNavigation testId="form-drafts-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Form Drafts</p>
            <h2>Debounced localStorage draft persistence.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectFormDraft()</code> auto-saves form data to localStorage with debounce,
          configurable TTL, and signal-based draft status.
        </p>
        <demo-status-strip
          testId="form-drafts-demo-status"
          summary="localStorage-backed form draft with debounced auto-save and expiry."
          currentUrl="Angular Form Drafts — Demo"
          summaryTestId="form-drafts-demo-summary"
          urlTestId="form-drafts-demo-url"
        />
      </article>

      <article demoPrimary class="demo-card demo-card--stack" data-testid="form-drafts-playground">
        <div class="fd-toolbar">
          <h3>
            Draft status:
            @if (draft.hasDraft()) {
              <span class="fd-badge fd-badge--saved" data-testid="fd-status-saved"
                >Draft saved</span
              >
            } @else {
              <span class="fd-badge" data-testid="fd-status-none">No draft</span>
            }
          </h3>
          <button (click)="draft.clear()" [disabled]="!draft.hasDraft()" data-testid="fd-clear-btn">
            Clear draft
          </button>
          <button
            (click)="restoreDraft()"
            [disabled]="!draft.hasDraft()"
            data-testid="fd-restore-btn"
          >
            Restore draft
          </button>
        </div>

        <div class="fd-form">
          <label class="fd-field">
            <span>Title</span>
            <input
              [value]="title()"
              (input)="onFieldChange('title', $any($event.target).value)"
              data-testid="fd-title-input"
            />
          </label>
          <label class="fd-field">
            <span>Content</span>
            <textarea
              [value]="content()"
              (input)="onFieldChange('content', $any($event.target).value)"
              data-testid="fd-content-input"
              rows="4"
            ></textarea>
          </label>
          <label class="fd-field">
            <span>Category</span>
            <select
              [value]="category()"
              (change)="onFieldChange('category', $any($event.target).value)"
              data-testid="fd-category-select"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
          </label>
        </div>

        @if (restoredData(); as data) {
          <div class="fd-restored" data-testid="fd-restored-notice">
            <p>
              <strong>Draft restored:</strong> {{ data.title }} — {{ data.content?.slice(0, 50)
              }}{{ (data.content?.length ?? 0) > 50 ? '…' : '' }}
            </p>
          </div>
        }

        @if (draft.metadata(); as meta) {
          <div class="fd-meta" data-testid="fd-meta">
            <span>Saved: {{ meta.savedAt | date: 'medium' }}</span>
            <span>Expires: {{ meta.expiresAt | date: 'medium' }}</span>
          </div>
        }
      </article>

      <demo-inspector-panel
        demoAside
        panelTestId="form-drafts-inspector-panel"
        eyebrow="Reference"
        title="Form Drafts snapshot"
        summary="Live draft state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="form-drafts-snapshot-json"
        codeTestId="form-drafts-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .fd-toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .fd-toolbar h3 {
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .fd-toolbar button {
        padding: 0.4rem 0.8rem;
        border: 1px solid var(--color-border);
        border-radius: 0.35rem;
        background: var(--color-surface);
        cursor: pointer;
        font-size: 0.85rem;
      }
      .fd-toolbar button:hover {
        background: var(--color-surface-alt);
      }
      .fd-toolbar button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .fd-badge {
        padding: 0.2rem 0.5rem;
        border-radius: 0.4rem;
        font-size: 0.75rem;
        font-weight: 600;
        background: var(--color-surface-alt);
        color: var(--color-text-weak);
      }
      .fd-badge--saved {
        background: #5cb85c;
        color: #fff;
      }
      .fd-form {
        display: grid;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .fd-field {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-size: 0.85rem;
      }
      .fd-field span {
        font-weight: 600;
      }
      .fd-field input,
      .fd-field textarea,
      .fd-field select {
        padding: 0.4rem 0.6rem;
        border: 1px solid var(--color-border);
        border-radius: 0.35rem;
        font-size: 0.85rem;
        font-family: inherit;
      }
      .fd-restored {
        padding: 0.75rem;
        border-radius: 0.5rem;
        background: #dff0d8;
        color: #3c763d;
        margin-bottom: 0.75rem;
        font-size: 0.85rem;
      }
      .fd-meta {
        font-size: 0.75rem;
        color: var(--color-text-weak);
        display: flex;
        gap: 1rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormDraftsDemoPageComponent {
  protected readonly demo = ANGULAR_FORM_DRAFTS_DEMO;

  protected readonly title = signal('');
  protected readonly content = signal('');
  protected readonly category = signal('work');
  protected readonly restoredData = signal<{
    title: string;
    content: string;
    category: string;
  } | null>(null);

  protected readonly draft = injectFormDraft<{ title: string; content: string; category: string }>(
    'demo-form',
    {
      debounceMs: 500,
    },
  );

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      hasDraft: this.draft.hasDraft(),
      metadata: this.draft.metadata(),
      currentForm: { title: this.title(), content: this.content(), category: this.category() },
      restoredData: this.restoredData(),
    }),
  );

  onFieldChange(field: 'title' | 'content' | 'category', value: string): void {
    if (field === 'title') this.title.set(value);
    else if (field === 'content') this.content.set(value);
    else if (field === 'category') this.category.set(value);

    this.restoredData.set(null);
    this.draft.save({ title: this.title(), content: this.content(), category: this.category() });
  }

  restoreDraft(): void {
    const saved = this.draft.restore();
    if (saved) {
      this.title.set(saved.data.title);
      this.content.set(saved.data.content);
      this.category.set(saved.data.category);
      this.restoredData.set(saved.data);
    }
  }
}
