import { signal } from '@angular/core';

import type { LookupCatalog } from '@hexguard/angular-lookups';

export interface ProductLookupDraft {
  readonly sku: string;
  readonly name: string;
  readonly categoryKey: string;
  readonly supplierKey: string;
  readonly lifecycleKey: string;
}

export interface ProductLookupSummaryRow {
  readonly sku: string;
  readonly name: string;
  readonly categoryKey: string;
  readonly supplierKey: string;
  readonly lifecycleKey: string;
}

export type ProductLookupCatalogScenario = 'base' | 'refreshed' | 'invalid';

export interface ProductLookupCatalogScenarioOption {
  readonly value: ProductLookupCatalogScenario;
  readonly label: string;
}

export const PRODUCT_LOOKUP_CATALOG_SCENARIO_OPTIONS: readonly ProductLookupCatalogScenarioOption[] =
  Object.freeze([
    Object.freeze({ value: 'base', label: 'Base catalog' }),
    Object.freeze({ value: 'refreshed', label: 'Refreshed labels' }),
    Object.freeze({ value: 'invalid', label: 'Invalid payload' }),
  ]);

export const LOOKUPS_SAMPLE_API_BASE_URL = 'http://127.0.0.1:5074';

export const PRODUCT_LOOKUP_EDITOR_DRAFT: ProductLookupDraft = Object.freeze({
  sku: 'HG-2401',
  name: 'Field Dock Pro',
  categoryKey: 'hardware',
  supplierKey: 'contoso',
  lifecycleKey: 'active',
});

export const PRODUCT_LOOKUP_SUMMARY_ROWS: readonly ProductLookupSummaryRow[] = Object.freeze([
  {
    sku: 'HG-2401',
    name: 'Field Dock Pro',
    categoryKey: 'hardware',
    supplierKey: 'contoso',
    lifecycleKey: 'active',
  },
  {
    sku: 'HG-2402',
    name: 'Workflow Studio',
    categoryKey: 'software',
    supplierKey: 'northwind',
    lifecycleKey: 'draft',
  },
  {
    sku: 'HG-2403',
    name: 'Care Coverage Plus',
    categoryKey: 'services',
    supplierKey: 'missing-supplier',
    lifecycleKey: 'retired',
  },
]);

export const PRODUCT_LOOKUPS_BASE_CATALOG: LookupCatalog = Object.freeze({
  metadata: Object.freeze({
    version: 'products-2026-06-15',
    generatedAtUtc: '2026-06-15T00:00:00Z',
  }),
  collections: Object.freeze([
    Object.freeze({
      key: 'categories',
      revision: 'categories-r1',
      items: Object.freeze([
        Object.freeze({ key: 'hardware', label: 'Hardware' }),
        Object.freeze({ key: 'software', label: 'Software' }),
        Object.freeze({ key: 'services', label: 'Services' }),
      ]),
    }),
    Object.freeze({
      key: 'suppliers',
      revision: 'suppliers-r3',
      items: Object.freeze([
        Object.freeze({ key: 'contoso', label: 'Contoso Industrial' }),
        Object.freeze({ key: 'northwind', label: 'Northwind Supply' }),
        Object.freeze({ key: 'tailspin', label: 'Tailspin Components' }),
      ]),
    }),
    Object.freeze({
      key: 'lifecycleStates',
      revision: 'lifecycle-r2',
      items: Object.freeze([
        Object.freeze({ key: 'draft', label: 'Draft' }),
        Object.freeze({ key: 'active', label: 'Active' }),
        Object.freeze({ key: 'retired', label: 'Retired', isActive: false }),
      ]),
    }),
  ]),
});

export const PRODUCT_LOOKUPS_REFRESHED_CATALOG: LookupCatalog = Object.freeze({
  metadata: Object.freeze({
    version: 'products-2026-07-01',
    generatedAtUtc: '2026-07-01T00:00:00Z',
  }),
  collections: Object.freeze([
    Object.freeze({
      key: 'categories',
      revision: 'categories-r2',
      items: Object.freeze([
        Object.freeze({ key: 'hardware', label: 'Hardware and Devices' }),
        Object.freeze({ key: 'software', label: 'Software' }),
        Object.freeze({ key: 'services', label: 'Services and Support' }),
      ]),
    }),
    Object.freeze({
      key: 'suppliers',
      revision: 'suppliers-r4',
      items: Object.freeze([
        Object.freeze({ key: 'contoso', label: 'Contoso Global' }),
        Object.freeze({ key: 'northwind', label: 'Northwind Supply' }),
        Object.freeze({ key: 'tailspin', label: 'Tailspin Components' }),
      ]),
    }),
    Object.freeze({
      key: 'lifecycleStates',
      revision: 'lifecycle-r3',
      items: Object.freeze([
        Object.freeze({ key: 'draft', label: 'Draft' }),
        Object.freeze({ key: 'active', label: 'Active' }),
        Object.freeze({ key: 'retired', label: 'Archived', isActive: false }),
      ]),
    }),
  ]),
});

