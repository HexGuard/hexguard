namespace HexGuard.ReferenceData;

/// <summary>
/// One lookup option inside a reference-data collection.
/// </summary>
public sealed record ReferenceDataItem(
    string Key,
    string Label,
    bool IsActive = true,
    string? Description = null);