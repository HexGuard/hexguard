import type { TokenRegistry, FlatTokens } from './define-tokens';

/**
 * Define semantic token aliases that map to raw token paths.
 *
 * Aliases resolve at definition time and produce a new `TokenRegistry`-compatible
 * object that consumers can query by semantic name.
 *
 * @param registry - The source token registry.
 * @param aliases - A map of alias path → token path reference.
 * @returns A `TokenRegistry`-compatible object with aliases resolved.
 *
 * @example
 * ```ts
 * const tokens = defineTokens({
 *   color: { primary: { 500: '#3b82f6' }, neutral: { 50: '#fafafa', 900: '#171717' } },
 * });
 *
 * const semantic = tokenAliases(tokens, {
 *   'color.brand': 'color.primary.500',
 *   'color.surface': 'color.neutral.50',
 *   'color.text': 'color.neutral.900',
 * });
 *
 * semantic.get('color.brand');   // '#3b82f6'
 * semantic.get('color.surface'); // '#fafafa'
 * ```
 */
export function tokenAliases(
  registry: TokenRegistry,
  aliases: Record<string, string>,
): TokenRegistry {
  const entries = new Map<string, string>(registry.entries);

  // Detect circular aliases
  const resolved = new Set<string>();

  for (const [aliasPath, targetPath] of Object.entries(aliases)) {
    if (resolved.has(aliasPath)) {
      throw new Error(`Circular alias detected: "${aliasPath}" is referenced more than once.`);
    }

    // Resolve chain: alias → target → maybe another alias → raw value
    const value = resolveAliasChain(aliasPath, targetPath, aliases, registry);
    entries.set(aliasPath, value);
    resolved.add(aliasPath);
  }

  return {
    entries,
    prefix: registry.prefix,
    size: entries.size,
    get: (path: string) => entries.get(path),
    validate: () => [], // Aliases inherit validation from source — already validated
  };
}

function resolveAliasChain(
  origin: string,
  targetPath: string,
  aliases: Record<string, string>,
  registry: TokenRegistry,
  visited = new Set<string>(),
): string {
  if (visited.has(targetPath)) {
    throw new Error(`Circular alias detected: "${origin}" → ... → "${targetPath}" forms a cycle.`);
  }
  visited.add(targetPath);

  // If target is itself an alias, follow the chain
  const nextTarget = aliases[targetPath];
  if (nextTarget) {
    return resolveAliasChain(origin, nextTarget, aliases, registry, visited);
  }

  // Resolve from source registry
  const value = registry.get(targetPath);
  if (value === undefined) {
    throw new Error(`Alias "${origin}" → "${targetPath}" does not resolve to a known token.`);
  }
  return value;
}
