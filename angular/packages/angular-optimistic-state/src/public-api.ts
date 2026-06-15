/**
 * Public API for `@hexguard/angular-optimistic-state`.
 *
 * The package keeps optimistic mutation state explicit and typed through
 * `optimisticState()` plus focused policy, entry, and error types.
 */
export { OptimisticStatePendingError } from './lib/errors';
export { HexguardOptimisticStateOutletComponent } from './lib/optimistic-state-outlet.component';
export { optimisticState } from './lib/optimistic-state';
export type { OptimisticStateOptions } from './lib/optimistic-state-options';
export type {
  OptimisticMutationConflictPolicy,
  OptimisticMutationEntry,
  OptimisticMutationEntryStatus,
  OptimisticStateErrorContext,
  OptimisticStatePendingContext,
  OptimisticState,
  OptimisticStateRunArgs,
  OptimisticStateStatus,
  OptimisticStateValueContext,
} from './lib/types';
