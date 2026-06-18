namespace HexGuard.FeatureFlags;

/// <summary>
/// Options for configuring feature flags from code or configuration.
/// </summary>
public sealed class FeatureFlagOptions
{
    /// <summary>
    /// The list of feature flags to register with the in-memory store.
    /// Flags with duplicate keys overwrite earlier entries.
    /// </summary>
    public List<FeatureFlag> Flags { get; set; } = new();
}
