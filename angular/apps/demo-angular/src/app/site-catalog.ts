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

// ── Stack registry ─────────────────────────────────────────────────

/**
 * Supported stack identifiers. Add new stacks here — the rest of the
 * demo site adapts automatically via the registry below.
 */
export type StackId = 'angular' | 'dotnet' | 'blazor' | 'cross-stack';

/**
 * Metadata for a supported stack. The registry is the single source of
 * truth for display labels, route prefixes, and hub page content.
 */
export interface StackDefinition {
  readonly id: StackId;
  /** Human-readable label, e.g. "Angular", ".NET", "Cross-stack". */
  readonly label: string;
  /** Package-display label, e.g. "Angular", "NuGet", "Cross-stack". */
  readonly packageLabel: string;
  /** URL route prefix for individual package hubs, e.g. "/packages", "/dotnet". */
  readonly routePrefix: string;
  /** URL route for the stack overview hub page. */
  readonly hubRoute: string;
  /** Short hero description for the stack overview hub page. */
  readonly description: string;
}

export const STACK_REGISTRY: Record<StackId, StackDefinition> = {
  angular: {
    id: 'angular',
    label: 'Angular',
    packageLabel: 'Angular',
    routePrefix: '/packages',
    hubRoute: '/angular',
    description: 'Angular guardrail libraries with live demos and Playwright-backed coverage.',
  },
  dotnet: {
    id: 'dotnet',
    label: '.NET',
    packageLabel: 'NuGet',
    routePrefix: '/dotnet',
    hubRoute: '/dotnet',
    description:
      '.NET guardrail libraries and a shared demo API, all demonstrated through the HexGuard.SampleApi.',
  },
  blazor: {
    id: 'blazor',
    label: 'Blazor',
    packageLabel: 'Blazor',
    routePrefix: '/blazor',
    hubRoute: '/blazor',
    description:
      'Headless Blazor component libraries — pure C#, minimal JS interop, interactive demos in the Blazor Web App.',
  },
  'cross-stack': {
    id: 'cross-stack',
    label: 'Cross-stack',
    packageLabel: 'Cross-stack',
    routePrefix: '/ecosystems',
    hubRoute: '/cross-stack',
    description:
      'Packages that share domain concepts, a shared API, or complementary contracts across stacks.',
  },
};

/**
 * Ordered list of stacks for menu/navigation rendering.
 * Excludes special stacks (like cross-stack) where appropriate at call-site.
 */
export const STACK_ORDER: readonly StackId[] = ['angular', 'blazor', 'dotnet', 'cross-stack'];

/** Scope identifier used by the unified package card system. */
export type UnifiedScope = StackId;

// ── Dependencies ───────────────────────────────────────────────────

/**
 * A link from one package to another package it depends on or pairs with.
 * Dependencies can span stacks (Angular↔.NET) or stay within one stack.
 */
export interface PackageDependency {
  readonly packageId: string;
  readonly label: string;
  readonly stack: StackId;
  readonly relationship: string;
  readonly route: string;
}

