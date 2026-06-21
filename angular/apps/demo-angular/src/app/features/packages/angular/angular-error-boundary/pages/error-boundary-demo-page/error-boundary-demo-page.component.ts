import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { HexguardErrorBoundaryComponent } from '@hexguard/angular-error-boundary';

import { ANGULAR_ERROR_BOUNDARY_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

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
      <demo-navigation-strip demoNavigation testId="error-boundary-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Error Boundary</p>
            <h2>Declarative component error boundary with fallback and reset.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>HexguardErrorBoundaryComponent</code> catches errors from projected content. Try the
          default fallback and the custom fallback below.
        </p>

        <demo-status-strip
          testId="error-boundary-demo-status"
          summary="Declarative error boundary with fallback and reset."
          currentUrl="Angular Error Boundary Demo"
          summaryTestId="error-boundary-demo-summary"
          urlTestId="error-boundary-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-error-boundary/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="error-boundary-demo-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Error boundary</p>
            <h3>Default fallback</h3>
          </div>
        </div>
        <p class="demo-card__summary">
          Click <strong>Throw error</strong> to trigger the boundary. The default fallback shows an
          error message with a Retry button that restores the original content.
        </p>

        <hexguard-error-boundary>
          <ng-template>
            @if (checkRenderError()) {}
            <div class="boundary-safe" data-testid="error-boundary-safe-content">
              <div class="boundary-safe__inner">
                <span class="boundary-icon">✓</span>
                <div>
                  <strong>Safe content</strong>
                  <p class="boundary-safe__desc">
                    This content renders normally until an error is thrown.
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="demo-button demo-button--sm"
                (click)="throwRenderError()"
                data-testid="trigger-error"
              >
                Throw error
              </button>
            </div>
          </ng-template>
        </hexguard-error-boundary>
      </article>

      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="error-boundary-demo-custom"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Error boundary</p>
            <h3>Custom fallback</h3>
          </div>
        </div>
        <p class="demo-card__summary">
          The custom fallback receives the error context with a <code>reset()</code> function.
        </p>

        <hexguard-error-boundary [fallback]="customFallback">
          <ng-template>
            @if (checkCustomError()) {}
            <div class="boundary-safe">
              <div class="boundary-safe__inner">
                <span class="boundary-icon">✓</span>
                <div>
                  <strong>Safe content (custom)</strong>
                  <p class="boundary-safe__desc">
                    This content also throws and triggers a custom fallback.
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="demo-button demo-button--sm"
                (click)="throwCustomError()"
                data-testid="trigger-custom-error"
              >
                Throw error
              </button>
            </div>
          </ng-template>
        </hexguard-error-boundary>

        <ng-template #customFallback let-error="error" let-reset="reset">
          <div class="boundary-error" data-testid="custom-fallback">
            <div class="boundary-error__head">
              <span class="boundary-icon boundary-icon--warn">⚠</span>
              <strong>Custom error boundary</strong>
            </div>
            <p class="boundary-error__msg">{{ error?.message || 'Unknown error' }}</p>
            <button type="button" (click)="reset()" data-testid="custom-retry" class="demo-button">
              Try again
            </button>
          </div>
        </ng-template>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="error-boundary-inspector-panel"
        eyebrow="Reference"
        title="Error boundary state"
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="error-boundary-snapshot-json"
        codeTestId="error-boundary-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .boundary-safe {
        padding: 1rem;
        border: 1px solid var(--color-border);
        border-radius: 1rem;
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        box-shadow: var(--shadow-soft);
      }
      .boundary-safe__inner {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
      }
      .boundary-safe__desc {
        margin: 0.15rem 0 0;
        font-size: 0.85rem;
        color: var(--color-muted);
      }
      .boundary-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        flex-shrink: 0;
        background: #d4edda;
        color: #155724;
        font-size: 1.1rem;
      }
      .boundary-icon--warn {
        background: #f8d7da;
        color: #721c24;
      }
      .boundary-error {
        padding: 1rem;
        border: 1px solid rgba(217, 119, 75, 0.3);
        border-radius: 1rem;
        background: linear-gradient(180deg, rgba(255, 243, 205, 0.84), rgba(253, 232, 197, 0.76));
        box-shadow: var(--shadow-soft);
      }
      .boundary-error__head {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .boundary-error__msg {
        margin: 0 0 0.75rem;
        font-size: 0.85rem;
        font-family: var(--font-mono);
        word-break: break-word;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorBoundaryDemoPageComponent {
  readonly demo = ANGULAR_ERROR_BOUNDARY_DEMO;

  /**
   * Queued error messages. Set by click handlers, consumed (thrown) during the
   * next CD pass in the corresponding `check*Error()` method.
   *
   * Uses a plain property — NOT a signal — because writing to a `WritableSignal`
   * during template evaluation is prohibited in Angular 22 (NG0600).
   */
  private queuedDefaultError: string | null = null;
  private queuedCustomError: string | null = null;

  /** Signal that tracks whether an error has been triggered (for the live snapshot). */
  private readonly errorTriggered = signal(false);

  readonly snapshotJson = computed(() =>
    formatSnapshot({
      errorTriggered: this.errorTriggered(),
    }),
  );

  /** Click handler for the first boundary's "Throw error" button. */
  throwRenderError(): void {
    this.queuedDefaultError = 'Render error triggered by user.';
    this.errorTriggered.set(true);
  }

  /** Click handler for the second boundary's "Throw error" button. */
  throwCustomError(): void {
    this.queuedCustomError = 'Custom boundary error — message shown in fallback.';
    this.errorTriggered.set(true);
  }

  /**
   * Called during template rendering inside the first boundary's `<ng-template>`.
   * Throws if an error is queued, consuming it.
   */
  checkRenderError(): boolean {
    if (this.queuedDefaultError !== null) {
      const msg = this.queuedDefaultError;
      this.queuedDefaultError = null;
      throw new Error(msg);
    }
    return false;
  }

  /**
   * Called during template rendering inside the second boundary's `<ng-template>`.
   * Throws if an error is queued, consuming it.
   */
  checkCustomError(): boolean {
    if (this.queuedCustomError !== null) {
      const msg = this.queuedCustomError;
      this.queuedCustomError = null;
      throw new Error(msg);
    }
    return false;
  }
}
