namespace HexGuard.BulkOperations;

/// <summary>
/// A bulk operation request with either a shared payload for all items
/// or per-item payloads keyed by item identifier.
/// </summary>
/// <typeparam name="TItem">The item type.</typeparam>
/// <typeparam name="TPayload">The payload type for the operation.</typeparam>
/// <param name="Items">The list of items to operate on.</param>
/// <param name="SharedPayload">
/// A payload applied to all items. When set, <see cref="PerItemPayloads"/> is ignored.
/// </param>
/// <param name="PerItemPayloads">
/// Per-item payloads keyed by item identifier.
/// Only used when <see cref="SharedPayload"/> is <c>null</c>.
/// </param>
public sealed record BulkOperationRequest<TItem, TPayload>(
    IReadOnlyList<TItem> Items,
    TPayload? SharedPayload = default,
    IReadOnlyDictionary<string, TPayload>? PerItemPayloads = null
);
