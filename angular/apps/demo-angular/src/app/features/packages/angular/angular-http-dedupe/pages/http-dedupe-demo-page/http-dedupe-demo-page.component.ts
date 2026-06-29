import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { createHttpDedupe } from '@hexguard/angular-http-dedupe';
import { ANGULAR_HTTP_DEDUPE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-http-dedupe-demo-page',
  templateUrl: './http-dedupe-demo-page.component.html',
  styleUrl: './http-dedupe-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDedupeDemoPageComponent {
  protected readonly demo = ANGULAR_HTTP_DEDUPE_DEMO;

  /** Singleton dedupe — cache and in-flight state persist across calls. */
  private readonly dedupe = createHttpDedupe<string>({ maxAgeMs: 5000 });

  /** Tracks how many times the real fetch function was invoked. */
  private fetchCounter = 0;

  protected readonly result = signal<string | null>(null);
  protected readonly source = signal<'fresh' | 'reused' | null>(null);
  protected readonly totalCalls = signal(0);
  protected readonly actualFetches = signal(0);
  protected readonly loading = signal(false);

  protected get avoided(): number {
    return this.totalCalls() - this.actualFetches();
  }

  private simulateFetch(label: string, delayMs: number): Promise<string> {
    this.fetchCounter++;
    const id = this.fetchCounter;
    this.actualFetches.update((n) => n + 1);
    return new Promise((resolve) => {
      setTimeout(() => resolve(`Response #${id}: ${label}`), delayMs);
    });
  }

  /** Execute one request — shows cache-on-rerun behavior. */
  async executeSingle(): Promise<void> {
    this.loading.set(true);
    this.totalCalls.update((n) => n + 1);

    const before = this.fetchCounter;
    const result = await this.dedupe.execute(
      { method: 'GET', url: '/api/demo' },
      () => this.simulateFetch('Single', 600),
    );

    this.result.set(result);
    this.source.set(this.fetchCounter > before ? 'fresh' : 'reused');
    this.loading.set(false);
  }

  /** Fire two identical requests in parallel — shows in-flight dedup. */
  async executeParallel(): Promise<void> {
    this.loading.set(true);

    const before = this.fetchCounter;

    const [r1] = await Promise.all([
      this.dedupe.execute(
        { method: 'GET', url: '/api/demo' },
        () => this.simulateFetch('Parallel', 600),
      ),
      this.dedupe.execute(
        { method: 'GET', url: '/api/demo' },
        () => this.simulateFetch('Parallel', 600),
      ),
    ]);

    this.totalCalls.update((n) => n + 2);
    this.result.set(r1);
    this.source.set(this.fetchCounter > before ? 'fresh' : 'reused');
    this.loading.set(false);
  }

  /** Clear the response cache so the next execute is fresh. */
  clearCache(): void {
    this.dedupe.clear();
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      lastResult: this.result(),
      source: this.source(),
      totalExecuteCalls: this.totalCalls(),
      actualFetchCalls: this.actualFetches(),
      avoidedCalls: this.avoided,
      loading: this.loading(),
    }),
  );
}
