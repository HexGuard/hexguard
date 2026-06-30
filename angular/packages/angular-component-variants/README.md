# @hexguard/angular-component-variants

**Headless component variant system for Angular.** Declarative variant definitions with auto-generated CSS classes, ARIA attributes, and default resolution — no more `[class.btn-primary]="variant==='primary'"` boilerplate.

**[Demo](/packages/angular-component-variants/demo)**

---

## Problem

Every component with visual variants (size, color, state) ends up with manual CSS class binding, conditional ARIA attributes, and scattered default logic. Teams rebuild the same `[class]` expressions and `[attr.aria-*]` bindings in every button, badge, card, and input component.

**`@hexguard/angular-component-variants`** standardizes this into a declarative variant definition system with auto-generated CSS class strings, ARIA attribute signals, and default resolution.

## Installation

```bash
pnpm add @hexguard/angular-component-variants
```

## Quickstart

```typescript
import { defineVariants, useVariants } from '@hexguard/angular-component-variants';

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

@Component({ ... })
class ButtonComponent {
  readonly variants = useVariants(ButtonVariants);
  // variants.cssClasses() → 'btn-md btn-primary'
  // variants.aria() → {}
}
```

```html
<button [class]="variants.cssClasses()" [attr.aria-busy]="variants.aria()['aria-busy']">
  Click me
</button>
```

## API

### `defineVariants(groups, config?)`

| Param             | Type                     | Description                                                               |
| ----------------- | ------------------------ | ------------------------------------------------------------------------- |
| `groups`          | `VariantGroups`          | Map of group name → variant → CSS class                                   |
| `config.defaults` | `Record<string, string>` | Default variant per group (first variant if omitted)                      |
| `config.aria`     | `AriaMap`                | ARIA attributes per variant (`"group.variant"` → `{ "aria-*": "value" }`) |

### `useVariants(definition)` / `injectVariantState(definition)`

Returns `VariantState`:

| Member                | Type                             | Description                      |
| --------------------- | -------------------------------- | -------------------------------- |
| `cssClasses`          | `Signal<string>`                 | Space-joined CSS class string    |
| `aria`                | `Signal<Record<string, string>>` | Active ARIA attributes           |
| `values`              | `Signal<Record<string, string>>` | Current variant values per group |
| `set(group, variant)` | `(string, string) => void`       | Set a variant value              |
| `get(group)`          | `(string) => Signal<string>`     | Get reactive signal for a group  |

### `extendVariants(base, extraGroups, extraConfig?)`

Extend an existing definition with additional variant groups.

## Scope Boundaries

| Concern                              | Status             |
| ------------------------------------ | ------------------ |
| Declarative variant definitions      | ✅                 |
| Auto-generated CSS class strings     | ✅                 |
| ARIA attribute generation            | ✅                 |
| Default variant resolution           | ✅                 |
| Variant composition (extendVariants) | ✅                 |
| Runtime validation                   | ✅                 |
| Rendered component library           | ❌ (headless only) |
| CSS framework integration            | ❌                 |
