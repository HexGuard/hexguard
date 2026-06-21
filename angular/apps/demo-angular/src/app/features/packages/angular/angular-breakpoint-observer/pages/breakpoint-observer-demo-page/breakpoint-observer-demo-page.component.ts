import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectBreakpointObserver } from '@hexguard/angular-breakpoint-observer';

import { ANGULAR_BREAKPOINT_OBSERVER_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-breakpoint-observer-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="breakpoint-observer-demo-page">
      <demo-navigation-strip
        demoNavigation
        testId="breakpoint-observer-demo-navigation"
        [demo]="demo"
      />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Breakpoint Observer</p>
            <h2>Signal-based reactive breakpoint detection.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectBreakpointObserver()</code> wraps <code>window.matchMedia</code> into typed
          signals — active breakpoint, per-breakpoint booleans, above/below comparisons, and
          arbitrary media query matching.
        </p>

        <demo-status-strip
          testId="breakpoint-observer-demo-status"
          summary="Reactive breakpoint detection via matchMedia signals."
          currentUrl="Angular Breakpoint Observer — Demo"
          summaryTestId="breakpoint-observer-demo-summary"
          urlTestId="breakpoint-observer-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-breakpoint-observer/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="breakpoint-observer-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Breakpoint Observer</p>
            <h3>Live breakpoint monitor</h3>
          </div>
        </div>

        <div class="bp-viewport-info">
          <p class="bp-viewport-label">Active breakpoint</p>
          <p class="bp-active" data-testid="bp-active">{{ bp.active() || '—' }}</p>
        </div>

        <div class="bp-breakpoints">
          @for (name of breakpointNames; track name) {
            <div
              class="bp-breakpoint"
              [class.bp-breakpoint--active]="bp.breakpoints[name]()"
              [attr.data-testid]="'bp-breakpoint-' + name"
            >
              <span class="bp-breakpoint__name">{{ name }}</span>
              <span class="bp-breakpoint__status">
                {{ bp.breakpoints[name]() ? '✓' : '—' }}
              </span>
            </div>
          }
        </div>

        <div class="bp-comparisons">
          <div class="bp-comparison">
            <span class="bp-comparison__label">above('md')</span>
            <span class="bp-comparison__value" data-testid="bp-above-md">
              {{ bp.above('md')() ? 'true' : 'false' }}
            </span>
          </div>
          <div class="bp-comparison">
            <span class="bp-comparison__label">below('md')</span>
            <span class="bp-comparison__value" data-testid="bp-below-md">
              {{ bp.below('md')() ? 'true' : 'false' }}
            </span>
          </div>
          <div class="bp-comparison">
            <span class="bp-comparison__label">above('lg')</span>
            <span class="bp-comparison__value" data-testid="bp-above-lg">
              {{ bp.above('lg')() ? 'true' : 'false' }}
            </span>
          </div>
          <div class="bp-comparison">
            <span class="bp-comparison__label">below('xl')</span>
            <span class="bp-comparison__value" data-testid="bp-below-xl">
              {{ bp.below('xl')() ? 'true' : 'false' }}
            </span>
          </div>
        </div>

        <div class="demo-card__note">
          <p>
            Resize the browser viewport to see breakpoint state update in real time. The default
            breakpoints match the Tailwind convention: sm (640px), md (768px), lg (1024px), xl
            (1280px), 2xl (1536px).
          </p>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="breakpoint-observer-inspector-panel"
        eyebrow="Reference"
        title="Breakpoint Observer snapshot"
        summary="Live breakpoint state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="breakpoint-observer-snapshot-json"
        codeTestId="breakpoint-observer-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .bp-viewport-info {
        text-align: center;
        padding: 1.5rem;
        margin-bottom: 1rem;
        border-radius: 1rem;
        background: linear-gradient(
          180deg,
          rgba(91, 192, 222, 0.08),
          rgba(91, 192, 222, 0.04)
        );
        border: 1px solid var(--color-border);
      }
      .bp-viewport-label {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--color-text-weak);
        margin-bottom: 0.25rem;
      }
      .bp-active {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-text-strong);
      }
      .bp-breakpoints {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(8rem, 100%), 1fr));
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      .bp-breakpoint {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 0.8rem;
        border-radius: 0.75rem;
        border: 1px solid var(--color-border);
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        transition:
          border-color 200ms ease,
          box-shadow 200ms ease;
      }
      .bp-breakpoint--active {
        border-color: rgba(92, 184, 92, 0.5);
        box-shadow: 0 0 0 1px rgba(92, 184, 92, 0.2);
      }
      .bp-breakpoint__name {
        font-weight: 600;
        font-size: 0.9rem;
      }
      .bp-breakpoint__status {
        font-size: 1rem;
        color: var(--color-text-weak);
      }
      .bp-breakpoint--active .bp-breakpoint__status {
        color: green;
      }
      .bp-comparisons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(10rem, 100%), 1fr));
        gap: 0.5rem;
      }
      .bp-comparison {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.8rem;
        border-radius: 0.5rem;
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
        border: 1px solid var(--color-border);
      }
      .bp-comparison__label {
        font-family: monospace;
        font-size: 0.85rem;
      }
      .bp-comparison__value {
        font-weight: 600;
        font-family: monospace;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreakpointObserverDemoPageComponent {
  protected readonly demo = ANGULAR_BREAKPOINT_OBSERVER_DEMO;
  protected readonly bp = injectBreakpointObserver();
  protected readonly breakpointNames = Object.keys(this.bp.breakpoints);

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      active: this.bp.active(),
      breakpoints: Object.fromEntries(
        this.breakpointNames.map((name) => [name, this.bp.breakpoints[name]()]),
      ),
      'above(md)': this.bp.above('md')(),
      'below(md)': this.bp.below('md')(),
      'above(lg)': this.bp.above('lg')(),
      'below(xl)': this.bp.below('xl')(),
    }),
  );
}
