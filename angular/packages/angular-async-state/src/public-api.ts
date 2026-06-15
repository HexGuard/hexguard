/**
 * Public API for `@hexguard/angular-async-state`.
 *
 * The package keeps async lifecycle state explicit and typed through two core
 * primitives, `asyncState()` and `asyncAction()`, plus thin Angular template
 * outlets that render the same handles without introducing hidden behavior.
 */
export { asyncAction } from './lib/async-action';
export type { AsyncActionOptions } from './lib/async-action-options';
export { HexguardAsyncActionOutletComponent } from './lib/async-action-outlet.component';
export { asyncState } from './lib/async-state';
export type { AsyncStateOptions } from './lib/async-state-options';
export { HexguardAsyncStateOutletComponent } from './lib/async-state-outlet.component';
export { AsyncActionPendingError } from './lib/errors';
export type {
  AsyncAction,
  AsyncActionDuplicateRunPolicy,
  AsyncActionErrorContext,
  AsyncActionIdleContext,
  AsyncActionPendingContext,
  AsyncActionRunArgs,
  AsyncActionStatus,
  AsyncActionSuccessContext,
  AsyncState,
  AsyncStateEmptyContext,
  AsyncStateErrorContext,
  AsyncStateIdleContext,
  AsyncStateReloadingContext,
  AsyncStateStatus,
  AsyncStateValueContext,
} from './lib/types';
