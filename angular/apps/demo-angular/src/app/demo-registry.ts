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

const ANGULAR_URL_STATE_DOCS = ANGULAR_URL_STATE_CATALOG.docsLinks;
const ANGULAR_QUERY_FORM_DOCS = ANGULAR_QUERY_FORM_CATALOG.docsLinks;
const ANGULAR_ASYNC_STATE_DOCS = ANGULAR_ASYNC_STATE_CATALOG.docsLinks;

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
