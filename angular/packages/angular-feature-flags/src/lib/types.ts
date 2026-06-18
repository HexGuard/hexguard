/**
 * Allowed string key type for feature flag identifiers.
 */
export type FlagKey = string;

// ── Targeting rules ────────────────────────────────────────────────

export interface AlwaysRule {
  readonly type: 'always';
}

export interface NeverRule {
  readonly type: 'never';
}

export interface RolloutRule {
  readonly type: 'rollout';
  readonly percentage: number;
}

export interface UserInRule {
  readonly type: 'userIn';
  readonly users: readonly string[];
}

export interface UserNotInRule {
  readonly type: 'userNotIn';
  readonly users: readonly string[];
}

export interface GroupInRule {
  readonly type: 'groupIn';
  readonly groups: readonly string[];
}

export interface GroupNotInRule {
  readonly type: 'groupNotIn';
  readonly groups: readonly string[];
}

export interface AttributeMatchRule {
  readonly type: 'attributeMatch';
  readonly attribute: string;
  readonly value: string;
}

export interface AttributeNotMatchRule {
  readonly type: 'attributeNotMatch';
  readonly attribute: string;
  readonly value: string;
}

/** Discriminated union of all targeting rule types. */
export type TargetingRule =
  | AlwaysRule
  | NeverRule
  | RolloutRule
  | UserInRule
  | UserNotInRule
  | GroupInRule
  | GroupNotInRule
  | AttributeMatchRule
  | AttributeNotMatchRule;

// ── Core flag types ────────────────────────────────────────────────

/** A single feature flag with enablement, variant, and targeting rules. */
export interface FeatureFlag {
  readonly key: FlagKey;
  readonly enabled: boolean;
  readonly variant: string;
  readonly rolloutPercentage: number;
  readonly targetingRules: readonly TargetingRule[];
  readonly metadata: Readonly<Record<string, string>> | null;
}
