import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
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
  protected readonly recent = injectRecentlyViewed({ maxItems: 5 });
  protected readonly snapshotJson = computed(() => formatSnapshot({ items: this.recent.items(), count: this.recent.count() }));
  protected itemCounter = 1;
  protected addItem(): void {
    this.recent.add({ id: `item-${this.itemCounter}`, label: `Item ${this.itemCounter}`, viewedAt: Date.now() });
    this.itemCounter++;
  }
}
