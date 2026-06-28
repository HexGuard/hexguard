import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectDirtyState } from '@hexguard/angular-dirty-state';
import { ANGULAR_DIRTY_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-dirty-state-demo-page',
  templateUrl: './dirty-state-demo-page.component.html',
  styleUrl: './dirty-state-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent, DemoNavigationStripComponent,
    DemoPageLayoutComponent, DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirtyStateDemoPageComponent {
  protected readonly demo = ANGULAR_DIRTY_STATE_DEMO;
  protected readonly dirty = injectDirtyState();
  protected readonly snapshotJson = computed(() =>
    formatSnapshot({ isDirty: this.dirty.isDirty(), snapshot: this.dirty.snapshot() }));
}
