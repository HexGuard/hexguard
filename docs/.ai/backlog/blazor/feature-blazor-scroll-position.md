---
id: feature-blazor-scroll-position
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.ScrollPosition
---

# HexGuard.Blazor.ScrollPosition

## Summary

Scroll position tracking for Blazor — save/restore scroll position on navigation, detect scroll direction and distance, trigger infinite scroll callbacks, and provide scroll-to-top functionality. Common but universally re-invented.

**Competition check (NuGet):** Zero packages. **Greenfield.**

## Why Wide Adoption

Every content-heavy Blazor app needs scroll management: "back to top" buttons, infinite scroll list loading, scroll-aware headers that shrink on scroll-down, and analytics tracking scroll depth. Without a package, each developer writes the same JS interop scroll listener boilerplate.

## Goals

1. Provide `ScrollPositionService` with `GetScrollY`, `ScrollToTop`, `ScrollToElement` methods.
2. Provide `OnScroll` EventCallback providing scroll position, direction, and distance from bottom.
3. Save/restore scroll position on Blazor navigation (both Server and WASM).
4. Support `InfiniteScrollTrigger` component that fires when user scrolls near the bottom.
5. Automatic cleanup on component disposal.

## Decisions

1. **JS interop required**: `window.scrollY`, `window.scrollTo`, `element.scrollIntoView` are browser APIs.
2. **Two modes**: Imperative (service) and declarative (component).

## Proposed Public API

```csharp
public sealed class ScrollPositionService
{
    public ValueTask<double> GetScrollYAsync();
    public ValueTask ScrollToTopAsync(bool smooth = true);
    public ValueTask ScrollToElementAsync(ElementReference element, bool smooth = true);
    public event Action<ScrollInfo>? OnScrollChanged;
}

public sealed record ScrollInfo(
    double ScrollY,
    double MaxScrollY,
    bool IsScrollingDown,
    double DistanceFromBottom
);

// Component
@* <InfiniteScrollTrigger Threshold="200" OnTrigger="LoadMore" /> *@
```

## Implementation Plan

1. Create Razor class library project.
2. Implement JS module + `ScrollPositionService`.
3. Test with bUnit.
