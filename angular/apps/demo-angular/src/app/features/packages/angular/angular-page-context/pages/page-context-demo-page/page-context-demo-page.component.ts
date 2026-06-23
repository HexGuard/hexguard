import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectPageContext } from '@hexguard/angular-page-context';
import { ANGULAR_PAGE_CONTEXT_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-page-context-demo-page',
  templateUrl: './page-context-demo-page.component.html',
  styleUrl: './page-context-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContextDemoPageComponent {
  protected readonly demo = ANGULAR_PAGE_CONTEXT_DEMO;
  protected readonly pageCtx = injectPageContext();

  protected setDashboard(): void {
    this.pageCtx.set({
      title: 'Dashboard',
      breadcrumbs: [{ label: 'Home', route: '/' }, { label: 'Dashboard' }],
      tabs: [
        { id: 'overview', label: 'Overview' },
        { id: 'analytics', label: 'Analytics' },
      ],
      actions: [{ id: 'refresh', label: 'Refresh' }],
    });
  }

  protected setOrders(): void {
    this.pageCtx.set({
      title: 'Order Details',
      breadcrumbs: [{ label: 'Orders', route: '/orders' }, { label: 'Order #42' }],
      actions: [
        { id: 'edit', label: 'Edit' },
        { id: 'delete', label: 'Delete' },
      ],
    });
  }

  protected clear(): void {
    this.pageCtx.set({ title: '', breadcrumbs: [], tabs: [], actions: [] });
  }

  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      title: this.pageCtx.title(),
      breadcrumbs: this.pageCtx.breadcrumbs(),
      activeTab: this.pageCtx.activeTab(),
      actions: this.pageCtx.actions(),
    }),
  );
}
