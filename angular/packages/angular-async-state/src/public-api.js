/**
 * Public API for `@hexguard/angular-async-state`.
 *
 * The package keeps async lifecycle state explicit and typed through
 * `asyncState()`, `observableState()`, and `asyncAction()`, plus thin Angular
 * template outlets for the finite async value and action handles.
 */
export { asyncAction } from './lib/async-action';
export { HexguardAsyncActionOutletComponent } from './lib/async-action-outlet.component';
export { asyncState } from './lib/async-state';
export { HexguardAsyncStateOutletComponent } from './lib/async-state-outlet.component';
export { observableState } from './lib/observable-state';
export { AsyncActionPendingError } from './lib/errors';
