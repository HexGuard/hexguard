import type { Signal } from '@angular/core';

/** Allowed string key type for capability and role identifiers. */
export type PermissionKey = string;

/** Collection shapes accepted for capabilities or roles in a permission context. */
export type PermissionCollection<T extends PermissionKey> = ReadonlySet<T> | readonly T[];

/** Normalized application access context evaluated by the library. */
export interface PermissionContext<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
> {
  readonly capabilities: PermissionCollection<TCapability>;
  readonly roles?: PermissionCollection<TRole>;

  /**
   * Role hierarchy for inherited permissions.
   * Each key inherits from its listed values.
   * E.g. `{ admin: ['editor', 'viewer'], editor: ['viewer'] }`
   * means admin has all editor and viewer permissions.
   */
  readonly hierarchy?: Readonly<Record<TRole, readonly TRole[]>>;
}

/** Requirement keys surfaced in `PermissionDecision.failedRequirements`. */
export type PermissionRequirementKey =
  | 'allCapabilities'
  | 'anyCapabilities'
  | 'noneCapabilities'
  | 'allRoles'
  | 'anyRoles'
  | 'noneRoles';

/** Headless capability and role requirement contract. */
export interface PermissionRequirement<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
> {
  readonly allCapabilities?: readonly TCapability[];
  readonly anyCapabilities?: readonly TCapability[];
  readonly noneCapabilities?: readonly TCapability[];
  readonly allRoles?: readonly TRole[];
  readonly anyRoles?: readonly TRole[];
  readonly noneRoles?: readonly TRole[];
}

/** Result returned by the pure permission evaluator. */
export interface PermissionDecision<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
> {
  readonly allowed: boolean;
  readonly failedRequirements: readonly PermissionRequirementKey[];
  readonly context: PermissionContext<TCapability, TRole>;
  readonly requirement: PermissionRequirement<TCapability, TRole>;
}

/** Static or signal-backed permission context accepted by DI configuration. */
export type PermissionSource<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
> = PermissionContext<TCapability, TRole> | Signal<PermissionContext<TCapability, TRole>>;

/** Imperative Angular facade exposed by `injectPermissions()`. */
export interface HexGuardPermissions<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
> {
  readonly context: Signal<PermissionContext<TCapability, TRole>>;
  can(requirement: PermissionRequirement<TCapability, TRole>): boolean;
  evaluate(
    requirement: PermissionRequirement<TCapability, TRole>,
  ): PermissionDecision<TCapability, TRole>;
  canSignal(requirement: PermissionRequirement<TCapability, TRole>): Signal<boolean>;
  decisionSignal(
    requirement: PermissionRequirement<TCapability, TRole>,
  ): Signal<PermissionDecision<TCapability, TRole>>;
}
