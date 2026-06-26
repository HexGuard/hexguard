---
id: feature-blazor-tree-view
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.TreeView
---

# HexGuard.Blazor.TreeView

## Summary

Headless tree expand/collapse, selection, and filtering state for hierarchical data in Blazor. Every Blazor app with an org chart, category browser, file explorer, permission tree, or taxonomy selector needs tree interaction primitives — yet no Blazor NuGet package provides headless tree state.

**Angular counterpart:** `@hexguard/angular-tree-state`

**Competition check (NuGet):** Zero headless tree-state packages exist for Blazor. UI libraries (Radzen, MudBlazor, FluentUI) include tree components but bundle them with opinionated rendering, styling, and full UI frameworks.

## Why Wide Adoption

Tree UI is universal: folder navigation, category filters, organizational hierarchies, permission assignment trees, nested menu builders. Every team building these re-implements expand/collapse tracking, selection propagation, filtering with parent visibility, and keyboard navigation.

## Goals

1. Provide `TreeViewState<T>` service with expand/collapse, selection, and filtering.
2. Support single and multi selection with optional parent-child propagation.
3. Support `Filter(query)` — visible nodes based on matching text, parents visible if any child matches.
4. Support keyboard navigation (ArrowUp/Down/Left/Right/Enter).
5. Expose reactive state via `OnChange` events for `StateHasChanged()`.
6. Pure C# — no JS interop required (tree state is data-driven).

## Non-Goals

- No UI rendering — consumer provides their own template for each node.
- No drag-and-drop reorder.
- No async lazy loading of children.

## Decisions

1. **Service pattern**: `TreeViewState<T>` is a Scoped service with all state in-memory.
2. **Normalized model**: Input `TreeNode<T>[]` with children; internally flattens for O(1) lookup.
3. **Immutable operations**: State changes produce new collections for reliable change detection.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record TreeNode<T>
{
    public required string Id { get; init; }
    public required string Label { get; init; }
    public T? Data { get; init; }
    public IReadOnlyList<TreeNode<T>> Children { get; init; } = [];
    public bool InitiallyExpanded { get; init; }
    public bool Disabled { get; init; }
}

public enum TreeSelectionMode { None, Single, Multi }

// ── Service ───────────────────────────────────────────────

public sealed class TreeViewState<T>
{
    public TreeViewState(IReadOnlyList<TreeNode<T>> nodes,
        TreeSelectionMode selectionMode = TreeSelectionMode.None);

    // Signals (re-fire OnChange when mutated)
    public IReadOnlyList<TreeNode<T>> VisibleNodes { get; private set; }
    public IReadOnlySet<string> ExpandedIds { get; private set; }
    public IReadOnlySet<string> SelectedIds { get; private set; }
    public string? ActiveId { get; private set; }
    public string? FilterQuery { get; private set; }
    public event Action? OnChange;

    // Expand/collapse
    public void Toggle(string id);
    public void Expand(string id);
    public void Collapse(string id);
    public void ExpandAll();
    public void CollapseAll();

    // Selection
    public void Select(string id);
    public void Deselect(string id);
    public void ToggleSelect(string id);
    public void ClearSelection();

    // Filter
    public void Filter(string query);
    public void ClearFilter();

    // Keyboard navigation
    public void NavigateUp();
    public void NavigateDown();
    public void NavigateLeft();
    public void NavigateRight();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<TreeViewState<T>>();
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.TreeView/` Razor class library.
2. Implement `TreeNode<T>`, tree normalization, expand/collapse logic.
3. Implement selection with propagation option.
4. Implement filtering with parent-visibility preservation.
5. Implement keyboard navigation.
6. Test with bUnit + xUnit.
7. Publish as NuGet.
