namespace HexGuard.ReferenceData;

/// <summary>
/// Guards the catalog contract against malformed payloads before it is served.
/// </summary>
public static class ReferenceDataCatalogValidator
{
    /// <summary>
    /// Returns the list of contract violations for one catalog.
    /// </summary>
    public static IReadOnlyList<string> Validate(ReferenceDataCatalog catalog)
    {
        ArgumentNullException.ThrowIfNull(catalog);

        var errors = new List<string>();

        if (catalog.Metadata is null)
        {
            errors.Add("Metadata is required.");
            return errors;
        }

        if (string.IsNullOrWhiteSpace(catalog.Metadata.Version))
        {
            errors.Add("Metadata.Version is required.");
        }

        if (catalog.Metadata.GeneratedAtUtc == default)
        {
            errors.Add("Metadata.GeneratedAtUtc must be set.");
        }

        if (catalog.Collections is null)
        {
            errors.Add("Collections are required.");
            return errors;
        }

        var collectionKeys = new HashSet<string>(StringComparer.Ordinal);

        foreach (var collection in catalog.Collections)
        {
            if (collection is null)
            {
                errors.Add("Collections cannot contain null entries.");
                continue;
            }

            if (string.IsNullOrWhiteSpace(collection.Key))
            {
                errors.Add("Collection keys are required.");
            }
            else if (!collectionKeys.Add(collection.Key))
            {
                errors.Add($"Duplicate collection key '{collection.Key}'.");
            }

            if (collection.Items is null)
            {
                errors.Add($"Collection '{collection.Key}' must include items.");
                continue;
            }

            var itemKeys = new HashSet<string>(StringComparer.Ordinal);

            foreach (var item in collection.Items)
            {
                if (item is null)
                {
                    errors.Add($"Collection '{collection.Key}' cannot contain null items.");
                    continue;
                }

                if (string.IsNullOrWhiteSpace(item.Key))
                {
                    errors.Add($"Collection '{collection.Key}' contains an item with an empty key.");
                }
                else if (!itemKeys.Add(item.Key))
                {
                    errors.Add($"Collection '{collection.Key}' contains duplicate item key '{item.Key}'.");
                }

                if (string.IsNullOrWhiteSpace(item.Label))
                {
                    errors.Add($"Collection '{collection.Key}' contains an empty label for key '{item.Key}'.");
                }
            }
        }

        return errors;
    }

    /// <summary>
    /// Throws when the catalog violates the contract.
    /// </summary>
    public static void ValidateOrThrow(ReferenceDataCatalog catalog)
    {
        var errors = Validate(catalog);

        if (errors.Count > 0)
        {
            throw new ReferenceDataValidationException(errors);
        }
    }
}