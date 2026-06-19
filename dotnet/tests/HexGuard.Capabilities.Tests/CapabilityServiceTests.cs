using HexGuard.Capabilities;
using Microsoft.Extensions.DependencyInjection;

namespace HexGuard.Capabilities.Tests;

public class CapabilityServiceTests
{
    private static ICapabilityService CreateService(Action<CapabilitiesOptions>? configure = null)
    {
        var services = new ServiceCollection();
        services.AddHexGuardCapabilities(configure);
        var provider = services.BuildServiceProvider();
        return provider.GetRequiredService<ICapabilityService>();
    }

    [Fact]
    public async Task GetCapabilitiesAsync_ReturnsEmptySet_WhenNoUser()
    {
        var service = CreateService();
        var caps = await service.GetCapabilitiesAsync();
        Assert.Empty(caps.Roles);
        Assert.Empty(caps.Permissions);
    }

    [Fact]
    public async Task GetCapabilitiesAsync_ReturnsRoles_WhenConfigured()
    {
        var service = CreateService(options =>
        {
            options.AddCapabilities("user-1", new CapabilitySet
            {
                Roles = new[] { "admin", "analyst" },
                Permissions = new Dictionary<string, IReadOnlyList<string>>
                {
                    ["orders"] = new[] { "create", "read", "update", "delete" },
                    ["reports"] = new[] { "read" },
                },
            });
        });

        service.SetCurrentUser("user-1");

        var caps = await service.GetCapabilitiesAsync();
        Assert.Contains("admin", caps.Roles);
        Assert.Contains("analyst", caps.Roles);
        Assert.Contains("orders", caps.Permissions.Keys);
        Assert.Contains("create", caps.Permissions["orders"]);
    }

    [Fact]
    public async Task HasCapabilityAsync_ReturnsTrue_WhenPermitted()
    {
        var service = CreateService(options =>
        {
            options.AddCapabilities("user-1", new CapabilitySet
            {
                Roles = new[] { "analyst" },
                Permissions = new Dictionary<string, IReadOnlyList<string>>
                {
                    ["orders"] = new[] { "read" },
                },
            });
        });

        service.SetCurrentUser("user-1");

        Assert.True(await service.HasCapabilityAsync("orders", "read"));
        Assert.False(await service.HasCapabilityAsync("orders", "delete"));
        Assert.False(await service.HasCapabilityAsync("reports", "read"));
    }

    [Fact]
    public async Task HasCapabilityAsync_ReturnsFalse_ForUnknownUser()
    {
        var service = CreateService();

        service.SetCurrentUser("unknown");

        Assert.False(await service.HasCapabilityAsync("orders", "read"));
    }
}
