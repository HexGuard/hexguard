namespace HexGuard.Pagination;

/// <summary>
/// Standardized query request for paginated, sorted, and filtered list endpoints.
/// </summary>
/// <param name="Page">The 1-based page number.</param>
/// <param name="PageSize">Number of items per page.</param>
/// <param name="Search">Optional free-text search term.</param>
/// <param name="Sort">Optional sort specifications.</param>
/// <param name="Filters">Optional key-value filter pairs.</param>
public sealed record QueryRequest(
    int Page,
    int PageSize,
    string? Search,
    IReadOnlyList<SortSpec>? Sort,
    IReadOnlyDictionary<string, string>? Filters
)
{
    /// <summary>
    /// Creates a <see cref="QueryRequest"/> with default page and page size.
    /// </summary>
    public QueryRequest() : this(1, 20, null, null, null) { }

    /// <summary>
    /// Creates a <see cref="QueryRequest"/> with the specified page and page size.
    /// </summary>
    public QueryRequest(int Page, int PageSize) : this(Page, PageSize, null, null, null) { }
}
