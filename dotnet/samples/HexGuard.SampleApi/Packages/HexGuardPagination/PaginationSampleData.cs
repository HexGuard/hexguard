namespace HexGuard.SampleApi.Packages.HexGuardPagination;

/// <summary>
/// Mock product records for pagination demo endpoints.
/// </summary>
internal static class PaginationSampleData
{
    /// <summary>
    /// A product record returned by paginated endpoints.
    /// </summary>
    public sealed record Product(
        string Id,
        string Name,
        string Category,
        decimal Price,
        int Stock
    );

    /// <summary>
    /// Returns the full list of mock products.
    /// </summary>
    public static IReadOnlyList<Product> GetProducts() => new List<Product>
    {
        new("prd-001", "Wireless Mouse", "Electronics", 29.99m, 150),
        new("prd-002", "Mechanical Keyboard", "Electronics", 89.99m, 72),
        new("prd-003", "USB-C Hub", "Electronics", 45.50m, 200),
        new("prd-004", "Ergonomic Chair", "Furniture", 399.00m, 15),
        new("prd-005", "Standing Desk", "Furniture", 599.00m, 8),
        new("prd-006", "Monitor Arm", "Furniture", 79.99m, 42),
        new("prd-007", "Noise-Canceling Headphones", "Electronics", 249.99m, 35),
        new("prd-008", "Webcam 4K", "Electronics", 129.99m, 60),
        new("prd-009", "Desk Lamp", "Furniture", 39.99m, 90),
        new("prd-010", "Laptop Stand", "Furniture", 34.99m, 110),
        new("prd-011", "Graphics Tablet", "Electronics", 199.99m, 25),
        new("prd-012", "Portable SSD 1TB", "Electronics", 109.99m, 48),
        new("prd-013", "Bookshelf", "Furniture", 149.00m, 12),
        new("prd-014", "Office Plant Pot", "Furniture", 24.99m, 75),
        new("prd-015", "Cable Management Kit", "Electronics", 19.99m, 180),
        new("prd-016", "LED Strip Lights", "Electronics", 29.99m, 95),
        new("prd-017", "File Cabinet", "Furniture", 89.00m, 20),
        new("prd-018", "Whiteboard", "Furniture", 49.99m, 30),
        new("prd-019", "Docking Station", "Electronics", 159.99m, 22),
        new("prd-020", "Wireless Charger", "Electronics", 24.99m, 140),
    };

    /// <summary>
    /// Returns products filtered and sorted according to the specified parameters.
    /// </summary>
    public static (IReadOnlyList<Product> Items, int TotalCount) QueryProducts(
        string? search,
        string? categoryFilter,
        string? sortField,
        bool sortDesc,
        int page,
        int pageSize)
    {
        var query = GetProducts().AsEnumerable();

        // Filter by search term
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLowerInvariant();
            query = query.Where(p =>
                p.Name.Contains(s, StringComparison.OrdinalIgnoreCase) ||
                p.Id.Contains(s, StringComparison.OrdinalIgnoreCase));
        }

        // Filter by category
        if (!string.IsNullOrWhiteSpace(categoryFilter))
        {
            query = query.Where(p =>
                p.Category.Equals(categoryFilter, StringComparison.OrdinalIgnoreCase));
        }

        // Sort
        query = (sortField ?? "id").ToLowerInvariant() switch
        {
            "name" => sortDesc ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            "price" => sortDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "stock" => sortDesc ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock),
            "category" => sortDesc ? query.OrderByDescending(p => p.Category) : query.OrderBy(p => p.Category),
            _ => sortDesc ? query.OrderByDescending(p => p.Id) : query.OrderBy(p => p.Id),
        };

        var list = query.ToList();
        var total = list.Count;
        var items = list.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return (items, total);
    }
}
