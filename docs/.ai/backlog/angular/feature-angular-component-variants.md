---
id: feature-angular-component-variants
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-component-variants'
---

# @hexguard/angular-component-variants

## Summary

Headless component variant system — declarative variant definitions with auto-generated CSS classes, ARIA attributes, and compile-time safety. Eliminates per-component `[class.btn-primary]="variant==='primary'"` boilerplate.

## Goals

- Declarative variant definition per component (size, color, state)
- Automatic CSS class generation from variant configuration
- ARIA attribute generation for accessible components
- Variant composition (size + color + state)
- Default variant resolution
- Runtime variant validation

## Non-Goals

- No rendered component library
- No CSS framework integration
- No Figma sync

## Proposed Public API

```typescript
export const ButtonVariants = defineVariants({
  size: { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
  color: { primary: 'btn-primary', secondary: 'btn-secondary', outline: 'btn-outline', ghost: 'btn-ghost' },
  state: { default: '', loading: 'btn-loading', disabled: 'btn-disabled' }
}, {
  defaults: { size: 'md', color: 'primary', state: 'default' },
  aria: {
    'state.loading': { 'aria-busy': 'true' },
    'state.disabled': { 'aria-disabled': 'true' }
  }
});

@Component({...})
export class ButtonComponent {
  readonly variants = useVariants(ButtonVariants);
  // Auto-generates: size, color, state inputs
  // Auto-computes: cssClasses(), aria() signals
}

export const IconButtonVariants = extendVariants(ButtonVariants, {
  shape: { circle: 'btn-circle', square: 'btn-square' }
});
```

## Implementation Plan
1. Scaffold `angular/packages/angular-component-variants/`.
2. Implement `defineVariants`, `useVariants`, `extendVariants` APIs.
3. Add CSS class generation, ARIA mapping, validation.
4. Add tests. Register in workspace.
