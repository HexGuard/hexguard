---
id: feature-blazor-js-interop
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.JsInterop'
---

# HexGuard.Blazor.JsInterop

## Summary

Typed JavaScript interop abstraction for Blazor — eliminate `IJSRuntime` magic strings, `JsonElement` parsing, and manual serialization. Provides strongly-typed wrappers for common browser APIs and a module contract system.

## Pain Point

Blazor's `IJSRuntime.InvokeAsync<T>("function.name", args)` is the primary bottleneck for Blazor-JS integration:
- Magic strings for function names and module paths
- Manual `JsonElement` deserialization for complex objects
- No compile-time safety for module references
- Verbose error handling for missing JS functions
- Every new browser API means writing new interop glue

## Goals

- Typed JS module contracts with compile-time safety
- Common browser API wrappers out of the box (clipboard, geolocation, notification, share, fullscreen)
- Automatic JSON serialization/deserialization
- JS module lazy loading with fallback
- Cancellation token propagation to JS calls
- Error categorization (JS not available, timeout, serialization error)

## Non-Goals

- No replacement for `IJSRuntime` — builds on top of it
- No JS bundling or module management
- No rendered UI components

## Proposed Public API

```csharp
// Typed module contract
public interface IClipboardModule
{
    Task WriteTextAsync(string text);
    Task<string> ReadTextAsync();
}

public interface IGeolocationModule
{
    Task<GeoPosition> GetCurrentPositionAsync(GeoOptions? options = null);
    Task<int> WatchPositionAsync(Func<GeoPosition, Task> callback, GeoOptions? options = null);
    Task ClearWatchAsync(int watchId);
}

// Registration
public static IServiceCollection AddBlazorInterop(this IServiceCollection services);

// Usage
@inject IBlazorInterop Interop

var clipboard = Interop.GetModule<IClipboardModule>();
await clipboard.WriteTextAsync("copied!");

// Or invoke directly
var position = await Interop.InvokeAsync<GeoPosition>(
    "geolocation.getCurrentPosition",
    new { enableHighAccuracy = true }
);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.JsInterop/` with `.csproj` (Razor Class Library).
2. Implement typed module contract system, common browser API wrappers.
3. Add module lazy loading, error categorization, cancellation support.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
