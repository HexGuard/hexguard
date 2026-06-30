---
id: feature-angular-content-projection
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-content-projection'
---

# @hexguard/angular-content-projection

## Summary

Headless content projection state — typed slot management, conditional slot rendering, slot defaults, and slot querying. Makes multi-slot components type-safe and testable.

## Pain Point

Angular's `ng-content` is untyped — there's no compile-time guarantee that a component's slots are filled correctly. `select="[slot-name]"` uses CSS selectors with no type checking. Components with conditional slots (show/hide based on state) resort to `*ngIf` wrapping `ng-content`, which destroys and recreates projected content. Multi-slot components (card header/body/footer, dialog title/content/actions) are verbose.

## Goals

- Typed slot definitions with required/optional constraints
- Conditional slot visibility without destroying projected content
- Slot querying (is this slot filled? by what?)
- Default slot content when consumer doesn't provide
- Multi-slot composition helpers
- Slot change detection (slot content added/removed)

## Non-Goals

- No rendered slot UI
- No dynamic slot creation at runtime
- No Web Component slot polyfill

## Proposed Public API

```typescript
// Typed slot definitions
@Component({
  template: `
    @if (slots.header.isPresent()) {
      <ng-container [ngTemplateOutlet]="slots.header.template()" />
    } @else {
      <div class="default-header">Default</div>
    }
    <div class="body">
      <ng-container [ngTemplateOutlet]="slots.body.template()" />
    </div>
    @if (slots.footer.isPresent()) {
      <ng-container [ngTemplateOutlet]="slots.footer.template()" />
    }
  `
})
class CardComponent {
  readonly slots = injectContentSlots({
    header: { required: false, defaultValue: DefaultHeaderTemplate },
    body: { required: true },
    footer: { required: false }
  });
}

// Consumer
@Component({
  template: `
    <app-card>
      <ng-template slot="header">My Title</ng-template>
      <ng-template slot="body">Content here</ng-template>
    </app-card>
  `
})

// Slot state
export function injectContentSlots<T extends SlotDefinitions>(defs: T): {
  [K in keyof T]: {
    template: Signal<TemplateRef<unknown> | null>;
    isPresent: Signal<boolean>;
    context: Signal<unknown>;
  }
};
```

## Implementation Plan
1. Scaffold `angular/packages/angular-content-projection/`.
2. Implement slot definition, conditional visibility, defaults, querying with signals.
3. Add slot change detection.
4. Add tests. Register in workspace.
