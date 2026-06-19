using HexGuard.Capabilities;

namespace HexGuard.SampleApi.Packages.HexGuardCapabilities;

/// <summary>Sample persona-based capability data for the demo API.</summary>
public static class CapabilitiesSampleData
{
    /// <summary>Returns predefined capability sets for demo personas.</summary>
    public static Dictionary<string, CapabilitySet> CreatePersonas() => new()
    {
        ["guest"] = new CapabilitySet
        {
            Roles = new[] { "guest" },
            Permissions = new Dictionary<string, IReadOnlyList<string>>
            {
                ["dashboard"] = new[] { "read" },
                ["reports"] = new[] { "read" },
            },
        },
        ["analyst"] = new CapabilitySet
        {
            Roles = new[] { "analyst" },
            Permissions = new Dictionary<string, IReadOnlyList<string>>
            {
                ["dashboard"] = new[] { "read" },
                ["orders"] = new[] { "read", "update" },
                ["reports"] = new[] { "create", "read", "delete" },
                ["settings"] = new[] { "read" },
            },
        },
        ["approver"] = new CapabilitySet
        {
            Roles = new[] { "analyst", "approver" },
            Permissions = new Dictionary<string, IReadOnlyList<string>>
            {
                ["dashboard"] = new[] { "read" },
                ["orders"] = new[] { "create", "read", "update", "approve" },
                ["reports"] = new[] { "create", "read", "update", "delete" },
                ["settings"] = new[] { "read" },
            },
        },
        ["admin"] = new CapabilitySet
        {
            Roles = new[] { "admin" },
            Permissions = new Dictionary<string, IReadOnlyList<string>>
            {
                ["dashboard"] = new[] { "create", "read", "update", "delete" },
                ["orders"] = new[] { "create", "read", "update", "delete", "approve" },
                ["reports"] = new[] { "create", "read", "update", "delete" },
                ["users"] = new[] { "create", "read", "update", "delete" },
                ["settings"] = new[] { "create", "read", "update", "delete" },
                ["audit"] = new[] { "read" },
            },
        },
    };
}
