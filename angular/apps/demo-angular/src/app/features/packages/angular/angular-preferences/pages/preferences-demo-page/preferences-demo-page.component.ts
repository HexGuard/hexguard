import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectPreferences, pref } from '@hexguard/angular-preferences';
import { ANGULAR_PREFERENCES_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

const DEMO_PREFS = {
  sidebar: pref('demo-prefs-sidebar', true),
  pageSize: pref('demo-prefs-page-size', 20),
} as const;

@Component({
  standalone: true,
  selector: 'demo-preferences-demo-page',
  templateUrl: './preferences-demo-page.component.html',
  styleUrl: './preferences-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreferencesDemoPageComponent {
  protected readonly demo = ANGULAR_PREFERENCES_DEMO;
  protected readonly prefs = injectPreferences(DEMO_PREFS);
  protected readonly snapshotJson = computed(() =>
    formatSnapshot({ sidebar: this.prefs.get('sidebar')(), pageSize: this.prefs.get('pageSize')() }));
}
