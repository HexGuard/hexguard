---
id: feature-blazor-table-state
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.TableState
---

# HexGuard.Blazor.TableState

## Summary

Headless table column structure state for Blazor â€” column visibility, ordering, pinning, resizing, and sorting. Blazor counterpart to `@hexguard/angular-table`.

**Competition check:** Zero Blazor table-state packages.


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
public sealed record ColumnDef
{
    public required string Id { get; init; }
    public required string Label { get; init; }
    public bool Visible { get; init; } = true;
    public string? Pinned { get; init; }         // "left", "right", null
    public int Width { get; init; }
    public int MinWidth { get; init; } = 50;
    public int MaxWidth { get; init; } = 1000;
    public bool Sortable { get; init; }
    public bool Resizeable { get; init; } = true;
}

public sealed class TableState : IDisposable
{
    public TableState(IReadOnlyList<ColumnDef> columns);

    public IReadOnlyList<ColumnDef> Columns { get; private set; }
    public IReadOnlyList<ColumnDef> VisibleColumns { get; private set; }
    public IReadOnlyList<SortState> Sort { get; private set; }
    public event Action? OnChange;

    public void ToggleColumn(string id);
    public void ShowColumn(string id);
    public void HideColumn(string id);
    public void MoveColumn(int from, int to);
    public void ResizeColumn(string id, int width);
    public void PinColumn(string id, string? position);
    public void ToggleSort(string id);
    public void ClearSort();
    public void ResetColumns();
}

public sealed record SortState(string Id, string Direction); // "asc" | "desc"
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.TableState/` Razor class library.
2. Implement `TableState` with column management.
3. Test with bUnit.
4. Publish as NuGet.
