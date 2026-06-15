import { DEMO_PACKAGES, type DemoPackageEntry } from './demo-registry';

export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

export interface SitePackageCatalogEntry {
  readonly id: string;
  readonly packageName: string;
  readonly status: 'Available' | 'In Progress';
  readonly scope: 'Angular';
  readonly summary: string;
  readonly detail: string;
  readonly featureHighlights: readonly string[];
  readonly route: string;
  readonly repositoryHref: string;
  readonly docsLinks: readonly SiteLink[];
  readonly demoCount: number;
  readonly demoPackage: DemoPackageEntry;
}

export interface RoadmapPackageEntry {
  readonly id: string;
  readonly packageName: string;
  readonly scope: 'Angular' | '.NET' | 'Cross-stack';
  readonly status: 'Planned' | 'Proposed';
  readonly summary: string;
  readonly docsHref: string;
}

export interface SitePillar {
  readonly title: string;
  readonly description: string;
}

export interface SiteMetric {
  readonly label: string;
  readonly value: string;
}

type CurrentPackageContent = {
  readonly packageName: string;
  readonly status: 'Available' | 'In Progress';
  readonly scope: 'Angular';
  readonly summary: string;
  readonly detail: string;
  readonly featureHighlights: readonly string[];
  readonly repositoryHref: string;
};

const CURRENT_PACKAGE_CONTENT = {
  'angular-url-state': {
    packageName: '@hexguard/angular-url-state',
    status: 'Available',
    scope: 'Angular',
    summary: 'Typed, signal-first synchronization between Angular state and URL query params.',
    detail:
      'Designed for filters, dashboards, and shareable deep links where query params need stable decoding, compact keys, and browser-history-aware updates.',
    featureHighlights: [
      'Deterministic query serialization and safe invalid-param fallback behavior.',
      'Signal-first state with typed codecs and compact query-key remapping.',
      'Docs-grade demos for filter screens and browser-history-friendly dashboards.',
    ],
    repositoryHref:
      'https://github.com/HexGuard/hexguard/tree/main/angular/packages/angular-url-state',
  },
  'angular-query-form': {
    packageName: '@hexguard/angular-query-form',
    status: 'In Progress',
    scope: 'Angular',
    summary: 'Reactive Forms binding for typed query params, staged apply mode, and recovery flows.',
    detail:
      'Built for filter-heavy pages that need URL-owned state, partial form ownership, reset-on-change rules, and malformed-link cleanup without hand-written glue.',
    featureHighlights: [
      'Manual apply mode for staged form commits on noisy filter surfaces.',
      'Managed key subsets so page and page size can stay URL-owned when needed.',
      'Recovery demos that prove invalid-link cleanup and coherent history replay.',
    ],
    repositoryHref:
      'https://github.com/HexGuard/hexguard/tree/main/angular/packages/angular-query-form',
  },
  'angular-async-state': {
    packageName: '@hexguard/angular-async-state',
    status: 'In Progress',
    scope: 'Angular',
    summary: 'Signal-first async value, observable, and action lifecycle state for Angular screens.',
    detail:
      'Focused on explicit loading, success, stale-data, failure, and duplicate-run behavior for async reads, live streams, and submit-style actions.',
    featureHighlights: [
      'Headless primitives for async value, observable state, and async action flows.',
      'Optional outlet helpers that keep lifecycle templates explicit instead of magical.',
      'Demos for stale-data reloads, reconnectable streams, and duplicate submit reuse.',
    ],
    repositoryHref:
      'https://github.com/HexGuard/hexguard/tree/main/angular/packages/angular-async-state',
  },
} as const satisfies Record<string, CurrentPackageContent>;

function getCurrentPackageContent(packageId: string): CurrentPackageContent {
  const content = CURRENT_PACKAGE_CONTENT[packageId as keyof typeof CURRENT_PACKAGE_CONTENT];

  if (!content) {
    throw new Error(`Missing site-catalog metadata for package ${packageId}.`);
  }

  return content;
}

export const SITE_HEADER_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/HexGuard/hexguard',
  },
  {
    label: 'Package catalog',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md',
  },
  {
    label: 'Demo runbook',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
  },
  {
    label: 'Contributing',
    href: 'https://github.com/HexGuard/hexguard/blob/main/CONTRIBUTING.md',
  },
] as const satisfies readonly SiteLink[];

