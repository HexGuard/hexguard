import { computed, signal, type Signal } from '@angular/core';
import type { VariantDefinition, VariantState } from './define-variants';

/**
 * Create standalone variant state from a `VariantDefinition`.
 *
 * Returns reactive signals for CSS classes, ARIA attributes, and per-group
 * value access. Can be used in services, directives, or plain classes —
 * no `@Component` required.
 *
 * @param definition - A variant definition from `defineVariants()`.
 * @returns `VariantState` with signals for `cssClasses`, `aria`, and `values`.
 *
 * @example
 * ```ts
 * const buttonState = injectVariantState(ButtonVariants);
 * buttonState.set('size', 'lg');
 * buttonState.set('color', 'primary');
 * // buttonState.cssClasses() → 'btn-lg btn-primary'
 * ```
 */
export function injectVariantState(definition: VariantDefinition): VariantState {
  // Per-group writable signals — initialized to defaults
  const groupSignals = new Map<string, ReturnType<typeof signal<string>>>();
  const groupReadonly = new Map<string, Signal<string>>();

  for (const groupName of Object.keys(definition.groups)) {
    const initial = definition.defaults[groupName]!;
    const sig = signal(initial);
    groupSignals.set(groupName, sig);
    groupReadonly.set(groupName, sig.asReadonly());
  }

  /** All current values as a single computed record. */
  const values = computed<Readonly<Record<string, string>>>(() => {
    const rec: Record<string, string> = {};
    for (const [group, sig] of groupSignals) {
      rec[group] = sig();
    }
    return rec;
  });

  /** Space-joined CSS class string. */
  const cssClasses = computed(() => {
    const parts: string[] = [];
    for (const [group, sig] of groupSignals) {
      const variant = sig();
      const cssClass = definition.groups[group]?.[variant];
      if (cssClass) {
        parts.push(cssClass);
      }
    }
    return parts.join(' ');
  });

  /** Computed ARIA attributes from current variant combination. */
  const aria = computed(() => {
    const attrs: Record<string, string> = {};
    for (const [group, sig] of groupSignals) {
      const variant = sig();
      const key = `${group}.${variant}`;
      const ariaMap = definition.aria[key];
      if (ariaMap) {
        Object.assign(attrs, ariaMap);
      }
    }
    return attrs;
  });

  return {
    values,
    cssClasses,
    aria,

    set(group: string, variant: string): void {
      const sig = groupSignals.get(group);
      if (!sig) {
        throw new Error(`Unknown variant group "${group}".`);
      }
      if (!(variant in definition.groups[group]!)) {
        throw new Error(`Unknown variant "${variant}" in group "${group}".`);
      }
      sig.set(variant);
    },

    get(group: string): Signal<string> {
      const sig = groupReadonly.get(group);
      if (!sig) {
        throw new Error(`Unknown variant group "${group}".`);
      }
      return sig;
    },
  };
}
