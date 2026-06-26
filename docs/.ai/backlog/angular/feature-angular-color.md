---
id: feature-angular-color
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-color'
---

# @hexguard/angular-color

## Summary

Color manipulation utilities and state models for Angular — parse, convert, and manipulate colors across Hex, RGB, HSL, HSV color spaces with contrast calculation, palette generation, and signal-based color picker state. Every design tool, theming system, dashboard customizer, and chart configuration UI needs color manipulation, yet every team rebuilds the same color math.

**Competition check:** Color libraries exist (chroma.js, color, tinycolor2) but they're JavaScript libraries, not Angular-specific. No Angular package provides color state as signals with reactive color picker integration.

## Why Wide Adoption

Theming UIs (dark/light mode customizers), chart builders, dashboard personalization, design tools, product configurators, and accessibility checkers all need color manipulation: parsing hex input, converting to HSL for sliders, calculating contrast ratios for WCAG compliance, and generating harmonious palettes.

## Goals

1. Provide `Color` value object — parse from hex, RGB, HSL, HSV strings; convert between spaces; manipulate brightness, saturation, hue.
2. Provide `injectColorPicker()` — color picker state with hue/saturation/value/luminance signals and an output color signal.
3. Provide contrast ratio calculation (WCAG AA/AAA compliance checking).
4. Provide palette generation (complementary, analogous, triadic, monochromatic).
5. Provide alpha/opacity support throughout.

## Non-Goals

- No color picker UI component (headless state — consumer renders their own picker).
- No color blindness simulation.
- No image color extraction.

## Decisions

1. **Value object**: `Color` is an immutable value object with methods that return new instances.
2. **Signal state**: The color picker state uses signals for each channel (hue, saturation, lightness, alpha) and a computed output color.
3. **WCAG compliance**: Expose `contrastRatio(other)` returning a number, and `contrastLevel(other)` returning `'AA' | 'AAA' | 'fail'`.

## Proposed Public API

```typescript
// ── Value Object ──────────────────────────────────────────

export class Color {
  static fromHex(hex: string): Color;
  static fromRgb(r: number, g: number, b: number, a?: number): Color;
  static fromHsl(h: number, s: number, l: number, a?: number): Color;
  static fromHsv(h: number, s: number, v: number, a?: number): Color;

  toHex(): string;
  toRgb(): { r: number; g: number; b: number; a: number };
  toHsl(): { h: number; s: number; l: number; a: number };
  toHsv(): { h: number; s: number; v: number; a: number };

  lighten(factor: number): Color;           // 0–1
  darken(factor: number): Color;            // 0–1
  saturate(factor: number): Color;
  desaturate(factor: number): Color;
  rotateHue(degrees: number): Color;
  alpha(value: number): Color;
  blend(other: Color, ratio: number): Color;

  contrastRatio(other: Color): number;
  contrastLevel(other: Color): 'AAA' | 'AA' | 'fail';

  palette(type: PaletteType): Color[];      // complementary, analogous, triadic, monochromatic

  isLight(): boolean;
  isDark(): boolean;
  equals(other: Color): boolean;
  toString(): string;
}

export type PaletteType = 'complementary' | 'analogous' | 'triadic'
  | 'monochromatic' | 'split-complementary';

// ── Color Picker State ────────────────────────────────────

export interface ColorPickerConfig {
  initialColor?: string | Color;
  format?: 'hex' | 'rgb' | 'hsl' | 'hsv';
}

export interface ColorPickerState {
  readonly color: Signal<Color>;
  readonly hex: Signal<string>;
  readonly hue: Signal<number>;
  readonly saturation: Signal<number>;       // HSL saturation 0–100
  readonly lightness: Signal<number>;
  readonly alpha: Signal<number>;

  setColor(color: string | Color): void;
  setHue(value: number): void;
  setSaturation(value: number): void;
  setLightness(value: number): void;
  setAlpha(value: number): void;
  setHex(hex: string): void;
}

// ── Factory ───────────────────────────────────────────────

export function injectColorPicker(config?: ColorPickerConfig): ColorPickerState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-color/` following the standard pattern.
2. Implement `Color` value object with all conversion and manipulation methods.
3. Implement `ColorPickerState` with per-channel signals.
4. Add tests: all color conversions round-trip, contrast ratio calculation, palette generation, edge cases (invalid hex, black/white extremes).
5. Create demo page.
6. Register in workspace, build scripts, and catalog.
