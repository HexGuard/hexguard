import { getGeneratedCurrentPackage } from './generated/package-catalog';

export interface DemoLink {
  readonly label: string;
  readonly href: string;
}

export interface DemoCodeSample {
  readonly snippetId: string;
  readonly label: string;
  readonly description: string;
}

export interface DemoPageEntry {
  readonly id: string;
  readonly packageId: string;
  readonly route: string;
  readonly legacyRoute: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly docsLinks: readonly DemoLink[];
  readonly codeSample: DemoCodeSample;
}

export interface DemoPackageEntry {
  readonly id: string;
  readonly route: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly docsLinks: readonly DemoLink[];
  readonly demos: readonly DemoPageEntry[];
}

const ANGULAR_URL_STATE_CATALOG = getGeneratedCurrentPackage('angular-url-state');
const ANGULAR_QUERY_FORM_CATALOG = getGeneratedCurrentPackage('angular-query-form');
const ANGULAR_ASYNC_STATE_CATALOG = getGeneratedCurrentPackage('angular-async-state');
const ANGULAR_LOOKUPS_CATALOG = getGeneratedCurrentPackage('angular-lookups');
const ANGULAR_OPTIMISTIC_STATE_CATALOG = getGeneratedCurrentPackage('angular-optimistic-state');
const ANGULAR_PERMISSIONS_CATALOG = getGeneratedCurrentPackage('angular-permissions');

const ANGULAR_URL_STATE_DOCS = ANGULAR_URL_STATE_CATALOG.docsLinks;
const ANGULAR_QUERY_FORM_DOCS = ANGULAR_QUERY_FORM_CATALOG.docsLinks;
const ANGULAR_ASYNC_STATE_DOCS = ANGULAR_ASYNC_STATE_CATALOG.docsLinks;
const ANGULAR_LOOKUPS_DOCS = ANGULAR_LOOKUPS_CATALOG.docsLinks;
const ANGULAR_OPTIMISTIC_STATE_DOCS = ANGULAR_OPTIMISTIC_STATE_CATALOG.docsLinks;
const ANGULAR_PERMISSIONS_DOCS = ANGULAR_PERMISSIONS_CATALOG.docsLinks;

