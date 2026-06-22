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

        @if (nav.isNavigating()) {
          <div class="nav-bar" data-testid="nav-bar">
            <div class="nav-bar__fill" [class.nav-bar__fill--slow]="nav.isSlowNavigation()"></div>
          </div>
        }

        <div class="nav-links">
          <a class="demo-button" routerLink="/packages/angular-navigation-pending/demo" data-testid="nav-self">
            Navigate to self (fast)
          </a>
          <a class="demo-button demo-button--accent" routerLink="/" data-testid="nav-home-slow">
            Navigate to home (slow — 2.5s deactivate guard)
          </a>
        </div>

        <div class="nav-status-grid">
          <div class="nav-status" [class.nav-status--active]="nav.isNavigating()">
            <span class="nav-status__label">isNavigating</span>
            <span
              class="nav-status__value"
              [class.nav-status__value--true]="nav.isNavigating()"
              data-testid="nav-is-navigating"
            >
              {{ nav.isNavigating() ? 'true' : 'false' }}
            </span>
          </div>
          <div class="nav-status" [class.nav-status--active]="nav.isSlowNavigation()">
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
            Click <strong>"Navigate to home (slow)"</strong> to trigger a navigation with a
            2.5-second <code>canDeactivate</code> guard delay. You'll see
            <code>isNavigating → true</code> immediately, then
            <code>isSlowNavigation → true</code> after 200ms, and finally both reset to
            <code>false</code> when the guard resolves and the page transitions away.
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
      .nav-bar {
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: var(--color-border);
        margin-bottom: 1rem;
        overflow: hidden;
      }
      .nav-bar__fill {
        height: 100%;
        width: 0%;
        background: #5bc0de;
        border-radius: 2px;
        animation: nav-fill 200ms ease-out forwards;
      }
      .nav-bar__fill--slow {
        background: #f0ad4e;
        animation: nav-fill-slow 2.3s ease-in forwards;
      }
      @keyframes nav-fill {
        to { width: 30%; }
      }
      @keyframes nav-fill-slow {
        0% { width: 30%; }
        70% { width: 85%; }
        100% { width: 100%; }
      }
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
        transition:
          border-color 200ms ease,
          box-shadow 200ms ease;
      }
      .nav-status--active {
        border-color: rgba(91, 192, 222, 0.5);
        box-shadow: 0 0 0 1px rgba(91, 192, 222, 0.2);
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
  /**
   * Uses immediate mode (delayedIndicatorMs: 0) so the user sees isNavigating
   * become true immediately when they click a link. The route's canDeactivate
   * guard keeps this component alive for ~2.5s while the guard resolves,
   * making the isNavigating → isSlowNavigation → completed lifecycle visible.
   */
  protected readonly nav = injectNavigationPending({ delayedIndicatorMs: 200 });

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      isNavigating: this.nav.isNavigating(),
      isSlowNavigation: this.nav.isSlowNavigation(),
    }),
  );
}
