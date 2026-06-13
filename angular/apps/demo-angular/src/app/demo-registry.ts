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

export const ANGULAR_URL_STATE_ORDERS_DEMO: DemoPageEntry = {
  id: 'orders',
  packageId: 'angular-url-state',
  route: '/packages/angular-url-state/orders',
  legacyRoute: '/orders',
  label: 'Orders Search',
  title: 'Orders search with debounced replace-state filters',
  description:
    'Search text, status, pagination, and tags all stay aligned with shareable query parameters.',
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
  title: 'Orders filters driven by Reactive Forms and query params',
  description:
    'Reactive Forms controls stay aligned with debounced URL state, pagination reset rules, and generated source snippets.',
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
    'Reactive Forms demos that show typed query binding, reset-on-change rules, history replay, and malformed-link recovery.',
  docsLinks: ANGULAR_QUERY_FORM_DOCS,
  demos: [ANGULAR_QUERY_FORM_ORDERS_DEMO, ANGULAR_QUERY_FORM_RECOVERY_DEMO],
};

export const DEMO_PACKAGES = [ANGULAR_URL_STATE_PACKAGE, ANGULAR_QUERY_FORM_PACKAGE] as const;
export const DEMO_PAGES = DEMO_PACKAGES.flatMap((entry) => entry.demos);

export function getDemoPackage(packageId: string): DemoPackageEntry | undefined {
  return DEMO_PACKAGES.find((entry) => entry.id === packageId);
}

export function getDemoPage(pageId: string): DemoPageEntry | undefined {
  return DEMO_PAGES.find((entry) => entry.id === pageId);
}
