import { describe, it, expect } from 'vitest';
import { defineTokens } from './define-tokens';

describe('defineTokens', () => {
  it('flattens a nested definition', () => {
    const tokens = defineTokens({
      color: {
        primary: { 500: '#3b82f6' },
        neutral: { 100: '#f5f5f5' },
      },
      spacing: { sm: '0.5rem', md: '1rem' },
    });

    expect(tokens.size).toBe(4);
    expect(tokens.get('color.primary.500')).toBe('#3b82f6');
    expect(tokens.get('color.neutral.100')).toBe('#f5f5f5');
    expect(tokens.get('spacing.sm')).toBe('0.5rem');
    expect(tokens.get('spacing.md')).toBe('1rem');
  });

  it('returns undefined for unknown paths', () => {
    const tokens = defineTokens({ color: { red: '#ff0000' } });
    expect(tokens.get('color.blue')).toBeUndefined();
    expect(tokens.get('nonexistent')).toBeUndefined();
  });

  it('handles empty definition', () => {
    const tokens = defineTokens({});
    expect(tokens.size).toBe(0);
    expect(tokens.entries.size).toBe(0);
  });

  it('handles deeply nested definitions', () => {
    const tokens = defineTokens({
      a: { b: { c: { d: { e: 'deep' } } } },
    });
    expect(tokens.get('a.b.c.d.e')).toBe('deep');
  });

  it('converts numbers to strings', () => {
    const tokens = defineTokens({ size: { large: 42 } as any });
    expect(tokens.get('size.large')).toBe('42');
  });

  it('uses custom prefix', () => {
    const tokens = defineTokens({ color: { red: '#ff0000' } }, { prefix: 'myapp' });
    expect(tokens.prefix).toBe('myapp');
  });

  it('default prefix is hexguard', () => {
    const tokens = defineTokens({ color: { red: '#ff0000' } });
    expect(tokens.prefix).toBe('hexguard');
  });

  // ── Validation ──────────────────────────────────────────

  it('validate() returns empty array for valid tokens', () => {
    const tokens = defineTokens({
      color: { primary: { 500: '#3b82f6' } },
      spacing: { md: '1rem' },
    });
    expect(tokens.validate()).toEqual([]);
  });

  it('validate() catches invalid hex colors', () => {
    const tokens = defineTokens({
      color: { primary: { 500: 'not-a-color' } },
    });
    const errors = tokens.validate();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('not-a-color');
  });

  it('validate() catches empty values', () => {
    const tokens = defineTokens({
      color: { primary: { 500: '' } },
    });
    const errors = tokens.validate();
    expect(errors.length).toBeGreaterThan(0);
  });
});
