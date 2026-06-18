using HexGuard.FeatureFlags;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection;

/// <summary>
/// Extension methods for registering HexGuard feature flags in the
/// ASP.NET Core DI container.
/// </summary>
public static class HexGuardFeatureFlagsServiceCollectionExtensions
{
    /// <summary>
    /// Registers the in-memory feature flag store and evaluator.
    /// </summary>
    /// <param name="services">The service collection.</param>
    /// <param name="configure">Action to configure the flag definitions.</param>
    /// <returns>The same service collection for chaining.</returns>
    public static IServiceCollection AddHexGuardFeatureFlags(
        this IServiceCollection services,
        Action<FeatureFlagOptions> configure)
    {
        ArgumentNullException.ThrowIfNull(configure);

        var options = new FeatureFlagOptions();
        configure(options);
        services.AddSingleton<IFeatureFlagStore>(new InMemoryFeatureFlagStore(options));
        return services;
    }
}
