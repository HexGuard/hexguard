import { computed, InjectionToken, type Provider } from '@angular/core';

import { asyncState } from '@hexguard/angular-async-state';

import { LookupCatalogValidationError } from './errors';
import {
  EMPTY_LOOKUP_CATALOG,
  EMPTY_LOOKUP_ITEMS,
  assertLookupCatalog,
  findLookupCollection,
  findLookupItem,
  resolveLookupLabel,
} from './lookup-catalog';
import type { HexGuardLookupsOptions } from './lookup-catalog-options';
import type { HexGuardLookupError, HexGuardLookups, LookupCatalog, LookupItem } from './types';

/** DI token for the lookup cache facade. */
export const HEXGUARD_LOOKUPS = new InjectionToken<HexGuardLookups<unknown>>('HEXGUARD_LOOKUPS');

/**
 * Registers one loader-backed lookup cache for the active injector tree.
 *
 * The returned provider array can be added to route-level or component-level
 * `providers`. Each call creates an independent cache instance, so consumers
 * that need shared state across routes should register at a common ancestor.
 *
 * @param options - Loader, optional initial catalog, and optional error mapper.
 * @returns A provider array suitable for Angular `providers` arrays.
 */
export function provideHexGuardLookups<TError = unknown>(
  options: HexGuardLookupsOptions<TError>,
): Provider[] {
  return [
    {
      provide: HEXGUARD_LOOKUPS,
      useValue: createLookupsHandle(options),
    },
  ];
}

function createLookupsHandle<TError>(
  options: HexGuardLookupsOptions<TError>,
): HexGuardLookups<TError> {
  const initialCatalog =
    options.initialCatalog === undefined
      ? EMPTY_LOOKUP_CATALOG
      : assertLookupCatalog(options.initialCatalog);

  const state = asyncState<LookupCatalog, HexGuardLookupError<TError>>({
    initialValue: initialCatalog,
    empty: (catalog) => catalog.collections.length === 0,
    load: async () => assertLookupCatalog(await options.load()),
    mapError: (error) => mapLookupError(error, options.mapError),
  });

  if (options.initialCatalog !== undefined) {
    state.setValue(initialCatalog);
  }

  const metadata = computed(() => (state.hasLoaded() ? state.value().metadata : null));
  const version = computed(() => metadata()?.version ?? null);

  return {
    state,
    metadata,
    version,
    ensureLoaded(): Promise<LookupCatalog> {
      return state.hasLoaded() ? Promise.resolve(state.value()) : state.load();
    },
    reload(): Promise<LookupCatalog> {
      return state.reload();
    },
    invalidate(): void {
      state.reset();
    },
    collection(collectionKey: string) {
      return findLookupCollection(state.value(), collectionKey);
    },
    collectionSignal(collectionKey: string) {
      return computed(() => findLookupCollection(state.value(), collectionKey));
    },
    options(collectionKey: string) {
      return findLookupCollection(state.value(), collectionKey)?.items ?? EMPTY_LOOKUP_ITEMS;
    },
    optionsSignal(collectionKey: string) {
      return computed(
        () => findLookupCollection(state.value(), collectionKey)?.items ?? EMPTY_LOOKUP_ITEMS,
      );
    },
    label(collectionKey: string, itemKey: string) {
      return resolveLookupLabel(state.value(), collectionKey, itemKey);
    },
    labelSignal(collectionKey: string, itemKey: string) {
      return computed(() => resolveLookupLabel(state.value(), collectionKey, itemKey));
    },
    hasItem(collectionKey: string, itemKey: string) {
      return findLookupItem(state.value(), collectionKey, itemKey) !== null;
    },
    hasItemSignal(collectionKey: string, itemKey: string) {
      return computed(() => findLookupItem(state.value(), collectionKey, itemKey) !== null);
    },
  };
}

function mapLookupError<TError>(
  error: unknown,
  mapError?: (error: unknown) => TError,
): HexGuardLookupError<TError> {
  return error instanceof LookupCatalogValidationError
    ? error
    : (mapError?.(error) ?? (error as TError));
}
