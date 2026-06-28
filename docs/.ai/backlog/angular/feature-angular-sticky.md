---
id: feature-angular-sticky
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-sticky'
---

# @hexguard/angular-sticky

## Summary

Sticky positioning state for Angular â€” track when elements enter/leave sticky state via IntersectionObserver, calculate offsets, expose signals. For sticky headers, toolbars, and footers in scrollable containers.

**Competition check:** No Angular sticky state package exists.


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
export function injectSticky(element: ElementRef): {
  readonly isSticky: Signal<boolean>;
  readonly offset: Signal<number>;
  readonly isStuckTop: Signal<boolean>;
  readonly isStuckBottom: Signal<boolean>;
};

// Usage
const sticky = injectSticky(headerEl);
@if (sticky.isSticky()) {
  <div class="shadow">Sticky!</div>
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-sticky/`.
2. Implement IntersectionObserver-based sticky detection.
3. Add tests.
4. Register in workspace.
