namespace HexGuard.ReferenceData;

/// <summary>
/// Metadata used for cache invalidation and observability.
/// </summary>
public sealed record ReferenceDataCatalogMetadata(string Version, DateTimeOffset GeneratedAtUtc);