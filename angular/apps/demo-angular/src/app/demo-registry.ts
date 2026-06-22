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
const ANGULAR_API_ERRORS_CATALOG = getGeneratedCurrentPackage('angular-api-errors');
const ANGULAR_FEATURE_FLAGS_CATALOG = getGeneratedCurrentPackage('angular-feature-flags');

const ANGULAR_URL_STATE_DOCS = ANGULAR_URL_STATE_CATALOG.docsLinks;
const ANGULAR_QUERY_FORM_DOCS = ANGULAR_QUERY_FORM_CATALOG.docsLinks;
const ANGULAR_ASYNC_STATE_DOCS = ANGULAR_ASYNC_STATE_CATALOG.docsLinks;
const ANGULAR_LOOKUPS_DOCS = ANGULAR_LOOKUPS_CATALOG.docsLinks;
const ANGULAR_OPTIMISTIC_STATE_DOCS = ANGULAR_OPTIMISTIC_STATE_CATALOG.docsLinks;
const ANGULAR_PERMISSIONS_DOCS = ANGULAR_PERMISSIONS_CATALOG.docsLinks;
const ANGULAR_API_ERRORS_DOCS = ANGULAR_API_ERRORS_CATALOG.docsLinks;
const ANGULAR_FEATURE_FLAGS_DOCS = ANGULAR_FEATURE_FLAGS_CATALOG.docsLinks;
const ANGULAR_DATE_UTILS_CATALOG = getGeneratedCurrentPackage('angular-date-utils');
const ANGULAR_BREAKPOINT_OBSERVER_CATALOG = getGeneratedCurrentPackage('angular-breakpoint-observer');
const ANGULAR_UNDO_CATALOG = getGeneratedCurrentPackage('angular-undo');
const ANGULAR_CONFIRMATION_CATALOG = getGeneratedCurrentPackage('angular-confirmation');
const ANGULAR_LIVE_DATA_CATALOG = getGeneratedCurrentPackage('angular-live-data');
const ANGULAR_FILE_PICKER_CATALOG = getGeneratedCurrentPackage('angular-file-picker');
const ANGULAR_FORM_DRAFTS_CATALOG = getGeneratedCurrentPackage('angular-form-drafts');
const ANGULAR_PAGINATION_CATALOG = getGeneratedCurrentPackage('angular-pagination');
const ANGULAR_CLICK_OUTSIDE_CATALOG = getGeneratedCurrentPackage('angular-click-outside');
const ANGULAR_NAVIGATION_PENDING_CATALOG = getGeneratedCurrentPackage('angular-navigation-pending');
const ANGULAR_VISIBILITY_CATALOG = getGeneratedCurrentPackage('angular-visibility');
const ANGULAR_NETWORK_STATUS_CATALOG = getGeneratedCurrentPackage('angular-network-status');
const ANGULAR_STORAGE_CATALOG = getGeneratedCurrentPackage('angular-storage');
const ANGULAR_SELECTION_STATE_CATALOG = getGeneratedCurrentPackage('angular-selection-state');
const ANGULAR_BULK_OPERATIONS_CATALOG = getGeneratedCurrentPackage('angular-bulk-operations');

const ANGULAR_SELECTION_STATE_DOCS = ANGULAR_SELECTION_STATE_CATALOG.docsLinks;
const ANGULAR_BULK_OPERATIONS_DOCS = ANGULAR_BULK_OPERATIONS_CATALOG.docsLinks;
const ANGULAR_DATE_UTILS_DOCS = ANGULAR_DATE_UTILS_CATALOG.docsLinks;
const ANGULAR_BREAKPOINT_OBSERVER_DOCS = ANGULAR_BREAKPOINT_OBSERVER_CATALOG.docsLinks;
const ANGULAR_UNDO_DOCS = ANGULAR_UNDO_CATALOG.docsLinks;
const ANGULAR_CONFIRMATION_DOCS = ANGULAR_CONFIRMATION_CATALOG.docsLinks;
const ANGULAR_PAGINATION_DOCS = ANGULAR_PAGINATION_CATALOG.docsLinks;
const ANGULAR_CLICK_OUTSIDE_DOCS = ANGULAR_CLICK_OUTSIDE_CATALOG.docsLinks;
const ANGULAR_NAVIGATION_PENDING_DOCS = ANGULAR_NAVIGATION_PENDING_CATALOG.docsLinks;
const ANGULAR_LIVE_DATA_DOCS = ANGULAR_LIVE_DATA_CATALOG.docsLinks;
const ANGULAR_FILE_PICKER_DOCS = ANGULAR_FILE_PICKER_CATALOG.docsLinks;
const ANGULAR_FORM_DRAFTS_DOCS = ANGULAR_FORM_DRAFTS_CATALOG.docsLinks;
const ANGULAR_VISIBILITY_DOCS = ANGULAR_VISIBILITY_CATALOG.docsLinks;
const ANGULAR_NETWORK_STATUS_DOCS = ANGULAR_NETWORK_STATUS_CATALOG.docsLinks;
const ANGULAR_STORAGE_DOCS = ANGULAR_STORAGE_CATALOG.docsLinks;

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
  demos: [ANGULAR_LOOKUPS_EDITOR_DEMO, ANGULAR_LOOKUPS_SUMMARY_DEMO, ANGULAR_LOOKUPS_BACKEND_DEMO],
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

// ── angular-feature-flags demo entries ───────────────────────────────

