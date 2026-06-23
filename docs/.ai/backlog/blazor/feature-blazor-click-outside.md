---
id: feature-blazor-click-outside
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.ClickOutside
---

# HexGuard.Blazor.ClickOutside

## Summary

Click-outside detection for Blazor components — an injectable service and Razor component helper that detects when a user clicks outside a target element. Blazor has no built-in click-outside pattern; developers must manually wire JavaScript interop for dropdowns, modals, and popovers.

## Goals

1. Provide a `ClickOutsideWatcher` service that tracks a target element ref and emits an `EventCallback` on outside clicks.
2. Provide a `TrackClickOutside` component wrapper (or extension method on `ElementReference`) for declarative use.
3. Support enable/disable toggling via a boolean parameter.
4. Support CSS selector exclusions for nested popover elements.
5. Zero JavaScript interop dependency — uses Blazor's `@ref` + JS interop only for the `pointerdown` capture listener (a single ~10-line JS snippet auto-injected).

## Non-Goals

- No CSS, styling, or transition logic.
- No dropdown or modal UI components — headless detection only.
- No focus management or focus trapping.

## Decisions

1. **JS interop required**: Unlike Angular's `injectClickOutside`, Blazor cannot directly add DOM event listeners. A minimal JS interop module (`clickOutside.js`) is auto-registered via `IJSRuntime`. This is injected once per app via `AddClickOutside()`.
2. **Service + extension**: `builder.Services.AddBlazorClickOutside()` registers the JS module; `ElementReference.TrackClickOutside()` returns a `ClickOutsideHandle` with `EventCallback<PointerEvent>`.

## Proposed Public API

```csharp
// ── Registration ──────────────────────────────────────────

public static class ClickOutsideExtensions
{
    public static IServiceCollection AddBlazorClickOutside(this IServiceCollection services);
}

// ── Service ───────────────────────────────────────────────

public sealed class ClickOutsideHandle
{
    public EventCallback<PointerEvent> OnOutsideClick { get; set; }
    public bool Enabled { get; set; } = true;
    public IReadOnlyList<string> ExcludeSelectors { get; set; } = [];
}

public sealed class ClickOutsideInterop : IAsyncDisposable
{
    // Internal — manages JS module lifecycle
}

// ── Extension method ──────────────────────────────────────

public static class ElementReferenceExtensions
{
    public static ClickOutsideHandle TrackClickOutside(
        this ElementReference elementRef,
        ClickOutsideInterop interop);
}

// ── Usage ─────────────────────────────────────────────────

@* In a Blazor component: *@
@implements IAsyncDisposable
@inject ClickOutsideInterop ClickOutside

<div @ref="dropdownRef">
    <button @onclick="() => isOpen = true">Open</button>
    @if (isOpen)
    {
        <div class="dropdown">
            <!-- dropdown content -->
        </div>
    }
</div>

@code {
    private ElementReference dropdownRef;
    private ClickOutsideHandle? outsideHandle;
    private bool isOpen;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender && isOpen)
        {
            outsideHandle = dropdownRef.TrackClickOutside(ClickOutside);
            outsideHandle.OnOutsideClick = (e) => { isOpen = false; StateHasChanged(); };
        }
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.ClickOutside/` with Razor class library `.csproj`.
2. Create `clickOutside.js` module (auto-registered embedded resource).
3. Implement `ClickOutsideInterop` service managing JS module lifecycle.
4. Implement `ElementReferenceExtensions.TrackClickOutside()`.
5. Create `AddBlazorClickOutside()` extension method.
6. Add test project with bUnit tests.
7. Publish as NuGet package.
