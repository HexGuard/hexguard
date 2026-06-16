import {
  DOTNET_PACKAGES,
  getDemoPackage,
  type DemoPackageEntry,
  type DotnetPackageEntry,
} from './demo-registry';
import {
  GENERATED_CURRENT_PACKAGES,
  GENERATED_ROADMAP_PACKAGES,
  type GeneratedCurrentPackageCatalogEntry,
  type GeneratedRoadmapPackageEntry,
} from './generated/package-catalog';

export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

export interface SitePackageCatalogEntry extends GeneratedCurrentPackageCatalogEntry {
  readonly route: string;
  readonly demoCount: number;
  readonly demoPackage: DemoPackageEntry;
  /** ID of the .NET counterpart package, if any. */
  readonly dotnetCounterpartId: string | null;
  /** Display label for the .NET counterpart, if any. */
  readonly dotnetCounterpartLabel: string | null;
}

export interface DotnetSitePackageCatalogEntry {
  readonly id: string;
  readonly packageName: string;
  readonly nugetId: string;
  readonly status: string;
  readonly summary: string;
  readonly route: string;
  readonly demoCount: number;
  readonly dotnetPackage: DotnetPackageEntry;
  /** ID of the Angular counterpart package, if any. */
  readonly angularCounterpartId: string | null;
  /** Display label for the Angular counterpart, if any. */
  readonly angularCounterpartLabel: string | null;
}

export interface CrossStackPair {
  readonly angularId: string;
  readonly angularLabel: string;
  readonly dotnetId: string;
  readonly dotnetLabel: string;
  readonly pairingLabel: string;
  readonly description: string;
}

export type RoadmapPackageEntry = GeneratedRoadmapPackageEntry;

export interface SitePillar {
  readonly title: string;
  readonly description: string;
}

