---
id: feature-angular-tree-state
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-tree-state'
---

# @hexguard/angular-tree-state

## Summary

Headless tree expand/collapse, selection, and filtering state for hierarchical data in Angular. Every app with an org chart, category browser, file explorer, permission tree, navigation menu, or taxonomy selector needs tree interaction primitives — yet there's no headless, signal-based tree state package for Angular.

**Competition check:** Angular CDK has `CdkTree` but it's tightly coupled to its own structural directive and data source pattern. No standalone signal-based tree state primitive exists. Third-party tree components (primeng, material tree) are opinionated UI widgets.

## Why Wide Adoption

Tree UI is everywhere: folder navigation, category filters, organizational hierarchies, permission assignment trees, nested comment threads, sitemaps, nested menu builders. Every team building these re-implements expand/collapse tracking, selection propagation, filtering with parent visibility, and keyboard navigation.

## Goals

1. Provide `injectTreeState<T>()` — factory accepting a flat or nested node array and returning tree UI state.
2. Support expand/collapse per node with `toggle()`, `expandAll()`, `collapseAll()`.
3. Support single and multi selection with parent-child propagation (optional).
4. Support `filter(query)` — visible nodes based on matching text, with parents visible if any child matches.
5. Support keyboard navigation (ArrowUp/Down/Left/Right/Enter) out of the box.
6. Provide computed signals: `visibleNodes`, `expandedNodes`, `selectedNodes`, `filteredNodes`.

## Non-Goals

- No UI rendering — consumer provides their own template/component for each node.
- No drag-and-drop reorder (use `angular-drag-state` for that).
- No async lazy loading of children (consumer manages their own data loading).

## Decisions

1. **Normalized node model**: Input is `TreeNode<T>[]` with `children` array; internally normalizes to a flat lookup map for O(1) access.
2. **Immutable operations**: Expand/collapse/select produce new state objects for signal change detection.
3. **Filter strategy**: `filter(query)` sets `visibleNodes` to nodes whose label matches (case-insensitive), including parents of matching leaf nodes. Empty query shows all.

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export interface TreeNode<T = unknown> {
  id: string;
  label: string;
  data?: T;
  children?: TreeNode<T>[];
  initiallyExpanded?: boolean;
  disabled?: boolean;
  icon?: string;
}

export interface TreeStateOptions<T> {
  nodes: TreeNode<T>[] | Signal<TreeNode<T>[]>;
  selectionMode?: 'none' | 'single' | 'multi';
  filterField?: (node: TreeNode<T>) => string;   // default: node.label
  trackBy?: (node: TreeNode<T>) => string;        // default: node.id
}

export interface TreeState<T> {
  // Signals
  readonly nodes: Signal<TreeNode<T>[]>;
  readonly visibleNodes: Signal<TreeNode<T>[]>;    // Filtered + parent-expanded
  readonly expandedIds: Signal<Set<string>>;
  readonly selectedIds: Signal<Set<string>>;
  readonly activeId: Signal<string | null>;         // Keyboard focus
  readonly filterQuery: Signal<string>;

  // Expand/collapse
  toggle(id: string): void;
  expand(id: string): void;
  collapse(id: string): void;
  expandAll(): void;
  collapseAll(): void;
  isExpanded(id: string): Signal<boolean>;

  // Selection
  select(id: string): void;
  deselect(id: string): void;
  toggleSelect(id: string): void;
  selectAll(): void;
  clearSelection(): void;
  isSelected(id: string): Signal<boolean>;

  // Filter
  filter(query: string): void;
  clearFilter(): void;

  // Keyboard navigation (call on keydown)
  navigate(direction: 'up' | 'down' | 'left' | 'right'): void;
  activate(id: string): void;
}

// ── Factory ───────────────────────────────────────────────

export function injectTreeState<T>(options: TreeStateOptions<T>): TreeState<T>;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-tree-state/` following the standard pattern.
2. Implement `TreeNode`, `TreeStateOptions`, `TreeState` types.
3. Implement tree normalization (nested → flat lookup).
4. Implement expand/collapse with signal state.
5. Implement selection with optional parent propagation.
6. Implement filtering with parent-visibility preservation.
7. Implement keyboard navigation.
8. Add tests: expand/collapse, selection modes, filter behavior, keyboard nav, edge cases (empty tree, single node, deep nesting).
9. Create demo page using `DemoPageLayoutComponent`.
10. Register in workspace, build scripts, and catalog.
