namespace HexGuard.ReferenceData;

/// <summary>
/// Versioned reference-data catalog composed of named collections.
/// </summary>
public sealed record ReferenceDataCatalog(
    ReferenceDataCatalogMetadata Metadata,
    IReadOnlyList<ReferenceDataCollection> Collections)
{
    /// <summary>
    /// Finds one collection by exact key.
    /// </summary>
    public ReferenceDataCollection? FindCollection(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return Collections.FirstOrDefault((collection) => string.Equals(collection.Key, key, StringComparison.Ordinal));
    }

    /// <summary>
    /// Returns one collection or throws when the key is missing.
    /// </summary>
    public ReferenceDataCollection GetRequiredCollection(string key)
    {
        return FindCollection(key)
            ?? throw new KeyNotFoundException($"Reference-data collection '{key}' was not found.");
    }
}