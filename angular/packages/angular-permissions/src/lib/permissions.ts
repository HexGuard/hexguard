import { computed, inject, type Signal } from '@angular/core';

import { HEXGUARD_PERMISSION_CONTEXT } from './permission-context';
import { evaluatePermission } from './permission-evaluator';
import type {
  HexGuardPermissions,
  PermissionContext,
  PermissionDecision,
  PermissionKey,
  PermissionRequirement,
} from './types';

/** Injects an imperative permissions facade backed by the current permission context signal. */
export function injectPermissions<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
>(): HexGuardPermissions<TCapability, TRole> {
  const context = inject(HEXGUARD_PERMISSION_CONTEXT) as Signal<
    PermissionContext<TCapability, TRole>
  >;

  return {
    context,
    can(requirement: PermissionRequirement<TCapability, TRole>): boolean {
      return evaluatePermission(context(), requirement).allowed;
    },
    evaluate(
      requirement: PermissionRequirement<TCapability, TRole>,
    ): PermissionDecision<TCapability, TRole> {
      return evaluatePermission(context(), requirement);
    },
    canSignal(requirement: PermissionRequirement<TCapability, TRole>): Signal<boolean> {
      return computed(() => evaluatePermission(context(), requirement).allowed);
    },
    decisionSignal(
      requirement: PermissionRequirement<TCapability, TRole>,
    ): Signal<PermissionDecision<TCapability, TRole>> {
      return computed(() => evaluatePermission(context(), requirement));
    },
  };
}
