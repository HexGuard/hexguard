namespace HexGuard.FeatureFlags;

/// <summary>
/// Abstraction for loading feature flags from a backing store.
/// </summary>
public interface IFeatureFlagStore
{
    /// <summary>Returns all feature flags as a catalog snapshot.</summary>
    Task<FeatureFlagCatalog> GetCatalogAsync(CancellationToken cancellationToken = default);

    /// <summary>Returns a single flag by key, or <c>null</c> if not found.</summary>
    Task<FeatureFlag?> GetFlagAsync(string key, CancellationToken cancellationToken = default);
}
