import { LookupCatalogValidationError } from './errors';
import type { LookupCatalog, LookupCollection, LookupItem } from './types';

export const EMPTY_LOOKUP_ITEMS: readonly LookupItem[] = Object.freeze([]);
export const EMPTY_LOOKUP_COLLECTIONS: readonly LookupCollection[] = Object.freeze([]);

/** Empty fallback catalog used before the first successful load. */
export const EMPTY_LOOKUP_CATALOG: LookupCatalog = Object.freeze({
  metadata: Object.freeze({
    version: '',
    generatedAtUtc: '',
  }),
  collections: EMPTY_LOOKUP_COLLECTIONS,
});

/** Returns the list of contract violations for one lookup catalog payload. */
export function validateLookupCatalog(catalog: LookupCatalog): readonly string[] {
  const errors: string[] = [];

  if (!isRecord(catalog)) {
    return ['Catalog must be an object.'];
  }

  if (!isRecord(catalog.metadata)) {
    errors.push('Metadata is required.');
  } else {
    if (
      typeof catalog.metadata.version !== 'string' ||
      catalog.metadata.version.trim().length === 0
    ) {
      errors.push('Metadata.version is required.');
    }

    if (
      typeof catalog.metadata.generatedAtUtc !== 'string' ||
      catalog.metadata.generatedAtUtc.trim().length === 0
    ) {
      errors.push('Metadata.generatedAtUtc is required.');
    }
  }

  if (!Array.isArray(catalog.collections)) {
    errors.push('Collections are required.');
    return errors;
  }

  const collectionKeys = new Set<string>();

  for (const collection of catalog.collections) {
    if (!isRecord(collection)) {
      errors.push('Collections cannot contain null or primitive entries.');
      continue;
    }

    const collectionKey = readString(collection, 'key');
    const collectionItems = collection['items'];

    if (collectionKey === null || collectionKey.trim().length === 0) {
      errors.push('Collection keys are required.');
    } else if (collectionKeys.has(collectionKey)) {
      errors.push(`Duplicate collection key '${collectionKey}'.`);
    } else {
      collectionKeys.add(collectionKey);
    }

    if (!Array.isArray(collectionItems)) {
      errors.push(`Collection '${String(collectionKey)}' must include items.`);
      continue;
    }

    const itemKeys = new Set<string>();

    for (const item of collectionItems) {
      if (!isRecord(item)) {
        errors.push(
          `Collection '${String(collectionKey)}' cannot contain null or primitive items.`,
        );
        continue;
      }

      const itemKey = readString(item, 'key');
      const itemLabel = readString(item, 'label');

      if (itemKey === null || itemKey.trim().length === 0) {
        errors.push(`Collection '${String(collectionKey)}' contains an item with an empty key.`);
      } else if (itemKeys.has(itemKey)) {
        errors.push(
          `Collection '${String(collectionKey)}' contains duplicate item key '${itemKey}'.`,
        );
      } else {
        itemKeys.add(itemKey);
      }

      if (itemLabel === null || itemLabel.trim().length === 0) {
        errors.push(
          `Collection '${String(collectionKey)}' contains an empty label for key '${String(itemKey)}'.`,
        );
      }
    }
  }

  return errors;
}

/** Throws when a lookup catalog payload violates the contract. */
export function assertLookupCatalog(catalog: LookupCatalog): LookupCatalog {
  const errors = validateLookupCatalog(catalog);

  if (errors.length > 0) {
    throw new LookupCatalogValidationError(errors);
  }

  return catalog;
}

/** Finds one collection by exact key. */
export function findLookupCollection(
  catalog: LookupCatalog,
  collectionKey: string,
): LookupCollection | null {
  return catalog.collections.find((collection) => collection.key === collectionKey) ?? null;
}

/** Finds one item inside one collection by exact keys. */
export function findLookupItem(
  catalog: LookupCatalog,
  collectionKey: string,
  itemKey: string,
): LookupItem | null {
  const collection = findLookupCollection(catalog, collectionKey);

  return collection?.items.find((item) => item.key === itemKey) ?? null;
}

/** Resolves one display label or returns `null` when the item is missing. */
export function resolveLookupLabel(
  catalog: LookupCatalog,
  collectionKey: string,
  itemKey: string,
): string | null {
  return findLookupItem(catalog, collectionKey, itemKey)?.label ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' ? value : null;
}
