namespace HexGuard.ReferenceData;

/// <summary>
/// One named family inside a reference-data catalog.
/// </summary>
public sealed record ReferenceDataCollection(
    string Key,
    string? Revision,
    IReadOnlyList<ReferenceDataItem> Items)
{
    /// <summary>
    /// Finds one item by exact key.
    /// </summary>
    public ReferenceDataItem? FindItem(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return Items.FirstOrDefault((item) => string.Equals(item.Key, key, StringComparison.Ordinal));
    }

    /// <summary>
    /// Resolves one label or returns <c>null</c> when the item is missing.
    /// </summary>
    public string? FindLabel(string key)
    {
        return FindItem(key)?.Label;
    }
}