import type { Signal } from '@angular/core';
import type { BulkOperationRequest } from './types';

/**
 * Maps selected keys from a selection state signal into a
 * `BulkOperationRequest` using the provided items map.
 *
 * Designed to compose with `@hexguard/angular-selection-state`:
 * ```ts
 * const selection = injectSelectionState<string>();
 * const request = selectedItemsToBulkRequest(selection.selected, itemsMap);
 * ```
 *
 * For per-item payloads (e.g. bulk update with different values per item):
 * ```ts
 * const request: BulkOperationRequest<Item, StatusPayload> = {
 *   items: selectedItems,
 *   perItemPayloads: new Map([
 *     ['item-1', { newStatus: 'approved' }],
 *     ['item-2', { newStatus: 'rejected' }],
 *   ]),
 * };
 * ```
 *
 * @param selectedSignal - A signal emitting the set of selected keys.
 * @param itemsMap - A record mapping item keys to the actual item objects.
 * @param sharedPayload - Optional payload to apply to all selected items.
 * @returns A `BulkOperationRequest` containing only the selected items.
 */
export function selectedItemsToBulkRequest<TItem, TPayload = void>(
  selectedSignal: Signal<ReadonlySet<string>>,
  itemsMap: Readonly<Record<string, TItem>>,
  sharedPayload?: TPayload,
): BulkOperationRequest<TItem, TPayload> {
  const selectedKeys = [...selectedSignal()];
  const items = selectedKeys
    .map((key) => itemsMap[key])
    .filter((item): item is TItem => item !== undefined);

  return {
    items,
    sharedPayload,
  };
}
