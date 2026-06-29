---
id: feature-blazor-virtual-scroll
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.VirtualScroll'
---

# HexGuard.Blazor.VirtualScroll

## Summary

Advanced virtualization state for Blazor — dynamic row heights, grid virtualization, infinite scroll with placeholder skeleton, and scroll restoration. Extends beyond the built-in `Virtualize` component's limitations.

## Pain Point

Blazor's built-in `Virtualize` component has real limitations: fixed item sizes only, no grid layout virtualization, no infinite-scroll with loading placeholders, no scroll position restoration on navigation back, and no bi-directional (chat-style) scrolling. JS frameworks have mature solutions (react-window, tanstack virtual).

## Goals

- Dynamic row/item height measurement and adaptation
- Grid/masonry layout virtualization
- Infinite scroll with sentinel-based loading
- Bi-directional scrolling (chat, log viewers)
- Scroll position save/restore on navigation
- Overscan configuration for smooth scrolling
- Sticky headers and group labels within virtualized list

## Non-Goals

- No rendered virtualization UI — headless state and measurement only
- No replacement for the built-in `Virtualize` component
- No windowing in CSS (that's the consumer's responsibility)

## Proposed Public API

```csharp
public interface IVirtualScrollState
{
    int TotalCount { get; set; }
    int Overscan { get; set; }
    double ScrollTop { get; }
    double ViewportHeight { get; }
    IReadOnlyList<VirtualItem> VisibleItems { get; }
    VirtualScrollDirection Direction { get; set; }
    bool IsLoadingMore { get; }
    string? StickyGroupKey { get; }

    event Action? VisibleRangeChanged;
    event Func<Task>? LoadMoreRequested;

    void SetItemHeight(int index, double height);
    double GetEstimatedTotalHeight();
    int FindIndexAtOffset(double offset);
    void SaveScrollPosition(string key);
    bool RestoreScrollPosition(string key);
}

public readonly record struct VirtualItem(int Index, double Offset, double Height, string? GroupKey);

public enum VirtualScrollDirection { TopDown, BottomUp, BiDirectional }

// Registration
builder.Services.AddBlazorVirtualScroll();
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.VirtualScroll/` with `.csproj` (RCL).
2. Implement dynamic measurement, grid layout, infinite scroll, scroll restoration.
3. Add bi-directional scrolling and sticky group support.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
