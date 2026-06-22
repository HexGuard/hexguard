namespace HexGuard.Pagination;

/// <summary>
/// Standardized paginated response for list endpoints.
/// </summary>
/// <typeparam name="T">The item type.</typeparam>
/// <param name="Items">The items on the current page.</param>
/// <param name="TotalCount">Total number of items across all pages.</param>
/// <param name="Page">The current 1-based page number.</param>
/// <param name="PageSize">Number of items per page.</param>
/// <param name="TotalPages">Total number of pages.</param>
public sealed record QueryResponse<T>(
    IReadOnlyList<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
)
{
    /// <summary>
    /// Whether the current page has a next page.
    /// </summary>
    public bool HasNext => Page < TotalPages;

    /// <summary>
    /// Whether the current page has a previous page.
    /// </summary>
    public bool HasPrevious => Page > 1;

    /// <summary>
    /// 1-based index of the first item on the current page.
    /// </summary>
    public int RangeStart => TotalCount == 0 ? 0 : (Page - 1) * PageSize + 1;

    /// <summary>
    /// 1-based index of the last item on the current page.
    /// </summary>
    public int RangeEnd => Math.Min(Page * PageSize, TotalCount);

    /// <summary>
    /// Creates a <see cref="QueryResponse{T}"/> from a full result set.
    /// </summary>
    public static QueryResponse<T> Create(IReadOnlyList<T> items, int totalCount, int page, int pageSize)
    {
        var totalPages = totalCount <= 0 ? 0 : (int)Math.Ceiling((double)totalCount / pageSize);
        return new QueryResponse<T>(items, totalCount, page, pageSize, totalPages);
    }
}
