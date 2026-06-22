import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectLiveData } from '@hexguard/angular-live-data';
import { ANGULAR_LIVE_DATA_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';
import { fetchDashboardMetrics, fetchFailingMetrics } from '../../data/live-data-demo.data';

@Component({
  standalone: true,
  selector: 'demo-live-data-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  templateUrl: './live-data-demo-page.component.html',
  styleUrls: ['./live-data-demo-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LiveDataDemoPageComponent {
  protected readonly demo = ANGULAR_LIVE_DATA_DEMO;

  /** Healthy polling — updates every 5 seconds. */
  protected readonly live = injectLiveData({
    pollInterval: 5_000,
    staleAfter: 10_000,
    fetcher: () => fetchDashboardMetrics(),
  });

  /** Error-prone polling to demonstrate error state (toggle with button). */
  protected useFailingApi = false;
  protected readonly failingLive = injectLiveData({
    pollInterval: 5_000,
    staleAfter: 10_000,
    retryConfig: { maxRetries: 2, baseDelayMs: 1_000, maxDelayMs: 5_000 },
    fetcher: () => (this.useFailingApi ? fetchFailingMetrics() : fetchDashboardMetrics()),
  });

  protected readonly mainSnapshotJson = computed(() =>
    formatSnapshot({
      data: this.live.data(),
      stale: this.live.stale(),
      loading: this.live.loading(),
      error: this.live.error(),
      isPaused: this.live.isPaused(),
    }),
  );

  protected readonly failingSnapshotJson = computed(() =>
    formatSnapshot({
      data: this.failingLive.data(),
      stale: this.failingLive.stale(),
      loading: this.failingLive.loading(),
      error: this.failingLive.error(),
      isPaused: this.failingLive.isPaused(),
    }),
  );

  protected toggleFailingApi(): void {
    this.useFailingApi = !this.useFailingApi;
  }
}