function waitForDemoLatency(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, durationMs);
  });
}

function createInvalidCatalog(): LookupCatalog {
  return {
    metadata: {
      version: 'products-invalid',
      generatedAtUtc: '2026-07-02T00:00:00Z',
    },
    collections: [
      {
        key: 'categories',
        revision: 'categories-r3',
        items: [{ key: 'hardware', label: 'Hardware' }],
      },
      {
        key: 'categories',
        revision: 'categories-r4',
        items: [{ key: 'software', label: 'Software' }],
      },
    ],
  };
}

function normalizeSampleApiBaseUrl(value: string): string {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return LOOKUPS_SAMPLE_API_BASE_URL;
  }

  return trimmedValue.replace(/\/+$/, '');
}

export function buildAngularLookupsSampleApiCatalogUrl(
  apiBaseUrl: string,
  scenario: ProductLookupCatalogScenario,
): string {
  const normalizedBaseUrl = normalizeSampleApiBaseUrl(apiBaseUrl);
  const requestUrl = new URL('/api/angular-lookups/catalog', `${normalizedBaseUrl}/`);

  requestUrl.searchParams.set('scenario', scenario);

  return requestUrl.toString();
}

export class ProductLookupsDemoRepository {
  readonly loadCount = signal(0);
  readonly scenario = signal<ProductLookupCatalogScenario>('base');

  reset(): void {
    this.loadCount.set(0);
    this.scenario.set('base');
  }

  useBase(): void {
    this.scenario.set('base');
  }

  useRefreshed(): void {
    this.scenario.set('refreshed');
  }

  useInvalid(): void {
    this.scenario.set('invalid');
  }

  async loadCatalog(): Promise<LookupCatalog> {
    this.loadCount.update((count) => count + 1);

    await waitForDemoLatency(325);

    switch (this.scenario()) {
      case 'refreshed':
        return PRODUCT_LOOKUPS_REFRESHED_CATALOG;
      case 'invalid':
        return createInvalidCatalog();
      case 'base':
      default:
        return PRODUCT_LOOKUPS_BASE_CATALOG;
    }
  }
}

export const PRODUCT_LOOKUPS_DEMO_REPOSITORY = new ProductLookupsDemoRepository();

export class ProductLookupsBackendDemoRepository {
  readonly loadCount = signal(0);
  readonly scenario = signal<ProductLookupCatalogScenario>('base');
  readonly apiBaseUrl = signal(LOOKUPS_SAMPLE_API_BASE_URL);
  readonly lastResolvedUrl = signal<string | null>(null);

  reset(): void {
    this.loadCount.set(0);
    this.scenario.set('base');
    this.apiBaseUrl.set(LOOKUPS_SAMPLE_API_BASE_URL);
    this.lastResolvedUrl.set(null);
  }

  setApiBaseUrl(value: string): void {
    this.apiBaseUrl.set(normalizeSampleApiBaseUrl(value));
  }

  useBase(): void {
    this.scenario.set('base');
  }

  useRefreshed(): void {
    this.scenario.set('refreshed');
  }

  useInvalid(): void {
    this.scenario.set('invalid');
  }

  async loadCatalog(): Promise<LookupCatalog> {
    this.loadCount.update((count) => count + 1);

    const requestUrl = buildAngularLookupsSampleApiCatalogUrl(this.apiBaseUrl(), this.scenario());
    this.lastResolvedUrl.set(requestUrl);

    const response = await fetch(requestUrl, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Sample API request to ${requestUrl} failed with ${response.status} ${response.statusText}.`,
      );
    }

    return (await response.json()) as LookupCatalog;
  }
}

export const PRODUCT_LOOKUPS_BACKEND_DEMO_REPOSITORY = new ProductLookupsBackendDemoRepository();
