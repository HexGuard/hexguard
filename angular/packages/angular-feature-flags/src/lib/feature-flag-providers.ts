import { InjectionToken, isSignal, type Signal, signal } from '@angular/core';
import type { FeatureFlag } from './types';

/** A catalog of feature flags, keyed by flag key. */
export interface FeatureFlagCatalog {
  readonly flags: Readonly<Record<string, FeatureFlag>>;
  readonly contextHash: string;
}

/**
 * A static or signal-backed source for the feature flag catalog.
 * Static catalogs are wrapped into a signal internally.
 */
export type FeatureFlagCatalogSource =
  | FeatureFlagCatalog
  | Signal<FeatureFlagCatalog>;

/**
 * Injection token for the current feature flag catalog signal.
 * Consumers inject this to access the catalog for evaluation.
 */
export const HEXGUARD_FEATURE_FLAG_CATALOG = new InjectionToken<
  Signal<FeatureFlagCatalog>
>('HEXGUARD_FEATURE_FLAG_CATALOG');

/**
 * Registers the feature flag catalog in the Angular DI container.
 *
 * Accepts either a static catalog or a signal-backed catalog for
 * dynamic updates (e.g. from the sync service).
 */
export function provideHexGuardFeatureFlags(
  source: FeatureFlagCatalogSource,
) {
  const catalogSignal =
    isSignal(source) ? source : signal(source).asReadonly();

  return [
    {
      provide: HEXGUARD_FEATURE_FLAG_CATALOG,
      useValue: catalogSignal,
    },
  ];
}
