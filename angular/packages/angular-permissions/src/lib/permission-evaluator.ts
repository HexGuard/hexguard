import type {
  PermissionCollection,
  PermissionContext,
  PermissionDecision,
  PermissionKey,
  PermissionRequirement,
  PermissionRequirementKey,
} from './types';

const EMPTY_PERMISSION_SET: ReadonlySet<never> = new Set<never>();
const EMPTY_FAILED_REQUIREMENTS: readonly PermissionRequirementKey[] = Object.freeze([]);

function resolveHierarchy<TRole extends PermissionKey>(
  role: TRole,
  hierarchy: Readonly<Record<TRole, readonly TRole[]>> | undefined,
  visited: Set<TRole> = new Set(),
): TRole[] {
  if (!hierarchy || visited.has(role)) return [role];
  visited.add(role);
  const inherited = hierarchy[role];
  if (!inherited) return [role];
  return [role, ...inherited.flatMap((r) => resolveHierarchy(r, hierarchy, visited))];
}

/** Pure capability and role evaluation shared by all Angular adapters. */
export function evaluatePermission<
  TCapability extends PermissionKey = string,
  TRole extends PermissionKey = string,
>(
  context: PermissionContext<TCapability, TRole>,
  requirement: PermissionRequirement<TCapability, TRole> = {},
): PermissionDecision<TCapability, TRole> {
  const capabilities = toPermissionSet(context.capabilities);
  const hierarchy = context.hierarchy;

  // Resolve inherited roles through hierarchy
  const rawRoles = toPermissionSet(context.roles);
  const roles = new Set(rawRoles);
  for (const role of rawRoles) {
    for (const inherited of resolveHierarchy(role as TRole, hierarchy as any)) {
      roles.add(inherited as any);
    }
  }
  const failedRequirements: PermissionRequirementKey[] = [];

  if (!hasAll(capabilities, requirement.allCapabilities)) {
    failedRequirements.push('allCapabilities');
  }

  if (!hasAny(capabilities, requirement.anyCapabilities)) {
    failedRequirements.push('anyCapabilities');
  }

  if (!hasNone(capabilities, requirement.noneCapabilities)) {
    failedRequirements.push('noneCapabilities');
  }

  if (!hasAll(roles, requirement.allRoles)) {
    failedRequirements.push('allRoles');
  }

  if (!hasAny(roles, requirement.anyRoles)) {
    failedRequirements.push('anyRoles');
  }

  if (!hasNone(roles, requirement.noneRoles)) {
    failedRequirements.push('noneRoles');
  }

  return {
    allowed: failedRequirements.length === 0,
    failedRequirements:
      failedRequirements.length === 0 ? EMPTY_FAILED_REQUIREMENTS : failedRequirements,
    context,
    requirement,
  };
}

function hasAll<T>(available: ReadonlySet<T>, required?: readonly T[]): boolean {
  return required == null || required.length === 0 || required.every((item) => available.has(item));
}

function hasAny<T>(available: ReadonlySet<T>, required?: readonly T[]): boolean {
  return required == null || required.length === 0 || required.some((item) => available.has(item));
}

function hasNone<T>(available: ReadonlySet<T>, forbidden?: readonly T[]): boolean {
  return (
    forbidden == null || forbidden.length === 0 || forbidden.every((item) => !available.has(item))
  );
}

function toPermissionSet<T extends PermissionKey>(
  collection?: PermissionCollection<T>,
): ReadonlySet<T> {
  if (collection == null) {
    return EMPTY_PERMISSION_SET as ReadonlySet<T>;
  }

  return collection instanceof Set ? collection : new Set(collection);
}
