import { ChangeDetectionStrategy, Component, computed } from '@angular/core';

import {
  HexguardLookupLabelPipe,
  injectLookups,
  provideHexGuardLookups,
} from '@hexguard/angular-lookups';

import { ANGULAR_LOOKUPS_SUMMARY_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../../../shared/formatting';
import {
  PRODUCT_LOOKUP_SUMMARY_ROWS,
  PRODUCT_LOOKUPS_DEMO_REPOSITORY,
  type ProductLookupCatalogScenario,
} from '../../data/lookups-demo.data';

@Component({
  standalone: true,
  selector: 'demo-lookups-summary-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    HexguardLookupLabelPipe,
  ],
  providers: [
    provideHexGuardLookups({
      load: () => PRODUCT_LOOKUPS_DEMO_REPOSITORY.loadCatalog(),
    }),
  ],
  templateUrl: './lookups-summary-demo-page.component.html',
  styleUrl: './lookups-summary-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupsSummaryDemoPageComponent {
  readonly demo = ANGULAR_LOOKUPS_SUMMARY_DEMO;
  readonly repository = PRODUCT_LOOKUPS_DEMO_REPOSITORY;
  readonly lookups = injectLookups();
  readonly lookupState = this.lookups.state;
  readonly products = PRODUCT_LOOKUP_SUMMARY_ROWS;

  // demo-snippet:start lookups-summary-demo
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
    if (this.lookupState.isIdle()) {
      return 'Idle. Load the catalog to resolve table labels through the shared pipe and facade.';
    }

    if (this.lookupState.isLoading()) {
      return 'Loading the product catalog for the detail grid.';
    }

    if (this.lookupState.isReloading()) {
      return 'Refreshing labels while the existing grid stays visible.';
    }

    if (this.lookupState.isError() && this.lookupState.hasLoaded()) {
      return 'Refresh failed. The last successful label set is still visible in the grid.';
    }

    if (this.lookupState.isError()) {
      return (
        this.errorMessage() ?? 'The first lookup load failed before any labels were available.'
      );
    }

    return `Catalog ${this.lookups.version() ?? 'unknown'} resolved ${this.products.length} rows, including explicit fallbacks for missing keys.`;
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      scenario: this.repository.scenario(),
      requestCount: this.repository.loadCount(),
      status: this.lookupState.status(),
      version: this.lookups.version(),
      error: this.errorMessage(),
      resolvedRows: this.resolvedRows(),
    }),
  );
  // demo-snippet:end lookups-summary-demo

  readonly isBusy = computed(() => this.lookupState.isLoading() || this.lookupState.isReloading());

  constructor() {
    this.repository.reset();
  }

  loadBaseCatalog(): void {
    this.runScenario('base');
  }

  reloadRefreshedCatalog(): void {
    this.runScenario('refreshed');
  }

  invalidateCatalog(): void {
    this.lookups.invalidate();
  }

  private runScenario(scenario: ProductLookupCatalogScenario): void {
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

    const promise = this.lookupState.hasLoaded()
      ? this.lookups.reload()
      : this.lookups.ensureLoaded();

    void promise.catch(() => undefined);
  }
}
