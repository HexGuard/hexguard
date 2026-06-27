---
id: feature-angular-kanban
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-kanban'
---

# @hexguard/angular-kanban

## Summary

Headless kanban board state — columns, cards, drag-and-drop reordering, filtering, and swimlanes. For project management, task tracking, CRM pipelines, and any columnar workflow visualization.

## Goals

- Column and card management with signals
- Drag-and-drop card movement between columns
- Card reordering within columns
- Swimlane grouping (by assignee, priority, label)
- Card filtering and search
- Card detail expansion
- WIP (work-in-progress) limits per column
- Optimistic updates with server sync

## Non-Goals

- No rendered kanban board UI (columns, cards are consumer responsibility)
- No real-time collaboration (use angular-presence for that)
- No workflow rules engine

## Proposed Public API

```typescript
export function injectKanban<T extends KanbanCard>(config: {
  endpoint: string;
  columns: KanbanColumn[];
  swimlaneBy?: keyof T;
}): {
  readonly columns: Signal<KanbanColumn[]>;
  readonly cards: Signal<T[]>;
  readonly cardsByColumn: Signal<Map<string, T[]>>;
  readonly swimlanes: Signal<SwimlaneGroup<T>[]>;
  readonly selectedCard: Signal<T | null>;
  readonly filters: Signal<KanbanFilters>;
  readonly isLoading: Signal<boolean>;
  moveCard(cardId: string, toColumnId: string, toIndex: number): Promise<void>;
  reorderColumn(columnId: string, fromIndex: number, toIndex: number): Promise<void>;
  selectCard(cardId: string | null): void;
  setFilters(f: Partial<KanbanFilters>): void;
  addCard(card: Partial<T>, columnId: string): Promise<void>;
  updateCard(cardId: string, changes: Partial<T>): Promise<void>;
  removeCard(cardId: string): Promise<void>;
};

export interface KanbanColumn { id: string; title: string; wipLimit?: number; color?: string; }
export interface KanbanCard { id: string; title: string; columnId: string; order: number; labels?: string[]; assignee?: string; }
export interface KanbanFilters { search?: string; labels?: string[]; assignee?: string; }
export interface SwimlaneGroup<T> { key: string; label: string; cardsByColumn: Map<string, T[]>; }
```

## Implementation Plan

1. Scaffold `angular/packages/angular-kanban/`.
2. Implement column/card CRUD, drag reordering, swimlanes with signals.
3. Add optimistic updates and server reconciliation.
4. Add tests for move, reorder, swimlane grouping.
5. Register in workspace.
