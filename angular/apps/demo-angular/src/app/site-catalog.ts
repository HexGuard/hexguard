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

/** Scope identifier used by the unified package card system. */
export type UnifiedScope = 'Angular' | '.NET' | 'Cross-stack';

/**
 * Unified package entry for rendering any package (Angular, .NET, or
 * cross-stack) through a single card component.
 *
 * Build via the adapter functions below rather than constructing directly.
 */
export interface UnifiedPackageEntry {
  readonly id: string;
  readonly packageName: string;
  readonly scope: UnifiedScope;
  readonly status: string;
  readonly summary: string;
  readonly detail: string | null;
  readonly featureHighlights: readonly string[];
  readonly route: string;
  readonly demoCount: number;
  /** Display label for the counterpart package in the other stack, if any. */
  readonly counterpartLabel: string | null;
  /** Router link to the counterpart package hub, if any. */
  readonly counterpartRoute: string | null;
  readonly repositoryHref: string;
  readonly docsLinks: readonly { label: string; href: string }[];
  readonly installCommand: string | null;
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
export const SECTION_COLLAPSED_LIMIT = 6;

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

// ── Package ecosystems ─────────────────────────────────────────────

/**
 * A package ecosystem groups multiple packages across stacks that solve
 * a common problem together. Unlike a cross-stack pair (which is 1:1
 * Angular↔.NET), an ecosystem can contain any number of packages from
 * any stacks, each with a named role.
 *
 * Ecosystems drive the cross-stack hub pages and help consumers discover
 * related packages that address different layers of the same concern.
 */
export interface PackageEcosystemMember {
  readonly scope: UnifiedScope;
  readonly packageId: string;
  readonly label: string;
  readonly role: string;
  readonly route: string;
}

export interface PackageEcosystem {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly members: readonly PackageEcosystemMember[];
}

/**
 * Ecosystems define multi-package relationships that cross stacks.
 * Each ecosystem has a canonical hub route at `/ecosystems/{id}`.
 */
export const SITE_ECOSYSTEMS: readonly PackageEcosystem[] = [
  {
    id: 'rfc-9457-problem-details',
    label: 'RFC 9457 Problem Details',
    description:
      'End-to-end typed error pipeline: HexGuard.ProblemDetails produces the RFC 9457 payload, HexGuard.ValidationContracts extends it with validation-specific types, and @hexguard/angular-api-errors consumes it on the Angular side.',
    members: [
      {
        scope: 'Angular',
        packageId: 'angular-api-errors',
        label: '@hexguard/angular-api-errors',
        role: 'Consumer',
        route: '/packages/angular-api-errors',
      },
      {
        scope: '.NET',
        packageId: 'hexguard-problem-details',
        label: 'HexGuard.ProblemDetails',
        role: 'Foundation',
        route: '/dotnet/hexguard-problem-details',
      },
      {
        scope: '.NET',
        packageId: 'hexguard-validation-contracts',
        label: 'HexGuard.ValidationContracts',
        role: 'Validation Extension',
        route: '/dotnet/hexguard-validation-contracts',
      },
    ],
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

// ── Unified package adapters ───────────────────────────────────────

/**
 * Adapt an Angular SitePackageCatalogEntry to the unified card interface.
 * Cross-stack counterpart info is baked into the entry's dotnet fields.
 */
export function toUnifiedAngularEntry(
  entry: SitePackageCatalogEntry,
): UnifiedPackageEntry {
  return {
    id: entry.id,
    packageName: entry.packageName,
    scope: 'Angular',
    status: entry.status,
    summary: entry.summary,
    detail: entry.detail,
    featureHighlights: entry.featureHighlights,
    route: entry.route,
    demoCount: entry.demoCount,
    counterpartLabel: entry.dotnetCounterpartLabel,
    counterpartRoute: entry.dotnetCounterpartId
      ? `/dotnet/${entry.dotnetCounterpartId}`
      : null,
    repositoryHref: entry.repositoryHref,
    docsLinks: entry.docsLinks,
    installCommand: entry.installCommand,
  };
}

/**
 * Adapt a .NET DotnetSitePackageCatalogEntry to the unified card interface.
 * Uses dotnetPackage fields for docs and source links.
 */
export function toUnifiedDotnetEntry(
  entry: DotnetSitePackageCatalogEntry,
): UnifiedPackageEntry {
  return {
    id: entry.id,
    packageName: entry.packageName,
    scope: '.NET',
    status: entry.status,
    summary: entry.summary,
    detail: null,
    featureHighlights: [],
    route: entry.route,
    demoCount: entry.demoCount,
    counterpartLabel: entry.angularCounterpartLabel,
    counterpartRoute: entry.angularCounterpartId
      ? `/packages/${entry.angularCounterpartId}`
      : null,
    repositoryHref: entry.dotnetPackage.docsLinks[0]?.href ?? '',
    docsLinks: entry.dotnetPackage.docsLinks,
    installCommand: `dotnet add package ${entry.nugetId}`,
  };
}

/**
 * Adapt a CrossStackPair to the unified card interface.
 * Uses the Angular package name and route as the primary identity,
 * with the .NET package as the counterpart.
 */
function toUnifiedCrossStackEntry(
  pair: CrossStackPair,
): UnifiedPackageEntry {
  return {
    id: pair.angularId,
    packageName: pair.angularLabel,
    scope: 'Cross-stack',
    status: 'Available',
    summary: pair.description,
    detail: null,
    featureHighlights: [],
    route: `/cross-stack/${pair.angularId}`,
    demoCount: 2, // one from each stack
    counterpartLabel: pair.dotnetLabel,
    counterpartRoute: `/dotnet/${pair.dotnetId}`,
    repositoryHref:
      'https://github.com/HexGuard/hexguard',
    docsLinks: [],
    installCommand: null,
  };
}

// ── Cross-stack package hub entry ─────────────────────────────────

export interface CrossStackPackageHubEntry {
  readonly id: string;
  readonly angularId: string;
  readonly dotnetId: string;
  readonly pairingLabel: string;
  readonly description: string;
  readonly angularPackage: SitePackageCatalogEntry;
  readonly dotnetPackage: DotnetSitePackageCatalogEntry;
  readonly integrationNotes: readonly string[];
}

let _crossStackHubEntries: readonly CrossStackPackageHubEntry[] | null = null;

function buildCrossStackHubEntry(pair: CrossStackPair): CrossStackPackageHubEntry {
  const angularPkg = getCurrentPackages().find((p) => p.id === pair.angularId);
  const dotnetPkg = getDotnetPackages().find((p) => p.id === pair.dotnetId);

  if (!angularPkg || !dotnetPkg) {
    throw new Error(
      `Cannot build cross-stack hub entry for pair ${pair.angularId} / ${pair.dotnetId}: missing package data.`,
    );
  }

  return {
    id: pair.angularId,
    angularId: pair.angularId,
    dotnetId: pair.dotnetId,
    pairingLabel: pair.pairingLabel,
    description: pair.description,
    angularPackage: angularPkg,
    dotnetPackage: dotnetPkg,
    integrationNotes: [
      `The ${angularPkg.packageName} Angular package and ${dotnetPkg.packageName} .NET library work together through the shared HexGuard.SampleApi.`,
      `Angular code consumes typed contracts (${pair.pairingLabel}) that the .NET library validates and serves. ` +
        `The SampleApi provides live endpoints that both stacks use for end-to-end integration testing and demo workflows.`,
      `To run the full cross-stack experience, start the API with \`pnpm dotnet:start:demo-api\` and navigate to any demo route that supports live backend integration.`,
    ],
  };
}

export function getCrossStackHubEntries(): readonly CrossStackPackageHubEntry[] {
  if (!_crossStackHubEntries) {
    _crossStackHubEntries = SITE_CROSS_STACK_PAIRS.map(buildCrossStackHubEntry);
  }
  return _crossStackHubEntries;
}

export function getCrossStackHubEntry(pairId: string): CrossStackPackageHubEntry {
  const entry = getCrossStackHubEntries().find((e) => e.id === pairId);
  if (!entry) {
    throw new Error(`Missing cross-stack hub entry for ${pairId}.`);
  }
  return entry;
}

let _unifiedPackages: readonly UnifiedPackageEntry[] | null = null;

/**
 * Returns the combined list of all packages (Angular, .NET, cross-stack)
 * as unified entries for the site home showcase.
 */
export function getUnifiedPackages(): readonly UnifiedPackageEntry[] {
  if (!_unifiedPackages) {
    _unifiedPackages = [
      ...getCurrentPackages().map(toUnifiedAngularEntry),
      ...getDotnetPackages().map(toUnifiedDotnetEntry),
      ...SITE_CROSS_STACK_PAIRS.map(toUnifiedCrossStackEntry),
    ];
  }
  return _unifiedPackages;
}

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
  return GENERATED_CURRENT_PACKAGES.filter((packageEntry) => packageEntry.scope === 'Angular').map(
    (packageEntry) => {
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
    },
  );
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
    label: 'Current packages',
    value: String(getUnifiedPackages().length),
  },
  {
    label: 'Live demo routes',
    value: String(
      getCurrentPackages().reduce((total, entry) => total + entry.demoCount, 0) +
        getDotnetPackages().reduce((total, entry) => total + entry.demoCount, 0),
    ),
  },
  {
    label: 'Cross-stack pairs',
    value: String(SITE_CROSS_STACK_PAIRS.length),
  },
  {
    label: 'Stacks covered',
    value: '3',
  },
] as const satisfies readonly SiteMetric[];
