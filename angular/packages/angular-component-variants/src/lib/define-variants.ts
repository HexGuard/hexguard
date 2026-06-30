import { computed, type Signal } from '@angular/core';

// ── Types ──────────────────────────────────────────────────

/** A single variant group: variant name → CSS class string. */
export type VariantGroup = Readonly<Record<string, string>>;

/** All variant groups for a component. */
export type VariantGroups = Readonly<Record<string, VariantGroup>>;

/** ARIA attribute mapping: `"group.variant"` → `{ "aria-*": "value" }`. */
export type AriaMap = Readonly<Record<string, Readonly<Record<string, string>>>>;

/** A compound variant rule: when all conditions match, add the given CSS class. */
export interface CompoundVariant {
  /** Conditions: group → variant value that must all match. */
  readonly conditions: Readonly<Record<string, string>>;
  /** CSS class to add when all conditions are met. */
  readonly class: string;
}

/** Configuration for `defineVariants()`. */
export interface VariantConfig {
  /** Default variant per group. */
  readonly defaults?: Readonly<Record<string, string>>;
  /** ARIA attributes per variant value. Key format: `"group.variant"`. */
  readonly aria?: AriaMap;
  /** Compound variant rules: extra CSS classes when multiple conditions match. */
  readonly compounds?: readonly CompoundVariant[];
}

/**
 * A complete variant definition — the output of `defineVariants()`.
 *
 * @example
 * ```ts
 * const ButtonVariants = defineVariants({
 *   size: { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
 *   color: { primary: 'btn-primary', secondary: 'btn-secondary' },
 * });
 * ```
 */
export interface VariantDefinition {
  /** All variant groups. */
  readonly groups: VariantGroups;
  /** Default variant values per group. */
  readonly defaults: Readonly<Record<string, string>>;
  /** ARIA attribute map (keyed by "group.variant"). */
  readonly aria: AriaMap;
  /** Compound variant rules. */
  readonly compounds: readonly CompoundVariant[];
}

/**
 * Runtime variant state — returned by `useVariants()` or `injectVariantState()`.
 *
 * @example Template usage
 * ```html
 * <button [class]="state.cssClasses()" [attr.aria-busy]="state.aria()['aria-busy']">
 * ```
 */
export interface VariantState {
  /** Current variant values per group. */
  readonly values: Signal<Readonly<Record<string, string>>>;
  /** Space-joined CSS class string from all active variants. */
  readonly cssClasses: Signal<string>;
  /** Computed ARIA attributes from the current variant combination. */
  readonly aria: Signal<Readonly<Record<string, string>>>;
  /** Set a variant value for a group. */
  set(group: string, variant: string): void;
  /** Get the current value for a group. */
  get(group: string): Signal<string>;
}

// ── Implementation ─────────────────────────────────────────

/**
 * Define a set of component variants.
 *
 * Variant groups map variant names to CSS class strings. The returned
 * definition can be used with `useVariants()` or `injectVariantState()`.
 *
 * @param groups - Variant groups (e.g. `{ size: { sm: 'btn-sm', md: 'btn-md' } }`).
 * @param config - Optional defaults and ARIA mappings.
 * @returns A `VariantDefinition`.
 *
 * @example
 * ```ts
 * export const ButtonVariants = defineVariants(
 *   {
 *     size: { sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg' },
 *     color: { primary: 'btn-primary', secondary: 'btn-secondary', outline: 'btn-outline' },
 *     state: { default: '', loading: 'btn-loading', disabled: 'btn-disabled' },
 *   },
 *   {
 *     defaults: { size: 'md', color: 'primary', state: 'default' },
 *     aria: {
 *       'state.loading': { 'aria-busy': 'true' },
 *       'state.disabled': { 'aria-disabled': 'true' },
 *     },
 *   },
 * );
 * ```
 */
export function defineVariants(groups: VariantGroups, config?: VariantConfig): VariantDefinition {
  // Validate: every group has at least one variant
  for (const [groupName, variants] of Object.entries(groups)) {
    if (Object.keys(variants).length === 0) {
      throw new Error(`Variant group "${groupName}" must have at least one variant.`);
    }
  }

  // Validate: defaults reference valid groups and variants
  if (config?.defaults) {
    for (const [group, variant] of Object.entries(config.defaults)) {
      if (!groups[group]) {
        throw new Error(`Default references unknown variant group "${group}".`);
      }
      if (!(variant in groups[group])) {
        throw new Error(`Default value "${variant}" not found in variant group "${group}".`);
      }
    }
  }

  const defaults: Record<string, string> = {};
  for (const groupName of Object.keys(groups)) {
    const variants = groups[groupName];
    const firstKey = Object.keys(variants)[0];
    defaults[groupName] = config?.defaults?.[groupName] ?? firstKey;
  }

  // Validate compounds
  if (config?.compounds) {
    for (const compound of config.compounds) {
      for (const [group, variant] of Object.entries(compound.conditions)) {
        if (!groups[group]) {
          throw new Error(`Compound references unknown variant group "${group}".`);
        }
        if (!(variant in groups[group])) {
          throw new Error(
            `Compound value "${variant}" not found in group "${group}".`,
          );
        }
      }
    }
  }

  return {
    groups,
    defaults,
    aria: config?.aria ?? {},
    compounds: config?.compounds ?? [],
  };
}
