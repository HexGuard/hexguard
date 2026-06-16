namespace HexGuard.ReferenceData;

/// <summary>
/// Simple in-memory provider for one validated reference-data catalog.
/// </summary>
public sealed class StaticReferenceDataCatalogProvider : IReferenceDataCatalogProvider
{
    private readonly ReferenceDataCatalog _catalog;

    /// <summary>
    /// Creates a provider around one validated catalog instance.
    /// </summary>
    public StaticReferenceDataCatalogProvider(ReferenceDataCatalog catalog)
    {
        ArgumentNullException.ThrowIfNull(catalog);

        ReferenceDataCatalogValidator.ValidateOrThrow(catalog);
        _catalog = catalog;
    }

    /// <summary>
    /// Returns the current in-memory catalog.
    /// </summary>
    public ValueTask<ReferenceDataCatalog> GetCatalogAsync(CancellationToken cancellationToken = default)
    {
        return ValueTask.FromResult(_catalog);
    }
}