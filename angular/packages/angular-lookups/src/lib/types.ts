import type { Signal } from '@angular/core';

import type { AsyncState } from '@hexguard/angular-async-state';

import type { LookupCatalogValidationError } from './errors';

/** Metadata used for lookup cache invalidation and observability. */
export interface LookupCatalogMetadata {
  readonly version: string;
  readonly generatedAtUtc: string;
}

/** One lookup option inside a named collection. */
export interface LookupItem {
  readonly key: string;
  readonly label: string;
  readonly isActive?: boolean;
  readonly description?: string | null;
}

/** One named lookup family inside a catalog payload. */
export interface LookupCollection {
  readonly key: string;
  readonly revision?: string | null;
  readonly items: readonly LookupItem[];
}

/** Versioned lookup catalog returned by the backend contract. */
export interface LookupCatalog {
  readonly metadata: LookupCatalogMetadata;
  readonly collections: readonly LookupCollection[];
}

/** Public error surface exposed by the lookup cache. */
export type HexGuardLookupError<TError = unknown> = TError | LookupCatalogValidationError;

/** Imperative Angular facade exposed by `injectLookups()`. */
export interface HexGuardLookups<TError = unknown> {
  readonly state: AsyncState<LookupCatalog, HexGuardLookupError<TError>>;
  readonly metadata: Signal<LookupCatalogMetadata | null>;
  readonly version: Signal<string | null>;
  ensureLoaded(): Promise<LookupCatalog>;
  reload(): Promise<LookupCatalog>;
  invalidate(): void;
  collection(collectionKey: string): LookupCollection | null;
  collectionSignal(collectionKey: string): Signal<LookupCollection | null>;
  options(collectionKey: string): readonly LookupItem[];
  optionsSignal(collectionKey: string): Signal<readonly LookupItem[]>;
  label(collectionKey: string, itemKey: string): string | null;
  labelSignal(collectionKey: string, itemKey: string): Signal<string | null>;
  hasItem(collectionKey: string, itemKey: string): boolean;
  hasItemSignal(collectionKey: string, itemKey: string): Signal<boolean>;
}
