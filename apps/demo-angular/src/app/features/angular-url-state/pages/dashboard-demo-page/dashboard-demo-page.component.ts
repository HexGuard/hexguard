import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { booleanParam, dateIsoParam, enumParam, urlState } from '@hexguard/angular-url-state';

import { ANGULAR_URL_STATE_DASHBOARD_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  TAB_OPTIONS,
  createMetrics,
  formatDateInput,
  parseDateInput,
  startOfUtcDay,
  type DashboardTab,
  type MetricCard,
} from '../../data/dashboard-demo.data';

@Component({
  standalone: true,
  selector: 'demo-dashboard-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
  ],
  templateUrl: './dashboard-demo-page.component.html',
  styleUrl: './dashboard-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDemoPageComponent {
  readonly demo = ANGULAR_URL_STATE_DASHBOARD_DEMO;
  readonly tabs = TAB_OPTIONS;

  // demo-snippet:start dashboard-demo-state
  readonly state = urlState(
    {
      startDate: dateIsoParam(),
      endDate: dateIsoParam(),
      showArchived: booleanParam(false),
      tab: enumParam(TAB_OPTIONS, 'overview'),
    },
    {
      history: 'push',
      removeDefaultsFromUrl: true,
    },
  );
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly startDateValue = computed(() => formatDateInput(this.state.startDate()));
  readonly endDateValue = computed(() => formatDateInput(this.state.endDate()));
  readonly snapshotJson = computed(() => formatSnapshot(this.state.snapshot()));
  readonly rangeLabel = computed(() => {
    const start = this.startDateValue();
    const end = this.endDateValue();

    if (!start && !end) {
      return 'All time';
    }

    return `${start || '...'} to ${end || '...'}`;
  });
  readonly metrics = computed<readonly MetricCard[]>(() =>
    createMetrics(
      this.state.tab(),
      this.state.startDate(),
      this.state.endDate(),
      this.state.showArchived(),
    ),
  );
  // demo-snippet:end dashboard-demo-state

  selectTab(tab: DashboardTab): void {
    this.state.tab.set(tab);
  }

  updateStartDate(value: string): void {
    this.state.startDate.set(parseDateInput(value));
  }

  updateEndDate(value: string): void {
    this.state.endDate.set(parseDateInput(value));
  }

  toggleArchived(value: boolean): void {
    this.state.showArchived.set(value);
  }

  applyPreset(days: number): void {
    const end = startOfUtcDay(new Date());
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));

    this.state.patch({
      startDate: start,
      endDate: end,
    });
  }

  clearRange(): void {
    this.state.patch({ startDate: null, endDate: null });
  }
}