export const SITE_PRIMARY_ACTIONS = [
  {
    label: 'Browse GitHub repo',
    href: 'https://github.com/HexGuard/hexguard',
  },
  {
    label: 'Open package docs',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md',
  },
  {
    label: 'Read the demo runbook',
    href: 'https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md',
  },
] as const satisfies readonly SiteLink[];

export const SITE_PILLARS = [
  {
    title: 'Docs-grade demos',
    description:
      'Every current Angular package ships with realistic UI flows, stable selectors, and live state inspection so behavior stays easy to verify.',
  },
  {
    title: 'Small, explicit APIs',
    description:
      'HexGuard packages aim for production-grade guardrails without hiding state machines, router behavior, or async lifecycle behind abstractions you cannot inspect.',
  },
  {
    title: 'Angular first, broader roadmap',
    description:
      'Today the site highlights Angular packages and demos, while the wider catalog previews .NET and cross-stack guardrails that fit the same design style.',
  },
] as const satisfies readonly SitePillar[];

export const SITE_CURRENT_PACKAGES: readonly SitePackageCatalogEntry[] = DEMO_PACKAGES.map(
  (demoPackage) => {
    const content = getCurrentPackageContent(demoPackage.id);

    return {
      id: demoPackage.id,
      packageName: content.packageName,
      status: content.status,
      scope: content.scope,
      summary: content.summary,
      detail: content.detail,
      featureHighlights: content.featureHighlights,
      route: demoPackage.route,
      repositoryHref: content.repositoryHref,
      docsLinks: demoPackage.docsLinks,
      demoCount: demoPackage.demos.length,
      demoPackage,
    };
  },
);

export function getSitePackage(packageId: string): SitePackageCatalogEntry {
  const packageEntry = SITE_CURRENT_PACKAGES.find((entry) => entry.id === packageId);

  if (!packageEntry) {
    throw new Error(`Missing site package entry for ${packageId}.`);
  }

  return packageEntry;
}

export const SITE_ROADMAP_PACKAGES = [
  {
    id: 'angular-api-errors',
    packageName: '@hexguard/angular-api-errors',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Normalize validation and business-rule failures into Angular-friendly error state with explicit payload mapping.',
    docsHref:
      'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md#package-angular-api-errors',
  },
  {
    id: 'angular-table-state',
    packageName: '@hexguard/angular-table-state',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Coordinate sorting, paging, filters, and selection for reusable admin-table workflows.',
    docsHref:
      'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md#package-angular-table-state',
  },
  {
    id: 'angular-dirty-state',
    packageName: '@hexguard/angular-dirty-state',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Track unsaved changes consistently across forms, route transitions, and long-lived edit flows.',
    docsHref:
      'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md#package-angular-dirty-state',
  },
  {
    id: 'angular-permissions',
    packageName: '@hexguard/angular-permissions',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Standardize permission and capability checks across routes, templates, and action surfaces.',
    docsHref:
      'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md#package-angular-permissions',
  },
  {
    id: 'problemdetails',
    packageName: 'HexGuard.ProblemDetails',
    scope: '.NET',
    status: 'Planned',
    summary:
      'Provide a focused .NET contract for RFC 9457 problem-details creation and mapping.',
    docsHref:
      'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md#package-problemdetails',
  },
  {
    id: 'operation-status',
    packageName: 'HexGuard.OperationStatus',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Pair backend operation contracts with Angular lifecycle surfaces for long-running workflows.',
    docsHref:
      'https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md#cross-stack-candidate-prioritization-matrix',
  },
] as const satisfies readonly RoadmapPackageEntry[];

const demoCount = SITE_CURRENT_PACKAGES.reduce((total, entry) => total + entry.demoCount, 0);

export const SITE_METRICS = [
  {
    label: 'Current Angular packages',
    value: String(SITE_CURRENT_PACKAGES.length),
  },
  {
    label: 'Live demo routes',
    value: String(demoCount),
  },
  {
    label: 'Roadmap entries highlighted',
    value: String(SITE_ROADMAP_PACKAGES.length),
  },
] as const satisfies readonly SiteMetric[];