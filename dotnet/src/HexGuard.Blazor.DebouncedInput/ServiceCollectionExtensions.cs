using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace HexGuard.Blazor.DebouncedInput;

/// <summary>
/// Extension methods for registering <see cref="DebouncedValue{T}"/> in the DI container.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Registers a transient <see cref="DebouncedValue{T}"/> factory so each component
    /// can create its own debounce instance via <c>DebouncedValue&lt;T&gt;.Create(...)</c>.
    /// </summary>
    /// <typeparam name="T">The value type to debounce.</typeparam>
    /// <param name="services">The service collection.</param>
    /// <returns>The service collection for chaining.</returns>
    public static IServiceCollection AddDebouncedValue<T>(this IServiceCollection services)
    {
        services.TryAddTransient<Func<Func<T, Task>, int, DebounceMode, DebouncedValue<T>>>(
            _ => (onValue, delayMs, mode) => DebouncedValue<T>.Create(onValue, delayMs, mode));
        return services;
    }
}
