namespace HexGuard.BulkOperations;

/// <summary>
/// The top-level response envelope for a bulk operation.
/// </summary>
/// <typeparam name="TItem">The item type.</typeparam>
/// <typeparam name="TResult">The success result type.</typeparam>
/// <param name="Status">Aggregate operation status.</param>
/// <param name="TotalCount">Total number of items in the request.</param>
/// <param name="SuccessCount">Number of items that succeeded.</param>
/// <param name="FailureCount">Number of items that failed.</param>
/// <param name="Results">Per-item results in the same order as the request.</param>
public sealed record BulkOperationResponse<TItem, TResult>(
    BulkOperationStatus Status,
    int TotalCount,
    int SuccessCount,
    int FailureCount,
    IReadOnlyList<BulkOperationResult<TItem, TResult>> Results
);