export const ANGULAR_FEATURE_FLAGS_TOGGLES_DEMO: DemoPageEntry = {
  id: 'feature-flags-toggles',
  packageId: 'angular-feature-flags',
  route: '/packages/angular-feature-flags/toggles',
  legacyRoute: '/feature-flags-toggles',
  label: 'Flag Toggles',
  title: 'Persona-driven feature flag toggles with per-flag override controls',
  description:
    'A persona selector drives evaluation context for all flags, proving the pure evaluator, directive, and imperative facade react consistently.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-feature-flags/README.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-feature-flags/toggles-demo-state',
    label: 'Feature flag toggles demo source',
    description:
      'The full flag toggles demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_FEATURE_FLAGS_ROUTING_DEMO: DemoPageEntry = {
  id: 'feature-flags-routing',
  packageId: 'angular-feature-flags',
  route: '/packages/angular-feature-flags/routing',
  legacyRoute: '/feature-flags-routing',
  label: 'Route Gating',
  title: 'Route activation gated on a feature flag with redirect on denial',
  description:
    'A premium content route proves canActivateFeatureFlag() with redirectTo, using the same evaluator as the directive and facade.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-feature-flags/README.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-feature-flags/routing-demo-state',
    label: 'Feature flag routing demo source',
    description:
      'The full route-gating demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_FEATURE_FLAGS_PACKAGE: DemoPackageEntry = {
  id: 'angular-feature-flags',
  route: '/packages/angular-feature-flags',
  label: 'Angular Feature Flags',
  title: ANGULAR_FEATURE_FLAGS_CATALOG.packageName,
  description: ANGULAR_FEATURE_FLAGS_CATALOG.summary,
  docsLinks: ANGULAR_FEATURE_FLAGS_DOCS,
  demos: [ANGULAR_FEATURE_FLAGS_TOGGLES_DEMO, ANGULAR_FEATURE_FLAGS_ROUTING_DEMO],
};

export const ANGULAR_SELECTION_STATE_DEMO: DemoPageEntry = {
  id: 'selection-state-demo',
  packageId: 'angular-selection-state',
  route: '/packages/angular-selection-state/demo',
  legacyRoute: '/selection-state-demo',
  label: 'Table Selection Demo',
  title: 'Mock data table with checkbox column and select-all',
  description:
    'Proves injectSelectionState() with toggle, select-all, clear, and bulk action enablement.',
  docsLinks: [],
  codeSample: {
    snippetId: 'angular-selection-state/demo',
    label: 'Selection state demo source',
    description: 'The full selection state demo component source.',
  },
};

export const ANGULAR_SELECTION_STATE_PACKAGE: DemoPackageEntry = {
  id: 'angular-selection-state',
  route: '/packages/angular-selection-state',
  label: 'Angular Selection State',
  title: ANGULAR_SELECTION_STATE_CATALOG.packageName,
  description: ANGULAR_SELECTION_STATE_CATALOG.summary,
  docsLinks: ANGULAR_SELECTION_STATE_DOCS,
  demos: [ANGULAR_SELECTION_STATE_DEMO],
};

export const ANGULAR_BULK_OPERATIONS_DEMO: DemoPageEntry = {
  id: 'bulk-operations-demo',
  packageId: 'angular-bulk-operations',
  route: '/packages/angular-bulk-operations/demo',
  legacyRoute: '/bulk-operations-demo',
  label: 'Bulk Delete & Approve Demo',
  title: 'Bulk operations with selection, partial-failure display, and retry',
  description:
    'Proves injectBulkOperation() with selectedItemsToBulkRequest() for delete and approve flows.',
  docsLinks: [],
  codeSample: {
    snippetId: 'angular-bulk-operations/demo',
    label: 'Bulk operations demo source',
    description: 'The full bulk operations demo component source.',
  },
};

export const ANGULAR_BULK_OPERATIONS_API_DEMO: DemoPageEntry = {
  id: 'bulk-operations-api-demo',
  packageId: 'angular-bulk-operations',
  route: '/packages/angular-bulk-operations/api-demo',
  legacyRoute: '/bulk-operations-api-demo',
  label: 'Live API Demo',
  title: 'Call the .NET SampleApi bulk endpoints from the Angular library',
  description:
    'Proves provideBulkOperation() + injectBulkOperation() with live HTTP requests to the .NET backend.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-bulk-operations/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-bulk-operations.md',
    },
    {
      label: 'Bulk Contracts (.NET)',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/hexguard-bulk-operations.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-bulk-operations/api-demo',
    label: 'Live API demo component source',
    description:
      'The full bulk operations API demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_BULK_OPERATIONS_LIBRARY_DEMO: DemoPageEntry = {
  id: 'bulk-operations-library-demo',
  packageId: 'angular-bulk-operations',
  route: '/packages/angular-bulk-operations/library-demo',
  legacyRoute: '/bulk-operations-library-demo',
  label: 'Library API Workflow Demo',
  title: 'Angular bulk operations library calling the live .NET SampleApi',
  description:
    'Proves provideBulkOperation(), injectBulkOperation(), and selectedItemsToBulkRequest() with live HTTP 207 Multi-Status responses from the .NET backend.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-bulk-operations/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-bulk-operations.md',
    },
    {
      label: 'Bulk Contracts (.NET)',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/hexguard-bulk-operations.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-bulk-operations/library-demo',
    label: 'Library API workflow demo source',
    description:
      'The full bulk operations library demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_BULK_OPERATIONS_PACKAGE: DemoPackageEntry = {
  id: 'angular-bulk-operations',
  route: '/packages/angular-bulk-operations',
  label: 'Angular Bulk Operations',
  title: ANGULAR_BULK_OPERATIONS_CATALOG.packageName,
  description: ANGULAR_BULK_OPERATIONS_CATALOG.summary,
  docsLinks: ANGULAR_BULK_OPERATIONS_DOCS,
  demos: [
    ANGULAR_BULK_OPERATIONS_DEMO,
    ANGULAR_BULK_OPERATIONS_API_DEMO,
    ANGULAR_BULK_OPERATIONS_LIBRARY_DEMO,
  ],
};

