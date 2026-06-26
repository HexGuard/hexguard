---
id: feature-blazor-split-view
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.SplitView
---

# HexGuard.Blazor.SplitView

## Summary

Resizable split panel state for Blazor — track splitter position, min/max constraints, collapse/expand, and persist ratios. Every IDE-style layout and dashboard with resizable panels needs this.

## Proposed Public API

```csharp
public sealed class SplitViewState : IDisposable
{
    public double SplitterPosition { get; private set; }   // 0–1 ratio or absolute px
    public bool IsCollapsed { get; private set; }
    public SplitViewMode Mode { get; set; }                 // Ratio, Pixels
    public double MinPosition { get; set; }
    public double MaxPosition { get; set; }
    public event Action? OnChanged;

    public void SetPosition(double position);
    public void ToggleCollapse();
    public void Reset();
}

public enum SplitViewMode { Ratio, Pixels }
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.SplitView/` Razor class library.
2. Implement splitter state with mouse/touch drag via JS interop.
3. Test with bUnit.
4. Publish as NuGet.
