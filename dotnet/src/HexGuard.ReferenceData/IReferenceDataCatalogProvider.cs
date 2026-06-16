namespace HexGuard.ReferenceData;

/// <summary>
/// Supplies a versioned reference-data catalog for one application boundary.
/// </summary>
public interface IReferenceDataCatalogProvider
{
    /// <summary>
    /// Returns the current catalog payload.
    /// </summary>
    ValueTask<ReferenceDataCatalog> GetCatalogAsync(CancellationToken cancellationToken = default);
}