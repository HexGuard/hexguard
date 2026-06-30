---
id: feature-blazor-ssr-optimizer
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.SsrOptimizer'
---

# HexGuard.Blazor.SsrOptimizer

## Summary

SSR optimization for Blazor — output caching, streaming improvements, partial hydration, and SSR performance diagnostics. For production Blazor SSR apps.

## Pain Point

Blazor SSR (Static Server Rendering + interactive islands) has optimization gaps: no built-in output caching for SSR pages, streaming is all-or-nothing with no partial completion signals, the hydrated interactive islands have no progressive enhancement fallback, and there are no diagnostics for SSR render time per component.

## Goals

- SSR output caching with configurable duration and vary-by rules
- Streaming render progress signals (sections completed)
- Partial hydration (hydrate sections independently)
- SSR render timing per component
- Cache invalidation triggers
- Progressive enhancement state (SSR HTML → hydrated interactive)

## Non-Goals

- No replacement for Blazor's rendering engine
- No CDN integration
- No static site generation

## Proposed Public API

```csharp
// Output caching
[BlazorOutputCache(Duration = 60, VaryBy = "query.page,query.filter")]
public partial class ProductsPage { }

// Programmatic cache control
public interface ISsrCache
{
    Task<RenderFragment?> GetCachedAsync(string key);
    Task SetCacheAsync(string key, RenderFragment content, TimeSpan duration);
    Task InvalidateAsync(string pattern);
}

// Streaming progress
public interface IStreamingState
{
    bool IsComplete { get; }
    int CompletedSections { get; }
    int TotalSections { get; }
    event Action<int>? SectionCompleted;
    void MarkSectionComplete(string sectionId);
}

// Progressive enhancement
public interface IHydrationState
{
    bool IsInteractive { get; }
    bool IsHydrated { get; }
    string? FallbackContent { get; }
}

// SSR diagnostics
public interface ISsrDiagnostics
{
    IReadOnlyList<ComponentRenderTiming> GetRenderTimings();
    void Clear();
}

public sealed record ComponentRenderTiming(
    string ComponentName,
    double RenderTimeMs,
    DateTimeOffset Timestamp,
    string PageUrl
);

// Registration
builder.Services.AddBlazorSsrOptimizer(options =>
{
    options.EnableOutputCaching = true;
    options.DefaultCacheDuration = TimeSpan.FromMinutes(5);
    options.EnableStreaming = true;
    options.EnableDiagnostics = builder.Environment.IsDevelopment();
    options.EnablePartialHydration = true;
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.SsrOptimizer/` with `.csproj` (RCL).
2. Implement output caching, streaming state, partial hydration, diagnostics.
3. Add cache invalidation, progressive enhancement, render timings.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
