using HexGuard.BulkOperations;

namespace HexGuard.SampleApi.Packages.HexGuardBulkOperations;

/// <summary>
/// Sample endpoints demonstrating the HexGuard.BulkOperations library.
/// </summary>
public static class BulkOperationsSampleEndpoints
{
    /// <summary>
    /// Maps bulk-operations demo endpoints under <c>/api/bulk-operations</c>.
    /// </summary>
    public static IEndpointRouteBuilder MapBulkOperationsSampleEndpoints(
        this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/bulk-operations");

        // ── POST /api/bulk-operations/delete ────────────────────
        group.MapPost("/delete", (
            BulkOperationRequest<BulkOperationsSampleData.Order, object?> request) =>
        {
            var data = BulkOperationsSampleData.GetOrders();
            var itemMap = data.ToDictionary(o => o.Id);

            var results = request.Items.Select(item =>
            {
                if (item.Id == "ord-003")
                {
                    return new BulkOperationResult<BulkOperationsSampleData.Order, BulkOperationsSampleData.DeleteResult>(
                        item,
                        false,
                        null,
                        new BulkOperationError("CANNOT_DELETE", "Order has already been shipped", null)
                    );
                }

                return new BulkOperationResult<BulkOperationsSampleData.Order, BulkOperationsSampleData.DeleteResult>(
                    item,
                    true,
                    new BulkOperationsSampleData.DeleteResult(true),
                    null
                );
            }).ToList();

            var response = BulkOperationResultBuilder.Build<BulkOperationsSampleData.Order, BulkOperationsSampleData.DeleteResult>(results);
            return Results.Extensions.BulkOperation(response);
        });

        // ── POST /api/bulk-operations/approve ───────────────────
        group.MapPost("/approve", (
            BulkOperationRequest<BulkOperationsSampleData.Order, object?> request) =>
        {
            var results = request.Items.Select(item =>
            {
                if (item.Status is "shipped" or "cancelled")
                {
                    return new BulkOperationResult<BulkOperationsSampleData.Order, BulkOperationsSampleData.ApproveResult>(
                        item,
                        false,
                        null,
                        new BulkOperationError("INVALID_STATUS", $"Cannot approve order in status '{item.Status}'", "status")
                    );
                }

                return new BulkOperationResult<BulkOperationsSampleData.Order, BulkOperationsSampleData.ApproveResult>(
                    item,
                    true,
                    new BulkOperationsSampleData.ApproveResult("approved"),
                    null
                );
            }).ToList();

            var response = BulkOperationResultBuilder.Build<BulkOperationsSampleData.Order, BulkOperationsSampleData.ApproveResult>(results);
            return Results.Extensions.BulkOperation(response);
        });

        // ── POST /api/bulk-operations/update-status ─────────────
        group.MapPost("/update-status", (
            BulkOperationRequest<BulkOperationsSampleData.Order, BulkOperationsSampleData.StatusUpdatePayload> request) =>
        {
            var results = request.Items.Select(item =>
            {
                if (item.Status == "cancelled")
                {
                    return new BulkOperationResult<BulkOperationsSampleData.Order, string>(
                        item,
                        false,
                        null,
                        new BulkOperationError("INVALID_STATUS", "Cancelled orders cannot be updated", "status")
                    );
                }

                var newStatus = request.SharedPayload?.NewStatus ?? "unknown";
                return new BulkOperationResult<BulkOperationsSampleData.Order, string>(
                    item,
                    true,
                    newStatus,
                    null
                );
            }).ToList();

            var response = BulkOperationResultBuilder.Build<BulkOperationsSampleData.Order, string>(results);
            return Results.Extensions.BulkOperation(response);
        });

        return group;
    }
}
