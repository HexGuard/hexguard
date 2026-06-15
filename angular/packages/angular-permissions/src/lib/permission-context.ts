import {
  type EnvironmentProviders,
  InjectionToken,
  isSignal,
  makeEnvironmentProviders,
  signal,
  type Signal,
} from '@angular/core';

import type { PermissionContext, PermissionKey, PermissionSource } from './types';

/** Empty permission context used when no application-specific access context is provided. */
export const EMPTY_PERMISSION_CONTEXT: PermissionContext = Object.freeze({
  capabilities: Object.freeze([]),
  roles: Object.freeze([]),
});

/** DI token for the current permission context. */
export const HEXGUARD_PERMISSION_CONTEXT = new InjectionToken<Signal<PermissionContext>>(
  'HEXGUARD_PERMISSION_CONTEXT',
  {
    providedIn: 'root',
    factory: () => signal(EMPTY_PERMISSION_CONTEXT),
  },
);

/** Registers the current permission context for all consumers in the injector tree. */
export function provideHexGuardPermissions<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
>(
  source: PermissionSource<TCapability, TRole> = EMPTY_PERMISSION_CONTEXT as PermissionContext<
    TCapability,
    TRole
  >,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HEXGUARD_PERMISSION_CONTEXT,
      useValue: coercePermissionContextSignal(source),
    },
  ]);
}

function coercePermissionContextSignal<
  TCapability extends PermissionKey,
  TRole extends PermissionKey,
>(source: PermissionSource<TCapability, TRole>): Signal<PermissionContext<TCapability, TRole>> {
  return isSignal(source) ? source : signal(source);
}
