---
id: feature-blazor-theme
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Theme
---

# HexGuard.Blazor.Theme

## Summary

Theme switching state for Blazor — light/dark/system, CSS class management, `prefers-color-scheme` detection. Blazor counterpart to `@hexguard/angular-theme`.

## Proposed Public API

```csharp
public enum ThemeMode { Light, Dark, System }

public sealed class ThemeService : IDisposable
{
    public ThemeMode Mode { get; private set; }
    public string EffectiveTheme => Mode switch {
        ThemeMode.System => IsSystemDark ? "dark" : "light",
        _ => Mode.ToString().ToLower()
    };
    public bool IsSystemDark { get; private set; }
    public event Action? OnChanged;

    public Task InitializeAsync();           // Detect system preference
    public void SetMode(ThemeMode mode);
    public void Toggle();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Theme/` Razor class library.
2. Implement with JS interop for `prefers-color-scheme`.
3. Test with bUnit.
4. Publish as NuGet.
