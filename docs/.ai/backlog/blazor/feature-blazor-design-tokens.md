---
id: feature-blazor-design-tokens
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.DesignTokens'
---

# HexGuard.Blazor.DesignTokens

## Summary

Typed design token system for Blazor — C# token definitions, CSS custom property generation, and theme layers. Single source of truth for design values with DI-based access.

## Goals

- C# token hierarchy with type safety
- Automatic CSS custom property generation
- Token access via `ITokenService` DI
- Theme layer support (light, dark, brand)
- Token aliasing and composition
- Build-time CSS generation

## Non-Goals

- No CSS-in-C# or style generation
- No Figma integration
- No rendered token editor

## Proposed Public API

```csharp
var tokens = new TokenRegistry()
    .AddColor("primary.500", "#3b82f6")
    .AddColor("neutral.900", "#171717")
    .AddSpacing("md", "1rem")
    .AddAlias("surface", "neutral.50")
    .AddTheme("dark", dark => dark
        .Override("surface", "#0f172a")
        .Override("text", "#f8fafc"));

builder.Services.AddBlazorDesignTokens(tokens);

// Access
public interface ITokenService
{
    string Get(string path);
    bool TryGet(string path, out string? value);
    IReadOnlyDictionary<string, string> GetAll();
}

public interface IThemeService
{
    string CurrentTheme { get; }
    IReadOnlyList<string> Themes { get; }
    event Action<string>? ThemeChanged;
    void SetTheme(string theme);
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.DesignTokens/` with `.csproj` (RCL).
2. Implement token registry, CSS var generation, theme layers, DI integration.
3. Add build-time CSS output and validation.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
