import {
  defineVariants,
  type VariantDefinition,
  type VariantGroups,
  type VariantConfig,
} from './define-variants';

/**
 * Extend an existing variant definition with additional groups or overrides.
 *
 * @param base - The base variant definition.
 * @param extraGroups - Additional variant groups to merge.
 * @param extraConfig - Optional overrides for defaults and ARIA.
 * @returns A new `VariantDefinition` combining both.
 *
 * @example
 * ```ts
 * const IconButtonVariants = extendVariants(ButtonVariants, {
 *   shape: { circle: 'btn-circle', square: 'btn-square' },
 * });
 * ```
 */
export function extendVariants(
  base: VariantDefinition,
  extraGroups: VariantGroups,
  extraConfig?: VariantConfig,
): VariantDefinition {
  const mergedGroups: Record<string, VariantGroups[string]> = {
    ...base.groups,
  };

  // Add extra groups (don't overwrite existing)
  for (const [key, group] of Object.entries(extraGroups)) {
    if (mergedGroups[key]) {
      throw new Error(`Cannot extend: group "${key}" already exists in the base definition.`);
    }
    mergedGroups[key] = group;
  }

  const mergedDefaults: Record<string, string> = { ...base.defaults };
  if (extraConfig?.defaults) {
    Object.assign(mergedDefaults, extraConfig.defaults);
  }

  const mergedAria = { ...base.aria, ...extraConfig?.aria };

  return defineVariants(mergedGroups, {
    defaults: mergedDefaults,
    aria: mergedAria,
  });
}
