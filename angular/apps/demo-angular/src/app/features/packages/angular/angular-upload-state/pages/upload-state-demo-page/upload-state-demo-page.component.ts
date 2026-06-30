import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectUploadState } from '@hexguard/angular-upload-state';

import { ANGULAR_UPLOAD_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { JsonPipe } from '@angular/common';
import { formatSnapshot } from '../../../../../../shared/formatting';

// ── Mock sender ──────────────────────────────────────────────

/** Simulates a file upload with incremental progress over ~2-4s. */
function createMockSender(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ fileName: string; size: number }> {
  const total = file.size > 0 ? file.size : 1024 * 1024;
  const chunkSize = Math.max(1, Math.round(total / 20));
  const delayMs = 80 + Math.random() * 40;
  let loaded = 0;

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      loaded += chunkSize;
      if (loaded >= total) {
        loaded = total;
        clearInterval(timer);
        onProgress(100);
        resolve({ fileName: file.name, size: total });
      } else {
        onProgress(Math.round((loaded / total) * 100));
      }
    }, delayMs);
  });
}

// ── Component ────────────────────────────────────────────────

@Component({
  standalone: true,
  selector: 'demo-upload-state-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    JsonPipe,
  ],
  template: `
    <demo-page-layout testId="upload-state-demo-page">
      <demo-navigation-strip demoNavigation testId="upload-state-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Upload State</p>
            <h2>Interactive file upload demo</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectUploadState()</code> manages a queue of files with
          signal-based progress tracking, cancellation, and retry.
          Uploads are simulated so no backend is needed.
        </p>

        <demo-status-strip
          testId="upload-state-demo-status"
          summary="Interactive upload queue with progress, cancel, retry."
          currentUrl="Angular Upload State — Demo"
          summaryTestId="upload-state-demo-summary"
          urlTestId="upload-state-demo-url"
        />
      </article>

      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="upload-state-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Upload controls</p>
            <h3>Queue, track, cancel, retry</h3>
          </div>
        </div>

        <!-- Controls -->
        <div class="upload-controls">
          <button
            class="demo-button"
            (click)="fileInput.click()"
            data-testid="upload-pick-files"
          >
            Pick files
          </button>
          <input
            #fileInput
            type="file"
            [multiple]="multiple()"
            (change)="onFilesSelected($any($event.target).files)"
            hidden
            accept="*"
            data-testid="upload-file-input"
          />

          <button
            class="demo-button demo-button--ghost"
            (click)="chooseSampleImages()"
            data-testid="upload-sample-images"
          >
            Sample images
          </button>

          <button
            class="demo-button demo-button--ghost"
            (click)="chooseSampleDocs()"
            data-testid="upload-sample-docs"
          >
            Sample documents
          </button>

          <label class="upload-toggle" data-testid="upload-multiple-toggle">
            <input type="checkbox" [checked]="multiple()" (change)="multiple.set(!multiple())" />
            <span>Multiple files</span>
          </label>

          <span class="upload-hint">
            Max: {{ maxFileSizeMB }} MB
          </span>
        </div>

        <!-- Overall progress -->
        @if (upload.queue().length > 0) {
          <div class="upload-overall" data-testid="upload-overall-progress">
            <div class="upload-overall__header">
              <span class="upload-overall__label">Overall progress</span>
              <span class="upload-overall__pct" data-testid="upload-overall-pct">
                {{ upload.progress() }}%
              </span>
            </div>
            <div class="upload-bar-track">
              <div
                class="upload-bar-fill"
                [style.width.%]="upload.progress()"
                [class.upload-bar-fill--done]="upload.progress() === 100"
                [class.upload-bar-fill--partial]="upload.progress() > 0 && upload.progress() < 100"
              ></div>
            </div>
          </div>
        }

        <!-- Summary -->
        @if (upload.queue().length > 0) {
          <div class="upload-summary" data-testid="upload-summary">
            <span class="upload-summary__pill upload-summary__pill--total">
              {{ upload.queue().length }} total
            </span>
            @if (upload.isUploading()) {
              <span class="upload-summary__pill upload-summary__pill--active">
                {{ activeFileName() }}
              </span>
            }
            <span class="upload-summary__pill upload-summary__pill--done">
              {{ upload.completed().length }} done
            </span>
            <span class="upload-summary__pill upload-summary__pill--fail">
              {{ upload.failed().length }} failed
            </span>
            <span class="upload-summary__pill upload-summary__pill--cancel">
              {{ cancelledCount() }} cancelled
            </span>

            <div class="upload-summary__actions">
              @if (upload.completed().length > 0) {
                <button
                  class="demo-button demo-button--ghost upload-summary__btn"
                  (click)="upload.clearCompleted()"
                  data-testid="upload-clear-completed"
                >
                  Clear completed
                </button>
              }
              @if (upload.queue().length > 0) {
                <button
                  class="demo-button demo-button--ghost upload-summary__btn upload-summary__btn--danger"
                  (click)="upload.clearAll()"
                  data-testid="upload-clear-all"
                >
                  Clear all
                </button>
              }
            </div>
          </div>
        }

        <!-- Empty state -->
        @if (upload.queue().length === 0) {
          <div class="upload-empty" data-testid="upload-empty-state">
            <p>No files uploaded yet. Pick files or use sample sets to start.</p>
          </div>
        }

        <!-- Queue -->
        @if (upload.queue().length > 0) {
          <div class="upload-queue" data-testid="upload-queue">
            @for (item of upload.queue(); track item.id) {
              <div
                class="upload-item"
                [class.upload-item--uploading]="item.status === 'uploading'"
                [class.upload-item--done]="item.status === 'completed'"
                [class.upload-item--fail]="item.status === 'failed'"
                [class.upload-item--cancel]="item.status === 'cancelled'"
                [attr.data-testid]="'upload-item-' + item.id"
              >
                <div class="upload-item__header">
                  <span class="upload-item__name" [title]="item.file.name">
                    {{ item.file.name }}
                  </span>
                  <span class="upload-item__size">{{ formatSize(item.file.size) }}</span>
                  <span
                    class="upload-item__status"
                    [class.upload-item__status--uploading]="item.status === 'uploading'"
                    [class.upload-item__status--done]="item.status === 'completed'"
                    [class.upload-item__status--fail]="item.status === 'failed'"
                    [class.upload-item__status--cancel]="item.status === 'cancelled'"
                    [attr.data-testid]="'upload-status-' + item.id"
                  >
                    {{ item.status }}
                  </span>
                </div>

                @if (item.status === 'uploading') {
                  <div class="upload-bar-track upload-item__bar">
                    <div
                      class="upload-bar-fill upload-bar-fill--active"
                      [style.width.%]="item.progress"
                    ></div>
                  </div>
                  <span class="upload-item__pct">{{ item.progress }}%</span>
                }

                @if (item.status === 'completed' && item.response) {
                  <div class="upload-item__response" [attr.data-testid]="'upload-response-' + item.id">
                    Response: <code>{{ item.response | json }}</code>
                  </div>
                }

                @if (item.status === 'failed' && item.error) {
                  <div class="upload-item__error" [attr.data-testid]="'upload-error-' + item.id">
                    {{ item.error }}
                  </div>
                }

                <div class="upload-item__actions">
                  @if (item.status === 'uploading') {
                    <button
                      class="demo-button demo-button--ghost upload-item__action upload-item__action--danger"
                      (click)="upload.cancel(item.id)"
                      [attr.data-testid]="'upload-cancel-' + item.id"
                    >
                      Cancel
                    </button>
                  }
                  @if (item.status === 'failed' || item.status === 'cancelled') {
                    <button
                      class="demo-button demo-button--ghost upload-item__action"
                      (click)="upload.retry(item.id)"
                      [attr.data-testid]="'upload-retry-' + item.id"
                    >
                      Retry
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }
      </article>

      <demo-inspector-panel
        demoAside
        panelTestId="upload-state-inspector-panel"
        eyebrow="Reference"
        title="Upload State snapshot"
        summary="Upload state reference."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="upload-state-snapshot-json"
        codeTestId="upload-state-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .upload-controls {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
        margin-bottom: 1rem;
        padding: 1rem;
        background: var(--color-surface-weak);
        border-radius: 0.75rem;
      }
      .upload-toggle {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        cursor: pointer;
        user-select: none;
      }
      .upload-toggle input {
        accent-color: var(--color-brand);
      }
      .upload-hint {
        font-size: 0.8rem;
        color: var(--color-text-tertiary);
        margin-left: auto;
      }
      .upload-overall {
        margin-bottom: 0.75rem;
      }
      .upload-overall__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
      }
      .upload-overall__label {
        font-weight: 600;
        font-size: 0.9rem;
      }
      .upload-overall__pct {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--color-text-secondary);
      }
      .upload-bar-track {
        width: 100%;
        height: 0.5rem;
        background: var(--color-surface-strong);
        border-radius: 0.25rem;
        overflow: hidden;
      }
      .upload-bar-fill {
        height: 100%;
        border-radius: 0.25rem;
        transition: width 0.15s ease;
      }
      .upload-bar-fill--partial {
        background: linear-gradient(90deg, #5bc0de, #3a9fc5);
      }
      .upload-bar-fill--done {
        background: #5cb85c;
      }
      .upload-bar-fill--active {
        background: linear-gradient(90deg, #5bc0de, #3a9fc5);
      }
      .upload-summary {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: center;
        margin-bottom: 0.75rem;
        padding: 0.5rem 0.75rem;
        background: var(--color-surface-weak);
        border-radius: 0.5rem;
      }
      .upload-summary__pill {
        font-size: 0.8rem;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        background: var(--color-surface-strong);
        color: var(--color-text-secondary);
      }
      .upload-summary__pill--total { background: #e8e8e8; color: #444; }
      .upload-summary__pill--active { background: #d9edf7; color: #31708f; }
      .upload-summary__pill--done { background: #dff0d8; color: #3c763d; }
      .upload-summary__pill--fail { background: #f2dede; color: #a94442; }
      .upload-summary__pill--cancel { background: #f5f5f5; color: #777; }
      .upload-summary__actions {
        margin-left: auto;
        display: flex;
        gap: 0.35rem;
      }
      .upload-summary__btn {
        font-size: 0.78rem;
        padding: 0.2rem 0.6rem;
      }
      .upload-summary__btn--danger { color: #a94442; }
      .upload-empty {
        padding: 2rem 1rem;
        text-align: center;
        color: var(--color-text-tertiary);
        border: 1px dashed var(--color-border);
        border-radius: 0.75rem;
      }
      .upload-queue {
        display: grid;
        gap: 0.5rem;
      }
      .upload-item {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.35rem 0.75rem;
        padding: 0.65rem 0.75rem;
        border: 1px solid var(--color-border);
        border-radius: 0.5rem;
        background: var(--color-surface);
        transition: border-color 0.15s;
        align-items: center;
      }
      .upload-item--uploading { border-color: #5bc0de; background: #f0f9ff; }
      .upload-item--done { border-color: #5cb85c; background: #f2faf2; }
      .upload-item--fail { border-color: #d9534f; background: #fff5f5; }
      .upload-item--cancel { border-color: #ccc; background: #fafafa; }
      .upload-item__header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 0;
      }
      .upload-item__name {
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .upload-item__size {
        font-size: 0.78rem;
        color: var(--color-text-tertiary);
        white-space: nowrap;
      }
      .upload-item__status {
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        padding: 0.1rem 0.45rem;
        border-radius: 999px;
        white-space: nowrap;
        background: #e8e8e8;
        color: #666;
      }
      .upload-item__status--uploading { background: #d9edf7; color: #31708f; }
      .upload-item__status--done { background: #dff0d8; color: #3c763d; }
      .upload-item__status--fail { background: #f2dede; color: #a94442; }
      .upload-item__status--cancel { background: #f5f5f5; color: #777; }
      .upload-item__bar { grid-column: 1 / -1; }
      .upload-item__pct {
        grid-column: 1 / -1;
        font-family: var(--font-mono);
        font-size: 0.78rem;
        color: var(--color-text-tertiary);
        text-align: right;
      }
      .upload-item__response,
      .upload-item__error {
        grid-column: 1 / -1;
        font-size: 0.8rem;
        padding: 0.3rem 0.5rem;
        border-radius: 0.3rem;
      }
      .upload-item__response {
        background: #f5f5f5;
        color: var(--color-text-secondary);
      }
      .upload-item__response code {
        font-size: 0.78rem;
        word-break: break-all;
      }
      .upload-item__error {
        background: #fff0f0;
        color: #a94442;
      }
      .upload-item__actions {
        grid-column: 1 / -1;
        display: flex;
        gap: 0.35rem;
        justify-content: flex-end;
      }
      .upload-item__action {
        font-size: 0.78rem;
        padding: 0.15rem 0.6rem;
      }
      .upload-item__action--danger {
        color: #a94442;
        border-color: #d9534f;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadStateDemoPageComponent {
  readonly demo = ANGULAR_UPLOAD_STATE_DEMO;
  readonly maxFileSizeMB = 50;
  readonly multiple = signal(true);

  readonly upload = injectUploadState({
    url: '/api/uploads',
    multiple: true,
    maxFileSize: this.maxFileSizeMB * 1024 * 1024,
    sender: (ctx, onProgress) => createMockSender(ctx.file, onProgress),
  });

  readonly cancelledCount = computed(
    () => this.upload.queue().filter((i) => i.status === 'cancelled').length,
  );

  readonly activeFileName = computed(() => {
    const a = this.upload.active();
    return a ? a.file.name : '\u2026';
  });

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      package: 'angular-upload-state',
      exports: ['injectUploadState'],
      status: 'Available',
      queue: this.upload.queue().length,
      isUploading: this.upload.isUploading(),
      progress: `${this.upload.progress()}%`,
      completed: this.upload.completed().length,
      failed: this.upload.failed().length,
      cancelled: this.cancelledCount(),
    }),
  );

  onFilesSelected(fileList: FileList | null): void {
    if (!fileList) return;
    for (let i = 0; i < fileList.length; i++) {
      this.upload.upload(fileList[i]);
    }
  }

  chooseSampleImages(): void {
    const names = ['photo-2026.jpg', 'screenshot.png', 'avatar.webp', 'banner-graphic.png'];
    for (const name of names) {
      const size = 100_000 + Math.round(Math.random() * 2_000_000);
      const ext = name.split('.').pop() ?? 'bin';
      this.upload.upload(
        new File([new ArrayBuffer(size)], name, {
          type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        }),
      );
    }
  }

  chooseSampleDocs(): void {
    const names = ['report-q2.pdf', 'presentation.pptx', 'spreadsheet.xlsx', 'notes.txt'];
    for (const name of names) {
      const size = 10_000 + Math.round(Math.random() * 500_000);
      this.upload.upload(
        new File([new ArrayBuffer(size)], name, { type: 'application/octet-stream' }),
      );
    }
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}
