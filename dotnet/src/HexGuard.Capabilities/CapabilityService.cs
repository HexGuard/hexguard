using System.Threading;

namespace HexGuard.Capabilities;

/// <summary>Default implementation of <see cref="ICapabilityService"/>.</summary>
public sealed class CapabilityService : ICapabilityService
{
    private readonly ICapabilityStore _store;
    private readonly AsyncLocal<string?> _currentUserId = new();

    /// <summary>Creates a new CapabilityService with the specified store.</summary>
    public CapabilityService(ICapabilityStore store)
    {
        _store = store ?? throw new ArgumentNullException(nameof(store));
    }

    /// <summary>Sets the current user identifier (typically called from middleware or endpoint).</summary>
    public void SetCurrentUser(string? userId)
    {
        _currentUserId.Value = userId;
    }

    /// <inheritdoc />
    public async Task<CapabilitySet> GetCapabilitiesAsync(CancellationToken ct = default)
    {
        var userId = _currentUserId.Value;
        if (userId is null)
            return new CapabilitySet();

        return await _store.GetCapabilitiesAsync(userId, ct)
            ?? new CapabilitySet();
    }

    /// <inheritdoc />
    public async Task<bool> HasCapabilityAsync(string resource, string action, CancellationToken ct = default)
    {
        var caps = await GetCapabilitiesAsync(ct);
        return caps.Permissions.TryGetValue(resource, out var actions)
               && actions.Contains(action, StringComparer.OrdinalIgnoreCase);
    }
}