export interface SitePackageCatalogEntry extends GeneratedCurrentPackageCatalogEntry {
  readonly route: string;
  readonly demoCount: number;
  readonly demoPackage: DemoPackageEntry;
  /** Other packages this one depends on or pairs with. */
  readonly dependencies: readonly PackageDependency[];
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
  /** Other packages this one depends on or pairs with. */
  readonly dependencies: readonly PackageDependency[];
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

/**
 * Unified package entry for rendering any package (Angular, .NET, or
 * cross-stack) through a single card component.
 *
 * Build via the adapter functions below rather than constructing directly.
 */
export interface UnifiedPackageEntry {
  readonly id: string;
  readonly packageName: string;
  readonly category: string | null;
  readonly scope: UnifiedScope;
  readonly status: string;
  readonly summary: string;
  readonly detail: string | null;
  readonly featureHighlights: readonly string[];
  readonly route: string;
  readonly demoCount: number;
  /** Other packages this one depends on or pairs with. */
  readonly dependencies: readonly PackageDependency[];
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
  {
    id: 'bulk-operations',
    label: 'Bulk operations',
    pairingLabel: 'Bulk operations',
    description:
      'The Angular bulk-operations service and facade share the same contract shape as the .NET BulkOperations library. Both use HTTP 207 Multi-Status for partial-success reporting with per-item error details.',
    members: [
      { packageId: 'angular-bulk-operations', role: 'Consumer' },
      { packageId: 'hexguard-bulk-operations', role: 'Provider' },
    ],
    integrationNotes: [
      'The @hexguard/angular-bulk-operations Angular package and HexGuard.BulkOperations .NET library share identical contract shapes (BulkOperationRequest, BulkOperationResponse, BulkOperationResult, BulkOperationError).',
      'The .NET library provides the BulkOperationResultBuilder and IResult extensions. The Angular library consumes the same payloads through the BulkOperationService.',
      'The shared SampleApi exposes demo endpoints at /api/bulk-operations/delete, /approve, and /update-status for end-to-end integration testing.',
    ],
  },
  {
    id: 'upload-state',
    label: 'Upload state',
    pairingLabel: 'Upload state',
    description:
      'The Angular upload-state client (injectUploadState) manages the client-side upload queue with progress, cancel, and retry, while HexGuard.Uploads provides the server-side session model (UploadSession, IUploadStore) and Minimal API endpoints. The shared SampleApi proves end-to-end integration.',
    members: [
      { packageId: 'angular-upload-state', role: 'Consumer' },
      { packageId: 'hexguard-uploads', role: 'Provider' },
    ],
    integrationNotes: [
      'The @hexguard/angular-upload-state Angular package and HexGuard.Uploads .NET library work together through the shared file upload lifecycle.',
      'Angular code manages the client-side upload queue (progress, cancel, retry). The .NET library provides the UploadSession model, IUploadStore abstraction, and Minimal API endpoints for creating, polling, and canceling uploads.',
      'The shared SampleApi exposes demo endpoints at /api/uploads/sample-files for end-to-end integration testing.',
    ],
  },
  {
    id: 'capabilities',
    label: 'Capabilities / permissions',
    pairingLabel: 'Capabilities / permissions',
    description:
      'The Angular permission evaluator gates UI actions and routes against the same capability contracts that HexGuard.Capabilities serves on the backend. The shared SampleApi provides persona-based capability sets for end-to-end testing.',
    members: [
      { packageId: 'angular-permissions', role: 'Consumer/Evaluator' },
      { packageId: 'hexguard-capabilities', role: 'Provider' },
    ],
    integrationNotes: [
      'The @hexguard/angular-permissions Angular package and HexGuard.Capabilities .NET library share the same role/permission contracts via CapabilitySyncService.',
      'The .NET library defines CapabilitySet (roles + per-resource permissions) through ICapabilityService and ICapabilityStore. The Angular side maps these to PermissionContext via provideCapabilitySync().',
      'To run the full cross-stack experience, start the API with `pnpm dotnet:start:demo-api` and navigate to the capabilities demo routes.',
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
  { angularId: 'angular-pagination', angularLabel: '@hexguard/angular-pagination' },
];

// ── Package dependency map ─────────────────────────────────────────

/**
 * Cross-stack and intra-stack dependency pairings. Maps package IDs to
 * their dependencies. Each dependency includes the target package info
 * and a human-readable relationship label.
 */
const PACKAGE_DEPENDENCIES: Record<string, readonly PackageDependency[]> = {
  'angular-lookups': [
    {
      packageId: 'hexguard-reference-data',
      label: 'HexGuard.ReferenceData',
      stack: 'dotnet',
      relationship: 'Cross-stack counterpart',
      route: '/dotnet/hexguard-reference-data',
    },
  ],
  'angular-api-errors': [
    {
      packageId: 'hexguard-validation-contracts',
      label: 'HexGuard.ValidationContracts',
      stack: 'dotnet',
      relationship: 'Cross-stack counterpart',
      route: '/dotnet/hexguard-validation-contracts',
    },
    {
      packageId: 'hexguard-problem-details',
      label: 'HexGuard.ProblemDetails',
      stack: 'dotnet',
      relationship: 'Foundation library',
      route: '/dotnet/hexguard-problem-details',
    },
  ],
  'angular-feature-flags': [
    {
      packageId: 'hexguard-feature-flags',
      label: 'HexGuard.FeatureFlags',
      stack: 'dotnet',
      relationship: 'Cross-stack counterpart',
      route: '/dotnet/hexguard-feature-flags',
    },
  ],
  'angular-permissions': [
    {
      packageId: 'hexguard-capabilities',
      label: 'HexGuard.Capabilities',
      stack: 'dotnet',
      relationship: 'Cross-stack counterpart',
      route: '/dotnet/hexguard-capabilities',
    },
  ],
  'angular-bulk-operations': [
    {
      packageId: 'hexguard-bulk-operations',
      label: 'HexGuard.BulkOperations',
      stack: 'dotnet',
      relationship: 'Cross-stack counterpart',
      route: '/dotnet/hexguard-bulk-operations',
    },
  ],
  'angular-pagination': [
    {
      packageId: 'hexguard-pagination',
      label: 'HexGuard.Pagination',
      stack: 'dotnet',
      relationship: 'Cross-stack counterpart',
      route: '/dotnet/hexguard-pagination',
    },
  ],
  'angular-upload-state': [
    {
      packageId: 'hexguard-uploads',
      label: 'HexGuard.Uploads',
      stack: 'dotnet',
      relationship: 'Cross-stack counterpart',
      route: '/dotnet/hexguard-uploads',
    },
  ],
  'hexguard-pagination': [
    {
      packageId: 'angular-pagination',
      label: '@hexguard/angular-pagination',
      stack: 'angular',
      relationship: 'Cross-stack counterpart',
      route: '/packages/angular-pagination',
    },
  ],
  'hexguard-reference-data': [
    {
      packageId: 'angular-lookups',
      label: '@hexguard/angular-lookups',
      stack: 'angular',
      relationship: 'Cross-stack counterpart',
      route: '/packages/angular-lookups',
    },
  ],
  'hexguard-validation-contracts': [
    {
      packageId: 'angular-api-errors',
      label: '@hexguard/angular-api-errors',
      stack: 'angular',
      relationship: 'Cross-stack counterpart',
      route: '/packages/angular-api-errors',
    },
    {
      packageId: 'hexguard-problem-details',
      label: 'HexGuard.ProblemDetails',
      stack: 'dotnet',
      relationship: 'Foundation library',
      route: '/dotnet/hexguard-problem-details',
    },
  ],
  'hexguard-capabilities': [
    {
      packageId: 'angular-permissions',
      label: '@hexguard/angular-permissions',
      stack: 'angular',
      relationship: 'Cross-stack counterpart',
      route: '/packages/angular-permissions',
    },
  ],
  'hexguard-feature-flags': [
    {
      packageId: 'angular-feature-flags',
      label: '@hexguard/angular-feature-flags',
      stack: 'angular',
      relationship: 'Cross-stack counterpart',
      route: '/packages/angular-feature-flags',
    },
  ],
  'hexguard-bulk-operations': [
    {
      packageId: 'angular-bulk-operations',
      label: '@hexguard/angular-bulk-operations',
      stack: 'angular',
      relationship: 'Cross-stack counterpart',
      route: '/packages/angular-bulk-operations',
    },
  ],
  'hexguard-uploads': [
    {
      packageId: 'angular-upload-state',
      label: '@hexguard/angular-upload-state',
      stack: 'angular',
      relationship: 'Cross-stack counterpart',
      route: '/packages/angular-upload-state',
    },
  ],
  'hexguard-problem-details': [
    {
      packageId: 'angular-api-errors',
      label: '@hexguard/angular-api-errors',
      stack: 'angular',
      relationship: 'Consumer library',
      route: '/packages/angular-api-errors',
    },
    {
      packageId: 'hexguard-validation-contracts',
      label: 'HexGuard.ValidationContracts',
      stack: 'dotnet',
      relationship: 'Validation extension',
      route: '/dotnet/hexguard-validation-contracts',
    },
  ],
};

// ── Unified package adapters ───────────────────────────────────────

/**
 * Adapt an Angular SitePackageCatalogEntry to the unified card interface.
 */
/** Maps .NET package IDs to their Angular counterpart package IDs for category derivation. */
export const DOTNET_TO_ANGULAR_COUNTERPART: Record<string, string> = {
  'hexguard-reference-data': 'angular-lookups',
  'hexguard-problem-details': 'angular-api-errors',
  'hexguard-validation-contracts': 'angular-api-errors',
  'hexguard-feature-flags': 'angular-feature-flags',
  'hexguard-capabilities': 'angular-permissions',
  'hexguard-bulk-operations': 'angular-bulk-operations',
  'hexguard-pagination': 'angular-pagination',
};

/**
 * Maps Angular package IDs to their .NET counterpart package IDs for cross-stack references.
 */
export const ANGULAR_TO_DOTNET_COUNTERPART: Record<string, string> = {
  'angular-pagination': 'hexguard-pagination',
  'hexguard-uploads': 'angular-upload-state',
  'angular-upload-state': 'hexguard-uploads',
};

/**
 * Adapt an Angular SitePackageCatalogEntry to the unified card interface.
 */
export function toUnifiedAngularEntry(entry: SitePackageCatalogEntry): UnifiedPackageEntry {
  return {
    id: entry.id,
    packageName: entry.packageName,
    category: entry.category,
    scope: 'angular',
    status: entry.status,
    summary: entry.summary,
    detail: entry.detail,
    featureHighlights: entry.featureHighlights,
    route: entry.route,
    demoCount: entry.demoCount,
    dependencies: entry.dependencies,
    repositoryHref: entry.repositoryHref,
    docsLinks: entry.docsLinks,
    installCommand: entry.installCommand,
  };
}

/**
 * Adapt a .NET DotnetSitePackageCatalogEntry to the unified card interface.
 * Uses dotnetPackage fields for docs and source links.
 */
export function toUnifiedDotnetEntry(entry: DotnetSitePackageCatalogEntry): UnifiedPackageEntry {
  const angularId = DOTNET_TO_ANGULAR_COUNTERPART[entry.id];
  const angularPkg = angularId ? getCurrentPackages().find((p) => p.id === angularId) : undefined;

  return {
    id: entry.id,
    packageName: entry.packageName,
    category: angularPkg?.category ?? null,
    scope: (entry.dotnetPackage.stackId as UnifiedScope) ?? 'dotnet',
    status: entry.status,
    summary: entry.summary,
    detail: null,
    featureHighlights: [],
    route: entry.route,
    demoCount: entry.demoCount,
    dependencies: entry.dependencies,
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
        category: null,
        scope: 'cross-stack' as UnifiedScope,
        status: 'Released',
        summary: eco.description,
        detail: null,
        featureHighlights: [],
        route,
        demoCount: totalDemos,
        dependencies: [],
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

      return {
        ...packageEntry,
        route: demoPackage.route,
        demoCount: demoPackage.demos.length,
        demoPackage,
        dependencies: PACKAGE_DEPENDENCIES[packageEntry.id] ?? [],
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
    return {
      id: dotnetPackage.id,
      packageName: dotnetPackage.nugetId,
      nugetId: dotnetPackage.nugetId,
      status: dotnetPackage.status,
      summary: dotnetPackage.summary,
      route: dotnetPackage.route,
      demoCount: dotnetPackage.demos.length,
      dotnetPackage,
      dependencies: PACKAGE_DEPENDENCIES[dotnetPackage.id] ?? [],
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
    value: String(Object.keys(STACK_REGISTRY).length),
  },
] as const satisfies readonly SiteMetric[];
