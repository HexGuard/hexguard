namespace HexGuard.Pagination;

/// <summary>
/// A field sort specification for list queries.
/// </summary>
/// <param name="Field">The field name to sort by.</param>
/// <param name="Descending">Whether to sort in descending order.</param>
public sealed record SortSpec(string Field, bool Descending);
