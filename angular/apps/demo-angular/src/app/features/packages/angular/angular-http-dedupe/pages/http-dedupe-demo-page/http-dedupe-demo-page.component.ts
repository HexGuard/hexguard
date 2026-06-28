import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { createHttpDedupe } from '@hexguard/angular-http-dedupe';
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
  protected result = '';
  protected callCount = 0;

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({ result: this.result, callCount: this.callCount }));

  async onExecute(): Promise<void> {
    this.callCount++;
    const dedupe = createHttpDedupe<string>({ maxAgeMs: 3000 });
    const r = await dedupe.execute(
      { method: 'GET', url: '/api/demo' },
      () => Promise.resolve(`Response #${this.callCount}`),
    );
    this.result = r;
  }
}
