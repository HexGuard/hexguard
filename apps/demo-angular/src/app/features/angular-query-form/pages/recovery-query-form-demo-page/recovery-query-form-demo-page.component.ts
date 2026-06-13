import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { enumParam, numberParam, queryForm, stringParam } from '@hexguard/angular-query-form';

import { ANGULAR_QUERY_FORM_RECOVERY_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  RECOVERY_INCIDENTS,
  RECOVERY_PAGE_SIZE,
  RECOVERY_SEVERITY_OPTIONS,
  RECOVERY_VIEW_OPTIONS,
  summarizeRecoveryIncidents,
  type RecoveryIncident,
  type RecoverySeverity,
  type RecoveryView,
} from '../../data/recovery-query-form.data';

type RecoveryQueryForm = FormGroup<{
  query: FormControl<string>;
  page: FormControl<number>;
  severity: FormControl<RecoverySeverity>;
  view: FormControl<RecoveryView>;
}>;

@Component({
  standalone: true,
  selector: 'demo-recovery-query-form-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './recovery-query-form-demo-page.component.html',
  styleUrl: './recovery-query-form-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryQueryFormDemoPageComponent {
  readonly demo = ANGULAR_QUERY_FORM_RECOVERY_DEMO;
  readonly severityOptions = RECOVERY_SEVERITY_OPTIONS;
  readonly viewOptions = RECOVERY_VIEW_OPTIONS;

  // demo-snippet:start query-form-recovery-demo
  readonly form: RecoveryQueryForm = new FormGroup({
    query: new FormControl('', { nonNullable: true }),
    page: new FormControl(1, { nonNullable: true }),
    severity: new FormControl<RecoverySeverity>('all', { nonNullable: true }),
    view: new FormControl<RecoveryView>('summary', { nonNullable: true }),
  });
  readonly query = queryForm(
    this.form,
    {
      query: stringParam(''),
      page: numberParam(1),
      severity: enumParam(RECOVERY_SEVERITY_OPTIONS, 'all'),
      view: enumParam(RECOVERY_VIEW_OPTIONS, 'summary'),
    },
    {
      history: 'push',
      invalidParamBehavior: 'removeInvalid',
      removeDefaultsFromUrl: true,
      resetKeysOnChange: {
        query: ['page'],
        severity: ['page'],
        view: ['page'],
      },
    },
  );
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly filteredIncidents = computed<readonly RecoveryIncident[]>(() => {
    const snapshot = this.query.snapshot();
    const search = snapshot.query.trim().toLowerCase();

    return RECOVERY_INCIDENTS.filter((incident) => {
      const matchesSeverity =
        snapshot.severity === 'all' || incident.severity === snapshot.severity;
      const matchesSearch =
        search.length === 0 ||
        [incident.id, incident.service, incident.title, incident.owner].some((value) =>
          value.toLowerCase().includes(search),
        );

      return matchesSeverity && matchesSearch;
    });
  });
  readonly totalResults = computed(() => this.filteredIncidents().length);
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalResults() / RECOVERY_PAGE_SIZE)),
  );
  readonly currentPage = computed(() => Math.min(this.query.urlState.page(), this.totalPages()));
  readonly pagedIncidents = computed(() => {
    const start = (this.currentPage() - 1) * RECOVERY_PAGE_SIZE;

    return this.filteredIncidents().slice(start, start + RECOVERY_PAGE_SIZE);
  });
  readonly resultSummary = computed(() =>
    summarizeRecoveryIncidents(
      this.totalResults(),
      this.currentPage(),
      this.pagedIncidents().length,
    ),
  );
  readonly cleanupSummary = computed(() => {
    const snapshot = this.query.snapshot();

    return `Invalid query params are removed after parse. Current view: ${snapshot.view}, severity: ${snapshot.severity}.`;
  });
  readonly snapshotJson = computed(() => formatSnapshot(this.query.snapshot()));
  // demo-snippet:end query-form-recovery-demo

  goToPage(page: number): void {
    const nextPage = Math.max(1, Math.min(page, this.totalPages()));
    this.form.controls.page.setValue(nextPage);
  }

  resetFilters(): void {
    this.query.reset();
  }
}
