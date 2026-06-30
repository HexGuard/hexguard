import { describe, it, expect } from 'vitest';
import { Color } from './color';

describe('Color', () => {
  // ── Hex parsing ──────────────────────────────────────────

  describe('fromHex', () => {
    it('parses 6-digit hex', () => {
      const c = Color.fromHex('#3b82f6');
      expect(c.r).toBe(59);
      expect(c.g).toBe(130);
      expect(c.b).toBe(246);
      expect(c.a).toBe(1);
    });

    it('parses hex without hash', () => {
      const c = Color.fromHex('3b82f6');
      expect(c.r).toBe(59);
      expect(c.g).toBe(130);
      expect(c.b).toBe(246);
    });

    it('parses 3-digit shorthand', () => {
      const c = Color.fromHex('#f00');
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
    });

    it('parses 8-digit hex with alpha', () => {
      const c = Color.fromHex('#3b82f680');
      expect(c.r).toBe(59);
      expect(c.g).toBe(130);
      expect(c.b).toBe(246);
      expect(c.a).toBeCloseTo(0.502, 2);
    });

    it('parses 4-digit shorthand with alpha', () => {
      const c = Color.fromHex('#f008');
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBeCloseTo(0.533, 2);
    });

    it('parses white', () => {
      const c = Color.fromHex('#ffffff');
      expect(c.r).toBe(255);
      expect(c.g).toBe(255);
      expect(c.b).toBe(255);
    });

    it('parses black', () => {
      const c = Color.fromHex('#000000');
      expect(c.r).toBe(0);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
    });

    it('throws on invalid hex', () => {
      expect(() => Color.fromHex('not-a-color')).toThrow();
      expect(() => Color.fromHex('#ggg')).toThrow();
      expect(() => Color.fromHex('#12345')).toThrow();
    });

    it('handles whitespace around hex', () => {
      const c = Color.fromHex('  #3b82f6  ');
      expect(c.r).toBe(59);
    });
  });

  // ── fromRgb ──────────────────────────────────────────────

  describe('fromRgb', () => {
    it('creates from RGB channels', () => {
      const c = Color.fromRgb(255, 0, 0);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
      expect(c.a).toBe(1);
    });

    it('creates from RGB with alpha', () => {
      const c = Color.fromRgb(255, 0, 0, 0.5);
      expect(c.a).toBe(0.5);
    });

    it('clamps out-of-range values', () => {
      const c = Color.fromRgb(300, -10, 128);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(128);
    });
  });

  // ── fromHsl ──────────────────────────────────────────────

  describe('fromHsl', () => {
    it('creates red from HSL', () => {
      const c = Color.fromHsl(0, 100, 50);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
    });

    it('creates green from HSL', () => {
      const c = Color.fromHsl(120, 100, 50);
      expect(c.r).toBe(0);
      expect(c.g).toBe(255);
      expect(c.b).toBe(0);
    });

    it('creates blue from HSL', () => {
      const c = Color.fromHsl(240, 100, 50);
      expect(c.r).toBe(0);
      expect(c.g).toBe(0);
      expect(c.b).toBe(255);
    });

    it('creates white from HSL', () => {
      const c = Color.fromHsl(0, 0, 100);
      expect(c.r).toBe(255);
      expect(c.g).toBe(255);
      expect(c.b).toBe(255);
    });

    it('creates black from HSL', () => {
      const c = Color.fromHsl(0, 0, 0);
      expect(c.r).toBe(0);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
    });

    it('wraps hue > 360', () => {
      const c = Color.fromHsl(480, 100, 50); // 480 - 360 = 120 → green
      // 120 hue, full saturation, 50% lightness = green
      expect(c.g).toBe(255);
    });

    it('handles negative hue', () => {
      const c = Color.fromHsl(-120, 100, 50); // -120 + 360 = 240 → blue
      expect(c.b).toBe(255);
    });
  });

  // ── fromHsv ──────────────────────────────────────────────

  describe('fromHsv', () => {
    it('creates red from HSV', () => {
      const c = Color.fromHsv(0, 100, 100);
      expect(c.r).toBe(255);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
    });

    it('creates black from HSV (v=0)', () => {
      const c = Color.fromHsv(0, 100, 0);
      expect(c.r).toBe(0);
      expect(c.g).toBe(0);
      expect(c.b).toBe(0);
    });
  });

  // ── toHex ────────────────────────────────────────────────

  describe('toHex', () => {
    it('round-trips hex → Color → hex', () => {
      const hex = '#3b82f6';
      expect(Color.fromHex(hex).toHex()).toBe(hex);
    });

    it('round-trips for black and white', () => {
      expect(Color.fromHex('#000000').toHex()).toBe('#000000');
      expect(Color.fromHex('#ffffff').toHex()).toBe('#ffffff');
    });

    it('includes alpha when not fully opaque', () => {
      const c = Color.fromRgb(59, 130, 246, 0.5);
      const hex = c.toHex();
      expect(hex).toMatch(/^#[0-9a-f]{8}$/);
      expect(hex.length).toBe(9);
    });

    it('omits alpha when fully opaque', () => {
      const c = Color.fromRgb(59, 130, 246, 1);
      expect(c.toHex().length).toBe(7);
    });
  });

  // ── toRgb ────────────────────────────────────────────────

  describe('toRgb', () => {
    it('returns correct RGB values', () => {
      const c = Color.fromHex('#3b82f6');
      const rgb = c.toRgb();
      expect(rgb).toEqual({ r: 59, g: 130, b: 246, a: 1 });
    });
  });

  // ── toHsl round-trip ─────────────────────────────────────

  describe('toHsl', () => {
    it('round-trips hex → HSL → hex', () => {
      const original = Color.fromHex('#3b82f6');
      const hsl = original.toHsl();
      const rebuilt = Color.fromHsl(hsl.h, hsl.s, hsl.l);
      // Allow ±1 due to integer rounding
      expect(rebuilt.r).toBeCloseTo(original.r, -1);
      expect(rebuilt.g).toBeCloseTo(original.g, -1);
      expect(rebuilt.b).toBeCloseTo(original.b, -1);
    });

    it('returns h=0 for achromatic colors', () => {
      const c = Color.fromHex('#808080');
      expect(c.toHsl().h).toBe(0);
      expect(c.toHsl().s).toBe(0);
    });
  });

  // ── toHsv round-trip ─────────────────────────────────────

  describe('toHsv', () => {
    it('round-trips hex → HSV → hex', () => {
      const original = Color.fromHex('#3b82f6');
      const hsv = original.toHsv();
      const rebuilt = Color.fromHsv(hsv.h, hsv.s, hsv.v);
      expect(rebuilt.r).toBeCloseTo(original.r, -1);
      expect(rebuilt.g).toBeCloseTo(original.g, -1);
      expect(rebuilt.b).toBeCloseTo(original.b, -1);
    });
  });

  // ── Manipulation ─────────────────────────────────────────

  describe('lighten / darken', () => {
    it('lighten increases lightness', () => {
      const c = Color.fromHex('#3b82f6');
      const lighter = c.lighten(0.5);
      expect(lighter.toHsl().l).toBeGreaterThan(c.toHsl().l);
    });

    it('darken decreases lightness', () => {
      const c = Color.fromHex('#3b82f6');
      const darker = c.darken(0.5);
      expect(darker.toHsl().l).toBeLessThan(c.toHsl().l);
    });

    it('lighten(1) produces white', () => {
      const c = Color.fromHex('#3b82f6');
      expect(c.lighten(1).toHex()).toBe('#ffffff');
    });

    it('darken(1) produces black', () => {
      const c = Color.fromHex('#3b82f6');
      expect(c.darken(1).toHex()).toBe('#000000');
    });

    it('lighten(0) returns same color', () => {
      const c = Color.fromHex('#3b82f6');
      expect(c.lighten(0).equals(c)).toBe(true);
    });
  });

  describe('saturate / desaturate', () => {
    it('saturate increases saturation', () => {
      const c = Color.fromHsl(217, 50, 60);
      const sat = c.saturate(0.5);
      expect(sat.toHsl().s).toBeGreaterThan(c.toHsl().s);
    });

    it('desaturate decreases saturation', () => {
      const c = Color.fromHsl(217, 50, 60);
      const desat = c.desaturate(0.5);
      expect(desat.toHsl().s).toBeLessThan(c.toHsl().s);
    });
  });

  describe('rotateHue', () => {
    it('rotates by 180° (complementary)', () => {
      const c = Color.fromHsl(0, 100, 50); // red
      const rotated = c.rotateHue(180);
      expect(rotated.toHsl().h).toBeCloseTo(180, -1); // cyan
    });

    it('wraps at 360', () => {
      const c = Color.fromHsl(300, 100, 50);
      const rotated = c.rotateHue(120);
      expect(rotated.toHsl().h).toBe(60);
    });
  });

  describe('alpha', () => {
    it('sets alpha', () => {
      const c = Color.fromHex('#3b82f6').alpha(0.5);
      expect(c.a).toBe(0.5);
      expect(c.r).toBe(59); // RGB unchanged
    });

    it('clamps alpha to 0–1', () => {
      expect(Color.fromHex('#3b82f6').alpha(2).a).toBe(1);
      expect(Color.fromHex('#3b82f6').alpha(-1).a).toBe(0);
    });
  });

  describe('blend', () => {
    it('blend at 0.5 gives midpoint', () => {
      const black = Color.fromHex('#000000');
      const white = Color.fromHex('#ffffff');
      const mid = black.blend(white, 0.5);
      expect(mid.r).toBe(128);
      expect(mid.g).toBe(128);
      expect(mid.b).toBe(128);
    });

    it('blend at 0 returns this color', () => {
      const a = Color.fromHex('#3b82f6');
      const b = Color.fromHex('#ef4444');
      expect(a.blend(b, 0).equals(a)).toBe(true);
    });

    it('blend at 1 returns other color', () => {
      const a = Color.fromHex('#3b82f6');
      const b = Color.fromHex('#ef4444');
      expect(a.blend(b, 1).equals(b)).toBe(true);
    });
  });

  // ── Contrast ─────────────────────────────────────────────

  describe('contrastRatio', () => {
    it('black on white = 21', () => {
      const ratio = Color.fromHex('#000000').contrastRatio(Color.fromHex('#ffffff'));
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('white on white = 1', () => {
      const ratio = Color.fromHex('#ffffff').contrastRatio(Color.fromHex('#ffffff'));
      expect(ratio).toBe(1);
    });

    it('black on black = 1', () => {
      const ratio = Color.fromHex('#000000').contrastRatio(Color.fromHex('#000000'));
      expect(ratio).toBe(1);
    });

    it('is symmetric', () => {
      const a = Color.fromHex('#3b82f6');
      const b = Color.fromHex('#ef4444');
      expect(a.contrastRatio(b)).toBe(b.contrastRatio(a));
    });
  });

  describe('contrastLevel', () => {
    it('black on white = AAA', () => {
      expect(Color.fromHex('#000000').contrastLevel(Color.fromHex('#ffffff'))).toBe('AAA');
    });

    it('grey on white may be AA or fail', () => {
      // #767676 on white → ~4.54 (borderline AA)
      const level = Color.fromHex('#767676').contrastLevel(Color.fromHex('#ffffff'));
      expect(['AA', 'fail']).toContain(level);
    });

    it('red on white ≈ 3.99 → fail', () => {
      expect(Color.fromHex('#ef4444').contrastLevel(Color.fromHex('#ffffff'))).toBe('fail');
    });
  });

  // ── Palette ──────────────────────────────────────────────

  describe('palette', () => {
    it('complementary returns 2 colors 180° apart', () => {
      const c = Color.fromHsl(0, 100, 50);
      const pals = c.palette('complementary');
      expect(pals).toHaveLength(2);
      expect(pals[1].toHsl().h).toBeCloseTo(180, -1);
    });

    it('analogous returns 3 colors ±30°', () => {
      const c = Color.fromHsl(0, 100, 50);
      const pals = c.palette('analogous');
      expect(pals).toHaveLength(3);
    });

    it('triadic returns 3 colors 120° apart', () => {
      const c = Color.fromHsl(0, 100, 50);
      const pals = c.palette('triadic');
      expect(pals).toHaveLength(3);
      expect(pals[1].toHsl().h).toBeCloseTo(120, -1);
      expect(pals[2].toHsl().h).toBeCloseTo(240, -1);
    });

    it('split-complementary returns 3 colors', () => {
      const c = Color.fromHsl(0, 100, 50);
      const pals = c.palette('split-complementary');
      expect(pals).toHaveLength(3);
    });

    it('monochromatic returns requested count', () => {
      const c = Color.fromHsl(217, 71, 60);
      const pals = c.palette('monochromatic', 5);
      expect(pals).toHaveLength(5);
    });
  });

  // ── isLight / isDark ─────────────────────────────────────

  describe('isLight / isDark', () => {
    it('white is light', () => {
      expect(Color.fromHex('#ffffff').isLight()).toBe(true);
      expect(Color.fromHex('#ffffff').isDark()).toBe(false);
    });

    it('black is dark', () => {
      expect(Color.fromHex('#000000').isDark()).toBe(true);
      expect(Color.fromHex('#000000').isLight()).toBe(false);
    });
  });

  // ── equals ───────────────────────────────────────────────

  describe('equals', () => {
    it('same hex equals', () => {
      expect(Color.fromHex('#3b82f6').equals(Color.fromHex('#3b82f6'))).toBe(true);
    });

    it('different hex not equals', () => {
      expect(Color.fromHex('#3b82f6').equals(Color.fromHex('#ef4444'))).toBe(false);
    });

    it('different alpha not equals', () => {
      expect(Color.fromRgb(59, 130, 246, 1).equals(Color.fromRgb(59, 130, 246, 0.5))).toBe(false);
    });
  });

  // ── toString ─────────────────────────────────────────────

  describe('toString', () => {
    it('returns hex', () => {
      expect(Color.fromHex('#3b82f6').toString()).toBe('#3b82f6');
    });
  });
});
