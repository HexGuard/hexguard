---
id: feature-angular-dashboard
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-dashboard'
---

# @hexguard/angular-dashboard

## Summary

Dashboard widget layout state â€” add/move/resize/remove widgets, drag-reorder, grid layout, persistence. Every configurable dashboard rebuilds this.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export interface Widget {
  id: string; type: string; title: string;
  position: { row: number; col: number };
  size: { colSpan: number; rowSpan: number };
  config?: Record<string, unknown>; visible?: boolean;
}

export function injectDashboard(config: {
  widgets: Widget[]; columns?: number; persistKey?: string;
}): {
  readonly widgets: Signal<Widget[]>;
  readonly columns: Signal<number>;
  readonly isEditing: Signal<boolean>;
  addWidget(type: string, config?: Record<string, unknown>): void;
  removeWidget(id: string): void;
  moveWidget(id: string, row: number, col: number): void;
  resizeWidget(id: string, colSpan: number, rowSpan: number): void;
  toggleEdit(): void; resetLayout(): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-dashboard/`.
2. Implement widget layout state with signals.
3. Add persistence.
4. Add tests.
5. Register in workspace.
