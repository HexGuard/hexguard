import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { defineTokens } from './define-tokens';
import {
  syncTokensToRoot,
  unsyncTokensFromRoot,
  tokenPathToCssProp,
} from './css-sync';

describe('css-sync', () => {
  describe('tokenPathToCssProp', () => {
    it('converts a token path to a CSS custom property name', () => {
      expect(tokenPathToCssProp('hexguard', 'color.primary.500')).toBe(
        '--hexguard-color-primary-500',
      );
    });

    it('handles single-segment paths', () => {
      expect(tokenPathToCssProp('app', 'fontSize')).toBe('--app-fontSize');
    });

    it('handles custom prefix', () => {
      expect(tokenPathToCssProp('myapp', 'spacing.lg')).toBe(
        '--myapp-spacing-lg',
      );
    });
  });

  describe('syncTokensToRoot / unsyncTokensFromRoot', () => {
    const tokens = defineTokens({
      color: {
        primary: { 500: '#3b82f6' },
        neutral: { 100: '#f5f5f5' },
      },
    });

    beforeEach(() => {
      // Clean up any leftover properties
      unsyncTokensFromRoot(tokens);
    });

    it('syncs tokens as CSS custom properties on :root', () => {
      syncTokensToRoot(tokens);

      const styles = getComputedStyle(document.documentElement);
      expect(styles.getPropertyValue('--hexguard-color-primary-500').trim()).toBe(
        '#3b82f6',
      );
      expect(styles.getPropertyValue('--hexguard-color-neutral-100').trim()).toBe(
        '#f5f5f5',
      );
    });

    it('unsyncs tokens removes CSS custom properties', () => {
      syncTokensToRoot(tokens);
      unsyncTokensFromRoot(tokens);

      const style = document.documentElement.style;
      expect(style.getPropertyValue('--hexguard-color-primary-500')).toBe('');
      expect(style.getPropertyValue('--hexguard-color-neutral-100')).toBe('');
    });

    it('syncs to a custom target element', () => {
      const div = document.createElement('div');
      syncTokensToRoot(tokens, { target: div });

      expect(div.style.getPropertyValue('--hexguard-color-primary-500')).toBe(
        '#3b82f6',
      );
    });

    it('is a no-op when document is unavailable', () => {
      // Just verify it doesn't throw — SSR safety
      expect(() => syncTokensToRoot(tokens)).not.toThrow();
    });
  });
});
