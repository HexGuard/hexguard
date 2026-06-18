namespace HexGuard.BulkOperations;

/// <summary>
/// The outcome of a single item in a bulk operation.
/// </summary>
/// <typeparam name="TItem">The item type.</typeparam>
/// <typeparam name="TResult">The success result type.</typeparam>
/// <param name="Item">The original item from the request.</param>
/// <param name="Succeeded">Whether this item succeeded.</param>
/// <param name="Result">Optional success payload.</param>
/// <param name="Error">Error details when <see cref="Succeeded"/> is <c>false</c>.</param>
public sealed record BulkOperationResult<TItem, TResult>(
    TItem Item,
    bool Succeeded,
    TResult? Result,
    BulkOperationError? Error
);
