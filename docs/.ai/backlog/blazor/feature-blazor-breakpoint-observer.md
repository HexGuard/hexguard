---
id: feature-blazor-breakpoint-observer
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.BreakpointObserver
---

# HexGuard.Blazor.BreakpointObserver

## Summary

Responsive breakpoint detection for Blazor components — an injectable service that wraps `window.matchMedia` (via JS interop) into reactive breakpoint state with `Above`, `Below`, `Active`, and per-breakpoint helpers. Blazor has no built-in responsive component detection; developers must use CSS media queries for styling but cannot react to viewport changes in C# code.

## Goals

1. Provide `BreakpointObserver` service with `Above(name)`, `Below(name)`, `Matches(query)` methods returning reactive `bool`.
2. Provide `Active` property returning the name of the largest matching breakpoint.
3. Support configurable breakpoint map (Tailwind-compatible defaults).
4. Automatic cleanup on component disposal — no manual JS interop management.
5. Fire `OnChange` events so Blazor components can call `StateHasChanged()`.

## Non-Goals

- No CSS media query generation (use Tailwind/PostCSS for styling).
- No element-level resize detection (use `ResizeObserver` separately).
- No SSR support (`window` unavailable).

## Decisions

1. **JS interop required**: Uses `IJSRuntime` to call `window.matchMedia` and listen for `change` events. A small JS module (`breakpointObserver.js`) is auto-registered.
2. **Event-driven**: Breakpoint changes fire a C# event. Components subscribe and call `StateHasChanged()`.
3. **DotNetObjectRef**: Uses `DotNetObjectReference` for JS-to-.NET callbacks.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record BreakpointMap
{
    public static readonly BreakpointMap Tailwind = new()
    {
        { "sm", 640 }, { "md", 768 }, { "lg", 1024 },
        { "xl", 1280 }, { "2xl", 1536 }
    };

    public Dictionary<string, int> Breakpoints { get; init; } = [];
}

// ── Service ───────────────────────────────────────────────

public sealed class BreakpointObserver : IAsyncDisposable
{
    public string Active { get; private set; } = "";
    public IReadOnlyDictionary<string, bool> Breakpoints { get; private set; }
    public event Action? OnChange;

    public bool Above(string name);
    public bool Below(string name);
    public bool Matches(string query);
}

// ── Extension ─────────────────────────────────────────────

public static class BreakpointObserverExtensions
{
    public static IServiceCollection AddBlazorBreakpointObserver(
        this IServiceCollection services,
        BreakpointMap? map = null);
}

// ── Usage ─────────────────────────────────────────────────

@inject BreakpointObserver Bp
@implements IDisposable

<div class="@(Bp.Below("md") ? "mobile-layout" : "desktop-layout")">
    @if (Bp.Above("lg"))
    {
        <sidebar>...</sidebar>
    }
    <main>Content</main>
</div>

@code {
    protected override void OnInitialized()
    {
        Bp.OnChange += StateHasChanged;
    }

    public void Dispose()
    {
        Bp.OnChange -= StateHasChanged;
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.BreakpointObserver/` with Razor class library `.csproj`.
2. Create `breakpointObserver.js` module.
3. Implement `BreakpointObserver` service.
4. Implement `AddBlazorBreakpointObserver()` extension.
5. Add test project with bUnit + mocked IJSRuntime.
6. Publish as NuGet package.
