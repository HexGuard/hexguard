---
id: feature-angular-org-chart
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-org-chart'
---

# @hexguard/angular-org-chart

## Summary

Headless organizational chart state — hierarchical tree structure, node expansion, search, and reporting lines. For company directories, team structure views, and reporting chain visualization.

## Goals

- Hierarchical org tree with expand/collapse
- Node detail with employee info (name, title, photo, department)
- Search and highlight across the tree
- Reporting chain view (path from employee to CEO)
- Direct reports list per manager
- Drag-and-drop restructuring state
- Multiple root nodes (for matrix organizations)
- Filter by department, location, title
- Export org chart as structured data

## Non-Goals

- No rendered org chart visualization
- No HR management functions
- No real-time collaboration

## Proposed Public API

```typescript
export function injectOrgChart(config: {
  endpoint: string;
}): {
  readonly tree: Signal<OrgNode[]>;
  readonly selectedNode: Signal<OrgNode | null>;
  readonly reportingChain: Signal<OrgNode[]>;
  readonly directReports: Signal<OrgNode[]>;
  readonly searchResults: Signal<OrgNode[]>;
  readonly filters: Signal<OrgFilters>;
  readonly expandedIds: Signal<Set<string>>;
  readonly isLoading: Signal<boolean>;
  selectNode(nodeId: string | null): void;
  expand(nodeId: string): void;
  collapse(nodeId: string): void;
  expandAll(): void;
  collapseAll(): void;
  search(query: string): void;
  setFilters(f: Partial<OrgFilters>): void;
  getReportingChain(nodeId: string): Promise<OrgNode[]>;
  // Drag-and-drop
  readonly isDragging: Signal<boolean>;
  readonly dropTarget: Signal<string | null>;
  moveNode(nodeId: string, newParentId: string, position: number): Promise<void>;
  export(format: 'json' | 'csv'): Promise<void>;
};

export interface OrgNode {
  id: string;
  name: string;
  title: string;
  department: string;
  photoUrl?: string;
  email?: string;
  location?: string;
  children: OrgNode[];
  directReportCount: number;
  isExpanded: boolean;
}

export interface OrgFilters {
  department?: string;
  location?: string;
  title?: string;
  search?: string;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-org-chart/`.
2. Implement tree structure, expand/collapse, search, reporting chain with signals.
3. Add drag-and-drop restructuring state and filters.
4. Add tests. Register in workspace.