export interface SiteMetric {
  readonly label: string;
  readonly value: string;
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

/** Number of cards to show in a collapsed section before the expand toggle. */
export const SECTION_COLLAPSED_LIMIT = 4;

/** Number of cross-stack pair cards to show before the expand toggle. */
export const CROSS_STACK_COLLAPSED_LIMIT = 3;

/**
 * Known cross-stack pairs between Angular packages and .NET packages.
 * These are packages that share domain concepts, a shared API, or
 * complementary contracts (e.g. lookups + reference data).
 */
export const SITE_CROSS_STACK_PAIRS: readonly CrossStackPair[] = [
  {
    angularId: 'angular-lookups',
    angularLabel: '@hexguard/angular-lookups',
    dotnetId: 'hexguard-reference-data',
    dotnetLabel: 'HexGuard.ReferenceData',
    pairingLabel: 'Reference data / lookups',
    description:
      'The Angular lookup catalog resolves labels from the same typed reference-data payload that the .NET library validates. The shared SampleApi proves end-to-end integration.',
  },
  {
    angularId: 'angular-api-errors',
    angularLabel: '@hexguard/angular-api-errors',
    dotnetId: 'hexguard-validation-contracts',
    dotnetLabel: 'HexGuard.ValidationContracts',
    pairingLabel: 'Validation / RFC 9457',
    description:
      'Angular ApiErrors consumes RFC 9457 Problem Details payloads that the .NET ValidationContracts library produces, creating a typed error pipeline from backend to form control.',
  },
];

/**
 * Angular packages that consume the shared .NET SampleApi for live demos.
 * These are listed in the cross-stack section as shared-API consumers.
 */
export const SITE_SHARED_API_CONSUMERS: readonly {
  readonly angularId: string;
  readonly angularLabel: string;
}[] = [
  { angularId: 'angular-async-state', angularLabel: '@hexguard/angular-async-state' },
  { angularId: 'angular-optimistic-state', angularLabel: '@hexguard/angular-optimistic-state' },
  { angularId: 'angular-permissions', angularLabel: '@hexguard/angular-permissions' },
];

/** Map from Angular package id to .NET counterpart id. */
const ANGULAR_TO_DOTNET_COUNTERPART: Record<string, string | null> = {
  'angular-lookups': 'hexguard-reference-data',
  'angular-api-errors': 'hexguard-validation-contracts',
};

/** Map from .NET package id to Angular counterpart id. */
const DOTNET_TO_ANGULAR_COUNTERPART: Record<string, string | null> = {
  'hexguard-reference-data': 'angular-lookups',
  'hexguard-validation-contracts': 'angular-api-errors',
};

export const SITE_PILLARS = [
  {
    title: 'Docs-grade demos',
    description:
      'Every current package ships with realistic UI flows, stable selectors, and live state inspection so behavior stays easy to verify.',
  },
  {
    title: 'Small, explicit APIs',
    description:
      'HexGuard packages aim for production-grade guardrails without hiding state machines, router behavior, or async lifecycle behind abstractions you cannot inspect.',
  },
  {
    title: 'Angular first, broader roadmap',
    description:
      'Angular packages anchor the site today, with .NET packages and cross-stack pairs shown through the same shared demo API and validated the same way.',
  },
] as const satisfies readonly SitePillar[];

function buildCurrentPackages(): readonly SitePackageCatalogEntry[] {
  return GENERATED_CURRENT_PACKAGES.map((packageEntry) => {
    const demoPackage = getDemoPackage(packageEntry.id);

    if (!demoPackage) {
      throw new Error(`Missing demo package for site catalog entry ${packageEntry.id}.`);
    }

    const dotnetCounterpartId = ANGULAR_TO_DOTNET_COUNTERPART[packageEntry.id] ?? null;
    const dotnetCounterpart = dotnetCounterpartId
      ? DOTNET_PACKAGES.find((p) => p.id === dotnetCounterpartId)
      : null;

    return {
      ...packageEntry,
      route: demoPackage.route,
      demoCount: demoPackage.demos.length,
      demoPackage,
      dotnetCounterpartId,
      dotnetCounterpartLabel: dotnetCounterpart?.nugetId ?? null,
    };
  });
}

let _currentPackages: readonly SitePackageCatalogEntry[] | null = null;

function getCurrentPackages(): readonly SitePackageCatalogEntry[] {
  if (!_currentPackages) {
    _currentPackages = buildCurrentPackages();
  }
  return _currentPackages;
}

export function getSitePackage(packageId: string): SitePackageCatalogEntry {
  const packageEntry = getCurrentPackages().find((entry) => entry.id === packageId);

  if (!packageEntry) {
    throw new Error(`Missing site package entry for ${packageId}.`);
  }

  return packageEntry;
}

export function getDotnetSitePackage(packageId: string): DotnetSitePackageCatalogEntry {
  const packageEntry = getDotnetPackages().find((entry) => entry.id === packageId);

  if (!packageEntry) {
    throw new Error(`Missing dotnet site package entry for ${packageId}.`);
  }

  return packageEntry;
}

function buildDotnetPackages(): readonly DotnetSitePackageCatalogEntry[] {
  return DOTNET_PACKAGES.map((dotnetPackage) => {
    const angularCounterpartId = DOTNET_TO_ANGULAR_COUNTERPART[dotnetPackage.id] ?? null;
    const angularCounterpart = angularCounterpartId
      ? GENERATED_CURRENT_PACKAGES.find((p) => p.id === angularCounterpartId)
      : null;

    return {
      id: dotnetPackage.id,
      packageName: dotnetPackage.nugetId,
      nugetId: dotnetPackage.nugetId,
      status: dotnetPackage.status,
      summary: dotnetPackage.summary,
      route: dotnetPackage.route,
      demoCount: dotnetPackage.demos.length,
      dotnetPackage,
      angularCounterpartId,
      angularCounterpartLabel: angularCounterpart?.packageName ?? null,
    };
  });
}

let _dotnetPackages: readonly DotnetSitePackageCatalogEntry[] | null = null;

function getDotnetPackages(): readonly DotnetSitePackageCatalogEntry[] {
  if (!_dotnetPackages) {
    _dotnetPackages = buildDotnetPackages();
  }
  return _dotnetPackages;
}

export const SITE_DOTNET_PACKAGES: readonly DotnetSitePackageCatalogEntry[] = getDotnetPackages();

export const SITE_CURRENT_PACKAGES: readonly SitePackageCatalogEntry[] = getCurrentPackages();

export const SITE_ROADMAP_PACKAGES = GENERATED_ROADMAP_PACKAGES.filter(
  (entry) => entry.showOnSiteHome,
);

export const SITE_METRICS = [
  {
    label: 'Current Angular packages',
    value: String(getCurrentPackages().length),
  },
  {
    label: 'Live demo routes',
    value: String(getCurrentPackages().reduce((total, entry) => total + entry.demoCount, 0)),
  },
  {
    label: '.NET packages and demos',
    value: String(getDotnetPackages().length),
  },
] as const satisfies readonly SiteMetric[];
