/**
 * Public API for `@hexguard/angular-permissions`.
 *
 * The package keeps permission evaluation headless and provider-agnostic,
 * then layers Angular DI integration on top through
 * `provideHexGuardPermissions()` and `injectPermissions()`.
 */
export { PermissionRequirementMissingError } from './lib/errors';
export { HexguardCanDirective } from './lib/hexguard-can.directive';
export {
  EMPTY_PERMISSION_CONTEXT,
  HEXGUARD_PERMISSION_CONTEXT,
  provideHexGuardPermissions,
} from './lib/permission-context';
export { evaluatePermission } from './lib/permission-evaluator';
export { canActivatePermissions, canMatchPermissions } from './lib/permission-guards';
export { injectPermissions } from './lib/permissions';
export {
  provideCapabilitySync,
  toPermissionContext,
  updateCapabilityContext,
  CAPABILITY_SYNC_CONTEXT,
} from './lib/capability-sync';
export type { CapabilitySet, CapabilityFetcher, CapabilitySyncConfig } from './lib/capability-sync';
export type {
  HexGuardPermissions,
  PermissionCollection,
  PermissionContext,
  PermissionDecision,
  PermissionKey,
  PermissionRequirement,
  PermissionRequirementKey,
  PermissionSource,
} from './lib/types';
export type { PermissionGuardOptions, PermissionGuardRedirect } from './lib/permission-guards';
