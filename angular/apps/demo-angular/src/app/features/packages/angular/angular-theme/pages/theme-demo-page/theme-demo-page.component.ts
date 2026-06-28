import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectTheme } from '@hexguard/angular-theme';
import { ANGULAR_THEME_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-theme-demo-page',
  templateUrl: './theme-demo-page.component.html',
  styleUrl: './theme-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeDemoPageComponent {
  protected readonly demo = ANGULAR_THEME_DEMO;
  protected readonly theme = injectTheme();

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      mode: this.theme.mode(),
      effectiveTheme: this.theme.effectiveTheme(),
      isDark: this.theme.isDark(),
      isLight: this.theme.isLight(),
      dataTheme: typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') : 'ssr',
    }),
  );
}
