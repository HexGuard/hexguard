namespace HexGuard.FeatureFlags;

/// <summary>
/// A snapshot of all feature flags at a point in time, used for
/// sync responses and cache invalidation.
/// </summary>
/// <param name="Flags">All flags keyed by <see cref="FeatureFlag.Key"/>.</param>
/// <param name="EvaluatedAt">Timestamp when this catalog snapshot was
/// produced.</param>
/// <param name="ContextHash">A deterministic hash derived from the flag
/// definitions. Clients supply this in subsequent requests so the server
/// can return 304 Not Modified when nothing has changed.</param>
public sealed record FeatureFlagCatalog(
    IReadOnlyDictionary<string, FeatureFlag> Flags,
    DateTimeOffset EvaluatedAt,
    string ContextHash
);
