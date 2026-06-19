namespace HexGuard.Capabilities;

/// <summary>In-memory implementation of <see cref="ICapabilityStore"/>.</summary>
public sealed class InMemoryCapabilityStore : ICapabilityStore
{
    private readonly Dictionary<string, CapabilitySet> _store = new(StringComparer.OrdinalIgnoreCase);
    private readonly object _lock = new();

    /// <inheritdoc />
    public Task<CapabilitySet?> GetCapabilitiesAsync(string userId, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_store.TryGetValue(userId, out var caps) ? caps : null);
        }
    }

    /// <inheritdoc />
    public Task SetCapabilitiesAsync(string userId, CapabilitySet capabilities, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _store[userId] = capabilities;
        }
        return Task.CompletedTask;
    }
}
