/**
 * Public API for `@hexguard/angular-selection-state`.
 *
 * The package provides a headless, signal-based keyed selection model
 * for Angular tables, lists, and bulk-action flows.
 */
export { injectSelectionState } from './lib/selection-state';
export { createSelectionState } from './lib/selection-state-observable';
export type { SelectionStateOptions, SelectionStateReturn } from './lib/selection-state';
export type { SelectionStateObservables } from './lib/selection-state-observable';
