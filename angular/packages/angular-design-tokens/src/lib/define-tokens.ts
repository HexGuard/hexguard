import { Color } from '@hexguard/angular-color';

// ── Types ──────────────────────────────────────────────────

/** Nested token definition — values can be strings or nested objects. */
export type TokenDefinition = {
  readonly [key: string]: string | number | TokenDefinition;
};

/** Flat token map: `"color.primary.500"` → `"#3b82f6"`. */
export type FlatTokens = ReadonlyMap<string, string>;

/**
 * Token registry — the output of `defineTokens()`.
 *
 * Holds a flat map of token paths to their CSS values.
 */
export interface TokenRegistry {
  /** All flat token entries. */
  readonly entries: FlatTokens;

  /** Get a token value by path e.g. `"color.primary.500"`. Returns undefined if not found. */
  get(path: string): string | undefined;

  /** Validate all token values. Returns an array of validation error messages (empty = valid). */
  validate(): string[];

  /** Number of tokens in the registry. */
  readonly size: number;

  /** The CSS prefix used for custom properties (e.g. `"hexguard"`). */
  readonly prefix: string;
}

// ── Implementation ─────────────────────────────────────────

class TokenRegistryImpl implements TokenRegistry {
  readonly entries: FlatTokens;
  readonly prefix: string;

  constructor(entries: Map<string, string>, prefix: string) {
    this.entries = entries;
    this.prefix = prefix;
  }

  get(path: string): string | undefined {
    return this.entries.get(path);
  }

  get size(): number {
    return this.entries.size;
  }

  validate(): string[] {
    const errors: string[] = [];
    for (const [path, value] of this.entries) {
      if (!value || typeof value !== 'string') {
        errors.push(`Token "${path}" has an empty or non-string value.`);
        continue;
      }
      // Color token validation
      if (path.startsWith('color.') && !path.startsWith('color.font')) {
        try {
          Color.fromHex(value);
        } catch {
          errors.push(`Token "${path}" value "${value}" is not a valid hex color.`);
        }
      }
    }
    return errors;
  }
}

// ── Flatten helper ─────────────────────────────────────────

function flattenDefinition(def: TokenDefinition, prefix: string, out: Map<string, string>): void {
  for (const [key, val] of Object.entries(def)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      flattenDefinition(val as TokenDefinition, fullKey, out);
    } else {
      out.set(fullKey, String(val));
    }
  }
}

// ── Public factory ─────────────────────────────────────────

/**
 * Define a set of design tokens from a nested definition object.
 *
 * The definition is recursively flattened into dot-separated paths.
 *
 * @param definition - Nested token definition.
 * @param options - Optional configuration.
 * @returns A `TokenRegistry` with flat token access.
 *
 * @example
 * ```ts
 * const tokens = defineTokens({
 *   color: {
 *     primary: { 50: '#eff6ff', 500: '#3b82f6', 900: '#1e3a5f' },
 *     neutral: { 100: '#f5f5f5', 900: '#171717' },
 *   },
 *   spacing: { sm: '0.5rem', md: '1rem' },
 * });
 *
 * tokens.get('color.primary.500'); // '#3b82f6'
 * tokens.get('spacing.md');        // '1rem'
 * ```
 */
export function defineTokens(
  definition: TokenDefinition,
  options?: { prefix?: string },
): TokenRegistry {
  const prefix = options?.prefix ?? 'hexguard';
  const flat = new Map<string, string>();
  flattenDefinition(definition, '', flat);
  return new TokenRegistryImpl(flat, prefix);
}
