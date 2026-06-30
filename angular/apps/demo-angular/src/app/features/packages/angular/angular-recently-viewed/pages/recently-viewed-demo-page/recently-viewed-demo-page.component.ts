import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { injectRecentlyViewed } from '@hexguard/angular-recently-viewed';
import { ANGULAR_RECENTLY_VIEWED_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-recently-viewed-demo-page',
  templateUrl: './recently-viewed-demo-page.component.html',
  styleUrl: './recently-viewed-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentlyViewedDemoPageComponent {
  protected readonly demo = ANGULAR_RECENTLY_VIEWED_DEMO;
  protected readonly recent = injectRecentlyViewed({ maxItems: 10 });
  protected readonly dedupLabel = signal<'replace' | 'ignore' | 'allow-duplicates'>('replace');
  protected itemCounter = signal(1);

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      items: this.recent.items().map(i => ({ id: i.id, label: i.label, route: i.route, meta: i.meta, viewedAt: i.viewedAt })),
      count: this.recent.count(),
      dedup: this.dedupLabel(),
    }));

  protected addItem(): void {
    const n = this.itemCounter();
    this.recent.add({
      id: `item-${n}`,
      label: `Item #${n}`,
      route: `/items/${n}`,
      viewedAt: Date.now(),
      meta: { category: n % 2 === 0 ? 'even' : 'odd' },
    });
    this.itemCounter.set(n + 1);
  }

  protected getMetaCategory(meta: Record<string, unknown> | null): string {
    return meta?.['category'] as string ?? '-';
  }

  protected addDuplicate(): void {
    const ts = Date.now() % 1000;
    this.recent.add({ id: 'demo-dup', label: `Dup #${ts}`, viewedAt: Date.now() });
    this.recent.add({ id: 'demo-dup', label: `Dup #${ts}`, viewedAt: Date.now() });
  }
}
