import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectFilePicker } from '@hexguard/angular-file-picker';
import { ANGULAR_FILE_PICKER_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-file-picker-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="file-picker-demo-page">
      <demo-navigation-strip demoNavigation testId="file-picker-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular File Picker</p>
            <h2>Headless file selection with signals.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectFilePicker()</code> provides programmatic file selection, drag-and-drop,
          type/size validation, and configurable content reading — all via signals.
        </p>
        <demo-status-strip
          testId="file-picker-demo-status"
          summary="Headless file picker with signals — open dialog, validate, read."
          currentUrl="Angular File Picker — Demo"
          summaryTestId="file-picker-demo-summary"
          urlTestId="file-picker-demo-url"
        />
      </article>

      <article demoPrimary class="demo-card demo-card--stack" data-testid="file-picker-playground">
        <div class="fp-toolbar">
          <button (click)="picker.open()" data-testid="fp-open-btn">Open file picker</button>
          <button
            (click)="picker.clear()"
            [disabled]="picker.files().length === 0"
            data-testid="fp-clear-btn"
          >
            Clear
          </button>
          <label class="fp-mode-label"
            >Read mode:
            <select
              [value]="picker.readMode()"
              (change)="picker.readMode.set($any($event.target).value)"
              data-testid="fp-mode-select"
            >
              <option value="text">Text</option>
              <option value="dataUrl">Data URL</option>
              <option value="none">Metadata only</option>
            </select>
          </label>
        </div>

        @if (picker.loading()) {
          <p data-testid="fp-loading">Reading files…</p>
        }

        @if (picker.error(); as err) {
          <div class="demo-banner demo-banner--error" data-testid="fp-error">{{ err }}</div>
        }

        @if (picker.files(); as files) {
          @if (files.length === 0) {
            <p class="fp-hint" data-testid="fp-hint">
              Click "Open file picker" to select files, or drag & drop files below.
            </p>
          } @else {
            <div class="fp-file-grid" data-testid="fp-file-grid">
              @for (f of files; track f.name) {
                <div class="fp-file-card" [attr.data-testid]="'fp-file-' + f.name">
                  <strong class="fp-filename">{{ f.name }}</strong>
                  <span class="fp-meta"
                    >{{ (f.size / 1024).toFixed(1) }} KB · {{ f.type || 'unknown' }}</span
                  >
                  @if (
                    f.content && typeof f.content === 'string' && f.content.startsWith('data:image')
                  ) {
                    <img [src]="f.content" alt="{{ f.name }}" class="fp-preview" />
                  } @else if (f.content && typeof f.content === 'string') {
                    <pre class="fp-text-preview"
                      >{{ f.content.slice(0, 500) }}{{ f.content.length > 500 ? '…' : '' }}</pre
                    >
                  }
                </div>
              }
            </div>
          }
        }

        <!-- Drag-drop zone -->
        <div
          class="fp-dropzone"
          (dragover)="$event.preventDefault()"
          (drop)="picker.acceptDrop($event); $event.preventDefault()"
          data-testid="fp-dropzone"
        >
          <p>Drag & drop files here</p>
        </div>
      </article>

      <demo-inspector-panel
        demoAside
        panelTestId="file-picker-inspector-panel"
        eyebrow="Reference"
        title="File Picker snapshot"
        summary="Live file picker state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="file-picker-snapshot-json"
        codeTestId="file-picker-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .fp-toolbar {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }
      .fp-toolbar button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--color-border);
        border-radius: 0.35rem;
        background: var(--color-surface);
        cursor: pointer;
        font-size: 0.85rem;
      }
      .fp-toolbar button:hover {
        background: var(--color-surface-alt);
      }
      .fp-toolbar button:disabled {
        opacity: 0.4;
        cursor: default;
      }
      .fp-mode-label {
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        margin-left: auto;
      }
      .fp-mode-label select {
        padding: 0.3rem 0.5rem;
        border-radius: 0.35rem;
        border: 1px solid var(--color-border);
      }
      .fp-hint {
        padding: 1rem;
        text-align: center;
        color: var(--color-text-weak);
      }
      .fp-file-grid {
        display: grid;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .fp-file-card {
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: 1px solid var(--color-border);
        background: var(--color-surface);
      }
      .fp-filename {
        display: block;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
      }
      .fp-meta {
        font-size: 0.8rem;
        color: var(--color-text-weak);
      }
      .fp-preview {
        max-width: 100%;
        max-height: 200px;
        margin-top: 0.5rem;
        border-radius: 0.35rem;
      }
      .fp-text-preview {
        font-size: 0.75rem;
        font-family: monospace;
        background: var(--color-surface-alt);
        padding: 0.5rem;
        border-radius: 0.35rem;
        margin-top: 0.5rem;
        max-height: 150px;
        overflow-y: auto;
        white-space: pre-wrap;
        word-break: break-all;
      }
      .fp-dropzone {
        margin-top: 0.5rem;
        padding: 2rem;
        border: 2px dashed var(--color-border);
        border-radius: 0.75rem;
        text-align: center;
        color: var(--color-text-weak);
        cursor: default;
        transition: border-color 200ms;
      }
      .fp-dropzone:hover {
        border-color: var(--color-accent);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePickerDemoPageComponent {
  protected readonly demo = ANGULAR_FILE_PICKER_DEMO;
  protected readonly picker = injectFilePicker({
    multiple: true,
  });

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      files: this.picker.files().map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        contentLength:
          typeof f.content === 'string'
            ? f.content.length
            : f.content === null
              ? 0
              : (f.content as ArrayBuffer).byteLength,
      })),
      loading: this.picker.loading(),
      error: this.picker.error(),
    }),
  );
}
