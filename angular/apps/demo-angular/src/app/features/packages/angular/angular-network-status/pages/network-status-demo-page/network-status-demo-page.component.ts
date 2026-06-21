import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectNetworkStatus } from '@hexguard/angular-network-status';

import { ANGULAR_NETWORK_STATUS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-network-status-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  template: `
    <demo-page-layout testId="network-status-demo-page">
      <demo-navigation-strip demoNavigation testId="network-status-demo-navigation" [demo]="demo" />

      <article demoIntro class="demo-card demo-card--stack">
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Angular Network Status</p>
            <h2>Signal-based connectivity monitoring with debounced reconnection.</h2>
          </div>
        </div>
        <p class="demo-card__summary">
          <code>injectNetworkStatus()</code> provides reactive online/offline state, connection type
          detection, a brief "recently back online" indicator, and a promise-based
          <code>whenBackOnline()</code> helper.
        </p>

        <demo-status-strip
          testId="network-status-demo-status"
          summary="Reactive network connectivity monitoring with signals."
          currentUrl="Angular Network Status — Demo"
          summaryTestId="network-status-demo-summary"
          urlTestId="network-status-demo-url"
        />
      </article>

      <!-- demo-snippet:start angular-network-status/demo-state -->
      <article
        demoPrimary
        class="demo-card demo-card--stack"
        data-testid="network-status-playground"
      >
        <div class="demo-card__header">
          <div>
            <p class="demo-eyebrow">Network Status</p>
            <h3>Live connectivity monitor</h3>
          </div>
        </div>

        <div class="demo-field-group">
          <h4 class="demo-field-label">Status</h4>
          <p data-testid="network-status-online">
            Online:
            <strong [style.color]="network.online() ? 'green' : 'red'">
              {{ network.online() ? 'Connected' : 'Disconnected' }}
            </strong>
          </p>
        </div>

        <div class="demo-field-group">
          <h4 class="demo-field-label">Connection Type</h4>
          <p data-testid="network-status-connection">
            Type: <strong>{{ network.connectionType() }}</strong>
          </p>
        </div>

        <div class="demo-field-group">
          <h4 class="demo-field-label">Recently Back Online</h4>
          <p data-testid="network-status-recently">
            {{ network.recentlyBackOnline() ? 'Just reconnected' : 'Stable' }}
          </p>
        </div>

        <div class="demo-card__note">
          <p>
            Toggle your device's network connection or use DevTools > Network > Offline to see the
            status update in real time.
          </p>
        </div>
      </article>
      <!-- demo-snippet:end -->

      <demo-inspector-panel
        demoAside
        panelTestId="network-status-inspector-panel"
        eyebrow="Reference"
        title="Network Status snapshot"
        summary="Live connectivity state."
        [snapshotJson]="snapshotJson()"
        [snippetId]="demo.codeSample.snippetId"
        [docsLinks]="demo.docsLinks"
        snapshotTestId="network-status-snapshot-json"
        codeTestId="network-status-code-sample"
      />
    </demo-page-layout>
  `,
  styles: [
    `
      .demo-field-group {
        margin-bottom: 1.25rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetworkStatusDemoPageComponent {
  protected readonly demo = ANGULAR_NETWORK_STATUS_DEMO;
  protected readonly network = injectNetworkStatus();

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      online: this.network.online(),
      connectionType: this.network.connectionType(),
      recentlyBackOnline: this.network.recentlyBackOnline(),
    }),
  );
}
