using HexGuard.FeatureFlags;

namespace HexGuard.FeatureFlags.Tests;

public sealed class InMemoryFeatureFlagStoreTests
{
    [Fact]
    public async Task Store_returns_catalog_with_registered_flags()
    {
        var options = new FeatureFlagOptions
        {
            Flags = new List<FeatureFlag>
            {
                new("flag-a", true),
                new("flag-b", false),
            },
        };

        var store = new InMemoryFeatureFlagStore(options);
        var catalog = await store.GetCatalogAsync();

        Assert.Equal(2, catalog.Flags.Count);
        Assert.True(catalog.Flags["flag-a"].Enabled);
        Assert.False(catalog.Flags["flag-b"].Enabled);
    }

    [Fact]
    public async Task Store_returns_single_flag_by_key()
    {
        var options = new FeatureFlagOptions
        {
            Flags = new List<FeatureFlag>
            {
                new("flag-a", true),
            },
        };

        var store = new InMemoryFeatureFlagStore(options);
        var flag = await store.GetFlagAsync("flag-a");

        Assert.NotNull(flag);
        Assert.Equal("flag-a", flag.Key);
        Assert.True(flag.Enabled);
    }

    [Fact]
    public async Task Store_returns_null_for_unknown_key()
    {
        var options = new FeatureFlagOptions();
        var store = new InMemoryFeatureFlagStore(options);
        var flag = await store.GetFlagAsync("nonexistent");

        Assert.Null(flag);
    }

    [Fact]
    public void Computed_context_hash_is_deterministic()
    {
        var flags = new Dictionary<string, FeatureFlag>
        {
            ["flag-a"] = new("flag-a", true, Variant: "enabled", RolloutPercentage: 100),
            ["flag-b"] = new("flag-b", false, Variant: "disabled", RolloutPercentage: 0),
        };

        var hash1 = InMemoryFeatureFlagStore.ComputeContextHash(flags);
        var hash2 = InMemoryFeatureFlagStore.ComputeContextHash(flags);

        Assert.Equal(hash1, hash2);
    }

    [Fact]
    public void Computed_context_hash_changes_when_flag_changes()
    {
        var flags1 = new Dictionary<string, FeatureFlag>
        {
            ["flag-a"] = new("flag-a", true),
        };

        var flags2 = new Dictionary<string, FeatureFlag>
        {
            ["flag-a"] = new("flag-a", false),
        };

        var hash1 = InMemoryFeatureFlagStore.ComputeContextHash(flags1);
        var hash2 = InMemoryFeatureFlagStore.ComputeContextHash(flags2);

        Assert.NotEqual(hash1, hash2);
    }
}
