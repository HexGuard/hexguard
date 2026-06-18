namespace HexGuard.BulkOperations;

/// <summary>
/// Aggregate status for a bulk operation response.
/// </summary>
public enum BulkOperationStatus
{
    /// <summary>All items succeeded.</summary>
    Completed,

    /// <summary>Some items succeeded, some failed.</summary>
    PartialFailure,

    /// <summary>All items failed.</summary>
    Failed,
}
