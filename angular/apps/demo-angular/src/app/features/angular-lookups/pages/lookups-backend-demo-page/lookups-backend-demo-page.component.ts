import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  HexguardLookupLabelPipe,
  injectLookups,
  provideHexGuardLookups,
} from '@hexguard/angular-lookups';

import { ANGULAR_LOOKUPS_BACKEND_DEMO } from '../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../shared/formatting';
import {
  PRODUCT_LOOKUP_CATALOG_SCENARIO_OPTIONS,
  PRODUCT_LOOKUP_SUMMARY_ROWS,
  PRODUCT_LOOKUPS_BACKEND_DEMO_REPOSITORY,
  type ProductLookupCatalogScenario,
} from '../../data/lookups-demo.data';

@Component({
  standalone: true,
  selector: 'demo-lookups-backend-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
    HexguardLookupLabelPipe,
  ],
  providers: [
    provideHexGuardLookups({
      load: () => PRODUCT_LOOKUPS_BACKEND_DEMO_REPOSITORY.loadCatalog(),
    }),
  ],
  templateUrl: './lookups-backend-demo-page.component.html',
  styleUrl: './lookups-backend-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupsBackendDemoPageComponent {
  readonly demo = ANGULAR_LOOKUPS_BACKEND_DEMO;
  readonly repository = PRODUCT_LOOKUPS_BACKEND_DEMO_REPOSITORY;
  readonly lookups = injectLookups();
  readonly lookupState = this.lookups.state;
  readonly products = PRODUCT_LOOKUP_SUMMARY_ROWS;

  // demo-snippet:start lookups-backend-demo
  readonly scenarioOptions = PRODUCT_LOOKUP_CATALOG_SCENARIO_OPTIONS;
  readonly apiBaseUrl = this.repository.apiBaseUrl;
  readonly selectedScenario = this.repository.scenario;
  readonly requestUrl = this.repository.lastResolvedUrl;
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly errorMessage = computed(() => {
    const error = this.lookupState.error();

    if (error == null) {
      return null;
    }

    return error instanceof Error ? error.message : 'Unknown lookup demo error.';
  });
  readonly resolvedRows = computed(() =>
    this.products.map((product) => ({
      sku: product.sku,
      name: product.name,
      category: this.lookups.label('categories', product.categoryKey) ?? 'Unknown category',
      supplier: this.lookups.label('suppliers', product.supplierKey) ?? 'Unknown supplier',
      lifecycle:
        this.lookups.label('lifecycleStates', product.lifecycleKey) ?? 'Unknown lifecycle state',
    })),
  );
  readonly statusSummary = computed(() => {
    const requestUrl = this.requestUrl();

    if (this.lookupState.isIdle()) {
      return 'Idle. Load a scenario from the shared .NET sample API to hydrate the Angular lookup cache.';
    }

    if (this.lookupState.isLoading()) {
      return requestUrl == null
        ? 'Loading the first catalog from the shared sample API.'
        : `Loading the first catalog from ${requestUrl}.`;
    }

    if (this.lookupState.isReloading()) {
      return 'Refreshing labels from the sample API while the previous successful catalog stays visible.';
    }

    if (this.lookupState.isError() && this.lookupState.hasLoaded()) {
      return 'Backend refresh failed. The previous labels stay visible while the error explains the integration issue.';
    }

    if (this.lookupState.isError()) {
      return (
        this.errorMessage() ?? 'The sample API request failed before any catalog was available.'
      );
    }

    return `Catalog ${this.lookups.version() ?? 'unknown'} loaded from the shared sample API and resolved ${this.products.length} display rows.`;
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      apiBaseUrl: this.apiBaseUrl(),
      scenario: this.selectedScenario(),
      requestUrl: this.requestUrl(),
      requestCount: this.repository.loadCount(),
      status: this.lookupState.status(),
      version: this.lookups.version(),
      error: this.errorMessage(),
      resolvedRows: this.resolvedRows(),
    }),
  );
  // demo-snippet:end lookups-backend-demo

  readonly isBusy = computed(() => this.lookupState.isLoading() || this.lookupState.isReloading());

  constructor() {
    this.repository.reset();
  }

  updateApiBaseUrl(value: string): void {
    this.repository.setApiBaseUrl(value);
  }

  updateScenario(value: string): void {
    this.setScenario(value as ProductLookupCatalogScenario);
  }

  loadSelectedScenario(): void {
    const promise = this.lookupState.hasLoaded()
      ? this.lookups.reload()
      : this.lookups.ensureLoaded();

    void promise.catch(() => undefined);
  }

  reloadSelectedScenario(): void {
    const promise = this.lookups.reload();

    void promise.catch(() => undefined);
  }

  invalidateCatalog(): void {
    this.lookups.invalidate();
  }

  private setScenario(scenario: ProductLookupCatalogScenario): void {
    switch (scenario) {
      case 'refreshed':
        this.repository.useRefreshed();
        break;
      case 'invalid':
        this.repository.useInvalid();
        break;
      case 'base':
      default:
        this.repository.useBase();
        break;
    }
  }
}
