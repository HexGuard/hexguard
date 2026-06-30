import { describe, it, expect } from 'vitest';
import { defineTokens } from './define-tokens';
import { transformToken } from './token-transforms';

const TOKENS = defineTokens({
  color: { primary: { 500: '#3b82f6' } },
  spacing: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
});

describe('transformToken', () => {
  it('transforms a token value through a function', () => {
    const result = transformToken(TOKENS, 'spacing.md', (v) => `calc(${v} * 2)`);
    expect(result()).toBe('calc(1rem * 2)');
  });

  it('returns undefined for unknown paths', () => {
    const result = transformToken(TOKENS, 'spacing.xxl', (v) => v);
    expect(result()).toBeUndefined();
  });

  it('handles numeric transforms', () => {
    const result = transformToken(TOKENS, 'spacing.md', (v) => parseFloat(v) * 2);
    expect(result()).toBe(2);
  });

  it('supports generic type parameter', () => {
    const result = transformToken(TOKENS, 'spacing.md', () => ({ value: 42 } as const));
    expect(result()?.value).toBe(42);
  });
});
