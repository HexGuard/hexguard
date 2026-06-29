---
id: feature-blazor-static-assets
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.StaticAssets'
---

# HexGuard.Blazor.StaticAssets

## Summary

Build-time static asset pipeline helpers for Blazor — CSS bundling, JS optimization, image optimization, font subsetting, and cache-busting. Integrates into the MSBuild pipeline.

## Pain Point

Blazor projects lack a modern asset pipeline: CSS needs manual bundling or external tools (Webpack, Vite, esbuild), images aren't optimized, fonts aren't subsetted, and cache-busting relies on ASP.NET's built-in versioning which is limited. Teams either add Node.js tooling to their .NET build or ship unoptimized assets.

## Goals

- MSBuild-integrated CSS bundling and minification
- JS bundling with tree-shaking via esbuild integration
- Image optimization (WebP conversion, resizing, lazy-load markup generation)
- Font subsetting for icon fonts
- Static asset hashing for cache-busting
- Asset manifest generation for versioned references
- Blazor-specific: WASM module preloading hints
- Development-time asset watching with hot reload

## Non-Goals

- No runtime asset serving — build-time only
- No CDN integration
- No SPA framework integration

## Proposed Public API

```csharp
// .csproj integration
<ItemGroup>
  <BlazorCssBundle Include="Styles/*.css" Output="wwwroot/css/bundle.min.css" />
  <BlazorJsBundle Include="Scripts/*.js" Output="wwwroot/js/bundle.min.js" />
  <BlazorImageOptimize Include="Images/*.jpg" OutputDir="wwwroot/img/" Formats="webp,jpg" />
  <BlazorFontSubset Include="Fonts/icons.ttf" Glyphs="" Output="wwwroot/fonts/icons-subset.woff2" />
</ItemGroup>

// Programmatic API
public static class BlazorAssetPipeline
{
    public static IServiceCollection AddBlazorStaticAssets(this IServiceCollection services,
        Action<AssetPipelineOptions>? configure = null);
}

public sealed class AssetPipelineOptions
{
    public bool EnableCssBundling { get; set; } = true;
    public bool EnableJsBundling { get; set; } = true;
    public bool EnableImageOptimization { get; set; } = true;
    public bool EnableCacheBusting { get; set; } = true;
    public string[] SupportedImageFormats { get; set; } = ["webp", "avif"];
}

// Asset manifest at wwwroot/asset-manifest.json
// {
//   "css/bundle.css": "css/bundle.a1b2c3d4.css",
//   "img/hero.jpg": "img/hero.e5f6g7h8.webp"
// }
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.StaticAssets/` with `.csproj` (MSBuild tasks).
2. Implement CSS/JS bundling via esbuild, image optimization via SkiaSharp.
3. Add font subsetting, cache-busting, asset manifest generation.
4. Add xunit tests. Register in `HexGuard.slnx`.
