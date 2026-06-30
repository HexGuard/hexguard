# @hexguard/angular-component-variants — Deep Package Notes

Headless component variant system: declarative definitions, auto-generated CSS classes, ARIA attributes, and variant composition — no more `[class.btn-primary]="variant==='primary'"` boilerplate.

## Problem

Every component with visual variants (size, color, state) ends up with manual CSS class binding, conditional ARIA attributes, and scattered default logic — rebuilt in every button, badge, card, and input component. There's no typed contract between variant definitions and their runtime representation.

**`@hexguard/angular-component-variants`** standardizes this into a declarative variant definition system with auto-generated `cssClasses` and `aria` signals.

## API

### `defineVariants(groups, config?)`

Defines variant groups mapping variant names to CSS class strings. Returns a `VariantDefinition`.

```typescript
const ButtonVariants = defineVariants(
  {
    size: { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
    color: { primary: 'btn-primary', secondary: 'btn-secondary', outline: 'btn-outline' },
    state: { default: '', loading: 'btn-loading', disabled: 'btn-disabled' },
  },
  {
    defaults: { size: 'md', color: 'primary', state: 'default' },
    aria: {
      'state.loading': { 'aria-busy': 'true' },
      'state.disabled': { 'aria-disabled': 'true' },
    },
  },
);
```

Defaults fall back to the first variant in each group if not specified. Validation catches invalid group/variant references at definition time.

### `useVariants(definition)` / `injectVariantState(definition)`

Returns `VariantState` with reactive signals:

| Member                | Type                             | Description                      |
| --------------------- | -------------------------------- | -------------------------------- |
| `cssClasses`          | `Signal<string>`                 | Space-joined CSS class string    |
| `aria`                | `Signal<Record<string, string>>` | Active ARIA attributes           |
| `values`              | `Signal<Record<string, string>>` | Current variant values per group |
| `set(group, variant)` | `(string, string) => void`       | Set a variant value              |
| `get(group)`          | `(string) => Signal<string>`     | Get reactive signal for a group  |

```html
<button [class]="variants.cssClasses()" [attr.aria-busy]="variants.aria()['aria-busy']">
  Click me
</button>
```

### `extendVariants(base, extraGroups, extraConfig?)`

Extends an existing definition with additional variant groups. Throws on duplicate group names.

```typescript
const IconButtonVariants = extendVariants(ButtonVariants, {
  shape: { circle: 'btn-circle', square: 'btn-square' },
});
```

## Design Decisions

1. **Per-group writable signals.** Each variant group gets its own `WritableSignal<string>`, initialized to defaults. Changes to one group don't affect others.
2. **`cssClasses` is a computed signal.** Recalculates only when any group signal changes — efficient template binding.
3. **ARIA mappings are flat.** Keyed by `"group.variant"` (e.g. `"state.loading"`). Only active ARIA attributes appear in the output.
4. **Empty CSS classes are excluded.** The `state.default` variant with `''` class doesn't produce trailing spaces in `cssClasses`.
5. **Validation at definition time.** `defineVariants` and `extendVariants` throw immediately on invalid config — no silent failures at runtime.

## Code Examples

### Full button component

```typescript
@Component({
  selector: 'app-button',
  template: `
    <button [class]="variants.cssClasses()" [attr.aria-busy]="variants.aria()['aria-busy']">
      <ng-content />
    </button>
  `,
})
class ButtonComponent {
  readonly variants = useVariants(ButtonVariants);
  // Consumer: variants.set('size', 'lg'); variants.set('color', 'secondary');
}
```

### Standalone state (no component)

```typescript
const state = injectVariantState(ButtonVariants);
state.set('size', 'lg');
state.set('color', 'outline');
state.set('state', 'loading');
// state.cssClasses() → 'btn-lg btn-outline btn-loading'
// state.aria() → { 'aria-busy': 'true' }
```

## Related Resources

- [Package README](../../angular/packages/angular-component-variants/README.md)
- [Package Catalog](../README.md)
- [Source Code](../../angular/packages/angular-component-variants/src/)
