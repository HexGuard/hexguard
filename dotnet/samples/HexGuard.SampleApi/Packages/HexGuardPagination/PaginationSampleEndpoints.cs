using HexGuard.Pagination;

namespace HexGuard.SampleApi.Packages.HexGuardPagination;

/// <summary>
/// Sample endpoints demonstrating the HexGuard.Pagination library.
/// </summary>
public static class PaginationSampleEndpoints
{
    /// <summary>
    /// Maps pagination demo endpoints under <c>/api/pagination</c>.
    /// </summary>
    public static IEndpointRouteBuilder MapPaginationSampleEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/pagination");

        // ── GET /api/pagination/products ────────────────────────
        group.MapGet("/products", (
            int page,
            int pageSize,
            string? search,
            string? sortField,
            bool? sortDesc,
            string? category) =>
        {
            var (items, total) = PaginationSampleData.QueryProducts(
                search, category, sortField, sortDesc ?? false, page, pageSize);

            var response = QueryResponse<PaginationSampleData.Product>.Create(
                items, total, page, pageSize);

            return Results.Ok(response);
        });

        // ── GET /api/pagination/products/raw?page=1&pageSize=5 ──
        // Returns a simple JSON object for the Angular demo to display raw.
        group.MapGet("/products/raw", (int page, int pageSize) =>
        {
            var all = PaginationSampleData.GetProducts();
            var items = all.Skip((page - 1) * pageSize).Take(pageSize).ToList();
            var total = all.Count;
            var totalPages = (int)Math.Ceiling((double)total / pageSize);

            return Results.Ok(new
            {
                items,
                totalCount = total,
                page,
                pageSize,
                totalPages,
                hasNext = page < totalPages,
                hasPrevious = page > 1,
                rangeStart = total == 0 ? 0 : (page - 1) * pageSize + 1,
                rangeEnd = Math.Min(page * pageSize, total),
            });
        });

        return group;
    }
}
