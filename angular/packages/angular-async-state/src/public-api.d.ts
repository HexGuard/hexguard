/**
 * Public API for `@hexguard/angular-async-state`.
 *
 * The package keeps async lifecycle state explicit and typed through
 * `asyncState()`, `observableState()`, and `asyncAction()`, plus thin Angular
 * template outlets for the finite async value and action handles.
 */
export { asyncAction } from './lib/async-action';
export type { AsyncActionOptions } from './lib/async-action-options';
export { HexguardAsyncActionOutletComponent } from './lib/async-action-outlet.component';
export { asyncState } from './lib/async-state';
export type { AsyncStateOptions } from './lib/async-state-options';
export { HexguardAsyncStateOutletComponent } from './lib/async-state-outlet.component';
export { observableState } from './lib/observable-state';
export type { ObservableStateOptions } from './lib/observable-state-options';
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
  ObservableState,
  ObservableStateStatus,
} from './lib/types';
//# sourceMappingURL=public-api.d.ts.map
