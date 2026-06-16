import type { LookupCatalog } from './types';

/** Configuration accepted by `provideHexGuardLookups()`. */
export interface HexGuardLookupsOptions<TError = unknown> {
  /** Async loader invoked by `ensureLoaded()` and `reload()`. */
  readonly load: () => Promise<LookupCatalog>;

  /** Optional seeded catalog used before the first remote load. */
  readonly initialCatalog?: LookupCatalog;

  /** Maps unknown thrown values into the public transport error type. */
  readonly mapError?: (error: unknown) => TError;
}
