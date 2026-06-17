import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { HexguardErrorBoundaryComponent } from '@hexguard/angular-error-boundary';

import { ANGULAR_ERROR_BOUNDARY_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-error-boundary-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    HexguardErrorBoundaryComponent,
  ],
  template: `
    <demo-page-layout testId="error-boundary-demo-page">
      <demo-navigation-strip
        demoNavigation
        testId="error-boundary-demo-navigation"
        [demo]="demo"
      />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Error Boundary</p>
            <h2>Declarative component error boundary with fallback and reset.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>HexguardErrorBoundaryComponent</code> catches errors from projected content. Try
          the default fallback and the custom fallback below.
        </p>
      </article>

      <!-- demo-snippet:start angular-error-boundary/demo-state -->
      <section class="demo-card" data-testid="error-boundary-demo-playground">
        <p class="demo-card__section-label">Default fallback</p>

        <hexguard-error-boundary>
          <div class="error-boundary-content" data-testid="error-boundary-safe-content">
            <p>This content is safe until you click the button.</p>
            <button
              type="button"
              class="throw-btn"
              (click)="throwRenderError()"
              data-testid="trigger-error"
            >
              Throw error
            </button>
          </div>
        </hexguard-error-boundary>
      </section>

      <section class="demo-card" data-testid="error-boundary-demo-custom">
        <p class="demo-card__section-label">Custom fallback</p>
        <p class="demo-card__summary">
          The custom fallback template receives the error and a reset function.
        </p>

        <hexguard-error-boundary [fallback]="customFallback">
          <div class="error-boundary-content">
            <p>This content also throws on click.</p>
            <button
              type="button"
              class="throw-btn"
              (click)="throwCustomError()"
              data-testid="trigger-custom-error"
            >
              Throw (custom fallback)
            </button>
          </div>
        </hexguard-error-boundary>

        <ng-template #customFallback let-ctx>
          <div class="custom-fallback" data-testid="custom-fallback">
            <p><strong>Custom error view</strong></p>
            <p class="custom-fallback-detail">{{ ctx.error?.message }}</p>
            <button
              type="button"
              (click)="ctx.reset()"
              data-testid="custom-retry"
              class="retry-btn"
            >
              Try again
            </button>
          </div>
        </ng-template>
      </section>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        panelTestId="error-boundary-inspector-panel"
        eyebrow="Reference"
        title="Error boundary state"
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="error-boundary-snapshot-json"
        codeTestId="error-boundary-code-sample"
      />

      <demo-status-strip
        summary="Declarative error boundary with fallback and reset."
        currentUrl="Angular Error Boundary Demo"
        summaryTestId="error-boundary-demo-summary"
        urlTestId="error-boundary-demo-url"
        testId="error-boundary-demo-status"
      />
    </demo-page-layout>
  `,
  styles: [
    `
    .error-boundary-content { padding: 1rem; border: 1px solid #e0e0e0; border-radius: 0.375rem; }
    .error-boundary-content p { margin: 0 0 0.75rem; }
    .throw-btn {
      padding: 0.5rem 1rem; border: 1px solid #dc3545; border-radius: 0.25rem;
      background: #fff; color: #dc3545; cursor: pointer; font-size: 0.875rem;
    }
    .throw-btn:hover { background: #dc3545; color: #fff; }
    .custom-fallback {
      padding: 1rem; border: 2px solid #ffc107; border-radius: 0.375rem;
      background: #fff3cd; color: #856404;
    }
    .custom-fallback-detail { font-size: 0.8125rem; margin: 0.5rem 0; }
    .retry-btn {
      padding: 0.375rem 0.75rem; border: 1px solid currentColor;
      border-radius: 0.25rem; background: none; cursor: pointer;
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorBoundaryDemoPageComponent {
  readonly demo = ANGULAR_ERROR_BOUNDARY_DEMO;
  private readonly errorFlag = signal(false);

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      errorTriggered: this.errorFlag(),
    }),
  );

  throwRenderError(): void {
    this.errorFlag.set(true);
    throw new Error('Render error triggered by user.');
  }

  throwCustomError(): void {
    const error = new Error('Custom boundary error — message shown in fallback.');
    setTimeout(() => {
      throw error;
    }, 50);
  }
}
