import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectNavigationPending } from '@hexguard/angular-navigation-pending';

import { ANGULAR_NAVIGATION_PENDING_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-navigation-pending-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    RouterLink,
  ],
  template: `
    <demo-page-layout testId="navigation-pending-demo-page">
      <demo-navigation-strip
        demoNavigation
        testId="navigation-pending-demo-navigation"
        [demo]="demo"
      />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Navigation Pending</p>
            <h2>Route transition busy state with slow-navigation detection.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectNavigationPending()</code> provides signal-based
          <code>isNavigating</code> and <code>isSlowNavigation</code> indicators using
          Angular Router events. Click the links below to trigger transitions and watch
          the state update.
        </p>

        <demo-status-strip
          testId="navigation-pending-demo-status"
          summary="Reactive route transition state via Router events."
          currentUrl="Angular Navigation Pending — Demo"
          summaryTestId="navigation-pending-demo-summary"
          urlTestId="navigation-pending-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-navigation-pending/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="navigation-pending-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Navigation Pending</p>
            <h3>Live navigation monitor</h3>
          </div>
        </div>

        <div class="nav-links">
          <a class="demo-button" routerLink="/packages/angular-navigation-pending/demo" data-testid="nav-self">
            Navigate to self (fast)
          </a>
          <a class="demo-button demo-button--ghost" routerLink="/" data-testid="nav-home">
            Navigate to home
          </a>
        </div>

        <div class="nav-status-grid">
          <div class="nav-status">
            <span class="nav-status__label">isNavigating</span>
            <span
              class="nav-status__value"
              [class.nav-status__value--true]="nav.isNavigating()"
              data-testid="nav-is-navigating"
            >
              {{ nav.isNavigating() ? 'true' : 'false' }}
            </span>
          </div>
          <div class="nav-status">
            <span class="nav-status__label">isSlowNavigation</span>
            <span
              class="nav-status__value"
              [class.nav-status__value--true]="nav.isSlowNavigation()"
              data-testid="nav-is-slow"
            >
              {{ nav.isSlowNavigation() ? 'true' : 'false' }}
            </span>
          </div>
        </div>

        <div class="demo-card__note">
          <p>
            <code>isSlowNavigation</code> becomes <code>true</code> only after 200ms of
            navigation, preventing a flash-of-spinner during fast transitions. Click a link
            above to trigger a transition.
          </p>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="navigation-pending-inspector-panel"
        eyebrow="Reference"
        title="Navigation Pending snapshot"
        summary="Live transition state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="navigation-pending-snapshot-json"
        codeTestId="navigation-pending-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .nav-links {
        display: flex;
        gap: 0.75rem;
        margin-bottom: 1.25rem;
        flex-wrap: wrap;
      }
      .nav-status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
        gap: 0.5rem;
      }
      .nav-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.6rem 0.8rem;
        border-radius: 0.75rem;
        border: 1px solid var(--color-border);
        background: color-mix(in srgb, var(--color-surface-strong) 82%, white);
      }
      .nav-status__label {
        font-family: monospace;
        font-size: 0.85rem;
      }
      .nav-status__value {
        font-weight: 600;
        font-family: monospace;
        font-size: 0.9rem;
        color: var(--color-text-weak);
      }
      .nav-status__value--true {
        color: green;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationPendingDemoPageComponent {
  protected readonly demo = ANGULAR_NAVIGATION_PENDING_DEMO;
  protected readonly nav = injectNavigationPending({ delayedIndicatorMs: 200 });

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      isNavigating: this.nav.isNavigating(),
      isSlowNavigation: this.nav.isSlowNavigation(),
    }),
  );
}
