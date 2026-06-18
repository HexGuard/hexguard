/**
 * Public API for `@hexguard/angular-feature-flags`.
 *
 * The package provides typed feature-flag evaluation for Angular applications
 * with a pure evaluator, DI-backed facade, structural directive, route guards,
 * and an optional backend sync service.
 */
export { evaluateFeatureFlag, evaluateFeatureFlags } from './lib/feature-flag-evaluator';
export type {
  EvaluateManyResult,
  FlagEvaluationContext,
  FlagEvaluationResult,
} from './lib/feature-flag-evaluator';
export type { FlagKey } from './lib/types';

export {
  HEXGUARD_FEATURE_FLAG_CATALOG,
  provideHexGuardFeatureFlags,
} from './lib/feature-flag-providers';
export type { FeatureFlagCatalog, FeatureFlagCatalogSource } from './lib/feature-flag-providers';

export { injectFeatureFlag, injectFeatureFlags } from './lib/feature-flag-facade';
export type { HexGuardFeatureFlags } from './lib/feature-flag-facade';

export { HexguardFeatureFlagDirective } from './lib/hexguard-feature-flag.directive';

export { canActivateFeatureFlag, canMatchFeatureFlag } from './lib/feature-flag-guards';
export type { FeatureFlagGuardOptions } from './lib/feature-flag-guards';

export { FeatureFlagSyncService, FEATURE_FLAG_SYNC_OPTIONS } from './lib/feature-flag-sync.service';
export type { FeatureFlagSyncOptions } from './lib/feature-flag-sync.service';

export type {
  FeatureFlag,
  TargetingRule,
  AlwaysRule,
  NeverRule,
  RolloutRule,
  UserInRule,
  UserNotInRule,
  GroupInRule,
  GroupNotInRule,
  AttributeMatchRule,
  AttributeNotMatchRule,
} from './lib/types';