export const FORM_VALIDATION_DEMO: DemoPageEntry = {
  id: 'form-validation',
  packageId: 'angular-api-errors',
  route: '/packages/angular-api-errors/form-validation',
  legacyRoute: '/api-errors-form-validation',
  label: 'Form Validation Demo',
  title: 'Backend validation errors bound to Angular form controls',
  description:
    'A product form proves apiFormErrors() maps dot-separated field paths from the validation contract onto FormControl.setErrors(). Model-level errors appear as page-level messages below the form.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-api-errors/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-api-errors.md',
    },
    {
      label: 'Validation Contracts (.NET)',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/validation-contracts.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-api-errors/form-validation-demo-state',
    label: 'Form validation component source',
    description:
      'The full form validation demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_API_ERRORS_BACKEND_DEMO: DemoPageEntry = {
  id: 'api-errors-backend',
  packageId: 'angular-api-errors',
  route: '/packages/angular-api-errors/backend',
  legacyRoute: '/api-errors-backend',
  label: 'Backend Validation Demo',
  title: 'Cross-stack validation via the shared .NET SampleApi',
  description:
    'Proves the end-to-end validation pipeline: the Angular apiFormErrors() consumes RFC 9457 Problem Details payloads that the HexGuard.ValidationContracts .NET library produces.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-api-errors/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-api-errors.md',
    },
    {
      label: 'Validation Contracts (.NET)',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/validation-contracts.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-api-errors/backend-demo-state',
    label: 'Backend validation component source',
    description:
      'The full cross-stack validation demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_API_ERRORS_PACKAGE: DemoPackageEntry = {
  id: 'angular-api-errors',
  route: '/packages/angular-api-errors',
  label: 'Angular API Errors',
  title: ANGULAR_API_ERRORS_CATALOG.packageName,
  description: ANGULAR_API_ERRORS_CATALOG.summary,
  docsLinks: ANGULAR_API_ERRORS_DOCS,
  demos: [FORM_VALIDATION_DEMO, ANGULAR_API_ERRORS_BACKEND_DEMO],
};

// ── angular-debounce demo entries ────────────────────────────────────

const ANGULAR_DEBOUNCE_CATALOG = getGeneratedCurrentPackage('angular-debounce');
const ANGULAR_DEBOUNCE_DOCS = ANGULAR_DEBOUNCE_CATALOG.docsLinks;

export const ANGULAR_DEBOUNCE_DEMO: DemoPageEntry = {
  id: 'debounce',
  packageId: 'angular-debounce',
  route: '/packages/angular-debounce/demo',
  legacyRoute: '/debounce',
  label: 'Debounced Signal',
  title: 'Debounced signal primitive with configurable leading and trailing edge modes',
  description:
    'An input field demonstrates trailing-only, leading-only, and both-edge debounce with a live isPending indicator and flush/cancel controls.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-debounce/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-debounce.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-debounce/demo-state',
    label: 'Debounce demo component source',
    description:
      'The full debounce demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_DEBOUNCE_PACKAGE: DemoPackageEntry = {
  id: 'angular-debounce',
  route: '/packages/angular-debounce',
  label: 'Angular Debounce',
  title: ANGULAR_DEBOUNCE_CATALOG.packageName,
  description: ANGULAR_DEBOUNCE_CATALOG.summary,
  docsLinks: ANGULAR_DEBOUNCE_DOCS,
  demos: [ANGULAR_DEBOUNCE_DEMO],
};

// ── angular-notifications demo entries ───────────────────────────────

const ANGULAR_NOTIFICATIONS_CATALOG = getGeneratedCurrentPackage('angular-notifications');
const ANGULAR_NOTIFICATIONS_DOCS = ANGULAR_NOTIFICATIONS_CATALOG.docsLinks;

export const ANGULAR_NOTIFICATIONS_DEMO: DemoPageEntry = {
  id: 'notifications',
  packageId: 'angular-notifications',
  route: '/packages/angular-notifications/demo',
  legacyRoute: '/notifications',
  label: 'Notification Queue',
  title: 'Toast notification queue with typed types, auto-dismiss, and action support',
  description:
    'Buttons trigger success, error, info, and warning toasts. Each notification shows configurable duration, dismiss control, and optional action buttons.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-notifications/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-notifications.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-notifications/demo-state',
    label: 'Notifications demo component source',
    description:
      'The full notifications demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_NOTIFICATIONS_PACKAGE: DemoPackageEntry = {
  id: 'angular-notifications',
  route: '/packages/angular-notifications',
  label: 'Angular Notifications',
  title: ANGULAR_NOTIFICATIONS_CATALOG.packageName,
  description: ANGULAR_NOTIFICATIONS_CATALOG.summary,
  docsLinks: ANGULAR_NOTIFICATIONS_DOCS,
  demos: [ANGULAR_NOTIFICATIONS_DEMO],
};

// ── angular-error-boundary demo entries ──────────────────────────────

const ANGULAR_ERROR_BOUNDARY_CATALOG = getGeneratedCurrentPackage('angular-error-boundary');
const ANGULAR_ERROR_BOUNDARY_DOCS = ANGULAR_ERROR_BOUNDARY_CATALOG.docsLinks;

export const ANGULAR_ERROR_BOUNDARY_DEMO: DemoPageEntry = {
  id: 'error-boundary',
  packageId: 'angular-error-boundary',
  route: '/packages/angular-error-boundary/demo',
  legacyRoute: '/error-boundary',
  label: 'Error Boundary',
  title: 'Component error boundary with custom fallback and reset recovery',
  description:
    'A throwable content area demonstrates error capture, default and custom fallback templates, and programmatic reset to restore the original content.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-error-boundary/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-error-boundary.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-error-boundary/demo-state',
    label: 'Error boundary demo component source',
    description:
      'The full error boundary demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_ERROR_BOUNDARY_PACKAGE: DemoPackageEntry = {
  id: 'angular-error-boundary',
  route: '/packages/angular-error-boundary',
  label: 'Angular Error Boundary',
  title: ANGULAR_ERROR_BOUNDARY_CATALOG.packageName,
  description: ANGULAR_ERROR_BOUNDARY_CATALOG.summary,
  docsLinks: ANGULAR_ERROR_BOUNDARY_DOCS,
  demos: [ANGULAR_ERROR_BOUNDARY_DEMO],
};

