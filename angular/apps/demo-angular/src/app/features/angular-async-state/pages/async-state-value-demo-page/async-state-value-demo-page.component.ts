import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { HexguardAsyncStateOutletComponent, asyncState } from '@hexguard/angular-async-state';

import { ANGULAR_ASYNC_STATE_VALUE_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  ASYNC_STATE_BASE_CARDS,
  ASYNC_STATE_REFRESHED_CARDS,
  type AsyncStateMetricCard,
} from '../../data/async-state-demo.data';

type LoadScenario = 'healthy' | 'refresh' | 'empty' | 'error';

function waitForDemoLatency(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, durationMs);
  });
}

function mapDemoError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown async-state demo error.';
}

@Component({
  standalone: true,
  selector: 'demo-async-state-value-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    HexguardAsyncStateOutletComponent,
  ],
  templateUrl: './async-state-value-demo-page.component.html',
  styleUrl: './async-state-value-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncStateValueDemoPageComponent {
  readonly demo = ANGULAR_ASYNC_STATE_VALUE_DEMO;

  // demo-snippet:start async-state-value-demo
  private readonly loadScenario = signal<LoadScenario>('healthy');
  readonly requestCount = signal(0);
  readonly cards = asyncState<readonly AsyncStateMetricCard[], string>({
    initialValue: [],
    load: async () => {
      this.requestCount.update((count) => count + 1);
      const scenario = this.loadScenario();

      await waitForDemoLatency(450);

      if (scenario === 'error') {
        throw new Error('Metrics service timed out while loading the dashboard cards.');
      }

      if (scenario === 'empty') {
        return [];
      }

      return scenario === 'refresh' ? ASYNC_STATE_REFRESHED_CARDS : ASYNC_STATE_BASE_CARDS;
    },
    mapError: mapDemoError,
  });
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly statusSummary = computed(() => {
    if (this.cards.isIdle()) {
      return 'Idle. Choose a scenario to load the dashboard cards.';
    }

    if (this.cards.isLoading()) {
      return 'Loading dashboard cards for the first time.';
    }

    if (this.cards.isReloading()) {
      return 'Refreshing dashboard cards while the previous snapshot stays visible.';
    }

    if (this.cards.isError() && this.cards.hasLoaded()) {
      return 'Refresh failed. The previous dashboard cards stay visible until the next success.';
    }

    if (this.cards.isError()) {
      return (
        this.cards.error() ?? 'The first load failed before any dashboard cards were available.'
      );
    }

    if (this.cards.isEmpty()) {
      return 'The loader completed successfully, but this scenario returned no dashboard cards.';
    }

    return `Loaded ${this.cards.value().length} cards across ${this.requestCount()} request(s).`;
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.cards.status(),
      hasLoaded: this.cards.hasLoaded(),
      hasValue: this.cards.hasValue(),
      isEmpty: this.cards.isEmpty(),
      error: this.cards.error(),
      requestCount: this.requestCount(),
      scenario: this.loadScenario(),
      value: this.cards.value(),
    }),
  );
  // demo-snippet:end async-state-value-demo

  readonly isBusy = computed(() => this.cards.isLoading() || this.cards.isReloading());

  loadHealthy(): void {
    this.startLoad('healthy', false);
  }

  loadEmpty(): void {
    this.startLoad('empty', false);
  }

  loadFailure(): void {
    this.startLoad('error', false);
  }

  reloadWithFreshData(): void {
    this.startLoad('refresh', true);
  }

  reloadWithFailure(): void {
    this.startLoad('error', true);
  }

  resetState(): void {
    this.loadScenario.set('healthy');
    this.requestCount.set(0);
    this.cards.reset();
  }

  private startLoad(scenario: LoadScenario, reload: boolean): void {
    this.loadScenario.set(scenario);

    const promise = reload ? this.cards.reload() : this.cards.load();

    void promise.catch(() => undefined);
  }
}
