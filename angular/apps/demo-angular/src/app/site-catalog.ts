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

/**
 * A package ecosystem groups multiple packages across stacks that solve
 * a common problem together. An ecosystem can contain 2+ packages from
 * any stacks, each with a named role.
 *
 * A 2-package Angular↔.NET ecosystem behaves like the former "cross-stack
 * pair" — the `pairingLabel` is shown as the ecosystem eyebrow.
 */
export interface EcosystemMember {
  readonly packageId: string;
  readonly role: string;
}

export interface Ecosystem {
  readonly id: string;
  readonly label: string;
  readonly pairingLabel: string;
  readonly description: string;
  readonly members: readonly EcosystemMember[];
  readonly integrationNotes: readonly string[];
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

// ── Package ecosystems ─────────────────────────────────────────────

/**
 * Ecosystems define multi-package relationships across stacks.
 * Each ecosystem has 2+ members and a hub route at `/ecosystems/{id}`.
 *
 * A 2-package ecosystem (Angular↔.NET) replaces the former "cross-stack pair".
 * A 3+-package ecosystem shows the layered relationship (e.g. Consumer,
 * Foundation, Extension) across multiple packages.
 */
export const SITE_ECOSYSTEMS: readonly Ecosystem[] = [
  {
    id: 'reference-data-lookups',
    label: 'Reference data / lookups',
    pairingLabel: 'Reference data / lookups',
    description:
      'The Angular lookup catalog resolves labels from the same typed reference-data payload that the .NET library validates. The shared SampleApi proves end-to-end integration.',
    members: [
      { packageId: 'angular-lookups', role: 'Consumer' },
      { packageId: 'hexguard-reference-data', role: 'Provider' },
    ],
    integrationNotes: [
      'The @hexguard/angular-lookups Angular package and HexGuard.ReferenceData .NET library work together through the shared HexGuard.SampleApi.',
      'Angular code consumes typed lookup catalogs that the .NET library validates and serves. The SampleApi provides live endpoints for end-to-end integration.',
      'To run the full cross-stack experience, start the API with `pnpm dotnet:start:demo-api` and navigate to the lookups backend demo route.',
    ],
  },
  {
    id: 'rfc-9457-problem-details',
    label: 'RFC 9457 Problem Details',
    pairingLabel: 'Validation / RFC 9457',
    description:
      'End-to-end typed error pipeline: HexGuard.ProblemDetails produces the RFC 9457 payload, HexGuard.ValidationContracts extends it with validation-specific types, and @hexguard/angular-api-errors consumes it on the Angular side.',
    members: [
      { packageId: 'angular-api-errors', role: 'Consumer' },
      { packageId: 'hexguard-problem-details', role: 'Foundation' },
      { packageId: 'hexguard-validation-contracts', role: 'Validation Extension' },
    ],
    integrationNotes: [
      'The @hexguard/angular-api-errors Angular package consumes RFC 9457 Problem Details payloads that HexGuard.ProblemDetails produces and HexGuard.ValidationContracts extends.',
      'HexGuard.ProblemDetails provides the core ProblemDetails record and middleware. HexGuard.ValidationContracts adds validation-specific types (ValidationError, FieldPath, ValidationResult) and a Problem Details adapter.',
      'All three packages share the HexGuard.SampleApi for live demos. Start the API with `pnpm dotnet:start:demo-api` and navigate to any validation demo route.',
    ],
  },
  {
    id: 'feature-flags',
    label: 'Feature flags',
    pairingLabel: 'Feature flags',
    description:
      'The Angular feature-flag evaluator shares the same flag contract and sync protocol as the .NET FeatureFlags library. The shared SampleApi proves end-to-end integration with persona-based evaluation.',
    members: [
      { packageId: 'angular-feature-flags', role: 'Consumer' },
      { packageId: 'hexguard-feature-flags', role: 'Provider' },
    ],
    integrationNotes: [
      'The @hexguard/angular-feature-flags Angular package and HexGuard.FeatureFlags .NET library work together through the shared sync API.',
      'The .NET library defines flags via InMemoryFeatureFlagStore and serves them via the sync/evaluate endpoints. The Angular library consumes the same payloads through FeatureFlagSyncService.',
      'To run the full cross-stack experience, start the API with `pnpm dotnet:start:demo-api` and navigate to the feature-flag demo routes.',
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
  { angularId: 'angular-feature-flags', angularLabel: '@hexguard/angular-feature-flags' },
];

/** Map from Angular package id to .NET counterpart id. */
const ANGULAR_TO_DOTNET_COUNTERPART: Record<string, string | null> = {
  'angular-lookups': 'hexguard-reference-data',
  'angular-api-errors': 'hexguard-validation-contracts',
  'angular-feature-flags': 'hexguard-feature-flags',
};

/** Map from .NET package id to Angular counterpart id. */
const DOTNET_TO_ANGULAR_COUNTERPART: Record<string, string | null> = {
  'hexguard-reference-data': 'angular-lookups',
  'hexguard-validation-contracts': 'angular-api-errors',
  'hexguard-feature-flags': 'angular-feature-flags',
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

let _unifiedPackages: readonly UnifiedPackageEntry[] | null = null;

/**
 * Returns the combined list of all packages (Angular, .NET, ecosystem)
 * as unified entries for the site home showcase.
 *
 * Ecosystem entries use the ecosystem id prefixed with "eco-" as their
 * package id to avoid collisions with individual package ids.
 */
export function getUnifiedPackages(): readonly UnifiedPackageEntry[] {
  if (!_unifiedPackages) {
    const ecosystems: UnifiedPackageEntry[] = SITE_ECOSYSTEMS.map((eco) => {
      // Use the first Angular member as the primary identity, or fall back
      // to the first .NET member.
      const firstPkg =
        getCurrentPackages().find((p) => p.id === eco.members[0]?.packageId) ??
        getDotnetPackages().find((p) => p.id === eco.members[0]?.packageId);

      const npmLabel = firstPkg?.packageName ?? eco.members[0]?.packageId ?? eco.id;
      const route = `/ecosystems/${eco.id}`;
      const totalDemos = eco.members.reduce((sum, m) => {
        const pkg =
          getCurrentPackages().find((p) => p.id === m.packageId) ??
          getDotnetPackages().find((p) => p.id === m.packageId);
        return sum + (pkg?.demoCount ?? 0);
      }, 0);

      return {
        id: `eco-${eco.id}`,
        packageName: npmLabel,
        scope: 'Cross-stack' as UnifiedScope,
        status: 'Available',
        summary: eco.description,
        detail: null,
        featureHighlights: [],
        route,
        demoCount: totalDemos,
        counterpartLabel: null,
        counterpartRoute: null,
        repositoryHref: 'https://github.com/HexGuard/hexguard',
        docsLinks: [],
        installCommand: null,
      };
    });

    _unifiedPackages = [
      ...getCurrentPackages().map(toUnifiedAngularEntry),
      ...getDotnetPackages().map(toUnifiedDotnetEntry),
      ...ecosystems,
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
    value: String(SITE_ECOSYSTEMS.length),
  },
  {
    label: 'Stacks covered',
    value: '3',
  },
] as const satisfies readonly SiteMetric[];
