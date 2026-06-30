/**
 * Public API for `@hexguard/angular-component-variants`.
 *
 * Provides a headless component variant system with declarative definitions,
 * auto-generated CSS classes, ARIA attributes, and token-linked values.
 */
export { defineVariants } from './lib/define-variants';
export type {
  VariantDefinition,
  VariantGroups,
  VariantConfig,
  VariantState,
} from './lib/define-variants';
export { useVariants } from './lib/use-variants';
export { extendVariants } from './lib/extend-variants';
export { injectVariantState } from './lib/variant-state';
