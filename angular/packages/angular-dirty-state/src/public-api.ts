/**
 * Public API for `@hexguard/angular-dirty-state`.
 *
 * The package provides:
 * - `injectDirtyState()` — signal-based unsaved-change tracking.
 * - `injectDirtyGuard()` — creates a `CanDeactivateFn` that prompts when dirty.
 */
export { injectDirtyState, injectDirtyGuard } from './lib/dirty-state';
export type { DirtyStateHandle, DirtyGuardOptions } from './lib/types';