// ── angular-date-utils demo entries ──────────────────────────────────

export const ANGULAR_DATE_UTILS_DEMO: DemoPageEntry = {
  id: 'date-utils',
  packageId: 'angular-date-utils',
  route: '/packages/angular-date-utils/demo',
  legacyRoute: '/date-utils',
  label: 'Date Utilities',
  title: 'Locale-aware date formatting, ranges, and business-day calculations',
  description:
    'Relative time, compact dates, duration formatting, DateRange presets, and business-day helpers with Intl locale support.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-date-utils/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-date-utils.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-date-utils/demo-state',
    label: 'Date utils demo component source',
    description:
      'The full date utilities demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_DATE_UTILS_PACKAGE: DemoPackageEntry = {
  id: 'angular-date-utils',
  route: '/packages/angular-date-utils',
  label: 'Angular Date Utils',
  title: ANGULAR_DATE_UTILS_CATALOG.packageName,
  description: ANGULAR_DATE_UTILS_CATALOG.summary,
  docsLinks: ANGULAR_DATE_UTILS_DOCS,
  demos: [ANGULAR_DATE_UTILS_DEMO],
};

// ── angular-network-status demo entries ─────────────────────────────

export const ANGULAR_NETWORK_STATUS_DEMO: DemoPageEntry = {
  id: 'network-status',
  packageId: 'angular-network-status',
  route: '/packages/angular-network-status/demo',
  legacyRoute: '/network-status',
  label: 'Network Status',
  title: 'Signal-based connectivity monitoring with debounced reconnection',
  description:
    'Online/offline state, connection type detection, recently-back-online indicator, and whenBackOnline() promise helper.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-network-status/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-network-status.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-network-status/demo-state',
    label: 'Network status demo component source',
    description:
      'The full network status demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_NETWORK_STATUS_PACKAGE: DemoPackageEntry = {
  id: 'angular-network-status',
  route: '/packages/angular-network-status',
  label: 'Angular Network Status',
  title: ANGULAR_NETWORK_STATUS_CATALOG.packageName,
  description: ANGULAR_NETWORK_STATUS_CATALOG.summary,
  docsLinks: ANGULAR_NETWORK_STATUS_DOCS,
  demos: [ANGULAR_NETWORK_STATUS_DEMO],
};

// ── angular-storage demo entries ─────────────────────────────────────

export const ANGULAR_STORAGE_DEMO: DemoPageEntry = {
  id: 'storage',
  packageId: 'angular-storage',
  route: '/packages/angular-storage/demo',
  legacyRoute: '/storage',
  label: 'Storage',
  title: 'Typed, signal-backed local and session storage with cross-tab sync',
  description:
    'Persistent preference panel demonstrating typed storage with versioning, TTL expiry, cross-tab synchronization, and graceful fallback.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-storage/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-storage.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-storage/demo-state',
    label: 'Storage demo component source',
    description:
      'The full storage demo component source, including TypeScript, template, and styles.',
  },
};

// ── angular-breakpoint-observer demo entries ────────────────────────

export const ANGULAR_BREAKPOINT_OBSERVER_DEMO: DemoPageEntry = {
  id: 'breakpoint-observer',
  packageId: 'angular-breakpoint-observer',
  route: '/packages/angular-breakpoint-observer/demo',
  legacyRoute: '/breakpoint-observer',
  label: 'Breakpoint Observer',
  title: 'Signal-based reactive breakpoint detection with above/below/active/matches helpers',
  description:
    'A live breakpoint monitor demonstrates active breakpoint, per-breakpoint booleans, above/below comparisons, and arbitrary media query matching.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-breakpoint-observer/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-breakpoint-observer.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-breakpoint-observer/demo-state',
    label: 'Breakpoint observer demo component source',
    description:
      'The full breakpoint observer demo component source, including TypeScript, template, and styles.',
  },
};

// ── angular-visibility demo entries ────────────────────────────

export const ANGULAR_VISIBILITY_DEMO: DemoPageEntry = {
  id: 'visibility',
  packageId: 'angular-visibility',
  route: '/packages/angular-visibility/demo',
  legacyRoute: '/visibility',
  label: 'Visibility',
  title: 'Tab visibility, idle detection, and element visibility signals',
  description:
    'A live monitor demonstrates tab visibility tracking, configurable idle timeout with activity reset, and IntersectionObserver-based element visibility.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-visibility/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-visibility.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-visibility/demo-state',
    label: 'Visibility demo component source',
    description:
      'The full visibility demo component source, including TypeScript, template, and styles.',
  },
};

// ── angular-navigation-pending demo entries ────────────────────

export const ANGULAR_NAVIGATION_PENDING_DEMO: DemoPageEntry = {
  id: 'navigation-pending',
  packageId: 'angular-navigation-pending',
  route: '/packages/angular-navigation-pending/demo',
  legacyRoute: '/navigation-pending',
  label: 'Navigation Pending',
  title: 'Route transition pending state with slow-navigation detection',
  description:
    'A live monitor demonstrates isNavigating and isSlowNavigation signals using Angular Router events with a configurable delay threshold.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-navigation-pending/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-navigation-pending.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-navigation-pending/demo-state',
    label: 'Navigation pending demo component source',
    description:
      'The full navigation pending demo component source, including TypeScript, template, and styles.',
  },
};

// ── angular-click-outside demo entries ───────────────────────────

export const ANGULAR_CLICK_OUTSIDE_DEMO: DemoPageEntry = {
  id: 'click-outside',
  packageId: 'angular-click-outside',
  route: '/packages/angular-click-outside/demo',
  legacyRoute: '/click-outside',
  label: 'Click Outside',
  title: 'Click-outside detection with injectable and directive',
  description:
    'A live demo demonstrates directive-based click-outside detection on a box element and injectable-based dropdown dismissal.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-click-outside/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-click-outside.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-click-outside/demo-state',
    label: 'Click outside demo component source',
    description:
      'The full click outside demo component source, including TypeScript, template, and styles.',
  },
};

