import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { injectLookups, provideHexGuardLookups } from '@hexguard/angular-lookups';

import { ANGULAR_LOOKUPS_EDITOR_DEMO } from '../../../../../../demo-registry';
import { DemoInspectorPanelComponent } from '../../../../../../shared/components/demo-inspector-panel.component';
import { DemoNavigationStripComponent } from '../../../../../../shared/components/demo-navigation-strip.component';
import { DemoPageLayoutComponent } from '../../../../../../shared/components/demo-page-layout.component';
import { DemoStatusStripComponent } from '../../../../../../shared/components/demo-status-strip.component';
import { createTrackedCurrentUrl } from '../../../../../../shared/current-url.signal';
import { formatSnapshot } from '../../../../../../shared/formatting';
import {
  PRODUCT_LOOKUP_EDITOR_DRAFT,
  PRODUCT_LOOKUPS_DEMO_REPOSITORY,
  type ProductLookupCatalogScenario,
} from '../../data/lookups-demo.data';

@Component({
  standalone: true,
  selector: 'demo-lookups-editor-demo-page',
  imports: [
    DemoInspectorPanelComponent,
    DemoNavigationStripComponent,
    DemoPageLayoutComponent,
    DemoStatusStripComponent,
    FormsModule,
  ],
  providers: [
    provideHexGuardLookups({
      load: () => PRODUCT_LOOKUPS_DEMO_REPOSITORY.loadCatalog(),
    }),
  ],
  templateUrl: './lookups-editor-demo-page.component.html',
  styleUrl: './lookups-editor-demo-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LookupsEditorDemoPageComponent {
  readonly demo = ANGULAR_LOOKUPS_EDITOR_DEMO;
  readonly repository = PRODUCT_LOOKUPS_DEMO_REPOSITORY;
  readonly lookups = injectLookups();
  readonly lookupState = this.lookups.state;

  // demo-snippet:start lookups-editor-demo
  readonly draft = PRODUCT_LOOKUP_EDITOR_DRAFT;
  readonly categoryKey = signal(PRODUCT_LOOKUP_EDITOR_DRAFT.categoryKey);
  readonly supplierKey = signal(PRODUCT_LOOKUP_EDITOR_DRAFT.supplierKey);
  readonly lifecycleKey = signal(PRODUCT_LOOKUP_EDITOR_DRAFT.lifecycleKey);
  readonly categoryOptions = this.lookups.optionsSignal('categories');
  readonly supplierOptions = this.lookups.optionsSignal('suppliers');
  readonly lifecycleOptions = this.lookups.optionsSignal('lifecycleStates');
  readonly currentUrl = createTrackedCurrentUrl(this.demo.route);
  readonly errorMessage = computed(() => {
    const error = this.lookupState.error();

    if (error == null) {
      return null;
    }

    return error instanceof Error ? error.message : 'Unknown lookup demo error.';
  });
  readonly selectedSummary = computed(() => ({
    category: this.lookups.label('categories', this.categoryKey()) ?? 'Unknown category',
    supplier: this.lookups.label('suppliers', this.supplierKey()) ?? 'Unknown supplier',
    lifecycle:
      this.lookups.label('lifecycleStates', this.lifecycleKey()) ?? 'Unknown lifecycle state',
  }));
  readonly statusSummary = computed(() => {
    if (this.lookupState.isIdle()) {
      return 'Idle. Load the product catalog to populate the form options.';
    }

    if (this.lookupState.isLoading()) {
      return 'Loading the product catalog for the first time.';
    }

    if (this.lookupState.isReloading()) {
      return 'Refreshing labels and options while the previous catalog stays visible.';
    }

    if (this.lookupState.isError() && this.lookupState.hasLoaded()) {
      return 'Catalog refresh failed. The previous options stay visible until the next successful reload.';
    }

    if (this.lookupState.isError()) {
      return (
        this.errorMessage() ?? 'The first lookup load failed before any catalog was available.'
      );
    }

    return `Catalog ${this.lookups.version() ?? 'unknown'} loaded with ${this.categoryOptions().length} categories, ${this.supplierOptions().length} suppliers, and ${this.lifecycleOptions().length} lifecycle states.`;
  });
  readonly snapshotJson = computed(() =>
    formatSnapshot({
      scenario: this.repository.scenario(),
      requestCount: this.repository.loadCount(),
      status: this.lookupState.status(),
      version: this.lookups.version(),
      error: this.errorMessage(),
      selectedKeys: {
        sku: this.draft.sku,
        name: this.draft.name,
        category: this.categoryKey(),
        supplier: this.supplierKey(),
        lifecycle: this.lifecycleKey(),
      },
      selectedLabels: this.selectedSummary(),
      collectionCounts: {
        categories: this.categoryOptions().length,
        suppliers: this.supplierOptions().length,
        lifecycleStates: this.lifecycleOptions().length,
      },
    }),
  );
  // demo-snippet:end lookups-editor-demo

  readonly isBusy = computed(() => this.lookupState.isLoading() || this.lookupState.isReloading());

  constructor() {
    this.repository.reset();
  }

  updateCategoryKey(value: string): void {
    this.categoryKey.set(value);
  }

  updateSupplierKey(value: string): void {
    this.supplierKey.set(value);
  }

  updateLifecycleKey(value: string): void {
    this.lifecycleKey.set(value);
  }

  loadBaseCatalog(): void {
    this.runScenario('base');
  }

  reloadRefreshedCatalog(): void {
    this.runScenario('refreshed');
  }

  loadInvalidCatalog(): void {
    this.runScenario('invalid');
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
