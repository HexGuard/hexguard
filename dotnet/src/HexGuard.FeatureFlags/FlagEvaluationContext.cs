namespace HexGuard.FeatureFlags;

/// <summary>
/// Contextual information about the user or request being evaluated.
/// Supplied when resolving whether a feature flag applies.
/// </summary>
/// <param name="UserId">Unique identifier for the current user.
/// Used for rollout percentage hashing and user-specific rules.</param>
/// <param name="TenantId">Optional tenant identifier for multi-tenant
/// deployments.</param>
/// <param name="Groups">List of group or role identifiers the user
/// belongs to.</param>
/// <param name="Attributes">Optional key-value attributes providing
/// additional context for attribute-matching rules.</param>
public sealed record FlagEvaluationContext(
    string UserId,
    string? TenantId = null,
    IReadOnlyList<string>? Groups = null,
    IReadOnlyDictionary<string, string>? Attributes = null
);
