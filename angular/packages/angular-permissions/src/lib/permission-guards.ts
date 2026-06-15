import { inject } from '@angular/core';
import type { CanActivateFn, CanMatchFn, UrlTree } from '@angular/router';
import { Router } from '@angular/router';

import { PermissionRequirementMissingError } from './errors';
import { injectPermissions } from './permissions';
import type { PermissionKey, PermissionRequirement } from './types';

/** Redirect target used when a denied guard should navigate instead of returning `false`. */
export type PermissionGuardRedirect = string | readonly unknown[];

/** Optional redirect behavior for permission guards. */
export interface PermissionGuardOptions {
  readonly redirectTo?: PermissionGuardRedirect;
}

/** Creates a `CanActivateFn` backed by the shared permission evaluator. */
export function canActivatePermissions<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
>(
  requirement: PermissionRequirement<TCapability, TRole>,
  options: PermissionGuardOptions = {},
): CanActivateFn {
  assertPermissionRequirement(requirement);

  return () => evaluateGuard(requirement, options);
}

/** Creates a `CanMatchFn` backed by the shared permission evaluator. */
export function canMatchPermissions<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
>(
  requirement: PermissionRequirement<TCapability, TRole>,
  options: PermissionGuardOptions = {},
): CanMatchFn {
  assertPermissionRequirement(requirement);

  return () => evaluateGuard(requirement, options);
}

function evaluateGuard<TCapability extends PermissionKey, TRole extends PermissionKey>(
  requirement: PermissionRequirement<TCapability, TRole>,
  options: PermissionGuardOptions,
): boolean | UrlTree {
  if (injectPermissions<TCapability, TRole>().can(requirement)) {
    return true;
  }

  if (options.redirectTo == null) {
    return false;
  }

  const router = inject(Router);

  return typeof options.redirectTo === 'string'
    ? router.parseUrl(options.redirectTo)
    : router.createUrlTree([...options.redirectTo]);
}

function assertPermissionRequirement(
  requirement: PermissionRequirement | null | undefined,
): asserts requirement is PermissionRequirement {
  if (requirement == null) {
    throw new PermissionRequirementMissingError();
  }
}
