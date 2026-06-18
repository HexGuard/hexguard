namespace HexGuard.BulkOperations;

/// <summary>
/// Static builder that aggregates per-item results into a
/// <see cref="BulkOperationResponse{TItem, TResult}"/> with
/// computed aggregate status and counts.
/// </summary>
public static class BulkOperationResultBuilder
{
    /// <summary>
    /// Builds a <see cref="BulkOperationResponse{TItem, TResult}"/> from
    /// a collection of per-item results.
    /// </summary>
    /// <param name="results">The per-item results.</param>
    /// <typeparam name="TItem">The item type.</typeparam>
    /// <typeparam name="TResult">The success result type.</typeparam>
    /// <returns>The aggregated response envelope.</returns>
    /// <exception cref="ArgumentNullException">Thrown when <paramref name="results"/> is null.</exception>
    public static BulkOperationResponse<TItem, TResult> Build<TItem, TResult>(
        IReadOnlyList<BulkOperationResult<TItem, TResult>> results)
    {
        ArgumentNullException.ThrowIfNull(results);

        var totalCount = results.Count;
        var successCount = results.Count(r => r.Succeeded);
        var failureCount = totalCount - successCount;

        var status = failureCount switch
        {
            0 => BulkOperationStatus.Completed,
            _ when successCount > 0 => BulkOperationStatus.PartialFailure,
            _ => BulkOperationStatus.Failed,
        };

        return new BulkOperationResponse<TItem, TResult>(
            status,
            totalCount,
            successCount,
            failureCount,
            results
        );
    }
}
