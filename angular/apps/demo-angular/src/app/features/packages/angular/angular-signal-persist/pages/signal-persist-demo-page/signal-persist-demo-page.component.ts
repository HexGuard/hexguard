import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectPersistedSignal } from '@hexguard/angular-signal-persist';
import { ANGULAR_SIGNAL_PERSIST_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-signal-persist-demo-page',
  templateUrl: './signal-persist-demo-page.component.html',
  styleUrl: './signal-persist-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalPersistDemoPageComponent {
  protected readonly demo = ANGULAR_SIGNAL_PERSIST_DEMO;
  protected readonly theme = injectPersistedSignal<string>('demo-persist-theme', 'light');
  protected readonly count = injectPersistedSignal<number>('demo-persist-count', 0);
  protected readonly snapshotJson = computed(() =>
    formatSnapshot({ theme: this.theme(), count: this.count() }));
}