export const ANGULAR_URL_STATE_ORDERS_DEMO: DemoPageEntry = {
  id: 'orders',
  packageId: 'angular-url-state',
  route: '/packages/angular-url-state/orders',
  legacyRoute: '/orders',
  label: 'Orders Search',
  title: 'Orders search with debounced filters and remapped query keys',
  description:
    'Descriptive local signal names stay aligned with compact shareable query keys such as q, p, size, and repeated tag params.',
  docsLinks: [
    {
      label: 'API reference',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-url-state/README.md#api-reference',
    },
    {
      label: 'Param codecs',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-url-state/README.md#param-codecs',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-url-state.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-url-state/orders-demo-state',
    label: 'Orders component source',
    description:
      'The full Orders demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_URL_STATE_DASHBOARD_DEMO: DemoPageEntry = {
  id: 'dashboard',
  packageId: 'angular-url-state',
  route: '/packages/angular-url-state/dashboard',
  legacyRoute: '/dashboard',
  label: 'Dashboard Filters',
  title: 'Dashboard filters with push-state history',
  description:
    'Tabs, date ranges, and archived toggles become browser-history-friendly dashboard state.',
  docsLinks: [
    {
      label: 'Examples',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-url-state/README.md#examples',
    },
    {
      label: 'Options and defaults',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-url-state.md#option-resolution-and-defaults',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-url-state.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-url-state/dashboard-demo-state',
    label: 'Dashboard component source',
    description:
      'The full Dashboard demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_URL_STATE_PACKAGE: DemoPackageEntry = {
  id: 'angular-url-state',
  route: '/packages/angular-url-state',
  label: 'Angular URL State',
  title: ANGULAR_URL_STATE_CATALOG.packageName,
  description: ANGULAR_URL_STATE_CATALOG.summary,
  docsLinks: ANGULAR_URL_STATE_DOCS,
  demos: [ANGULAR_URL_STATE_ORDERS_DEMO, ANGULAR_URL_STATE_DASHBOARD_DEMO],
};

export const ANGULAR_QUERY_FORM_ORDERS_DEMO: DemoPageEntry = {
  id: 'query-form-orders',
  packageId: 'angular-query-form',
  route: '/packages/angular-query-form/orders',
  legacyRoute: '/query-form-orders',
  label: 'Orders Query Form',
  title: 'Orders filters with staged apply mode and shared URL state',
  description:
    'Filter controls use manual apply mode while page and page size stay URL-owned through the same schema.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-query-form/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-query-form.md',
    },
    {
      label: 'URL state package',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-url-state/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-query-form/orders-demo-state',
    label: 'Orders query-form component source',
    description:
      'The full Orders Query Form component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_QUERY_FORM_RECOVERY_DEMO: DemoPageEntry = {
  id: 'query-form-recovery',
  packageId: 'angular-query-form',
  route: '/packages/angular-query-form/recovery',
  legacyRoute: '/query-form-recovery',
  label: 'Recovery Form',
  title: 'Malformed-link recovery with push history',
  description:
    'Invalid query params are cleaned up while Reactive Forms controls and browser history stay coherent.',
  docsLinks: [
    {
      label: 'Query-form package',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-query-form/README.md',
    },
    {
      label: 'URL state invalid-param behavior',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-url-state.md#option-resolution-and-defaults',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-query-form/recovery-demo-state',
    label: 'Recovery query-form component source',
    description:
      'The full Recovery Query Form component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_QUERY_FORM_PACKAGE: DemoPackageEntry = {
  id: 'angular-query-form',
  route: '/packages/angular-query-form',
  label: 'Angular Query Form',
  title: ANGULAR_QUERY_FORM_CATALOG.packageName,
  description: ANGULAR_QUERY_FORM_CATALOG.summary,
  docsLinks: ANGULAR_QUERY_FORM_DOCS,
  demos: [ANGULAR_QUERY_FORM_ORDERS_DEMO, ANGULAR_QUERY_FORM_RECOVERY_DEMO],
};

export const ANGULAR_ASYNC_STATE_VALUE_DEMO: DemoPageEntry = {
  id: 'async-state-value',
  packageId: 'angular-async-state',
  route: '/packages/angular-async-state/value',
  legacyRoute: '/async-state-value',
  label: 'Value Lifecycle',
  title: 'Async value lifecycle with empty, error, and stale-data reload states',
  description:
    'A dashboard-card loader proves first-load errors, empty results, successful reloads, and stale-data refresh failures through explicit outlet templates.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-async-state/README.md',
    },
    {
      label: 'API reference',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-async-state/README.md#api-reference',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-async-state.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-async-state/value-demo-state',
    label: 'Async value component source',
    description:
      'The full asyncState value demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO: DemoPageEntry = {
  id: 'async-state-observable',
  packageId: 'angular-async-state',
  route: '/packages/angular-async-state/observable',
  legacyRoute: '/async-state-observable',
  label: 'Observable State',
  title: 'Live observable state with explicit connect, reconnect, and terminal events',
  description:
    'A live approval stream proves multi-emission updates, retained last snapshots on failure or completion, and explicit subscription control without flattening the stream into one fetch.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-async-state/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-async-state.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-async-state/observable-demo-state',
    label: 'Observable-state component source',
    description:
      'The full observableState demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_ASYNC_STATE_ACTION_DEMO: DemoPageEntry = {
  id: 'async-state-action',
  packageId: 'angular-async-state',
  route: '/packages/angular-async-state/action',
  legacyRoute: '/async-state-action',
  label: 'Action Lifecycle',
  title: 'Async action lifecycle with pending, success, failure, and duplicate-run reuse',
  description:
    'A submit-style approval flow proves explicit pending, success, failure, and in-flight promise reuse without hiding the action handle.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-async-state/README.md',
    },
    {
      label: 'Outlet helpers',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-async-state.md#template-outlets',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-async-state/action-demo-state',
    label: 'Async action component source',
    description:
      'The full asyncAction demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_ASYNC_STATE_PACKAGE: DemoPackageEntry = {
  id: 'angular-async-state',
  route: '/packages/angular-async-state',
  label: 'Angular Async State',
  title: ANGULAR_ASYNC_STATE_CATALOG.packageName,
  description: ANGULAR_ASYNC_STATE_CATALOG.summary,
  docsLinks: ANGULAR_ASYNC_STATE_DOCS,
  demos: [
    ANGULAR_ASYNC_STATE_VALUE_DEMO,
    ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO,
    ANGULAR_ASYNC_STATE_ACTION_DEMO,
  ],
};

export const ANGULAR_LOOKUPS_EDITOR_DEMO: DemoPageEntry = {
  id: 'lookups-editor',
  packageId: 'angular-lookups',
  route: '/packages/angular-lookups/editor',
  legacyRoute: '/lookups-editor',
  label: 'Editor Options',
  title: 'Shared product lookup options for editable category, supplier, and lifecycle fields',
  description:
    'A product editor proves one catalog load can populate three related select surfaces, then refresh those labels in place when the catalog version changes.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-lookups/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-lookups.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-lookups/editor-demo-state',
    label: 'Lookup editor demo source',
    description:
      'The full lookup editor demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_LOOKUPS_BACKEND_DEMO: DemoPageEntry = {
  id: 'lookups-backend',
  packageId: 'angular-lookups',
  route: '/packages/angular-lookups/backend',
  legacyRoute: '/lookups-backend',
  label: 'Live Backend Catalog',
  title: 'Frontend plus backend lookups integration through the shared .NET sample API',
  description:
    'A live browser request proves the Angular cache can hydrate from the shared .NET sample API, refresh labels in place, and reject invalid payloads without changing template code.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-lookups/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-lookups.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-lookups/backend-demo-state',
    label: 'Lookup backend demo source',
    description:
      'The full live backend lookup demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_LOOKUPS_SUMMARY_DEMO: DemoPageEntry = {
  id: 'lookups-summary',
  packageId: 'angular-lookups',
  route: '/packages/angular-lookups/summary',
  legacyRoute: '/lookups-summary',
  label: 'Detail Labels',
  title: 'Detail-grid label resolution through a shared lookup cache and thin label pipe',
  description:
    'A product summary grid proves display labels, refreshes, and missing-key fallbacks without re-fetching catalog data per row or template surface.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-lookups/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-lookups.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-lookups/summary-demo-state',
    label: 'Lookup summary demo source',
    description:
      'The full lookup summary demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_LOOKUPS_PACKAGE: DemoPackageEntry = {
  id: 'angular-lookups',
  route: '/packages/angular-lookups',
  label: 'Angular Lookups',
  title: ANGULAR_LOOKUPS_CATALOG.packageName,
  description: ANGULAR_LOOKUPS_CATALOG.summary,
  docsLinks: ANGULAR_LOOKUPS_DOCS,
  demos: [
    ANGULAR_LOOKUPS_EDITOR_DEMO,
    ANGULAR_LOOKUPS_SUMMARY_DEMO,
    ANGULAR_LOOKUPS_BACKEND_DEMO,
  ],
};

export const ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO: DemoPageEntry = {
  id: 'optimistic-state-toggle',
  packageId: 'angular-optimistic-state',
  route: '/packages/angular-optimistic-state/toggle',
  legacyRoute: '/optimistic-toggle',
  label: 'Toggle Conflict Policy',
  title: 'Optimistic toggle flows with configurable same-target overlap behavior',
  description:
    'A feature-toggle workflow proves immediate optimistic overlays, rollback on failure, and visible reject, queue, or replace behavior for the same target.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-optimistic-state/README.md',
    },
    {
      label: 'Conflict policies',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-optimistic-state.md#conflict-policies',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-optimistic-state/toggle-demo-state',
    label: 'Optimistic toggle component source',
    description:
      'The full optimistic toggle demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO: DemoPageEntry = {
  id: 'optimistic-state-inline-edit',
  packageId: 'angular-optimistic-state',
  route: '/packages/angular-optimistic-state/inline-edit',
  legacyRoute: '/optimistic-inline-edit',
  label: 'Inline Edit Queue',
  title: 'Optimistic inline edits with queued follow-up saves and canonical reconciliation',
  description:
    'A draft-row editor fixes the policy to `queue` so a second save waits its turn and reconciles to the confirmed server title.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-optimistic-state/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-optimistic-state.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-optimistic-state/inline-edit-demo-state',
    label: 'Optimistic inline-edit component source',
    description:
      'The full optimistic inline-edit demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_OPTIMISTIC_STATE_BULK_DEMO: DemoPageEntry = {
  id: 'optimistic-state-bulk',
  packageId: 'angular-optimistic-state',
  route: '/packages/angular-optimistic-state/bulk',
  legacyRoute: '/optimistic-bulk',
  label: 'Bulk Replace Flow',
  title: 'Optimistic bulk publish with replace behavior for the latest shared target intent',
  description:
    'A bulk publish workflow fixes the policy to `replace` so a later bulk command immediately becomes the visible optimistic overlay.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-optimistic-state/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-optimistic-state.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-optimistic-state/bulk-demo-state',
    label: 'Optimistic bulk component source',
    description:
      'The full optimistic bulk demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_OPTIMISTIC_STATE_PACKAGE: DemoPackageEntry = {
  id: 'angular-optimistic-state',
  route: '/packages/angular-optimistic-state',
  label: 'Angular Optimistic State',
  title: ANGULAR_OPTIMISTIC_STATE_CATALOG.packageName,
  description: ANGULAR_OPTIMISTIC_STATE_CATALOG.summary,
  docsLinks: ANGULAR_OPTIMISTIC_STATE_DOCS,
  demos: [
    ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO,
    ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO,
    ANGULAR_OPTIMISTIC_STATE_BULK_DEMO,
  ],
};

export const ANGULAR_PERMISSIONS_ACTIONS_DEMO: DemoPageEntry = {
  id: 'permissions-actions',
  packageId: 'angular-permissions',
  route: '/packages/angular-permissions/actions',
  legacyRoute: '/permissions-actions',
  label: 'Action Gating',
  title: 'Persona-driven action gating through imperative and structural permission checks',
  description:
    'One shared permission context drives disabled buttons, hidden audit panels, and fallback templates without mixing auth parsing into the component layer.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-permissions/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-permissions.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-permissions/actions-demo-state',
    label: 'Permissions action demo source',
    description:
      'The full action-gating demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_PERMISSIONS_ROUTING_DEMO: DemoPageEntry = {
  id: 'permissions-routing',
  packageId: 'angular-permissions',
  route: '/packages/angular-permissions/routing',
  legacyRoute: '/permissions-routing',
  label: 'Route Gating',
  title: 'Route matching and activation with the same shared permission context',
  description:
    'Finance and audit child routes prove `canActivatePermissions()` and `canMatchPermissions()` without inventing a separate route-only access model.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-permissions/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-permissions.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-permissions/routing-demo-state',
    label: 'Permissions routing demo source',
    description:
      'The full route-gating demo shell source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_PERMISSIONS_PACKAGE: DemoPackageEntry = {
  id: 'angular-permissions',
  route: '/packages/angular-permissions',
  label: 'Angular Permissions',
  title: ANGULAR_PERMISSIONS_CATALOG.packageName,
  description: ANGULAR_PERMISSIONS_CATALOG.summary,
  docsLinks: ANGULAR_PERMISSIONS_DOCS,
  demos: [ANGULAR_PERMISSIONS_ACTIONS_DEMO, ANGULAR_PERMISSIONS_ROUTING_DEMO],
};

export const DEMO_PACKAGES = [
  ANGULAR_URL_STATE_PACKAGE,
  ANGULAR_QUERY_FORM_PACKAGE,
  ANGULAR_ASYNC_STATE_PACKAGE,
  ANGULAR_LOOKUPS_PACKAGE,
  ANGULAR_OPTIMISTIC_STATE_PACKAGE,
  ANGULAR_PERMISSIONS_PACKAGE,
] as const;
export const DEMO_PAGES = DEMO_PACKAGES.flatMap((entry) => entry.demos);

export function getDemoPackage(packageId: string): DemoPackageEntry | undefined {
  return DEMO_PACKAGES.find((entry) => entry.id === packageId);
}

export function getDemoPage(pageId: string): DemoPageEntry | undefined {
  return DEMO_PAGES.find((entry) => entry.id === pageId);
}

// ── .NET showcase types ──────────────────────────────────────────────

export interface DotnetDemoCodeSample {
  readonly snippetId: string;
  readonly label: string;
  readonly language: 'csharp';
  readonly description: string;
}

export interface DotnetDemoPageEntry {
  readonly id: string;
  readonly packageId: string;
  readonly route: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly docsLinks: readonly DemoLink[];
  readonly codeSample?: DotnetDemoCodeSample;
}

export interface DotnetPackageEntry {
  readonly id: string;
  readonly route: string;
  readonly label: string;
  readonly title: string;
  readonly nugetId: string;
  readonly description: string;
  readonly summary: string;
  readonly status: 'Available' | 'In Progress';
  readonly docsLinks: readonly DemoLink[];
  readonly demos: readonly DotnetDemoPageEntry[];
}

export const DOTNET_REFERENCE_DATA_HOME: DotnetDemoPageEntry = {
  id: 'reference-data',
  packageId: 'hexguard-reference-data',
  route: '/dotnet/reference-data',
  label: 'ReferenceData Library',
  title: 'HexGuard.ReferenceData ÔÇö typed catalog contracts and validation',
  description:
    'Demonstrates the ReferenceDataCatalog, ReferenceDataCollection, ReferenceDataItem types and the ReferenceDataCatalogValidator directly from the HexGuard.ReferenceData library via the shared SampleApi.',
  docsLinks: [
    {
      label: 'Source code',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.ReferenceData',
    },
    {
      label: 'Sample API',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
};

export const DOTNET_SAMPLE_API_EXPLORER: DotnetDemoPageEntry = {
  id: 'sample-api',
  packageId: 'hexguard-reference-data',
  route: '/dotnet/sample-api',
  label: 'SampleApi Explorer',
  title: 'Shared .NET Sample API endpoint explorer',
  description:
    'Discovers and invokes every endpoint group registered in the running HexGuard.SampleApi. Shows live JSON responses alongside C# source references.',
  docsLinks: [
    {
      label: 'Sample API source',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
};

export const DOTNET_PACKAGES: readonly DotnetPackageEntry[] = [
  {
    id: 'hexguard-reference-data',
    route: '/dotnet',
    label: 'HexGuard .NET',
    title: 'HexGuard .NET Packages',
    nugetId: 'HexGuard.ReferenceData',
    description:
      '.NET guardrail libraries and shared sample API for backend catalog contracts, validation, and reference-data patterns.',
    summary:
      'Typed reference-data catalog contracts and validation helpers for .NET applications, demonstrated through the shared HexGuard.SampleApi.',
    status: 'Available',
    docsLinks: [
      {
        label: 'Source code',
        href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.ReferenceData',
      },
      {
        label: 'Sample API',
        href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
      },
      {
        label: '.NET workspace docs',
        href: 'https://github.com/HexGuard/hexguard/blob/main/dotnet/README.md',
      },
    ],
    demos: [DOTNET_REFERENCE_DATA_HOME, DOTNET_SAMPLE_API_EXPLORER],
  },
];

export function getDotnetPackage(packageId: string): DotnetPackageEntry | undefined {
  return DOTNET_PACKAGES.find((entry) => entry.id === packageId);
}

export function getDotnetDemoPage(pageId: string): DotnetDemoPageEntry | undefined {
  return DOTNET_PACKAGES.flatMap((pkg) => pkg.demos).find((entry) => entry.id === pageId);
}
