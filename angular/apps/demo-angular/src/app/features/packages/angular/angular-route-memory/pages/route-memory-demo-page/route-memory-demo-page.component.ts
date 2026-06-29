import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
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

  /** Tracks the saved value for each key so the snapshot is meaningful. */
  private readonly savedContents = signal<Record<string, Record<string, unknown> | null>>({});

  /** The last restored value, formatted for display. */
  protected readonly lastRestored = signal<string | null>(null);

  protected save(key: string): void {
    const value = { saved: true, timestamp: Date.now() };
    this.memory.save(key, value);
    this.savedContents.update((m) => ({ ...m, [key]: value }));
    this.lastRestored.set(null);
  }

  protected restore(key: string): void {
    const value = this.memory.restore(key);
    this.lastRestored.set(value ? JSON.stringify(value, null, 2) : 'null');
  }

  protected clearKey(key: string): void {
    this.memory.clear(key);
    this.savedContents.update((m) => ({ ...m, [key]: null }));
    this.lastRestored.set(null);
  }

  protected clearAll(): void {
    this.memory.clearAll();
    this.savedContents.set({});
    this.lastRestored.set(null);
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      savedKeys: Object.entries(this.savedContents())
        .filter(([, v]) => v !== null)
        .map(([k]) => k),
      lastRestored: this.lastRestored(),
    }),
  );
}
