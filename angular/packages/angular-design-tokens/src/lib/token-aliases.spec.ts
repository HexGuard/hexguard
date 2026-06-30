import { describe, it, expect } from 'vitest';
import { defineTokens } from './define-tokens';
import { tokenAliases } from './token-aliases';

const BASE = defineTokens({
  color: {
    primary: { 500: '#3b82f6' },
    neutral: { 50: '#fafafa', 900: '#171717' },
  },
  spacing: { md: '1rem' },
});

describe('tokenAliases', () => {
  it('resolves aliases to their target values', () => {
    const semantic = tokenAliases(BASE, {
      'color.brand': 'color.primary.500',
      'color.surface': 'color.neutral.50',
    });

    expect(semantic.get('color.brand')).toBe('#3b82f6');
    expect(semantic.get('color.surface')).toBe('#fafafa');
  });

  it('preserves original tokens alongside aliases', () => {
    const semantic = tokenAliases(BASE, {
      'color.brand': 'color.primary.500',
    });

    // Original still accessible
    expect(semantic.get('color.primary.500')).toBe('#3b82f6');
    expect(semantic.get('spacing.md')).toBe('1rem');
  });

  it('size includes both originals and aliases', () => {
    const semantic = tokenAliases(BASE, {
      'color.brand': 'color.primary.500',
      'color.surface': 'color.neutral.50',
    });
    // BASE has 4 tokens + 2 aliases = 6
    expect(semantic.size).toBe(6);
  });

  it('detects circular aliases', () => {
    expect(() =>
      tokenAliases(BASE, {
        a: 'b',
        b: 'a',
      }),
    ).toThrow(/circular/i);
  });

  it('detects unresolved target paths', () => {
    expect(() =>
      tokenAliases(BASE, {
        'color.brand': 'color.nonexistent',
      }),
    ).toThrow(/does not resolve/i);
  });

  it('resolves chained aliases', () => {
    const semantic = tokenAliases(BASE, {
      'color.brand': 'color.primary',
      'color.primary': 'color.primary.500',
    });
    expect(semantic.get('color.brand')).toBe('#3b82f6');
  });

  it('returns empty validation result', () => {
    const semantic = tokenAliases(BASE, {
      'color.brand': 'color.primary.500',
    });
    expect(semantic.validate()).toEqual([]);
  });
});
