import { ChangeDetectionStrategy, Component, computed, ElementRef, viewChild } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { injectVisibility, inElementVisibility } from '@hexguard/angular-visibility';

import { ANGULAR_VISIBILITY_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-visibility-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    DatePipe,
    DecimalPipe,
  ],
  template: `
    <demo-page-layout testId="visibility-demo-page">
      <demo-navigation-strip demoNavigation testId="visibility-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Visibility</p>
            <h2>Tab visibility, idle detection, and element visibility signals.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectVisibility()</code> provides tab visibility and idle detection signals.
          <code>inElementVisibility()</code> tracks element viewport intersection via
          <code>IntersectionObserver</code>.
        </p>

        <demo-status-strip
          testId="visibility-demo-status"
          summary="Reactive visibility and idle detection with signals."
          currentUrl="Angular Visibility — Demo"
          summaryTestId="visibility-demo-summary"
          urlTestId="visibility-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-visibility/demo-state -->
      <article demoPrimary class="demo-card demo-card--stack" data-testid="visibility-playground">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Visibility</p>
            <h3>Live visibility monitor</h3>
          </div>
        </div>

        <div class="vis-section">
          <h4 class="vis-section__title">Tab Visibility</h4>
          <div class="vis-status">
            <span class="vis-status__label">isVisible</span>
            <span
              class="vis-status__value"
              [class.vis-status__value--true]="visibility.isVisible()"
              data-testid="vis-is-visible"
            >
              {{ visibility.isVisible() ? 'true' : 'false' }}
            </span>
          </div>
          <p class="vis-hint">Switch to another tab and come back to see the value change.</p>
        </div>

        <div class="vis-section">
          <h4 class="vis-section__title">Idle Detection (5s timeout)</h4>
          <div class="vis-status">
            <span class="vis-status__label">isIdle</span>
            <span
              class="vis-status__value"
              [class.vis-status__value--true]="visibility.isIdle()"
              data-testid="vis-is-idle"
            >
              {{ visibility.isIdle() ? 'true' : 'false' }}
            </span>
          </div>
          <div class="vis-status">
            <span class="vis-status__label">idleDuration</span>
            <span class="vis-status__value" data-testid="vis-idle-duration">
              {{ visibility.idleDuration() | number }}ms
            </span>
          </div>
          <div class="vis-status">
            <span class="vis-status__label">lastActivity</span>
            <span class="vis-status__value" data-testid="vis-last-activity">
              {{ visibility.lastActivity() | date: 'HH:mm:ss' }}
            </span>
          </div>
          <p class="vis-hint">
            Stop moving the mouse or pressing keys for 5 seconds to trigger idle state.
          </p>
        </div>

        <div class="vis-section">
          <h4 class="vis-section__title">Element Visibility</h4>
          <div class="vis-status">
            <span class="vis-status__label">isElementVisible</span>
            <span
              class="vis-status__value"
              [class.vis-status__value--true]="isElementVisible()"
              data-testid="vis-element-visible"
            >
              {{ isElementVisible() ? 'true' : 'false' }}
            </span>
          </div>
          <div #scrollTarget class="vis-scroll-box" data-testid="vis-scroll-box">
            Scroll this box or resize the viewport. This element uses
            <code>IntersectionObserver</code> to report visibility.
          </div>
          <p class="vis-hint">
            Scroll down to move the box out of view, then back up to see the value update.
          </p>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="visibility-inspector-panel"
        eyebrow="Reference"
        title="Visibility snapshot"
        summary="Live visibility and idle state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="visibility-snapshot-json"
        codeTestId="visibility-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .vis-section {
        margin-bottom: 1.5rem;
        padding-bottom: 1.25rem;
        border-bottom: 1px solid var(--color-border);
      }
      .vis-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .vis-section__title {
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        color: var(--color-text-strong);
      }
      .vis-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.4rem 0.6rem;
        margin-bottom: 0.25rem;
        border-radius: 0.5rem;
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
      }
      .vis-status__label {
        font-family: monospace;
        font-size: 0.85rem;
      }
      .vis-status__value {
        font-weight: 600;
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--color-text-weak);
      }
      .vis-status__value--true {
        color: green;
      }
      .vis-hint {
        font-size: 0.8rem;
        color: var(--color-text-weak);
        margin-top: 0.4rem;
        font-style: italic;
      }
      .vis-scroll-box {
        margin-top: 0.5rem;
        padding: 1rem;
        border-radius: 0.75rem;
        border: 2px dashed var(--color-border);
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        text-align: center;
        font-size: 0.9rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisibilityDemoPageComponent {
  protected readonly demo = ANGULAR_VISIBILITY_DEMO;
  protected readonly visibility = injectVisibility({ idleTimeoutMs: 5000 });

  protected readonly scrollTarget = viewChild.required<ElementRef<HTMLElement>>('scrollTarget');
  protected readonly isElementVisible = inElementVisibility(this.scrollTarget);

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      isVisible: this.visibility.isVisible(),
      isIdle: this.visibility.isIdle(),
      idleDurationMs: this.visibility.idleDuration(),
      lastActivity: new Date(this.visibility.lastActivity()).toISOString(),
      isElementVisible: this.isElementVisible(),
    }),
  );
}
