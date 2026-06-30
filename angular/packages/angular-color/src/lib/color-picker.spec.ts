import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { injectColorPicker } from './color-picker';
import { Color } from './color';

describe('injectColorPicker', () => {
  it('defaults to black', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker();
      expect(picker.color().toHex()).toBe('#000000');
      expect(picker.hex()).toBe('#000000');
    });
  });

  it('accepts initial hex string', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#3b82f6' });
      expect(picker.color().r).toBe(59);
      expect(picker.color().g).toBe(130);
      expect(picker.color().b).toBe(246);
      expect(picker.hex()).toBe('#3b82f6');
    });
  });

  it('accepts initial Color instance', () => {
    TestBed.runInInjectionContext(() => {
      const red = Color.fromHex('#ef4444');
      const picker = injectColorPicker({ initialColor: red });
      expect(picker.color().equals(red)).toBe(true);
    });
  });

  it('exposes correct channel values from initial color', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#3b82f6' });
      const hsl = picker.color().toHsl();
      // Allow ±1 rounding
      expect(picker.hue()).toBeCloseTo(hsl.h, -1);
      expect(picker.saturation()).toBeCloseTo(hsl.s, -1);
      expect(picker.lightness()).toBeCloseTo(hsl.l, -1);
      expect(picker.alpha()).toBe(1);
    });
  });

  // ── setHue ───────────────────────────────────────────────

  it('setHue updates the color signal', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#3b82f6' });
      picker.setHue(0); // red hue
      expect(picker.hue()).toBe(0);
      expect(picker.color().r).toBeGreaterThan(picker.color().b); // red > blue
    });
  });

  it('setHue wraps values', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#ff0000' });
      picker.setHue(480); // 480 - 360 = 120 (green)
      expect(picker.hue()).toBe(120);
    });
  });

  it('setHue handles negative values', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#ff0000' });
      picker.setHue(-120); // -120 + 360 = 240 (blue)
      expect(picker.hue()).toBe(240);
    });
  });

  // ── setSaturation ────────────────────────────────────────

  it('setSaturation updates color', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#3b82f6' });
      picker.setSaturation(0);
      expect(picker.saturation()).toBe(0);
      // Desaturated → RGB channels equal (grey)
      const { r, g, b } = picker.color().toRgb();
      expect(r).toBe(g);
      expect(g).toBe(b);
    });
  });

  it('setSaturation clamps to 0–100', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#ff0000' });
      picker.setSaturation(150);
      expect(picker.saturation()).toBe(100);
      picker.setSaturation(-50);
      expect(picker.saturation()).toBe(0);
    });
  });

  // ── setLightness ─────────────────────────────────────────

  it('setLightness(0) produces black', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker();
      picker.setLightness(0);
      expect(picker.color().toHex()).toBe('#000000');
    });
  });

  it('setLightness(100) produces white', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker();
      picker.setLightness(100);
      expect(picker.color().toHex()).toBe('#ffffff');
    });
  });

  // ── setAlpha ─────────────────────────────────────────────

  it('setAlpha updates alpha signal', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker();
      picker.setAlpha(0.5);
      expect(picker.alpha()).toBe(0.5);
      expect(picker.color().a).toBe(0.5);
    });
  });

  it('setAlpha clamps to 0–1', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker();
      picker.setAlpha(2);
      expect(picker.alpha()).toBe(1);
      picker.setAlpha(-1);
      expect(picker.alpha()).toBe(0);
    });
  });

  // ── setHex ───────────────────────────────────────────────

  it('setHex updates all channels', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#000000' });
      picker.setHex('#ef4444');
      expect(picker.hex()).toBe('#ef4444');
      expect(picker.color().r).toBe(239);
      expect(picker.hue()).toBeCloseTo(0, -1); // red
    });
  });

  // ── setColor ─────────────────────────────────────────────

  it('setColor with hex string', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker();
      picker.setColor('#10b981');
      expect(picker.hex()).toBe('#10b981');
    });
  });

  it('setColor with Color instance', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker();
      const green = Color.fromHex('#10b981');
      picker.setColor(green);
      expect(picker.color().equals(green)).toBe(true);
    });
  });

  // ── Channel consistency ──────────────────────────────────

  it('changing hue keeps saturation and lightness', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#3b82f6' });
      const initialSat = picker.saturation();
      const initialLight = picker.lightness();
      picker.setHue(0);
      expect(picker.saturation()).toBe(initialSat);
      expect(picker.lightness()).toBe(initialLight);
    });
  });

  it('hex signal stays in sync with color', () => {
    TestBed.runInInjectionContext(() => {
      const picker = injectColorPicker({ initialColor: '#3b82f6' });
      picker.setHue(0);
      expect(picker.hex()).toBe(picker.color().toHex());
    });
  });

  // ── Multiple independent pickers ─────────────────────────

  it('multiple pickers are independent', () => {
    TestBed.runInInjectionContext(() => {
      const pickerA = injectColorPicker({ initialColor: '#ef4444' });
      const pickerB = injectColorPicker({ initialColor: '#3b82f6' });

      expect(pickerA.hex()).toBe('#ef4444');
      expect(pickerB.hex()).toBe('#3b82f6');

      pickerA.setHue(120);
      expect(pickerA.hue()).toBe(120);
      expect(pickerB.hue()).not.toBe(120); // unchanged
    });
  });
});
