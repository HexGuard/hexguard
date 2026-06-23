---
id: feature-blazor-intersection-observer
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.IntersectionObserver
---

# HexGuard.Blazor.IntersectionObserver

## Summary

Element-level viewport intersection detection for Blazor components — lazy-load images, trigger infinite scroll, pause offscreen video, and fire scroll-spy analytics. Wraps the browser's `IntersectionObserver` API via JS interop.

**Competition check (NuGet):** Zero packages — no Blazor IntersectionObserver library exists. **Greenfield.**

## Why Wide Adoption

Lazy-loading images, infinite-scroll lists, scroll-triggered animations, and "section visible" analytics are required in almost every web app. In Blazor, each requires bespoke JS interop. A headless `IntersectionObserver` service would be an immediate dependency for any content-rich Blazor app.

## Goals

1. Provide `IntersectionObserverService` with `Observe(element, callback, options)` and `Unobserve(element)`.
2. Provide `ElementVisibilitySensor.razor` component with `OnVisibleChange` EventCallback.
3. Support configurable `rootMargin` and `threshold`.
4. Return intersection ratio and bounding rect data.
5. Automatic cleanup when component disposes.

## Non-Goals

- No scroll-spy logic (just raw intersection data — consumers build scroll-spy on top).
- No lazy-image component (too opinionated — provide the detection, not the loading UI).
- No infinite-scroll component (headless detection only).

## Decisions

1. **JS interop required**: `IntersectionObserver` is a browser API. A small `intersectionObserver.js` module is auto-registered.
2. **DotNetObjectReference**: Callbacks from JS to .NET use `DotNetObjectReference`.
3. **ElementReference-based**: Uses `ElementReference` rather than CSS selectors for type safety.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record IntersectionOptions
{
    public string? RootMargin { get; init; } = "0px";
    public float Threshold { get; init; } = 0f;
}

public sealed record IntersectionEntry
{
    public bool IsIntersecting { get; init; }
    public float IntersectionRatio { get; init; }
    public string? TargetId { get; init; }
}

// ── Service ───────────────────────────────────────────────

public sealed class IntersectionObserverService : IAsyncDisposable
{
    public Task Observe(ElementReference element,
        Func<IntersectionEntry, Task> callback,
        IntersectionOptions? options = null);
    public Task Unobserve(ElementReference element);
    public Task Disconnect();
}

// ── Component ─────────────────────────────────────────────

@* ElementVisibilitySensor.razor *@
public partial class ElementVisibilitySensor : IDisposable
{
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public EventCallback<bool> OnVisibleChange { get; set; }
    [Parameter] public IntersectionOptions Options { get; set; } = new();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<IntersectionObserverService>();

// ── Usage ─────────────────────────────────────────────────

@inject IntersectionObserverService Observer

<div @ref="lazyTarget">@* content *@</div>

@code {
    private ElementReference lazyTarget;

    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await Observer.Observe(lazyTarget, async (entry) =>
            {
                if (entry.IsIntersecting) await LoadData();
            });
        }
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.IntersectionObserver/` Razor class library.
2. Create `intersectionObserver.js` module.
3. Implement `IntersectionObserverService`.
4. Implement `ElementVisibilitySensor.razor` component.
5. Test with bUnit + mocked IJSRuntime.
6. Publish as NuGet.
