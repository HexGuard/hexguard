/**
 * Public API for `@hexguard/angular-lookups`.
 *
 * The package keeps lookup behavior explicit through one validated catalog
 * contract, one async cache facade, and one thin Angular label pipe.
 */
export { LookupCatalogValidationError } from './lib/errors';
export { HexguardLookupLabelPipe } from './lib/hexguard-lookup-label.pipe';
export {
  assertLookupCatalog,
  EMPTY_LOOKUP_CATALOG,
  findLookupCollection,
  findLookupItem,
  resolveLookupLabel,
  validateLookupCatalog,
} from './lib/lookup-catalog';
export { provideHexGuardLookups } from './lib/lookup-context';
export { injectLookups } from './lib/lookups';
export type { HexGuardLookupsOptions } from './lib/lookup-catalog-options';
export type {
  HexGuardLookupError,
  HexGuardLookups,
  LookupCatalog,
  LookupCatalogMetadata,
  LookupCollection,
  LookupItem,
} from './lib/types';
