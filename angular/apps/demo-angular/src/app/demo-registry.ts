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

const ANGULAR_URL_STATE_DOCS = [
  {
    label: 'Package README',
    href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-url-state/README.md',
  },
  {
    label: 'Deep package notes',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-url-state.md',
  },
  {
    label: 'Demo runbook',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
  },
] as const satisfies readonly DemoLink[];

const ANGULAR_QUERY_FORM_DOCS = [
  {
    label: 'Package README',
    href: 'https://github.com/HexGuard/hexguard/blob/main/angular/packages/angular-query-form/README.md',
  },
  {
    label: 'Deep package notes',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-query-form.md',
  },
  {
    label: 'Demo runbook',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
  },
] as const satisfies readonly DemoLink[];

const ANGULAR_ASYNC_STATE_DOCS = [
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
] as const satisfies readonly DemoLink[];

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
    label: 'Orders state setup',
    description: 'The real urlState schema, options, and computed state used by the orders demo.',
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
    label: 'Dashboard state setup',
    description:
      'The real urlState schema, options, and computed state used by the dashboard demo.',
  },
};

export const ANGULAR_URL_STATE_PACKAGE: DemoPackageEntry = {
  id: 'angular-url-state',
  route: '/packages/angular-url-state',
  label: 'Angular URL State',
  title: '@hexguard/angular-url-state',
  description:
    'Signal-first URL state demos that combine live behavior, deterministic query params, and source-backed implementation excerpts.',
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
    label: 'Orders query-form setup',
    description: 'The real Reactive Forms and queryForm setup used by the orders demo.',
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
    label: 'Recovery query-form setup',
    description: 'The real queryForm configuration for invalid-link cleanup and history replay.',
  },
};

export const ANGULAR_QUERY_FORM_PACKAGE: DemoPackageEntry = {
  id: 'angular-query-form',
  route: '/packages/angular-query-form',
  label: 'Angular Query Form',
  title: '@hexguard/angular-query-form',
  description:
    'Reactive Forms demos that show subset binding, staged apply mode, history replay, and malformed-link recovery.',
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
    label: 'Async value demo setup',
    description:
      'The real asyncState configuration and derived lifecycle summary used by this demo.',
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
    label: 'Async action demo setup',
    description:
      'The real asyncAction configuration and duplicate-run instrumentation used by this demo.',
  },
};

export const ANGULAR_ASYNC_STATE_PACKAGE: DemoPackageEntry = {
  id: 'angular-async-state',
  route: '/packages/angular-async-state',
  label: 'Angular Async State',
  title: '@hexguard/angular-async-state',
  description:
    'Signal-first async value and async action demos that keep lifecycle state explicit, typed, and source-backed.',
  docsLinks: ANGULAR_ASYNC_STATE_DOCS,
  demos: [ANGULAR_ASYNC_STATE_VALUE_DEMO, ANGULAR_ASYNC_STATE_ACTION_DEMO],
};

export const DEMO_PACKAGES = [
  ANGULAR_URL_STATE_PACKAGE,
  ANGULAR_QUERY_FORM_PACKAGE,
  ANGULAR_ASYNC_STATE_PACKAGE,
] as const;
export const DEMO_PAGES = DEMO_PACKAGES.flatMap((entry) => entry.demos);

export function getDemoPackage(packageId: string): DemoPackageEntry | undefined {
  return DEMO_PACKAGES.find((entry) => entry.id === packageId);
}

export function getDemoPage(pageId: string): DemoPageEntry | undefined {
  return DEMO_PAGES.find((entry) => entry.id === pageId);
}
