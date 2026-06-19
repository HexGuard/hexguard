using Microsoft.Extensions.DependencyInjection;

namespace HexGuard.Capabilities;

/// <summary>Configuration options for HexGuard.Capabilities.</summary>
public sealed class CapabilitiesOptions
{
    /// <summary>Gets the in-memory capability data keyed by user identifier.</summary>
    internal Dictionary<string, CapabilitySet> Stores { get; } = new();

    /// <summary>Adds a capability set for a given user identifier.</summary>
    public CapabilitiesOptions AddCapabilities(string userId, CapabilitySet capabilities)
    {
        Stores[userId] = capabilities;
        return this;
    }
}

/// <summary>Extension methods for registering HexGuard.Capabilities services.</summary>
public static class CapabilitiesServiceCollectionExtensions
{
    /// <summary>Registers HexGuard.Capabilities services with the specified configuration.</summary>
    public static IServiceCollection AddHexGuardCapabilities(
        this IServiceCollection services,
        Action<CapabilitiesOptions>? configure = null)
    {
        var options = new CapabilitiesOptions();
        configure?.Invoke(options);

        var store = new InMemoryCapabilityStore();
        // InMemoryCapabilityStore.SetCapabilitiesAsync is synchronous — safe to block.
        foreach (var (userId, caps) in options.Stores)
        {
            store.SetCapabilitiesAsync(userId, caps).GetAwaiter().GetResult();
        }

        services.AddSingleton<ICapabilityStore>(store);
        services.AddSingleton<ICapabilityService, CapabilityService>();
        return services;
    }

    /// <summary>Registers HexGuard.Capabilities services that use only an external store provider.</summary>
    public static IServiceCollection AddHexGuardCapabilities<TStore>(
        this IServiceCollection services)
        where TStore : class, ICapabilityStore
    {
        services.AddSingleton<ICapabilityStore, TStore>();
        services.AddSingleton<ICapabilityService, CapabilityService>();
        return services;
    }
}
