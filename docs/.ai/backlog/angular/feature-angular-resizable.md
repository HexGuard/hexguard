---
id: feature-angular-resizable
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-resizable'
---

# Angular Resizable Package

## Summary

Design `@hexguard/angular-resizable` as a headless Angular package for standardizing resizable split-pane and draggable-edge state with configurable min/max constraints, snap thresholds, and optional position persistence for dashboard and admin-panel layouts.

The repeated problem is that admin panels, IDEs, and dashboards frequently have resizable sidebars, panels, and columns, but every team rebuilds pointer-event tracking, constraint clamping, snap-to-collapsed behavior, and position persistence.

## Goals

- Provide `injectResizable(options?)` returning signals for current size, isResizing, and snap states.
- Support configurable min/max size constraints.
- Support snap-to-collapsed at a configurable threshold (panel collapses when dragged below threshold).
- Support persistence via an optional storage adapter.
- Support horizontal and vertical resize directions.

## Proposed Public API

```ts
const resizable = injectResizable({
  initialSize: 300,
  minSize: 48,
  maxSize: 600,
  direction: 'horizontal',
  snapThreshold: 50, // pixels — snap closed below this
  storage: localStorageResizeStorage('sidebar-width'),
});

resizable.size; // Signal<number> — current width/height in px
resizable.isResizing; // Signal<boolean>
resizable.isSnapped; // Signal<boolean> — collapsed below threshold

// Bind to pointer events
resizable.onPointerDown(event); // attach to mousedown/touchstart on drag handle
```

## Implementation Plan

1. Scaffold `angular/packages/angular-resizable/`.
2. Implement `injectResizable()` with pointer-event tracking, constraint clamping, snap detection.
3. Implement persistence adapter.
4. Add unit tests for: drag resize, min/max clamping, snap to collapsed, persistence, cleanup.
5. Add demo route, docs, release.
