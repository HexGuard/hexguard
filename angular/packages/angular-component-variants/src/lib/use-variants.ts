import type { VariantDefinition, VariantState } from './define-variants';
import { injectVariantState } from './variant-state';

/**
 * Use variants in a component.
 *
 * Thin wrapper around `injectVariantState()` for idiomatic component
 * usage. Returns the same `VariantState` interface.
 *
 * @param definition - A variant definition from `defineVariants()`.
 * @returns `VariantState` with reactive CSS class and ARIA signals.
 *
 * @example
 * ```ts
 * @Component({ ... })
 * export class ButtonComponent {
 *   readonly variants = useVariants(ButtonVariants);
 * }
 * // Template:
 * // <button [class]="variants.cssClasses()" [attr.aria-busy]="variants.aria()['aria-busy']">
 * ```
 */
export function useVariants(definition: VariantDefinition): VariantState {
  return injectVariantState(definition);
}
