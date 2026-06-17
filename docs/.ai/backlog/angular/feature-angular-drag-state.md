---
id: feature-angular-drag-state
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-drag-state'
---

# Angular Drag State Package

## Summary

Design `@hexguard/angular-drag-state` as a headless Angular package for standardizing drag-and-drop interaction state (dragging, hover target, reorder model, cancel) separate from DOM rendering, composable with CDK DragDrop for sortable lists, kanban boards, and file reordering.

The repeated problem is that Angular CDK's `DragDrop` module handles DOM rendering and animations but teams repeatedly build the same state layer on top — tracking which item is being dragged, which drop zone is hovered, computing the reordered model, and handling cancel vs confirm semantics. This package extracts that state layer into a reusable headless contract.

## Goals

- Provide `injectDragState<T>()` for tracking drag interaction state: dragged item, source list, hover target, drop zone.
- Provide sortable list reorder model computation (given a source list and a drop position, compute the new order).
- Support multiple drop zones with typed zone identifiers.
- Support drag cancellation (restore original order), drag confirmation (commit the new order), and drag preview state.
- Support keyboard accessibility (ARIA drag-and-drop roles and announcements).
- Compose with CDK DragDrop for DOM rendering while owning the state model.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Replacing or duplicating CDK DragDrop's DOM rendering, animations, or touch handling.
- Drag-to-reorder within a single flat list (that's covered by CDK alone — this adds cross-zone and reorder-model computation).
- File drag-and-drop from the OS — that's a browser-level `DragEvent` handled by file-picker or upload-state.

## Decisions

- State-only — no DOM elements, no drag handles, no drop zones rendered.
- The consumer uses CDK `cdkDrag`/`cdkDropList` for DOM; this package provides the state signals to drive them.
- Reorder model computation is a pure function mapping (source items, target items, drop index) → reordered array.
- Multiple drop zones are identified by a string key; the state tracks which zone is currently hovered.

## Proposed Public API

```ts
import { injectDragState } from '@hexguard/angular-drag-state';

interface DragStateOptions<T> {
  onReorder: (event: ReorderEvent<T>) => void;   // called when drop is confirmed
}

interface ReorderEvent<T> {
  item: T;
  fromList: string;
  fromIndex: number;
  toList: string;
  toIndex: number;
}

// In a kanban board component
@Component({ ... })
export class KanbanBoardComponent {
  readonly dragState = injectDragState<Task>({
    onReorder: (event) => this.saveNewOrder(event),
  });

  // Read state
  readonly isDragging = this.dragState.isDragging;         // Signal<boolean>
  readonly draggedItem = this.dragState.draggedItem;        // Signal<T | null>
  readonly hoveredZone = this.dragState.hoveredZone;        // Signal<string | null>
  readonly hoveredIndex = this.dragState.hoveredIndex;      // Signal<number | null>

  // Control
  startDrag(item: T, listId: string, index: number): void;
  updateHover(listId: string, index: number): void;
  clearHover(): void;
  confirmDrop(): void;          // fires onReorder and resets state
  cancelDrag(): void;           // restores original order, resets state
}

// Pure helper for computing reordered arrays
import { computeReorder } from '@hexguard/angular-drag-state';

const newItems = computeReorder(sourceItems, targetItems, {
  fromIndex: 2,
  toIndex: 0,
});
// Returns reordered copy — does not mutate
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold `angular/packages/angular-drag-state/` following existing conventions.
2. Add build and test scripts.

### Phase 1: Core Implementation

3. Implement `injectDragState()` with signals for dragged item, source/drop zone, hover position.
4. Implement `startDrag()`, `updateHover()`, `clearHover()`, `confirmDrop()`, `cancelDrag()`.
5. Implement `computeReorder()` pure function with support for same-list and cross-list reorder.
6. Add keyboard accessibility state (ARIA live region announcements for "dragged item X over zone Y").
7. Add unit tests for: drag start/end, hover zone tracking, same-list reorder, cross-list reorder, cancel restores original, confirm commits, empty lists, single-item lists.

### Phase 2: Demo & Docs

8. Add a demo route at `/packages/angular-drag-state` showing:
    - Kanban board with cross-column drag
    - Sortable list with reorder
    - Cancel vs confirm behavior
9. Add Playwright coverage.
10. Write `docs/packages/angular-drag-state.md`.
11. Update `README.md`.

### Phase 3: Release

12. Add `verify:package:drag-state`.
13. Add release workflow.
14. Run validation gate.

## Validation

- `pnpm test:lib:drag-state` — unit tests.
- `pnpm build:lib` — builds.
- `pnpm test:e2e` — Playwright.
