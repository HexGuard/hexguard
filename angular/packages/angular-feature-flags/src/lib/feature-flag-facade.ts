import { computed, inject, type Signal } from '@angular/core';

import {
  evaluateFeatureFlag,
  type FlagEvaluationContext,
  type FlagEvaluationResult,
} from './feature-flag-evaluator';
import { HEXGUARD_FEATURE_FLAG_CATALOG, type FeatureFlagCatalog } from './feature-flag-providers';
import type { FlagKey } from './types';

/** Imperative and signal-based facade for feature flag evaluation. */
export interface HexGuardFeatureFlags {
  readonly catalog: Signal<FeatureFlagCatalog>;
  isEnabled(flagKey: FlagKey, context: FlagEvaluationContext): boolean;
  getVariant(flagKey: FlagKey, context: FlagEvaluationContext): string | null;
  evaluate(flagKey: FlagKey, context: FlagEvaluationContext): FlagEvaluationResult | null;
  isEnabledSignal(flagKey: FlagKey, context: Signal<FlagEvaluationContext>): Signal<boolean>;
}

/**
 * Injects the full feature flags facade backed by the current catalog signal.
 *
 * Must be called within an Angular injection context (component constructor,
 * `inject()` context, or equivalent).
 */
export function injectFeatureFlags(): HexGuardFeatureFlags {
  const catalog = inject(HEXGUARD_FEATURE_FLAG_CATALOG);

  return {
    catalog,
    isEnabled(flagKey, context) {
      const flag = catalog().flags[flagKey];
      if (!flag) return false;
      return evaluateFeatureFlag(flag, context).enabled;
    },
    getVariant(flagKey, context) {
      const flag = catalog().flags[flagKey];
      if (!flag) return null;
      return evaluateFeatureFlag(flag, context).variant;
    },
    evaluate(flagKey, context) {
      const flag = catalog().flags[flagKey];
      if (!flag) return null;
      return evaluateFeatureFlag(flag, context);
    },
    isEnabledSignal(flagKey, context) {
      return computed(() => {
        const flag = catalog().flags[flagKey];
        if (!flag) return false;
        return evaluateFeatureFlag(flag, context()).enabled;
      });
    },
  };
}

/**
 * Shorthand that injects a signal for a single flag's evaluation result.
 *
 * The returned signal recomputes whenever the catalog or context changes.
 */
export function injectFeatureFlag(
  flagKey: FlagKey,
  context: Signal<FlagEvaluationContext>,
): Signal<FlagEvaluationResult | null> {
  const catalog = inject(HEXGUARD_FEATURE_FLAG_CATALOG);

  return computed(() => {
    const flag = catalog().flags[flagKey];
    if (!flag) return null;
    return evaluateFeatureFlag(flag, context());
  });
}
