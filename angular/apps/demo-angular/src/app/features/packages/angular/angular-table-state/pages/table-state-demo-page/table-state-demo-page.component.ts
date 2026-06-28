import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { injectTableState } from '@hexguard/angular-table-state';
import { ANGULAR_TABLE_STATE_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-table-state-demo-page',
  templateUrl: './table-state-demo-page.component.html',
  styleUrl: './table-state-demo-page.component.css',
  imports: [
    DemoInspectorPanelComponent, DemoNavigationStripComponent,
    DemoPageLayoutComponent, DemoStatusStripComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableStateDemoPageComponent {
  protected readonly demo = ANGULAR_TABLE_STATE_DEMO;
  protected readonly table = injectTableState();
  protected readonly snapshotJson = computed(() =>
    formatSnapshot({
      sortColumn: this.table.sortColumn(), sortDirection: this.table.sortDirection(),
      page: this.table.pagination.page(), filters: this.table.filters(),
      selectedCount: this.table.selection.selectedCount(),
    }));
}
