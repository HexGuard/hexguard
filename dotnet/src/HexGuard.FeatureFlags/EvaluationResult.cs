namespace HexGuard.FeatureFlags;

/// <summary>
/// The outcome of evaluating a single feature flag against a context.
/// </summary>
/// <param name="Key">The flag key that was evaluated.</param>
/// <param name="Enabled">Whether the flag resolved as active.</param>
/// <param name="Variant">The variant the flag resolved to
/// (e.g. <c>"enabled"</c>, <c>"disabled"</c>, or a custom A/B label).</param>
/// <param name="EvaluatedAt">Timestamp of the evaluation.</param>
/// <param name="MatchedRule">The rule type that matched, or <c>null</c>
/// when no specific rule applied.</param>
public sealed record EvaluationResult(
    string Key,
    bool Enabled,
    string Variant,
    DateTimeOffset EvaluatedAt,
    string? MatchedRule = null
);
