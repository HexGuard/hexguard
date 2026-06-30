import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ANGULAR_UPLOAD_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-upload-state-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="upload-state-demo-page">
      <demo-navigation-strip demoNavigation testId="upload-state-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Upload State</p>
            <h2>File upload queue with progress, cancel, and retry</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectUploadState()</code> manages file upload lifecycle with
          signal-based progress tracking, cancellation, retry, and queue management.
        </p>

        <demo-status-strip
          testId="upload-state-demo-status"
          summary="Upload state with queue, progress, cancel, retry."
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
            <p class="demo-eyebrow">Upload State</p>
            <h3>Upload queue with progress tracking</h3>
          </div>
        </div>

        <div class="demo-message">
          <p>
            <strong>injectUploadState()</strong> provides a complete file upload lifecycle
            with signal-based state. Key features:
          </p>
          <ul>
            <li><strong>Queue:</strong> add files, track each item's status (queued, uploading, completed, failed, cancelled).</li>
            <li><strong>Progress:</strong> per-file and overall progress signals via XMLHttpRequest.</li>
            <li><strong>Cancel:</strong> abort in-progress uploads with xhr.abort().</li>
            <li><strong>Retry:</strong> re-upload failed items with new tracking.</li>
            <li><strong>Validation:</strong> maxFileSize client-side check.</li>
          </ul>
        </div>
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
  styles: [`
    .demo-message { padding: 1rem; background: var(--color-surface-weak); border-radius: 0.75rem; }
    .demo-message ul { margin-top: 0.75rem; padding-left: 1.25rem; }
    .demo-message li { margin-bottom: 0.5rem; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadStateDemoPageComponent {
  readonly demo = ANGULAR_UPLOAD_STATE_DEMO;
  readonly snapshotJson = computed(() => formatSnapshot({
    package: 'angular-upload-state',
    exports: ['injectUploadState'],
    status: 'Available',
  }));
}
