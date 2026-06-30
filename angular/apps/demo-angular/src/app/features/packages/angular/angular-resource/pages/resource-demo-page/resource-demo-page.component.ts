import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  cachedResource,
  deduplicatedResource,
  retryResource,
} from '@hexguard/angular-resource';
import { ANGULAR_RESOURCE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

@Component({
  standalone: true,
  selector: 'demo-resource-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  templateUrl: './resource-demo-page.component.html',
  styleUrl: './resource-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResourceDemoPageComponent {
  protected readonly demo = ANGULAR_RESOURCE_DEMO;

  // ── cachedResource demo ───────────────────────────────────────
  protected readonly cacheVersion = signal(0);
  private _cacheFetchCount = 0;

  protected readonly cached = cachedResource(
    () => ({ v: this.cacheVersion() }),
    async () => {
      this._cacheFetchCount++;
      await delay(600);
      return `Cached result #${this._cacheFetchCount} (v${this.cacheVersion()})`;
    },
    { ttl: 5000, staleWhileRevalidate: true },
  );

  protected get cacheFetchCount(): number {
    return this._cacheFetchCount;
  }

  refreshCache(): void {
    this.cacheVersion.update((n) => n + 1);
  }

  // ── retryResource demo ────────────────────────────────────────
  protected readonly retryVersion = signal(0);
  private retryAttempt = 0;

  protected readonly retried = retryResource(
    () => ({ v: this.retryVersion() }),
    async () => {
      this.retryAttempt++;
      if (this.retryAttempt <= 2) {
        throw new Error(`Transient failure (attempt ${this.retryAttempt})`);
      }
      return `Success after ${this.retryAttempt} attempts`;
    },
    { maxRetries: 3, baseDelay: 300 },
  );

  protected get retryAttempts(): number {
    return this.retryAttempt;
  }

  triggerRetry(): void {
    this.retryAttempt = 0;
    this.retryVersion.update((n) => n + 1);
  }

  // ── deduplicatedResource demo ──────────────────────────────────
  protected readonly dedupVersion = signal(0);
  private dedupCallCount = 0;

  protected readonly deduped = deduplicatedResource(
    () => ({ v: this.dedupVersion() }),
    async () => {
      this.dedupCallCount++;
      await delay(500);
      return `Dedup result (fetcher ran ${this.dedupCallCount}x, v${this.dedupVersion()})`;
    },
  );

  protected get dedupFetchCount(): number {
    return this.dedupCallCount;
  }

  /** Trigger two identical resource loads in parallel to show dedup. */
  triggerDedup(): void {
    this.dedupCallCount = 0;
    this.dedupVersion.update((n) => n + 1);
    // Kick off a second load immediately — the resource will re-run
    // due to the param change, but dedup ensures only one fetcher call.
    queueMicrotask(() => this.deduped.reload());
  }

  // ── Snapshot ──────────────────────────────────────────────────
  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      cachedResource: {
        value: this.cached.value(),
        isLoading: this.cached.isLoading(),
        status: this.cached.status(),
        fetchCount: this._cacheFetchCount,
      },
      retryResource: {
        value: this.retried.value(),
        error: this.retried.error()?.message ?? null,
        isLoading: this.retried.isLoading(),
        status: this.retried.status(),
        attempts: this.retryAttempt,
      },
      deduplicatedResource: {
        value: this.deduped.value(),
        isLoading: this.deduped.isLoading(),
        status: this.deduped.status(),
        fetcherCalls: this.dedupCallCount,
      },
    }),
  );
}
