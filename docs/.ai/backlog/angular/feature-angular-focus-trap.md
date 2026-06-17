---
id: feature-angular-focus-trap
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-focus-trap'
---

# Angular Focus Trap Package

## Summary

Design `@hexguard/angular-focus-trap` as a headless Angular package for standardizing focus-trap and focus-restoration state for modals, dialogs, side panels, flyout menus, and overlay components with configurable tab-order, escape handling, and return-focus semantics.

The repeated problem is that accessible modal dialogs, slide-out panels, and flyout menus must trap focus inside the overlay while it is open and restore focus to the triggering element when closed. Every team rebuilds the same `focusin`/`keydown` listener, tab-order cycling, escape handling, and return-focus tracking with slightly different edge-case behavior across browsers and screen readers.

## Goals

- Provide `injectFocusTrap(containerRef)` that activates a focus trap on a given element and returns control signals.
- Support configurable first-focus and last-focus selectors for tab-order boundaries.
- Support escape-to-close with an optional callback (`onEscape`).
- Support `restoreFocusOnDeactivate: boolean` (default true) for returning focus to the previously focused element.
- Support `initialFocus: 'auto' | 'first' | 'container' | ElementRef` for configurable initial focus placement.
- Expose `isActive: Signal<boolean>` for binding visual state (backdrop, animation).
- Support nested focus traps (dialog opens a confirm dialog on top) with stack semantics.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Building a modal/dialog/panel component or overlay container — that's a UI package.
- Styling or animating overlays — the consumer's design system owns rendering.
- Managing `aria-modal`, `role="dialog"`, or `aria-hidden` on siblings — those are rendering concerns.
- Managing body scroll locking — that's a separate concern (consider a companion if demand arises).

## Decisions

- Default initial focus to the first focusable element inside the trap (button, input, select, textarea, `[tabindex]`).
- Use a focusable elements query (`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`) for boundary detection.
- Trap tab cycling by wrapping: Tab on last element → first element; Shift+Tab on first element → last element.
- Track the previously focused element via a module-level reference for cross-component restoration.
- Default escape handling to emit a signal rather than close — the consumer decides what "close" means for their overlay.

## Proposed Public API

```ts
import { injectFocusTrap } from '@hexguard/angular-focus-trap';

@Component({
  template: `
    @if (isOpen()) {
      <div #dialog role="dialog" aria-modal="true">
        <button (click)="close()">Close</button>
        <input type="text" />
        <button>Save</button>
      </div>
    }
  `,
})
export class MyDialogComponent {
  readonly dialogEl = viewChild.required<ElementRef<HTMLElement>>('dialog');
  private readonly focusTrap = injectFocusTrap(this.dialogEl, {
    initialFocus: 'auto',
    restoreFocusOnDeactivate: true,
    onEscape: () => this.close(),
  });

  readonly isOpen = signal(false);

  open() {
    this.isOpen.set(true);
    this.focusTrap.activate();
  }

  close() {
    this.focusTrap.deactivate();
    this.isOpen.set(false);
  }

  // Reactive state
  readonly trapActive = this.focusTrap.isActive;   // Signal<boolean>
}

// Options
interface FocusTrapOptions {
  initialFocus?: 'auto' | 'first' | 'container' | ElementRef;
  firstFocusSelector?: string;          // custom first-focus query
  lastFocusSelector?: string;           // custom last-focus query
  restoreFocusOnDeactivate?: boolean;   // default true
  onEscape?: () => void;                // escape key callback
}

// Return type
interface FocusTrapHandle {
  readonly isActive: Signal<boolean>;
  activate(): void;
  deactivate(): void;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-focus-trap/` following existing conventions (package.json, ng-package.json, tsconfigs, `angular.json` registration).
2. Add build and test scripts to `angular/package.json` (`build:lib:focus-trap`, `test:lib:focus-trap`).

### Phase 1: Core Implementation

3. Implement `injectFocusTrap()` using Angular's `DestroyRef` and `effect()` for container tracking.
4. Implement focusable-elements query within the container to determine tab boundaries.
5. Implement `keydown` listener for Tab/Shift+Tab cycling between first and last focusable elements.
6. Implement Escape key handling with configurable callback.
7. Implement `restoreFocusOnDeactivate` — save reference to `document.activeElement` on activate, restore on deactivate.
8. Implement `initialFocus` strategies: `'auto'` (first focusable), `'first'` (container.firstElementChild), `'container'` (container itself if focusable), or explicit `ElementRef`.
9. Implement nested focus-trap stack tracking so deactivating an inner trap re-activates the outer trap.
10. Implement cleanup on destroy — deactivate trap, remove event listeners.
11. Add unit tests for: tab cycling, shift+tab cycling, escape handling, initial focus strategies, focus restoration, nested traps, container changes, element removal during trap, multiple traps, and cleanup.

### Phase 2: Demo & Docs

12. Add a demo route at `/packages/angular-focus-trap` showing:
    - A modal dialog with focus trap
    - Tab cycling between fields
    - Escape to close
    - Nested focus trap (dialog opens a confirm dialog)
    - Focus restoration after close
13. Add Playwright coverage for the demo page.
14. Write the deep-dive doc at `docs/packages/angular-focus-trap.md`.
15. Update the npm-facing `README.md`.

### Phase 3: Release

16. Add `verify:package:focus-trap` to `angular/package.json`.
17. Add `.github/workflows/release-angular-focus-trap.yml`.
18. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:focus-trap` — unit tests for tab cycling, escape, focus restoration, nesting, cleanup.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm verify:package:focus-trap` — tarball smoke test.

## Follow-Ups

- Revisit body-scroll locking as a companion package or optional add-on — it's commonly needed alongside focus traps.
- Evaluate whether a `@hexguard/angular-focus-visible` package for `:focus-visible` polyfill and keyboard-only focus indicators would complement the focus-trap package.
