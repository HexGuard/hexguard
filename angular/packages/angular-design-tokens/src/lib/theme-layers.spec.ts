import { describe, it, expect } from 'vitest';
import { defineTokens } from './define-tokens';
import { TokenThemeLayer } from './theme-layers';

const BASE = defineTokens({
  color: {
    surface: '#ffffff',
    text: '#171717',
    primary: { 500: '#3b82f6' },
  },
});

describe('TokenThemeLayer', () => {
  it('creates a layer with overrides', () => {
    const layer = new TokenThemeLayer({
      'color.surface': '#1a1a1a',
      'color.text': '#f0f0f0',
    });
    expect(layer.size).toBe(2);
    expect(layer.entries.get('color.surface')).toBe('#1a1a1a');
  });

  it('applyTo() creates a merged registry', () => {
    const darkLayer = new TokenThemeLayer({
      'color.surface': '#1a1a1a',
      'color.text': '#f0f0f0',
    });

    const darkTokens = darkLayer.applyTo(BASE);

    // Overridden
    expect(darkTokens.get('color.surface')).toBe('#1a1a1a');
    expect(darkTokens.get('color.text')).toBe('#f0f0f0');

    // Unchanged
    expect(darkTokens.get('color.primary.500')).toBe('#3b82f6');
  });

  it('applyTo() preserves base registry size + overrides', () => {
    const darkLayer = new TokenThemeLayer({
      'color.surface': '#1a1a1a',
    });
    const darkTokens = darkLayer.applyTo(BASE);
    // BASE has 3 tokens; 1 override doesn't add a new key
    expect(darkTokens.size).toBe(3);
  });

  it('applyTo() can add new tokens not in base', () => {
    const layer = new TokenThemeLayer({
      'shadow.lg': '0 10px 25px rgba(0,0,0,0.3)',
    });
    const merged = layer.applyTo(BASE);
    expect(merged.get('shadow.lg')).toBe('0 10px 25px rgba(0,0,0,0.3)');
    expect(merged.size).toBe(4); // 3 base + 1 new
  });

  it('syncToDom() sets CSS custom properties', () => {
    const layer = new TokenThemeLayer({
      'color.surface': '#1a1a1a',
    });
    layer.syncToDom();

    if (typeof document !== 'undefined') {
      const value = document.documentElement.style.getPropertyValue(
        '--hexguard-color-surface',
      );
      expect(value).toBe('#1a1a1a');
    }
  });
});
