import { Pipe, type PipeTransform } from '@angular/core';

import { injectLookups } from './lookups';

/** Thin template pipe for resolving one item label from the shared lookup cache. */
@Pipe({
  name: 'hexguardLookupLabel',
  standalone: true,
  pure: false,
})
export class HexguardLookupLabelPipe implements PipeTransform {
  private readonly lookups = injectLookups();

  /**
   * Resolves one display label from the shared lookup cache.
   *
   * @param itemKey - The item key to resolve. Returns the fallback when
   *                  `null`, `undefined`, or empty.
   * @param collectionKey - The collection key to look up in the catalog.
   * @param fallback - Value returned when the item key has no matching label.
   *                   Defaults to `null`.
   * @returns The resolved label string or the fallback value.
   */
  transform(
    itemKey: string | null | undefined,
    collectionKey: string,
    fallback: string | null = null,
  ): string | null {
    if (itemKey == null || itemKey.length === 0) {
      return fallback;
    }

    return this.lookups.label(collectionKey, itemKey) ?? fallback;
  }
}
