import type { UnifiedPackageEntry } from '../site-catalog';

export interface PackageCategory {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

/**
 * Ordered list of all package categories for display.
 * The order determines the display order in the UI.
 */
export const PACKAGE_CATEGORIES: readonly PackageCategory[] = [
  {
    id: 'URL & Forms',
    label: 'URL & Forms',
    description: 'Query-param sync, form binding, and URL-owned state management.',
  },
  {
    id: 'Async State',
    label: 'Async State',
    description: 'Loading, success, failure lifecycle primitives and optimistic update management.',
  },
  {
    id: 'Data & Reference',
    label: 'Data & Reference',
    description: 'Catalog caching, label resolution, and backend reference data integration.',
  },
  {
    id: 'Permissions & Access',
    label: 'Permissions & Access',
    description: 'Role and capability gating, feature flag evaluation across routes and templates.',
  },
  {
    id: 'Validation & Errors',
    label: 'Validation & Errors',
    description: 'RFC 9457 error handling, field-level form binding, and page-level error state.',
  },
  {
    id: 'Utilities',
    label: 'Utilities',
    description:
      'General-purpose Angular signal primitives for dates, debounce, connectivity, and storage.',
  },
  {
    id: 'UI Infrastructure',
    label: 'UI Infrastructure',
    description: 'Toasts, error boundaries, selection state, and bulk-action infrastructure.',
  },
];

/** Map from category ID to its display label. */
export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  PACKAGE_CATEGORIES.map((c) => [c.id, c.label]),
);

/** Map from category ID to its description. */
export const CATEGORY_DESCRIPTION: Record<string, string> = Object.fromEntries(
  PACKAGE_CATEGORIES.map((c) => [c.id, c.description]),
);

/**
 * Group packages by their category.
 * Uncategorized packages (category === null) are placed in an "Other" group.
 */
export function groupPackagesByCategory(
  packages: readonly UnifiedPackageEntry[],
): Map<string, UnifiedPackageEntry[]> {
  const groups = new Map<string, UnifiedPackageEntry[]>();

  for (const pkg of packages) {
    const cat = pkg.category ?? 'Other';
    if (!groups.has(cat)) {
      groups.set(cat, []);
    }
    groups.get(cat)!.push(pkg);
  }

  return groups;
}

/**
 * Get the display label for a category ID.
 * Falls back to the raw ID if not found in known categories.
 */
export function getCategoryLabel(categoryId: string): string {
  return CATEGORY_LABEL[categoryId] ?? categoryId;
}

/**
 * Get the description for a category ID.
 * Returns null if the category is unknown.
 */
export function getCategoryDescription(categoryId: string): string | null {
  return CATEGORY_DESCRIPTION[categoryId] ?? null;
}

/**
 * Sort category entries by the canonical PACKAGE_CATEGORIES order.
 * Unknown categories ("Other") are placed last.
 */
export function sortCategoryEntries(
  entries: [string, UnifiedPackageEntry[]][],
): [string, UnifiedPackageEntry[]][] {
  const orderMap = new Map(PACKAGE_CATEGORIES.map((c, i) => [c.id, i]));

  return [...entries].sort(([a], [b]) => {
    const ai = orderMap.get(a);
    const bi = orderMap.get(b);
    if (ai !== undefined && bi !== undefined) return ai - bi;
    if (ai !== undefined) return -1;
    if (bi !== undefined) return 1;
    return a.localeCompare(b);
  });
}
