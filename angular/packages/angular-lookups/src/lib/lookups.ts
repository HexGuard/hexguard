import { inject } from '@angular/core';

import { HEXGUARD_LOOKUPS } from './lookup-context';
import type { HexGuardLookups } from './types';

/** Injects an imperative lookup facade backed by the current cache instance. */
export function injectLookups<TError = unknown>(): HexGuardLookups<TError> {
  return inject(HEXGUARD_LOOKUPS) as HexGuardLookups<TError>;
}