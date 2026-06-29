import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { querySignalForm, stringParam, numberParam } from '@hexguard/angular-query-signal-forms';
import { ANGULAR_QUERY_SIGNAL_FORMS_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { formatSnapshot } from '../../../../../../shared/formatting';

@Component({
  standalone: true,
  selector: 'demo-query-signal-forms-demo-page',
  templateUrl: './query-signal-forms-demo-page.component.html',
  styleUrl: './query-signal-forms-demo-page.component.css',
  imports: [DemoInspectorPanelComponent, DemoNavigationStripComponent, DemoPageLayoutComponent, DemoStatusStripComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuerySignalFormsDemoPageComponent {
  protected readonly demo = ANGULAR_QUERY_SIGNAL_FORMS_DEMO;
  protected readonly query = querySignalForm({ search: stringParam(''), page: numberParam(1) }, { history: 'replace' });
  protected readonly snapshotJson = computed(() => formatSnapshot(this.query.snapshot()));
}
