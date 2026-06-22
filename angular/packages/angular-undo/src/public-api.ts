/**
 * Public API for `@hexguard/angular-undo`.
 *
 * The package provides a single injectable — `injectUndoStack()` — for
 * managing reversible action flows with configurable undo windows, TTL
 * expiry, group undo, and commit-or-revert behavior.
 */
export { injectUndoStack } from './lib/undo';
export type { UndoAction, UndoStackOptions, UndoStack } from './lib/types';
