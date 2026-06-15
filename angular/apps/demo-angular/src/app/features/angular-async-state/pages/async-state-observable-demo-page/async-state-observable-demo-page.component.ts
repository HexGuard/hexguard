import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { observableState } from '@hexguard/angular-async-state';

import { ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  ASYNC_OBSERVABLE_HEALTHY_SNAPSHOT,
  ASYNC_OBSERVABLE_WARNING_SNAPSHOT,
  type AsyncStateMetricCard,
} from '../../data/async-state-demo.data';

interface ObservableFeedController {
  readonly id: number;
  readonly subject: Subject<readonly AsyncStateMetricCard[]>;
}

function createObservableFeedController(id: number): ObservableFeedController {
  return {
    id,
    subject: new Subject<readonly AsyncStateMetricCard[]>(),
  };
}

function mapDemoError(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown observable-state demo error.';
}

@Component({
  standalone: true,
  selector: 'demo-async-state-observable-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  templateUrl: './async-state-observable-demo-page.component.html',
  styleUrl: './async-state-observable-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncStateObservableDemoPageComponent {
  readonly demo = ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO;

  private nextFeedId = 2;

  // demo-snippet:start async-state-observable-demo
  private readonly activeFeed = signal(createObservableFeedController(1));
  readonly connectionCount = signal(0);
  readonly emissionCount = signal(0);
  readonly liveFeed = observableState<readonly AsyncStateMetricCard[], string>({
    initialValue: [],
    source: () => {
      this.connectionCount.update((count) => count + 1);

      return this.activeFeed().subject.asObservable();
    },
    mapError: mapDemoError,
  });
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly currentFeedId = computed(() => this.activeFeed().id);
  readonly statusSummary = computed(() => {
    if (this.liveFeed.isIdle()) {
      return 'Idle. Connect to start the live approval stream.';
    }

    if (this.liveFeed.isConnecting()) {
      return `Connected to feed ${this.currentFeedId()} and waiting for the first live snapshot.`;
    }

    if (this.liveFeed.isError()) {
      return this.liveFeed.error() ?? 'The active live feed failed.';
    }

    if (this.liveFeed.isComplete()) {
      return `Feed ${this.currentFeedId()} completed after ${this.emissionCount()} emitted snapshot(s).`;
    }

    if (this.liveFeed.isEmpty()) {
      return `Feed ${this.currentFeedId()} is live, but the latest snapshot is empty.`;
    }

    return `Feed ${this.currentFeedId()} is live with ${this.liveFeed.value().length} cards after ${this.emissionCount()} emitted snapshot(s).`;
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      status: this.liveFeed.status(),
      error: this.liveFeed.error(),
      hasValue: this.liveFeed.hasValue(),
      isEmpty: this.liveFeed.isEmpty(),
      connectionCount: this.connectionCount(),
      emissionCount: this.emissionCount(),
      feedId: this.currentFeedId(),
      value: this.liveFeed.value(),
    }),
  );
  // demo-snippet:end async-state-observable-demo

  readonly canConnect = computed(() => this.liveFeed.isIdle());
  readonly canEmit = computed(() => this.liveFeed.isConnecting() || this.liveFeed.isLive());
  readonly hasVisibleCards = computed(() => this.liveFeed.hasValue());

  connectFeed(): void {
    this.liveFeed.connect();
  }

  emitHealthySnapshot(): void {
    this.pushSnapshot(ASYNC_OBSERVABLE_HEALTHY_SNAPSHOT);
  }

  emitWarningSnapshot(): void {
    this.pushSnapshot(ASYNC_OBSERVABLE_WARNING_SNAPSHOT);
  }

  emitEmptySnapshot(): void {
    this.pushSnapshot([]);
  }

  failFeed(): void {
    if (!this.canEmit()) {
      return;
    }

    this.activeFeed().subject.error(
      new Error(
        `Live approval feed ${this.currentFeedId()} stopped while streaming backlog metrics.`,
      ),
    );
  }

  completeFeed(): void {
    if (!this.canEmit()) {
      return;
    }

    this.activeFeed().subject.complete();
  }

  disconnectFeed(): void {
    this.liveFeed.disconnect();
  }

  reconnectFeed(): void {
    this.activeFeed.set(createObservableFeedController(this.nextFeedId));
    this.nextFeedId += 1;
    this.liveFeed.reconnect();
  }

  resetFeed(): void {
    this.nextFeedId = 2;
    this.activeFeed.set(createObservableFeedController(1));
    this.connectionCount.set(0);
    this.emissionCount.set(0);
    this.liveFeed.reset();
  }

  private pushSnapshot(cards: readonly AsyncStateMetricCard[]): void {
    if (!this.canEmit()) {
      return;
    }

    this.emissionCount.update((count) => count + 1);
    this.activeFeed().subject.next(cards);
  }
}
