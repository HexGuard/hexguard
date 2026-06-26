---
id: feature-angular-accordion
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-accordion'
---

# @hexguard/angular-accordion

## Summary

Headless accordion/expandable section state for Angular — expand/collapse with single (accordion) or multi (toggle) mode, animation state, keyboard accessibility. Every FAQ page, settings panel, collapsible sidebar, filter group, and step-by-step content needs accordion state.

**Competition check:** No headless Angular accordion state package exists. UI libraries include accordion components (baked-in styling).

## Why Wide Adoption

Accordions are one of the most reused UI patterns: FAQ sections, collapsible settings groups, expandable filter panels, mobile nav menus, collapsible details in lists.

## Goals

1. Provide `injectAccordion()` — accordion group state with open/close/toggle.
2. Support `single` (only one open) and `multi` (multiple open) modes.
3. Provide per-item state: `isOpen(id)`, `toggle(id)`, `open(id)`, `close(id)`.
4. Provide `openAll()` / `closeAll()` for multi mode.
5. Provide `animationState(id)` — `'opening' | 'open' | 'closing' | 'closed'` for CSS animations.
6. Support keyboard accessibility (Arrow navigation, Space/Enter toggle).

## Proposed Public API

```typescript
export interface AccordionConfig {
  mode?: 'single' | 'multi';
  initialOpenIds?: string[];
}

export interface AccordionState {
  readonly openIds: Signal<Set<string>>;
  readonly openCount: Signal<number>;
  readonly mode: Signal<'single' | 'multi'>;

  isOpen(id: string): Signal<boolean>;
  toggle(id: string): void;
  open(id: string): void;
  close(id: string): void;
  openAll(): void;
  closeAll(): void;
  setMode(mode: 'single' | 'multi'): void;

  animationState(id: string): Signal<'idle' | 'opening' | 'open' | 'closing' | 'closed'>;
  handleKeyDown(id: string, event: KeyboardEvent): void;

  getHeaderId(id: string): string;
  getPanelId(id: string): string;
}

export function injectAccordion(config?: AccordionConfig): AccordionState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-accordion/`.
2. Implement open/close/toggle state with single/multi mode.
3. Implement animation state tracking.
4. Implement keyboard navigation.
5. Add tests: single/multi mode, animations, keyboard nav.
6. Register in workspace.
