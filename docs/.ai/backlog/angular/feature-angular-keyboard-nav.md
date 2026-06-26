---
id: feature-angular-keyboard-nav
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-keyboard-nav'
---

# @hexguard/angular-keyboard-nav

## Summary

Headless WAI-ARIA keyboard navigation patterns — listbox, grid, tabs, menu, and toolbar standardized `handleKeyDown(event)` functions. Every custom widget needs ARIA keyboard navigation for accessibility compliance.

**Distinct from `angular-keyboard`** (global shortcuts like Ctrl+S). This handles **widget-internal navigation**: Arrow keys in a listbox, Tab in a tab strip, etc.

**Competition check:** No Angular ARIA keyboard navigation package exists.

## Proposed Public API

```typescript
// ── Listbox ──────────────────────────────────────────────

export interface ListboxNavConfig {
  totalItems: number | Signal<number>;
  orientation?: 'vertical' | 'horizontal';
  wrap?: boolean;
  multiselect?: boolean;
}

export function injectListboxNav(config: ListboxNavConfig): {
  readonly activeIndex: Signal<number>;
  readonly selectedIndices: Signal<Set<number>>;
  goTo(index: number): void;
  next(): void; prev(): void;
  first(): void; last(): void;
  select(index: number): void;
  deselect(index: number): void;
  selectAll(): void;
  clearSelection(): void;
  handleKeyDown(event: KeyboardEvent): void;
};

// ── Grid ─────────────────────────────────────────────────

export function injectGridNav(config: {
  rows: number | Signal<number>;
  cols: number | Signal<number>;
  wrap?: boolean;
}): {
  readonly activeRow: Signal<number>;
  readonly activeCol: Signal<number>;
  up(): void; down(): void; left(): void; right(): void;
  goTo(row: number, col: number): void;
  handleKeyDown(event: KeyboardEvent): void;
};

// ── Tabs ─────────────────────────────────────────────────

export function injectTabsNav(config: {
  totalTabs: number | Signal<number>;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
}): {
  readonly activeTab: Signal<number>;
  readonly focusedTab: Signal<number>;
  next(): void; prev(): void;
  first(): void; last(): void;
  activate(index: number): void;
  handleKeyDown(event: KeyboardEvent): void;
};

// ── Menu ─────────────────────────────────────────────────

export function injectMenuNav(config: {
  totalItems: number | Signal<number>;
  orientation?: 'vertical' | 'horizontal';
}): {
  readonly activeIndex: Signal<number>;
  readonly isOpen: Signal<boolean>;
  open(): void; close(): void;
  next(): void; prev(): void;
  activate(): void;
  handleKeyDown(event: KeyboardEvent): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-keyboard-nav/`.
2. Implement each navigation pattern per WAI-ARIA Authoring Practices.
3. Add tests: each pattern, edge cases (empty list, single item), wrap around.
4. Register in workspace.
