// Public API surface for HexGuard.Capabilities.
//
// Provides server-side capability and role contracts that pair
// with @hexguard/angular-permissions for cross-stack authorization gating.

namespace HexGuard.Capabilities;

/// <summary>Represents the set of roles and permissions assigned to a user.</summary>
public sealed record CapabilitySet
{
    /// <summary>The roles assigned to the user (e.g. "admin", "analyst", "guest").</summary>
    public IReadOnlyList<string> Roles { get; init; } = Array.Empty<string>();

    /// <summary>
    /// The permissions assigned to the user, keyed by resource name.
    /// Each resource maps to a list of allowed actions (e.g. "create", "read", "update", "delete").
    /// </summary>
    public IReadOnlyDictionary<string, IReadOnlyList<string>> Permissions { get; init; } = new Dictionary<string, IReadOnlyList<string>>();
}

/// <summary>Request model for checking a specific permission.</summary>
public sealed record CapabilityCheckRequest
{
    /// <summary>The resource to check (e.g. "orders", "users", "reports").</summary>
    public string Resource { get; init; } = string.Empty;

    /// <summary>The action to check (e.g. "create", "read", "update", "delete").</summary>
    public string Action { get; init; } = string.Empty;
}

/// <summary>Response model for a permission check.</summary>
public sealed record CapabilityCheckResponse
{
    /// <summary>Whether the user has the specified permission.</summary>
    public bool Allowed { get; init; }
}

/// <summary>Service interface for resolving and evaluating capabilities.</summary>
public interface ICapabilityService
{
    /// <summary>Returns the full capability set for the current user context.</summary>
    Task<CapabilitySet> GetCapabilitiesAsync(CancellationToken ct = default);

    /// <summary>Checks whether the current user has a specific permission.</summary>
    Task<bool> HasCapabilityAsync(string resource, string action, CancellationToken ct = default);

    /// <summary>Sets the user identifier for the current request context.</summary>
    void SetCurrentUser(string? userId);
}

/// <summary>Store interface for pluggable capability persistence.</summary>
public interface ICapabilityStore
{
    /// <summary>Retrieves the capability set for a given user identifier.</summary>
    Task<CapabilitySet?> GetCapabilitiesAsync(string userId, CancellationToken ct = default);

    /// <summary>Stores or updates the capability set for a given user identifier.</summary>
    Task SetCapabilitiesAsync(string userId, CapabilitySet capabilities, CancellationToken ct = default);
}
