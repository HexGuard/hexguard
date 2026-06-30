---
id: feature-blazor-icon-registry
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.IconRegistry'
---

# HexGuard.Blazor.IconRegistry

## Summary

Centralized icon registry for Blazor — SVG icon management with lazy loading, caching, and design token integration. For consistent icon usage across design systems.

## Goals

- Typed icon registry with named definitions
- SVG sprite sheet and individual SVG loading
- Lazy loading with in-memory cache
- Sizing via design token scale
- Coloring via currentColor passthrough
- Icon aliasing and search

## Non-Goals

- No icon authoring tools
- No rendered icon picker UI
- No SVG optimization

## Proposed Public API

```csharp
builder.Services.AddBlazorIcons(options =>
{
    options.Add("trash", svg: "<svg>...</svg>", viewBox: "0 0 24 24", tags: ["delete", "remove"]);
    options.Add("edit", svg: "<svg>...</svg>", viewBox: "0 0 24 24");
    options.AddSvgSprite("icons/sprite.svg");
    options.DefaultSize = "24px";
    options.LazyLoad = true;
});

public interface IIconRegistry
{
    IconRenderData? Get(string name);
    ValueTask<IconRenderData?> GetAsync(string name);
    bool Has(string name);
    IReadOnlyList<string> Names();
    IReadOnlyList<string> Search(string query);
    Task PreloadAsync(params string[] names);
}

public sealed record IconRenderData(string Svg, string ViewBox, string Size, string? Color = null);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.IconRegistry/` with `.csproj` (RCL).
2. Implement icon registration, lazy loading, caching, search.
3. Add sprite sheet support and design token integration.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
