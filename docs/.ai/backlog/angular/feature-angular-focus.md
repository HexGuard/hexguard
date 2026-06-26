---
id: feature-angular-focus
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-focus'
---

# @hexguard/angular-focus

## Summary

Focus management utilities for Angular — roving tabindex manager, focus visible tracking, and auto-focus directive. For accessible toolbars, listboxes, grids, and menus.

**Complements `angular-focus-trap`** (traps focus in a container). `angular-focus` adds roving tabindex and focus-visible detection.

## Proposed Public API

```typescript
// ── Roving Tabindex ──────────────────────────────────────

export function injectRovingTabindex(config: {
  orientation?: 'horizontal' | 'vertical' | 'both';
  itemCount?: number | Signal<number>;
  wrap?: boolean;
}): {
  readonly activeIndex: Signal<number>;
  focus(index: number): void;
  handleKeyDown(event: KeyboardEvent): void;
  getTabIndex(index: number): 0 | -1;
};

// ── Focus Visible ────────────────────────────────────────

export function injectFocusVisible(): {
  readonly isFocusVisible: Signal<boolean>;
  // Tracks whether last input was keyboard (true) or mouse/touch (false)
};

// ── Auto Focus Directive ─────────────────────────────────

@Component({
  selector: '[hexAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective {
  @Input({ required: true }) hexAutoFocus!: boolean | Signal<boolean>;
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-focus/`.
2. Implement roving tabindex with keyboard handler.
3. Implement focus-visible detection.
4. Implement auto-focus directive.
5. Add tests.
6. Register in workspace.
