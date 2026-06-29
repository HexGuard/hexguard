---
id: feature-angular-a11y
type: feature
status: proposed
created: 2026-06-29
package: '@hexguard/angular-a11y'
---

# @hexguard/angular-a11y

## Summary

Headless accessibility state — focus trap, focus order, ARIA live region announcements, reduced-motion detection, and screen reader message queue. For building accessible Angular applications.

## Goals

- Focus trap with auto-focus and restore (modals, dialogs, drawers)
- Focus order management (roving tabindex for lists, grids)
- ARIA live region announcement queue (polite/assertive)
- Reduced-motion and prefers-contrast preference signals
- Skip-to-content link management
- Accessible name/label computation helpers
- Keyboard navigation helpers (arrow keys, Enter/Space/Escape)

## Non-Goals

- No rendered accessibility UI
- No automated accessibility testing
- No screen reader emulation

## Proposed Public API

```typescript
export function injectFocusTrap(): {
  readonly isActive: Signal<boolean>;
  activate(element: HTMLElement): void;
  deactivate(): void;
};

export function injectLiveRegion(): {
  announce(message: string, priority?: 'polite' | 'assertive'): void;
  clear(): void;
};

export function injectA11yPreferences(): {
  readonly prefersReducedMotion: Signal<boolean>;
  readonly prefersHighContrast: Signal<boolean>;
  readonly prefersColorScheme: Signal<'light' | 'dark' | 'no-preference'>;
};

export function injectRovingTabIndex(): {
  readonly activeIndex: Signal<number>;
  setCount(count: number): void;
  moveNext(): void;
  movePrevious(): void;
  moveTo(index: number): void;
  readonly focusKey: Signal<string>; // unique key to trigger focus
};

export function injectSkipLink(): {
  readonly targetId: Signal<string>;
  skipTo(targetId: string): void;
};
```

## Implementation Plan
1. Scaffold `angular/packages/angular-a11y/`.
2. Implement focus trap, live region, roving tabindex, preferences with signals.
3. Add keyboard helpers and skip-link.
4. Add tests. Register in workspace.
