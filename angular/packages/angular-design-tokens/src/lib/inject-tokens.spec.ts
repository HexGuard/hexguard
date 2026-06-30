import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { defineTokens } from './define-tokens';
import { injectTokens } from './inject-tokens';

const SAMPLE_TOKENS = defineTokens({
  color: {
    primary: { 500: '#3b82f6' },
    surface: '#ffffff',
  },
  spacing: { md: '1rem' },
});

describe('injectTokens', () => {
  it('returns a TokenAccess with get() and all', () => {
    TestBed.runInInjectionContext(() => {
      const access = injectTokens(SAMPLE_TOKENS);
      expect(access).toBeDefined();
      expect(access.get).toBeInstanceOf(Function);
      expect(access.all).toBeDefined();
    });
  });

  it('get() returns a signal with the token value', () => {
    TestBed.runInInjectionContext(() => {
      const access = injectTokens(SAMPLE_TOKENS);
      const primary = access.get('color.primary.500');
      expect(primary()).toBe('#3b82f6');
    });
  });

  it('get() returns undefined for unknown paths', () => {
    TestBed.runInInjectionContext(() => {
      const access = injectTokens(SAMPLE_TOKENS);
      const unknown = access.get('color.nonexistent');
      expect(unknown()).toBeUndefined();
    });
  });

  it('get() returns the same signal for the same path (cached)', () => {
    TestBed.runInInjectionContext(() => {
      const access = injectTokens(SAMPLE_TOKENS);
      const a = access.get('color.primary.500');
      const b = access.get('color.primary.500');
      expect(a).toBe(b);
    });
  });

  it('all signal returns the flat token map', () => {
    TestBed.runInInjectionContext(() => {
      const access = injectTokens(SAMPLE_TOKENS);
      const all = access.all();
      expect(all.get('color.primary.500')).toBe('#3b82f6');
      expect(all.get('spacing.md')).toBe('1rem');
    });
  });

  it('syncCss option syncs to :root', () => {
    // Clean up any prior sync
    if (typeof document !== 'undefined') {
      document.documentElement.style.removeProperty('--hexguard-color-primary-500');
    }

    TestBed.runInInjectionContext(() => {
      injectTokens(SAMPLE_TOKENS, { syncCss: true });
    });

    if (typeof document !== 'undefined') {
      const value = document.documentElement.style.getPropertyValue('--hexguard-color-primary-500');
      expect(value).toBe('#3b82f6');
    }
  });
});
