using HexGuard.FeatureFlags;

namespace HexGuard.SampleApi.Packages.HexGuardFeatureFlags;

/// <summary>
/// Predefined feature flags used by the SampleApi demo.
/// </summary>
internal static class FeatureFlagsSampleData
{
    public static FeatureFlagOptions CreateOptions() => new()
    {
        Flags = new List<FeatureFlag>
        {
            new(
                Key: "beta-search",
                Enabled: true,
                Variant: "search-v2",
                TargetingRules: new TargetingRule[]
                {
                    new GroupInRule(new[] { "beta-testers" }),
                    new RolloutRule(25),
                }),
            new(
                Key: "new-checkout",
                Enabled: true,
                Variant: "checkout-v2",
                TargetingRules: new TargetingRule[]
                {
                    new UserInRule(new[] { "admin-1", "admin-2" }),
                    new RolloutRule(10),
                }),
            new(
                Key: "dark-mode",
                Enabled: true,
                Variant: "dark",
                TargetingRules: new TargetingRule[]
                {
                    new AttributeMatchRule("preferences", "dark-mode"),
                }),
            new(
                Key: "premium-feature-x",
                Enabled: true,
                Variant: "premium",
                TargetingRules: new TargetingRule[]
                {
                    new GroupInRule(new[] { "premium-users" }),
                }),
            new(
                Key: "deprecated-ui",
                Enabled: false,
                Variant: "deprecated",
                Metadata: new Dictionary<string, string>
                {
                    ["deprecationDate"] = "2026-09-01",
                    ["replacement"] = "new-ui",
                }),
        },
    };

    /// <summary>
    /// Returns available personas for the demo UI.
    /// </summary>
    public static IReadOnlyList<object> GetPersonas() => new object[]
    {
        new
        {
            id = "guest",
            label = "Guest",
            userId = "guest-1",
            groups = Array.Empty<string>(),
            attributes = new Dictionary<string, string>(),
        },
        new
        {
            id = "beta-tester",
            label = "Beta Tester",
            userId = "beta-user-1",
            groups = new[] { "beta-testers" },
            attributes = new Dictionary<string, string>(),
        },
        new
        {
            id = "premium",
            label = "Premium User",
            userId = "premium-user-1",
            groups = new[] { "premium-users" },
            attributes = new Dictionary<string, string>(),
        },
        new
        {
            id = "dark-mode-user",
            label = "Dark Mode User",
            userId = "dark-user-1",
            groups = Array.Empty<string>(),
            attributes = new Dictionary<string, string>
            {
                ["preferences"] = "dark-mode",
            },
        },
        new
        {
            id = "admin",
            label = "Admin",
            userId = "admin-1",
            groups = new[] { "beta-testers", "premium-users" },
            attributes = new Dictionary<string, string>
            {
                ["preferences"] = "dark-mode",
            },
        },
    };
}
