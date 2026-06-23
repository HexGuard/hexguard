import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectScrollState, scrollTo } from '@hexguard/angular-scroll-state';
import { ANGULAR_SCROLL_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-scroll-state-demo-page',
  templateUrl: './scroll-state-demo-page.component.html',
  styleUrl: './scroll-state-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollStateDemoPageComponent {
  protected readonly demo = ANGULAR_SCROLL_STATE_DEMO;
  protected readonly scrollState = injectScrollState();

  protected save(): void {
    this.scrollState.save('demo-scroll');
  }

  protected restore(): void {
    const y = this.scrollState.restore('demo-scroll');
    if (y !== null) {
      scrollTo({ y });
    }
  }

  protected scrollToTop(): void {
    scrollTo({ y: 0 });
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      scrollY: this.scrollState.scrollY(),
    }),
  );
}
