---
id: feature-blazor-focus
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Focus
---

# HexGuard.Blazor.Focus

## Summary

Focus management for Blazor â€” roving tabindex, auto-focus, focus trapping complement. Works with `HexGuard.Blazor.FocusTrap`.


## Goals

- Provide reactive headless state for Blazor components
- SSR-safe with interactive server mode compatibility
- Minimal JavaScript interop, preferring native Blazor patterns


## Non-Goals

- No rendered UI components — headless state and services only
- No JavaScript library dependencies
- No server-side API integration (client-side state management only)

## Proposed Public API

```csharp
public sealed class RovingTabindex
{
    public int ActiveIndex { get; private set; }
    public event Action? OnFocusChanged;

    public RovingTabindex(int itemCount, string orientation = "horizontal", bool wrap = false);
    public void Focus(int index);
    public int GetTabIndex(int index);     // Returns 0 or -1
    public Task HandleKeyDown(KeyboardEventArgs e);
}

// Auto-focus component parameter
// <input @ref="myInput" @attributes="AutoFocus.Attributes()" />
public static class AutoFocus
{
    public static Dictionary<string, object> Attributes();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Focus/` Razor class library.
2. Implement `RovingTabindex` and `AutoFocus`.
3. Test with bUnit.
4. Publish as NuGet.
