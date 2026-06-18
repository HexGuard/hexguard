import type { FeatureFlag, TargetingRule } from './types';
import type { FlagKey } from './types';

// ── Public types ───────────────────────────────────────────────────

/** Evaluation context for a single flag request. */
export interface FlagEvaluationContext {
  readonly userId: string;
  readonly tenantId?: string;
  readonly groups?: readonly string[];
  readonly attributes?: Readonly<Record<string, string>>;
}

/** The outcome of evaluating a single feature flag. */
export interface FlagEvaluationResult {
  readonly key: FlagKey;
  readonly enabled: boolean;
  readonly variant: string;
  readonly evaluatedAt: Date;
  readonly matchedRule: string | null;
}

/** Batch evaluation result for multiple flags. */
export interface EvaluateManyResult {
  readonly results: readonly FlagEvaluationResult[];
  readonly evaluatedAt: Date;
}

// ── Stable hash for rollout percentage ────────────────────────────

/**
 * A simple stable hash (FNV-1a-like) that produces consistent results
 * across platforms. Used for deterministic rollout percentage evaluation.
 *
 * This avoids `String.GetHashCode` on .NET and `String.hashCode` in JS,
 * neither of which guarantees cross-platform stability. *
 * Returns a value in [0, 2^32 - 1]. */
function stableHash(input: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // FNV prime (32-bit)
  }
  return hash;
}

// ── Pure evaluator ─────────────────────────────────────────────────

/**
 * Evaluates a single feature flag against the given context.
 *
 * Returns the resolved enablement, variant, and matched rule type.
 * When the flag is disabled (`enabled === false`) or no rules match,
 * evaluation falls through to the flag's defaults.
 */
export function evaluateFeatureFlag(
  flag: FeatureFlag,
  context: FlagEvaluationContext,
): FlagEvaluationResult {
  const evaluatedAt = new Date();

  if (!flag.enabled) {
    return {
      key: flag.key,
      enabled: false,
      variant: 'disabled',
      evaluatedAt,
      matchedRule: null,
    };
  }

  const rules = flag.targetingRules;
  if (rules.length === 0) {
    // No rules means everyone gets the flag (subject to rollout).
    if (flag.rolloutPercentage >= 100) {
      return {
        key: flag.key,
        enabled: true,
        variant: flag.variant,
        evaluatedAt,
        matchedRule: null,
      };
    }
    const hash = stableHash(context.userId) % 100;
    const matched = hash < flag.rolloutPercentage;
    return {
      key: flag.key,
      enabled: matched,
      variant: matched ? flag.variant : 'disabled',
      evaluatedAt,
      matchedRule: matched ? 'rollout' : null,
    };
  }

  for (const rule of rules) {
    const result = matchRule(flag, rule, context);
    if (result !== null) {
      return result;
    }
  }

  // Fall through: no rule matched.
  return {
    key: flag.key,
    enabled: false,
    variant: 'disabled',
    evaluatedAt,
    matchedRule: null,
  };
}

/**
 * Evaluates multiple feature flags concurrently against the same context.
 */
export function evaluateFeatureFlags(
  flags: readonly FeatureFlag[],
  context: FlagEvaluationContext,
): EvaluateManyResult {
  const evaluatedAt = new Date();
  const results = flags.map((flag) => evaluateFeatureFlag(flag, context));
  return { results, evaluatedAt };
}

// ── Rule matching ─────────────────────────────────────────────────

function matchRule(
  flag: FeatureFlag,
  rule: TargetingRule,
  context: FlagEvaluationContext,
): FlagEvaluationResult | null {
  const evaluatedAt = new Date();

  switch (rule.type) {
    case 'always':
      return {
        key: flag.key,
        enabled: true,
        variant: flag.variant,
        evaluatedAt,
        matchedRule: 'always',
      };

    case 'never':
      return {
        key: flag.key,
        enabled: false,
        variant: 'disabled',
        evaluatedAt,
        matchedRule: 'never',
      };

    case 'rollout': {
      // rule is narrowed to RolloutRule by discriminated union
      const pct = Math.min(100, Math.max(0, rule.percentage));
      if (pct <= 0) {
        return {
          key: flag.key,
          enabled: false,
          variant: 'disabled',
          evaluatedAt,
          matchedRule: 'rollout',
        };
      }
      const hash = stableHash(context.userId) % 100;
      const matched = hash < pct;
      return {
        key: flag.key,
        enabled: matched,
        variant: matched ? flag.variant : 'disabled',
        evaluatedAt,
        matchedRule: matched ? 'rollout' : null,
      };
    }

    case 'userIn': {
      if (rule.users.length > 0 && rule.users.includes(context.userId)) {
        return {
          key: flag.key,
          enabled: true,
          variant: flag.variant,
          evaluatedAt,
          matchedRule: 'userIn',
        };
      }
      return null;
    }

    case 'userNotIn': {
      if (rule.users.includes(context.userId)) {
        return null; // user is excluded, continue to next rule
      }
      return {
        key: flag.key,
        enabled: true,
        variant: flag.variant,
        evaluatedAt,
        matchedRule: 'userNotIn',
      };
    }

    case 'groupIn': {
      if (context.groups?.some((g) => rule.groups.includes(g))) {
        return {
          key: flag.key,
          enabled: true,
          variant: flag.variant,
          evaluatedAt,
          matchedRule: 'groupIn',
        };
      }
      return null;
    }

    case 'groupNotIn': {
      if (context.groups?.some((g) => rule.groups.includes(g))) {
        return null; // user is in an excluded group
      }
      return {
        key: flag.key,
        enabled: true,
        variant: flag.variant,
        evaluatedAt,
        matchedRule: 'groupNotIn',
      };
    }

    case 'attributeMatch': {
      if (context.attributes?.[rule.attribute] === rule.value) {
        return {
          key: flag.key,
          enabled: true,
          variant: flag.variant,
          evaluatedAt,
          matchedRule: 'attributeMatch',
        };
      }
      return null;
    }

    case 'attributeNotMatch': {
      if (context.attributes?.[rule.attribute] === rule.value) {
        return null;
      }
      return {
        key: flag.key,
        enabled: true,
        variant: flag.variant,
        evaluatedAt,
        matchedRule: 'attributeNotMatch',
      };
    }

    default:
      return null;
  }
}
