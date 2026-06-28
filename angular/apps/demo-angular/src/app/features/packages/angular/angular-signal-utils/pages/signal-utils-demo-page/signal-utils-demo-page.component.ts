import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { computedFrom, injectToggle, throttledSignal } from '@hexguard/angular-signal-utils';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-signal-utils-demo-page',
  templateUrl: './signal-utils-demo-page.component.html',
  styleUrl: './signal-utils-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalUtilsDemoPageComponent {
  protected readonly first = signal('Jane');
  protected readonly last = signal('Doe');
  protected readonly fullName = computedFrom([this.first, this.last], (f, l) => `${f} ${l}`);
  protected readonly toggle = injectToggle(true);
  protected readonly throttled = throttledSignal(0, 1000);
  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      fullName: this.fullName(),
      toggled: this.toggle.value(),
      throttled: this.throttled.value(),
    }));
}