// ── angular-undo demo entries ──────────────────────────────────

export const ANGULAR_UNDO_DEMO: DemoPageEntry = {
  id: 'undo',
  packageId: 'angular-undo',
  route: '/packages/angular-undo/demo',
  legacyRoute: '/undo',
  label: 'Undo Stack',
  title: 'Timer-based undo stack with configurable TTL windows, undo, commit, and group undo',
  description:
    'A live demo shows reversible delete and archive actions with configurable undo windows, manual undo/commit, and an activity log.',
  docsLinks: [
    {
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-undo/README.md',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-undo.md',
    },
    {
      label: 'Demo runbook',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
    },
  ],
  codeSample: {
    snippetId: 'angular-undo/demo-state',
    label: 'Undo demo component source',
    description:
      'The full undo demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_PAGINATION_DEMO: DemoPageEntry = {
  id: 'pagination',
  packageId: 'angular-pagination',
  route: '/packages/angular-pagination/demo',
  legacyRoute: '/pagination',
  label: 'Pagination',
  title: 'Signal-based pagination state with page math, navigation, and URL-sync adapter',
  description:
    'A live pagination playground demonstrates page, pageSize, total, totalPages, hasNext, hasPrevious, range display, and page number navigation.',
  docsLinks: [
    { label: 'Package README', href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-pagination/README.md' },
    { label: 'Deep package notes', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-pagination.md' },
    { label: 'Demo runbook', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md' },
  ],
  codeSample: {
    snippetId: 'angular-pagination/demo-state',
    label: 'Pagination demo component source',
    description: 'The full pagination demo component source, including TypeScript, template, and styles.',
  },
};

export const ANGULAR_FORM_DRAFTS_DEMO: DemoPageEntry = {
  id: 'form-drafts',
  packageId: 'angular-form-drafts',
  route: '/packages/angular-form-drafts/demo',
  legacyRoute: '/form-drafts',
  label: 'Form Drafts',
  title: 'Debounced localStorage draft persistence with TTL expiry',
  description: 'A live demo shows a form that auto-saves to localStorage with debounce, with restore, clear, and TTL-based expiry.',
  docsLinks: [
    { label: 'Package README', href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-form-drafts/README.md' },
    { label: 'Deep package notes', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-form-drafts.md' },
    { label: 'Demo runbook', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md' },
  ],
  codeSample: { snippetId: 'angular-form-drafts/demo-state', label: 'Form Drafts demo component source', description: 'The full form drafts demo component source.' },
};
export const ANGULAR_FORM_DRAFTS_PACKAGE: DemoPackageEntry = {
  id: 'angular-form-drafts',
  route: '/packages/angular-form-drafts',
  label: 'Angular Form Drafts',
  title: ANGULAR_FORM_DRAFTS_CATALOG.packageName,
  description: ANGULAR_FORM_DRAFTS_CATALOG.summary,
  docsLinks: ANGULAR_FORM_DRAFTS_DOCS,
  demos: [ANGULAR_FORM_DRAFTS_DEMO],
};

export const ANGULAR_FILE_PICKER_DEMO: DemoPageEntry = {
  id: 'file-picker',
  packageId: 'angular-file-picker',
  route: '/packages/angular-file-picker/demo',
  legacyRoute: '/file-picker',
  label: 'File Picker',
  title: 'Headless file selection with signal-based state and drag-and-drop',
  description: 'A live demo shows file selection via dialog or drag-drop, type/size validation, and configurable content reading (text, data URL, or metadata only).',
  docsLinks: [
    { label: 'Package README', href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-file-picker/README.md' },
    { label: 'Deep package notes', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-file-picker.md' },
    { label: 'Demo runbook', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md' },
  ],
  codeSample: { snippetId: 'angular-file-picker/demo-state', label: 'File Picker demo component source', description: 'The full file picker demo component source.' },
};
export const ANGULAR_FILE_PICKER_PACKAGE: DemoPackageEntry = {
  id: 'angular-file-picker',
  route: '/packages/angular-file-picker',
  label: 'Angular File Picker',
  title: ANGULAR_FILE_PICKER_CATALOG.packageName,
  description: ANGULAR_FILE_PICKER_CATALOG.summary,
  docsLinks: ANGULAR_FILE_PICKER_DOCS,
  demos: [ANGULAR_FILE_PICKER_DEMO],
};

export const ANGULAR_PAGINATION_CROSS_STACK_DEMO: DemoPageEntry = {
  id: 'pagination-cross-stack',
  packageId: 'angular-pagination',
  route: '/packages/angular-pagination/cross-stack-demo',
  legacyRoute: '/pagination/dotnet',
  label: 'Cross-stack Demo',
  title: 'Angular Pagination + HexGuard.Pagination cross-stack integration',
  description: 'A live demo shows angular-pagination calling the HexGuard.Pagination .NET library via the shared SampleApi. Page navigation fetches products from the backend with typed QueryRequest/QueryResponse contracts.',
  docsLinks: [
    { label: 'Package README', href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-pagination/README.md' },
    { label: '.NET Pagination README', href: 'https://github.com/HexGuard/hexguard/blob/main/dotnet/src/HexGuard.Pagination/README.md' },
    { label: 'Sample API', href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi' },
    { label: 'Demo runbook', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md' },
  ],
  codeSample: {
    snippetId: 'angular-pagination/cross-stack-demo-state',
    label: 'Cross-stack pagination demo component source',
    description: 'The full cross-stack pagination demo component source.',
  },
};

export const ANGULAR_LIVE_DATA_DEMO: DemoPageEntry = {
  id: 'live-data',
  packageId: 'angular-live-data',
  route: '/packages/angular-live-data/demo',
  legacyRoute: '/live-data',
  label: 'Live Data',
  title: 'Reactive polling with visibility-aware pause/resume and stale detection',
  description: 'A live demo shows KPI dashboard metrics polling every 5 seconds, with pause/resume controls, stale badge, and error recovery demonstration.',
  docsLinks: [
    { label: 'Package README', href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-live-data/README.md' },
    { label: 'Deep package notes', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-live-data.md' },
    { label: 'Demo runbook', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md' },
  ],
  codeSample: { snippetId: 'angular-live-data/demo-state', label: 'Live Data demo component source', description: 'The full live data demo component source.' },
};
export const ANGULAR_LIVE_DATA_PACKAGE: DemoPackageEntry = {
  id: 'angular-live-data',
  route: '/packages/angular-live-data',
  label: 'Angular Live Data',
  title: ANGULAR_LIVE_DATA_CATALOG.packageName,
  description: ANGULAR_LIVE_DATA_CATALOG.summary,
  docsLinks: ANGULAR_LIVE_DATA_DOCS,
  demos: [ANGULAR_LIVE_DATA_DEMO],
};

export const ANGULAR_CONFIRMATION_DEMO: DemoPageEntry = {
  id: 'confirmation',
  packageId: 'angular-confirmation',
  route: '/packages/angular-confirmation/demo',
  legacyRoute: '/confirmation',
  label: 'Confirmation',
  title: 'Headless confirmation dialog state with promise-based ask/run flows',
  description: 'A live demo shows delete and archive confirmation flows with confirm/cancel dialog and reactive isOpen/currentRequest signals.',
  docsLinks: [
    { label: 'Package README', href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-confirmation/README.md' },
    { label: 'Deep package notes', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-confirmation.md' },
    { label: 'Demo runbook', href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md' },
  ],
  codeSample: { snippetId: 'angular-confirmation/demo-state', label: 'Confirmation demo component source', description: 'The full confirmation demo component source.' },
};
export const ANGULAR_CONFIRMATION_PACKAGE: DemoPackageEntry = {
  id: 'angular-confirmation',
  route: '/packages/angular-confirmation',
  label: 'Angular Confirmation',
  title: ANGULAR_CONFIRMATION_CATALOG.packageName,
  description: ANGULAR_CONFIRMATION_CATALOG.summary,
  docsLinks: ANGULAR_CONFIRMATION_DOCS,
  demos: [ANGULAR_CONFIRMATION_DEMO],
};
export const ANGULAR_PAGINATION_PACKAGE: DemoPackageEntry = {
  id: 'angular-pagination',
  route: '/packages/angular-pagination',
  label: 'Angular Pagination',
  title: ANGULAR_PAGINATION_CATALOG.packageName,
  description: ANGULAR_PAGINATION_CATALOG.summary,
  docsLinks: ANGULAR_PAGINATION_DOCS,
  demos: [ANGULAR_PAGINATION_DEMO, ANGULAR_PAGINATION_CROSS_STACK_DEMO],
};

export const ANGULAR_UNDO_PACKAGE: DemoPackageEntry = {
  id: 'angular-undo',
  route: '/packages/angular-undo',
  label: 'Angular Undo',
  title: ANGULAR_UNDO_CATALOG.packageName,
  description: ANGULAR_UNDO_CATALOG.summary,
  docsLinks: ANGULAR_UNDO_DOCS,
  demos: [ANGULAR_UNDO_DEMO],
};

export const ANGULAR_CLICK_OUTSIDE_PACKAGE: DemoPackageEntry = {
  id: 'angular-click-outside',
  route: '/packages/angular-click-outside',
  label: 'Angular Click Outside',
  title: ANGULAR_CLICK_OUTSIDE_CATALOG.packageName,
  description: ANGULAR_CLICK_OUTSIDE_CATALOG.summary,
  docsLinks: ANGULAR_CLICK_OUTSIDE_DOCS,
  demos: [ANGULAR_CLICK_OUTSIDE_DEMO],
};

export const ANGULAR_NAVIGATION_PENDING_PACKAGE: DemoPackageEntry = {
  id: 'angular-navigation-pending',
  route: '/packages/angular-navigation-pending',
  label: 'Angular Navigation Pending',
  title: ANGULAR_NAVIGATION_PENDING_CATALOG.packageName,
  description: ANGULAR_NAVIGATION_PENDING_CATALOG.summary,
  docsLinks: ANGULAR_NAVIGATION_PENDING_DOCS,
  demos: [ANGULAR_NAVIGATION_PENDING_DEMO],
};

export const ANGULAR_VISIBILITY_PACKAGE: DemoPackageEntry = {
  id: 'angular-visibility',
  route: '/packages/angular-visibility',
  label: 'Angular Visibility',
  title: ANGULAR_VISIBILITY_CATALOG.packageName,
  description: ANGULAR_VISIBILITY_CATALOG.summary,
  docsLinks: ANGULAR_VISIBILITY_DOCS,
  demos: [ANGULAR_VISIBILITY_DEMO],
};

export const ANGULAR_BREAKPOINT_OBSERVER_PACKAGE: DemoPackageEntry = {
  id: 'angular-breakpoint-observer',
  route: '/packages/angular-breakpoint-observer',
  label: 'Angular Breakpoint Observer',
  title: ANGULAR_BREAKPOINT_OBSERVER_CATALOG.packageName,
  description: ANGULAR_BREAKPOINT_OBSERVER_CATALOG.summary,
  docsLinks: ANGULAR_BREAKPOINT_OBSERVER_DOCS,
  demos: [ANGULAR_BREAKPOINT_OBSERVER_DEMO],
};

export const ANGULAR_STORAGE_PACKAGE: DemoPackageEntry = {
  id: 'angular-storage',
  route: '/packages/angular-storage',
  label: 'Angular Storage',
  title: ANGULAR_STORAGE_CATALOG.packageName,
  description: ANGULAR_STORAGE_CATALOG.summary,
  docsLinks: ANGULAR_STORAGE_DOCS,
  demos: [ANGULAR_STORAGE_DEMO],
};

export const DEMO_PACKAGES = [
  ANGULAR_URL_STATE_PACKAGE,
  ANGULAR_QUERY_FORM_PACKAGE,
  ANGULAR_ASYNC_STATE_PACKAGE,
  ANGULAR_LOOKUPS_PACKAGE,
  ANGULAR_OPTIMISTIC_STATE_PACKAGE,
  ANGULAR_PERMISSIONS_PACKAGE,
  ANGULAR_API_ERRORS_PACKAGE,
  ANGULAR_BREAKPOINT_OBSERVER_PACKAGE,
  ANGULAR_VISIBILITY_PACKAGE,
  ANGULAR_NAVIGATION_PENDING_PACKAGE,
  ANGULAR_CLICK_OUTSIDE_PACKAGE,
  ANGULAR_UNDO_PACKAGE,
  ANGULAR_PAGINATION_PACKAGE,
  ANGULAR_CONFIRMATION_PACKAGE,
  ANGULAR_LIVE_DATA_PACKAGE,
  ANGULAR_FILE_PICKER_PACKAGE,
  ANGULAR_FORM_DRAFTS_PACKAGE,
  ANGULAR_DEBOUNCE_PACKAGE,
  ANGULAR_NOTIFICATIONS_PACKAGE,
  ANGULAR_ERROR_BOUNDARY_PACKAGE,
  ANGULAR_FEATURE_FLAGS_PACKAGE,
  ANGULAR_SELECTION_STATE_PACKAGE,
  ANGULAR_BULK_OPERATIONS_PACKAGE,
  ANGULAR_DATE_UTILS_PACKAGE,
  ANGULAR_NETWORK_STATUS_PACKAGE,
  ANGULAR_STORAGE_PACKAGE,
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
      label: 'Package README',
      href: 'https://github.com/HexGuard/hexguard/blob/main/dotnet/src/HexGuard.ReferenceData/README.md',
    },
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

export const DOTNET_VALIDATION_CONTRACTS_HOME: DotnetDemoPageEntry = {
  id: 'validation-contracts',
  packageId: 'hexguard-validation-contracts',
  route: '/dotnet/validation-contracts',
  label: 'ValidationContracts Library',
  title: 'HexGuard.ValidationContracts — validation error contracts and RFC 9457 support',
  description:
    'Demonstrates ValidationError, ValidationResult, FieldPath, and ValidationErrorCode types from the HexGuard.ValidationContracts library, with RFC 9457 Problem Details integration through the shared SampleApi.',
  docsLinks: [
    {
      label: 'Source code',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.ValidationContracts',
    },
    {
      label: 'Sample API',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/validation-contracts.md',
    },
  ],
};

export const DOTNET_FEATURE_FLAGS_HOME: DotnetDemoPageEntry = {
  id: 'hexguard-feature-flags',
  packageId: 'hexguard-feature-flags',
  route: '/dotnet/feature-flags',
  label: 'FeatureFlags Library',
  title: 'HexGuard.FeatureFlags — feature flag evaluation and sync API',
  description:
    'Evaluates feature flags via the shared SampleApi. Select a persona to see how targeting rules (groupIn, rollout, attributeMatch) resolve against the .NET FeatureFlagEvaluator.',
  docsLinks: [
    {
      label: 'Source code',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.FeatureFlags',
    },
    {
      label: 'Sample API',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/hexguard-feature-flags.md',
    },
    {
      label: 'Angular counterpart',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-feature-flags/README.md',
    },
  ],
};

export const DOTNET_BULK_OPERATIONS_HOME: DotnetDemoPageEntry = {
  id: 'hexguard-bulk-operations',
  packageId: 'hexguard-bulk-operations',
  route: '/dotnet/bulk-operations',
  label: 'BulkOperations Library',
  title: 'HexGuard.BulkOperations — HTTP 207 Multi-Status bulk action contracts',
  description:
    'Demonstrates the BulkOperationResultBuilder and Results.Extensions.BulkOperation() via the shared SampleApi. Proves 207 Multi-Status responses for partial success and per-item error reporting.',
  docsLinks: [
    {
      label: 'Source code',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.BulkOperations',
    },
    {
      label: 'Sample API',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/hexguard-bulk-operations.md',
    },
    {
      label: 'Angular counterpart',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-bulk-operations/README.md',
    },
  ],
};

export const DOTNET_CAPABILITIES_HOME: DotnetDemoPageEntry = {
  id: 'hexguard-capabilities',
  packageId: 'hexguard-capabilities',
  route: '/dotnet/capabilities',
  label: 'Capabilities Library',
  title: 'HexGuard.Capabilities — persona-based capability sets',
  description:
    'Demonstrates ICapabilityService, InMemoryCapabilityStore, and the persona-based capability evaluation via the shared SampleApi. Proves role/permission contract gating across stacks.',
  docsLinks: [
    {
      label: 'Source code',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.Capabilities',
    },
    {
      label: 'Sample API',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Angular counterpart',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-permissions/README.md',
    },
  ],
};

export const DOTNET_PROBLEM_DETAILS_HOME: DotnetDemoPageEntry = {
  id: 'hexguard-problem-details',
  packageId: 'hexguard-problem-details',
  route: '/dotnet/problem-details',
  label: 'Problem Details Library',
  title: 'HexGuard.ProblemDetails — RFC 9457 Problem Details for .NET',
  description:
    'Demonstrates ProblemDetails record, ProblemDetailsBuilder, and ProblemDetailsMiddleware from the HexGuard.ProblemDetails library, paired with @hexguard/angular-api-errors for end-to-end RFC 9457 Problem Details across stacks.',
  docsLinks: [
    {
      label: 'Source code',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.ProblemDetails',
    },
    {
      label: 'Sample API',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Deep package notes',
      href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/hexguard-problem-details.md',
    },
    {
      label: 'Angular counterpart',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-api-errors/README.md',
    },
  ],
};

export const DOTNET_PAGINATION_HOME: DotnetDemoPageEntry = {
  id: 'hexguard-pagination',
  packageId: 'hexguard-pagination',
  route: '/dotnet/pagination',
  label: 'Pagination Library',
  title: 'HexGuard.Pagination — standardized query/pagination contracts for .NET APIs',
  description:
    'Demonstrates QueryRequest, QueryResponse<T>, and SortSpec types from the HexGuard.Pagination library, with a paginated product list served via the shared SampleApi.',
  docsLinks: [
    {
      label: 'Source code',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.Pagination',
    },
    {
      label: 'Sample API',
      href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi',
    },
    {
      label: 'Angular counterpart',
      href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-pagination/README.md',
    },
  ],
};

export const DOTNET_PACKAGES: readonly DotnetPackageEntry[] = [
  {
    id: 'hexguard-pagination',
    route: '/dotnet/hexguard-pagination',
    label: 'HexGuard Pagination',
    title: 'HexGuard.Pagination',
    nugetId: 'HexGuard.Pagination',
    description:
      'Standardized pagination and query contracts for .NET APIs — QueryRequest, QueryResponse<T>, SortSpec. Pairs with @hexguard/angular-pagination.',
    summary:
      'QueryRequest, QueryResponse<T>, SortSpec records for standardized paginated list endpoints. Computed helpers: HasNext, HasPrevious, RangeStart, RangeEnd.',
    status: 'Available',
    docsLinks: [
      { label: 'Source code', href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.Pagination' },
      { label: 'Sample API', href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/samples/HexGuard.SampleApi' },
      { label: '.NET workspace docs', href: 'https://github.com/HexGuard/hexguard/blob/main/dotnet/README.md' },
    ],
    demos: [DOTNET_PAGINATION_HOME],
  },
  {
    id: 'hexguard-problem-details',
    route: '/dotnet/hexguard-problem-details',
    label: 'HexGuard ProblemDetails',
    title: 'HexGuard.ProblemDetails',
    nugetId: 'HexGuard.ProblemDetails',
    description:
      'RFC 9457 Problem Details types, builder, middleware, and Minimal API result extensions for .NET. Pairs with @hexguard/angular-api-errors.',
    summary:
      'RFC 9457 Problem Details — core types, builder, middleware, and Minimal API IResult extensions for producing standard error responses.',
    status: 'Available',
    docsLinks: [
      {
        label: 'Source code',
        href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.ProblemDetails',
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
    demos: [DOTNET_PROBLEM_DETAILS_HOME],
  },
  {
    id: 'hexguard-capabilities',
    route: '/dotnet/hexguard-capabilities',
    label: 'HexGuard Capabilities',
    title: 'HexGuard.Capabilities',
    nugetId: 'HexGuard.Capabilities',
    description:
      'Capability and role contracts for ASP.NET Core APIs with persona-based evaluation. Pairs with @hexguard/angular-permissions.',
    summary:
      'ICapabilityService, InMemoryCapabilityStore, and Minimal API endpoints for persona-based role/permission gating.',
    status: 'Available',
    docsLinks: [
      {
        label: 'Source code',
        href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.Capabilities',
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
    demos: [DOTNET_CAPABILITIES_HOME],
  },
  {
    id: 'hexguard-feature-flags',
    route: '/dotnet/hexguard-feature-flags',
    label: 'HexGuard FeatureFlags',
    title: 'HexGuard.FeatureFlags',
    nugetId: 'HexGuard.FeatureFlags',
    description:
      'Feature flag evaluation, targeting rules, and sync endpoints for ASP.NET Core APIs. Pairs with @hexguard/angular-feature-flags.',
    summary:
      'Pure evaluator with 8 targeting rule types, IFeatureFlagStore, InMemoryFeatureFlagStore, and Minimal API endpoints for sync and evaluation.',
    status: 'Available',
    docsLinks: [
      {
        label: 'Source code',
        href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.FeatureFlags',
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
    demos: [DOTNET_FEATURE_FLAGS_HOME],
  },
  {
    id: 'hexguard-bulk-operations',
    route: '/dotnet/hexguard-bulk-operations',
    label: 'HexGuard BulkOperations',
    title: 'HexGuard.BulkOperations',
    nugetId: 'HexGuard.BulkOperations',
    description:
      'Bulk action contracts, response builder, and ASP.NET Core endpoint helpers for HTTP 207 Multi-Status partial-success scenarios. Pairs with @hexguard/angular-bulk-operations.',
    summary:
      'BulkOperationResultBuilder, Results.Extensions.BulkOperation(), and RFC 9457 Problem Details integration for bulk action endpoints.',
    status: 'Available',
    docsLinks: [
      {
        label: 'Source code',
        href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.BulkOperations',
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
    demos: [DOTNET_BULK_OPERATIONS_HOME],
  },
  {
    id: 'hexguard-validation-contracts',
    route: '/dotnet/hexguard-validation-contracts',
    label: 'HexGuard .NET Validation',
    title: 'HexGuard.ValidationContracts',
    nugetId: 'HexGuard.ValidationContracts',
    description:
      'Validation error contracts (field path, code, message) and RFC 9457 Problem Details helpers for .NET APIs, demonstrated through the shared HexGuard.SampleApi.',
    summary:
      'Standard error contracts with RFC 9457 Problem Details mapping and optional FluentValidation integration.',
    status: 'Available',
    docsLinks: [
      {
        label: 'Source code',
        href: 'https://github.com/HexGuard/hexguard/tree/main/dotnet/src/HexGuard.ValidationContracts',
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
    demos: [DOTNET_VALIDATION_CONTRACTS_HOME],
  },
  {
    id: 'hexguard-reference-data',
    route: '/dotnet/hexguard-reference-data',
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
