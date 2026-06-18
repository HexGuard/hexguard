namespace HexGuard.FeatureFlags;

/// <summary>
/// A single feature flag with an identifier, enablement state, variant,
/// optional rollout and user/group/attribute targeting rules.
/// </summary>
/// <param name="Key">Unique flag identifier used in evaluation, sync, and
/// Angular-side lookups.</param>
/// <param name="Enabled">Whether the flag is active. When <c>false</c>,
/// evaluation returns the fallback disabled state regardless of rules.</param>
/// <param name="Variant">The variant label to return when the flag is
/// enabled and rules match. Defaults to <c>"enabled"</c>.</param>
/// <param name="RolloutPercentage">0–100 percentage of users for whom
/// the flag activates, based on a deterministic hash of the user identifier.
/// Clamped to [0, 100] at evaluation time. Only applies when no
/// user/group/attribute rule matches.</param>
/// <param name="TargetingRules">Ordered list of targeting rules evaluated
/// first-match-wins. Empty list means the flag applies to everyone
/// (subject to rollout percentage) when <see cref="Enabled"/> is true.</param>
/// <param name="Metadata">Optional arbitrary key-value metadata attached
/// to the flag for documentation or client-side display.</param>
public sealed record FeatureFlag(
    string Key,
    bool Enabled,
    string Variant = "enabled",
    double RolloutPercentage = 100.0,
    IReadOnlyList<TargetingRule>? TargetingRules = null,
    IReadOnlyDictionary<string, string>? Metadata = null
);
