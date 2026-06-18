using System.Security.Cryptography;
using System.Text;

namespace HexGuard.FeatureFlags;

/// <summary>
/// Pure static evaluator for feature flag targeting rules.
/// All rule types are evaluated in first-match-wins order.
/// </summary>
public static class FeatureFlagEvaluator
{
    /// <summary>
    /// Evaluates a single feature flag against the provided context.
    /// Returns the resolved enablement, variant, and matched rule type.
    /// </summary>
    public static EvaluationResult Evaluate(
        FeatureFlag flag,
        FlagEvaluationContext context)
    {
        ArgumentNullException.ThrowIfNull(flag);
        ArgumentNullException.ThrowIfNull(context);

        // Clamp rollout percentage to valid range [0, 100].
        var rollout = Math.Clamp(flag.RolloutPercentage, 0.0, 100.0);
        var evaluatedAt = DateTimeOffset.UtcNow;

        if (!flag.Enabled)
        {
            return new EvaluationResult(flag.Key, false, "disabled", evaluatedAt);
        }

        var rules = flag.TargetingRules;

        if (rules is null || rules.Count == 0)
        {
            if (rollout >= 100.0)
            {
                return new EvaluationResult(flag.Key, true, flag.Variant, evaluatedAt);
            }

            if (rollout <= 0.0)
            {
                return new EvaluationResult(flag.Key, false, "disabled", evaluatedAt, "rollout");
            }

            var matched = StableHash(context.UserId) < rollout;
            return new EvaluationResult(
                flag.Key,
                matched,
                matched ? flag.Variant : "disabled",
                evaluatedAt,
                matched ? "rollout" : null);
        }

        foreach (var rule in rules)
        {
            var result = MatchRule(flag, rule, context, evaluatedAt);
            if (result is not null)
            {
                return result;
            }
        }

        // Fall through: no rule matched.
        return new EvaluationResult(flag.Key, false, "disabled", evaluatedAt);
    }

    /// <summary>
    /// Evaluates multiple flags against the same context.
    /// Returns results sorted by flag key for deterministic ordering.
    /// </summary>
    public static IReadOnlyList<EvaluationResult> EvaluateMany(
        IReadOnlyDictionary<string, FeatureFlag> flags,
        FlagEvaluationContext context)
    {
        ArgumentNullException.ThrowIfNull(flags);

        var results = new List<EvaluationResult>(flags.Count);
        foreach (var (key, _) in flags.OrderBy(kvp => kvp.Key, StringComparer.Ordinal))
        {
            results.Add(Evaluate(flags[key], context));
        }
        return results;
    }

    // ── Rule matching ──────────────────────────────────────────

    private static EvaluationResult? MatchRule(
        FeatureFlag flag,
        TargetingRule rule,
        FlagEvaluationContext context,
        DateTimeOffset evaluatedAt)
    {
        switch (rule)
        {
            case AlwaysRule:
                return new EvaluationResult(
                    flag.Key, true, flag.Variant, evaluatedAt, "always");

            case NeverRule:
                return new EvaluationResult(
                    flag.Key, false, "disabled", evaluatedAt, "never");

            case RolloutRule rollout:
            {
                var percentage = Math.Clamp(rollout.Percentage, 0.0, 100.0);
                if (percentage <= 0.0)
                {
                    return new EvaluationResult(
                        flag.Key, false, "disabled", evaluatedAt, "rollout");
                }
                var matched = StableHash(context.UserId) < percentage;
                return new EvaluationResult(
                    flag.Key,
                    matched,
                    matched ? flag.Variant : "disabled",
                    evaluatedAt,
                    matched ? "rollout" : null);
            }

            case UserInRule userIn:
            {
                if (userIn.Users.Count > 0 && userIn.Users.Contains(context.UserId))
                {
                    return new EvaluationResult(
                        flag.Key, true, flag.Variant, evaluatedAt, "userIn");
                }
                return null;
            }

            case UserNotInRule userNotIn:
            {
                if (userNotIn.Users.Contains(context.UserId))
                {
                    return null; // user is excluded — continue to next rule
                }
                return new EvaluationResult(
                    flag.Key, true, flag.Variant, evaluatedAt, "userNotIn");
            }

            case GroupInRule groupIn:
            {
                if (context.Groups is not null &&
                    groupIn.Groups.Count > 0 &&
                    context.Groups.Any(g => groupIn.Groups.Contains(g)))
                {
                    return new EvaluationResult(
                        flag.Key, true, flag.Variant, evaluatedAt, "groupIn");
                }
                return null;
            }

            case GroupNotInRule groupNotIn:
            {
                if (context.Groups is not null &&
                    groupNotIn.Groups.Count > 0 &&
                    context.Groups.Any(g => groupNotIn.Groups.Contains(g)))
                {
                    return null; // user is in an excluded group
                }
                return new EvaluationResult(
                    flag.Key, true, flag.Variant, evaluatedAt, "groupNotIn");
            }

            case AttributeMatchRule attrMatch:
            {
                if (context.Attributes is not null &&
                    context.Attributes.TryGetValue(attrMatch.Attribute, out var val) &&
                    val == attrMatch.Value)
                {
                    return new EvaluationResult(
                        flag.Key, true, flag.Variant, evaluatedAt, "attributeMatch");
                }
                return null;
            }

            case AttributeNotMatchRule attrNotMatch:
            {
                if (context.Attributes is not null &&
                    context.Attributes.TryGetValue(attrNotMatch.Attribute, out var val) &&
                    val == attrNotMatch.Value)
                {
                    return null;
                }
                return new EvaluationResult(
                    flag.Key, true, flag.Variant, evaluatedAt, "attributeNotMatch");
            }

            default:
                return null;
        }
    }

    // ── Stable hash ───────────────────────────────────────────

    /// <summary>
    /// A stable FNV-1a hash that produces the same result on .NET and
    /// in JavaScript for the same input string. Used for deterministic
    /// rollout percentage evaluation across platforms.
    /// Results in [0, 100).
    /// </summary>
    internal static double StableHash(string input)
    {
        ArgumentNullException.ThrowIfNull(input);

        const uint fnvOffsetBasis = 0x811c9dc5;
        const uint fnvPrime = 0x01000193;

        var bytes = Encoding.UTF8.GetBytes(input);
        uint hash = fnvOffsetBasis;

        foreach (var b in bytes)
        {
            hash ^= b;
            hash *= fnvPrime;
        }

        // Return a value in [0, 100)
        return (hash % 100);
    }
}
