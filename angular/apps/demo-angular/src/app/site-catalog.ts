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

export const SITE_CURRENT_PACKAGES: readonly SitePackageCatalogEntry[] =
  GENERATED_CURRENT_PACKAGES.map((packageEntry) => {
    const demoPackage = getDemoPackage(packageEntry.id);

    if (!demoPackage) {
      throw new Error(`Missing demo package for site catalog entry ${packageEntry.id}.`);
    }

    return {
      ...packageEntry,
      route: demoPackage.route,
      demoCount: demoPackage.demos.length,
      demoPackage,
    };
  });

export function getSitePackage(packageId: string): SitePackageCatalogEntry {
  const packageEntry = SITE_CURRENT_PACKAGES.find((entry) => entry.id === packageId);

  if (!packageEntry) {
    throw new Error(`Missing site package entry for ${packageId}.`);
  }

  return packageEntry;
}

export const SITE_DOTNET_PACKAGES: readonly DotnetSitePackageCatalogEntry[] = DOTNET_PACKAGES.map(
  (dotnetPackage) => ({
    id: dotnetPackage.id,
    packageName: dotnetPackage.nugetId,
    nugetId: dotnetPackage.nugetId,
    status: dotnetPackage.status,
    summary: dotnetPackage.summary,
    route: dotnetPackage.route,
    demoCount: dotnetPackage.demos.length,
    dotnetPackage,
  }),
);

export const SITE_ROADMAP_PACKAGES = GENERATED_ROADMAP_PACKAGES.filter(
  (entry) => entry.showOnSiteHome,
);

const angularDemoCount = SITE_CURRENT_PACKAGES.reduce((total, entry) => total + entry.demoCount, 0);
const dotnetDemoCount = SITE_DOTNET_PACKAGES.reduce((total, entry) => total + entry.demoCount, 0);

export const SITE_METRICS = [
  {
    label: 'Current Angular packages',
    value: String(SITE_CURRENT_PACKAGES.length),
  },
  {
    label: 'Live demo routes',
    value: String(angularDemoCount),
  },
  {
    label: '.NET packages and demos',
    value: String(SITE_DOTNET_PACKAGES.length),
  },
] as const satisfies readonly SiteMetric[];
