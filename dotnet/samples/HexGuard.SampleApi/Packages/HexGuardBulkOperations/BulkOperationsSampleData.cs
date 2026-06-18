namespace HexGuard.SampleApi.Packages.HexGuardBulkOperations;

/// <summary>
/// Mock order records and sample data for bulk-operations demo endpoints.
/// </summary>
internal static class BulkOperationsSampleData
{
    /// <summary>
    /// An order record used in bulk operation demos.
    /// </summary>
    public sealed record Order(
        string Id,
        string Name,
        string Status
    );

    /// <summary>
    /// The result of a delete operation.
    /// </summary>
    public sealed record DeleteResult(bool Deleted);

    /// <summary>
    /// The result of an approval operation.
    /// </summary>
    public sealed record ApproveResult(string NewStatus);

    /// <summary>
    /// Payload for updating order status.
    /// </summary>
    public sealed record StatusUpdatePayload(string NewStatus);

    /// <summary>
    /// Returns the full list of mock orders.
    /// </summary>
    public static IReadOnlyList<Order> GetOrders() => new List<Order>
    {
        new("ord-001", "Widget A", "pending"),
        new("ord-002", "Widget B", "pending"),
        new("ord-003", "Widget C", "shipped"),
        new("ord-004", "Widget D", "pending"),
        new("ord-005", "Widget E", "cancelled"),
        new("ord-006", "Widget F", "pending"),
        new("ord-007", "Widget G", "shipped"),
        new("ord-008", "Widget H", "pending"),
    };

    /// <summary>
    /// Mock items that will fail when processed.
    /// These simulate items that fail validation or have conflicts.
    /// </summary>
    private static readonly HashSet<string> FailingItemIds = new(StringComparer.Ordinal)
    {
        "ord-003", // shipped — cannot delete
        "ord-005", // cancelled — cannot approve
        "ord-007", // shipped — cannot approve
    };
}
