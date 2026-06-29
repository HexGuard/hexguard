---
id: feature-blazor-dynamic-render
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.DynamicRender'
---

# HexGuard.Blazor.DynamicRender

## Summary

Type-safe dynamic component rendering for Blazor — render components by type or name, with typed parameters and cascading values. Extends beyond `DynamicComponent` with full type safety and lazy assembly loading.

## Pain Point

Blazor's built-in `DynamicComponent` is limited: parameters are passed as `Dictionary<string, object?>`, no compile-time type safety, no support for rendering from dynamically loaded assemblies, and no cascading parameter propagation. Common use cases (plugin systems, dashboard widgets, form builders) require reflection hacks.

## Goals

- Render components by `Type` with typed parameter dictionaries
- Render components from dynamically loaded assemblies
- Typed parameter bags with compile-time safety
- Automatic cascading parameter propagation
- Component caching (avoid re-creating for same type)
- Error boundary per dynamically rendered component
- Fallback component for unknown types

## Non-Goals

- No component discovery or scanning
- No plugin framework or DI container
- No rendered component registry UI

## Proposed Public API

```csharp
// Typed dynamic rendering
public interface IDynamicRenderer
{
    RenderFragment Render<TComponent>(Action<ComponentParameters<TComponent>>? configure = null)
        where TComponent : IComponent;

    RenderFragment Render(Type componentType, ComponentParameters parameters);

    RenderFragment RenderFromAssembly(string assemblyPath, string componentTypeName,
        ComponentParameters parameters);
}

// Typed parameter bag
public sealed class ComponentParameters<T> where T : IComponent
{
    public ComponentParameters<T> Set<TValue>(Expression<Func<T, TValue>> property, TValue value);
    public ComponentParameters<T> Set(string parameterName, object? value);
}

// Usage
@inject IDynamicRenderer Renderer

@Renderer.Render<ProductCard>(p => p
    .Set(c => c.Product, myProduct)
    .Set(c => c.ShowPrice, true)
    .Set(c => c.OnAddToCart, EventCallback.Factory.Create<Product>(this, HandleAddToCart))
)

// Dynamic assembly loading
@Renderer.RenderFromAssembly(
    "plugins/WeatherWidget.dll",
    "WeatherWidget.WeatherDisplay",
    new ComponentParameters().Set("City", "London")
)

// Registration
builder.Services.AddBlazorDynamicRender();
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.DynamicRender/` with `.csproj` (RCL).
2. Implement typed parameter bags, dynamic rendering, assembly loading.
3. Add component caching, error boundaries, fallback support.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
