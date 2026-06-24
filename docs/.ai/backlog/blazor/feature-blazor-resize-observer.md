---
id: feature-blazor-resize-observer
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.ResizeObserver
---

# HexGuard.Blazor.ResizeObserver

## Summary

Element-level resize detection for Blazor — observe when a specific element changes size (not the viewport). Essential for responsive charts, auto-resize textareas, dashboards with collapsible panels, and custom-layout components.

**Competition check (NuGet):** One outdated competitor (`BlazorObservers`, 35k downloads, .NET 6 only, last updated 2022). **Greenfield — no modern .NET 10 alternative.**

## Why Wide Adoption

`ResizeObserver` is a browser API that fires when an element's size changes — unlike `matchMedia` which only detects viewport changes. Every chart library, auto-resize textarea, dashboard with resizable panes, and responsive component needs it. In Blazor, developers must write JS interop wrappers each time.

## Goals

1. Provide `ResizeObserverService` with `Observe(element, callback)` and `Unobserve(element)`.
2. Return content rect (`width`, `height`, `x`, `y`) on each resize event.
3. Debounce resize events to avoid excessive re-renders.
4. Automatic cleanup on component disposal.
5. No dependency on any UI framework.

## Decisions

1. **JS interop required**: `ResizeObserver` is a browser API.
2. **Debounced by default**: 100ms debounce to avoid rapid re-renders during live resizing.
3. **ElementReference-based**: Uses `ElementReference` for type safety.

## Proposed Public API

```csharp
public sealed record ResizeEntry
{
    public double Width { get; init; }
    public double Height { get; init; }
    public double X { get; init; }
    public double Y { get; init; }
}

public sealed class ResizeObserverService : IAsyncDisposable
{
    public Task Observe(ElementReference element,
        Action<ResizeEntry> onResize,
        ResizeObserverOptions? options = null);
    public Task Unobserve(ElementReference element);
}

public sealed record ResizeObserverOptions
{
    public int DebounceMs { get; init; } = 100;
    public bool FireImmediately { get; init; } = false;
}
```

## Implementation Plan

1. Create Razor class library project.
2. Create `resizeObserver.js` module.
3. Implement `ResizeObserverService`.
4. Add debounce logic.
5. Test with bUnit.
