import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectRouteMemory } from '@hexguard/angular-route-memory';
import { ANGULAR_ROUTE_MEMORY_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-route-memory-demo-page',
  templateUrl: './route-memory-demo-page.component.html',
  styleUrl: './route-memory-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteMemoryDemoPageComponent {
  protected readonly demo = ANGULAR_ROUTE_MEMORY_DEMO;
  protected readonly memory = injectRouteMemory();

  protected save(key: string): void {
    this.memory.save(key, { saved: true, timestamp: Date.now() });
  }

  protected restore(key: string): string {
    const value = this.memory.restore(key);
    return value ? JSON.stringify(value) : 'null';
  }

  protected clearKey(key: string): void {
    this.memory.clear(key);
  }

  protected clearAll(): void {
    this.memory.clearAll();
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      hasMemory: this.memory.hasMemory('list-1')(),
    }),
  );
}
