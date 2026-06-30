/**
 * Color value object — immutable representation of a color with
 * conversion, manipulation, contrast, and palette utilities.
 *
 * All mutation methods return new `Color` instances.
 *
 * @example Parse and convert
 * ```ts
 * const c = Color.fromHex('#3b82f6');
 * const hsl = c.toHsl(); // { h: 217, s: 71, l: 60, a: 1 }
 * ```
 *
 * @example Contrast check
 * ```ts
 * const ratio = Color.fromHex('#ef4444').contrastRatio(Color.fromHex('#ffffff'));
 * // 3.93 — fails WCAG AA for normal text
 * ```
 */
export class Color {
  // ── Internal: store as RGBA ──────────────────────────────

  readonly #r: number; // 0–255
  readonly #g: number;
  readonly #b: number;
  readonly #a: number; // 0–1

  private constructor(r: number, g: number, b: number, a: number) {
    this.#r = Color.#clampByte(r);
    this.#g = Color.#clampByte(g);
    this.#b = Color.#clampByte(b);
    this.#a = Color.#clampAlpha(a);
  }

  // ── Static factories ─────────────────────────────────────

  /**
   * Parse a hex color string.
   * Accepts `#RGB`, `#RRGGBB`, `#RRGGBBAA` formats (with or without `#`).
   */
  static fromHex(hex: string): Color {
    const raw = hex.trim().replace(/^#/, '');
    if (!/^[0-9a-fA-F]{3,8}$/.test(raw) || raw.length === 5 || raw.length === 7) {
      throw new Error(`Invalid hex color: "${hex}"`);
    }

    let r: number;
    let g: number;
    let b: number;
    let a = 1;

    if (raw.length === 3) {
      r = parseInt(raw[0] + raw[0], 16);
      g = parseInt(raw[1] + raw[1], 16);
      b = parseInt(raw[2] + raw[2], 16);
    } else if (raw.length === 6) {
      r = parseInt(raw.slice(0, 2), 16);
      g = parseInt(raw.slice(2, 4), 16);
      b = parseInt(raw.slice(4, 6), 16);
    } else if (raw.length === 8) {
      r = parseInt(raw.slice(0, 2), 16);
      g = parseInt(raw.slice(2, 4), 16);
      b = parseInt(raw.slice(4, 6), 16);
      a = Math.round((parseInt(raw.slice(6, 8), 16) / 255) * 1000) / 1000;
    } else {
      // 4-char shorthand with alpha — #RGBA
      r = parseInt(raw[0] + raw[0], 16);
      g = parseInt(raw[1] + raw[1], 16);
      b = parseInt(raw[2] + raw[2], 16);
      a = Math.round((parseInt(raw[3] + raw[3], 16) / 255) * 1000) / 1000;
    }

    return new Color(r, g, b, a);
  }

  /** Create from RGB channels (0–255). */
  static fromRgb(r: number, g: number, b: number, a = 1): Color {
    return new Color(r, g, b, a);
  }

  /**
   * Create from HSL channels.
   * @param h Hue 0–360
   * @param s Saturation 0–100
   * @param l Lightness 0–100
   * @param a Alpha 0–1
   */
  static fromHsl(h: number, s: number, l: number, a = 1): Color {
    const hNorm = ((h % 360) + 360) % 360;
    const sNorm = Color.#clampPercent(s) / 100;
    const lNorm = Color.#clampPercent(l) / 100;

    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
    const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
    const m = lNorm - c / 2;

    let r1: number;
    let g1: number;
    let b1: number;

    if (hNorm < 60) {
      r1 = c;
      g1 = x;
      b1 = 0;
    } else if (hNorm < 120) {
      r1 = x;
      g1 = c;
      b1 = 0;
    } else if (hNorm < 180) {
      r1 = 0;
      g1 = c;
      b1 = x;
    } else if (hNorm < 240) {
      r1 = 0;
      g1 = x;
      b1 = c;
    } else if (hNorm < 300) {
      r1 = x;
      g1 = 0;
      b1 = c;
    } else {
      r1 = c;
      g1 = 0;
      b1 = x;
    }

    return new Color(
      Math.round((r1 + m) * 255),
      Math.round((g1 + m) * 255),
      Math.round((b1 + m) * 255),
      a,
    );
  }

  /**
   * Create from HSV channels.
   * @param h Hue 0–360
   * @param s Saturation 0–100
   * @param v Value 0–100
   * @param a Alpha 0–1
   */
  static fromHsv(h: number, s: number, v: number, a = 1): Color {
    const hNorm = ((h % 360) + 360) % 360;
    const sNorm = Color.#clampPercent(s) / 100;
    const vNorm = Color.#clampPercent(v) / 100;

    const c = vNorm * sNorm;
    const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
    const m = vNorm - c;

    let r1: number;
    let g1: number;
    let b1: number;

    if (hNorm < 60) {
      r1 = c;
      g1 = x;
      b1 = 0;
    } else if (hNorm < 120) {
      r1 = x;
      g1 = c;
      b1 = 0;
    } else if (hNorm < 180) {
      r1 = 0;
      g1 = c;
      b1 = x;
    } else if (hNorm < 240) {
      r1 = 0;
      g1 = x;
      b1 = c;
    } else if (hNorm < 300) {
      r1 = x;
      g1 = 0;
      b1 = c;
    } else {
      r1 = c;
      g1 = 0;
      b1 = x;
    }

    return new Color(
      Math.round((r1 + m) * 255),
      Math.round((g1 + m) * 255),
      Math.round((b1 + m) * 255),
      a,
    );
  }

  // ── Accessors ────────────────────────────────────────────

  get r(): number {
    return this.#r;
  }
  get g(): number {
    return this.#g;
  }
  get b(): number {
    return this.#b;
  }
  get a(): number {
    return this.#a;
  }

  // ── Conversions ──────────────────────────────────────────

  /** Return hex string e.g. `#3b82f6`. Omits alpha if fully opaque. */
  toHex(): string {
    const rHex = this.#r.toString(16).padStart(2, '0');
    const gHex = this.#g.toString(16).padStart(2, '0');
    const bHex = this.#b.toString(16).padStart(2, '0');

    if (this.#a >= 1) {
      return `#${rHex}${gHex}${bHex}`;
    }

    const aHex = Math.round(this.#a * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${rHex}${gHex}${bHex}${aHex}`;
  }

  /** Return `{ r, g, b, a }` with r/g/b 0–255 and a 0–1. */
  toRgb(): { r: number; g: number; b: number; a: number } {
    return { r: this.#r, g: this.#g, b: this.#b, a: this.#a };
  }

  /** Return `{ h, s, l, a }` with h 0–360, s/l 0–100, a 0–1. */
  toHsl(): { h: number; s: number; l: number; a: number } {
    const rNorm = this.#r / 255;
    const gNorm = this.#g / 255;
    const bNorm = this.#b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    // Lightness
    const l = (max + min) / 2;

    // Achromatic
    if (delta === 0) {
      return { h: 0, s: 0, l: Math.round(l * 100), a: this.#a };
    }

    // Saturation
    const s = delta / (1 - Math.abs(2 * l - 1));

    // Hue
    let h: number;
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    return {
      h,
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a: this.#a,
    };
  }

  /** Return `{ h, s, v, a }` with h 0–360, s/v 0–100, a 0–1. */
  toHsv(): { h: number; s: number; v: number; a: number } {
    const rNorm = this.#r / 255;
    const gNorm = this.#g / 255;
    const bNorm = this.#b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    // Value
    const v = max;

    // Achromatic
    if (delta === 0) {
      return { h: 0, s: 0, v: Math.round(v * 100), a: this.#a };
    }

    // Saturation
    const s = delta / max;

    // Hue
    let h: number;
    if (max === rNorm) {
      h = ((gNorm - bNorm) / delta) % 6;
    } else if (max === gNorm) {
      h = (bNorm - rNorm) / delta + 2;
    } else {
      h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    return {
      h,
      s: Math.round(s * 100),
      v: Math.round(v * 100),
      a: this.#a,
    };
  }

  // ── Manipulation ─────────────────────────────────────────

  /** Lighten by factor 0–1 (moves toward white). */
  lighten(factor: number): Color {
    if (factor <= 0) return this;
    const f = Color.#clampFactor(factor);
    const { h, s, l, a } = this.toHsl();
    return Color.fromHsl(h, s, l + (100 - l) * f, a);
  }

  /** Darken by factor 0–1 (moves toward black). */
  darken(factor: number): Color {
    if (factor <= 0) return this;
    const f = Color.#clampFactor(factor);
    const { h, s, l, a } = this.toHsl();
    return Color.fromHsl(h, s, l - l * f, a);
  }

  /** Saturate by factor 0–1. */
  saturate(factor: number): Color {
    const f = Color.#clampFactor(factor);
    const { h, s, l, a } = this.toHsl();
    return Color.fromHsl(h, s + (100 - s) * f, l, a);
  }

  /** Desaturate by factor 0–1. */
  desaturate(factor: number): Color {
    const f = Color.#clampFactor(factor);
    const { h, s, l, a } = this.toHsl();
    return Color.fromHsl(h, s - s * f, l, a);
  }

  /** Rotate hue by degrees (positive or negative). */
  rotateHue(degrees: number): Color {
    const { h, s, l, a } = this.toHsl();
    return Color.fromHsl(h + degrees, s, l, a);
  }

  /** Return a copy with the given alpha (0–1). */
  alpha(value: number): Color {
    return new Color(this.#r, this.#g, this.#b, Color.#clampAlpha(value));
  }

  /**
   * Blend with another color.
   * @param other The color to blend with.
   * @param ratio 0–1; 0 = this color, 1 = other color.
   */
  blend(other: Color, ratio: number): Color {
    const t = Color.#clampFactor(ratio);
    return new Color(
      Math.round(this.#r + (other.#r - this.#r) * t),
      Math.round(this.#g + (other.#g - this.#g) * t),
      Math.round(this.#b + (other.#b - this.#b) * t),
      this.#a + (other.#a - this.#a) * t,
    );
  }

  // ── Contrast & Accessibility ─────────────────────────────

  /**
   * WCAG 2.1 relative luminance.
   * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  luminance(): number {
    const channel = (c: number): number => {
      const sRgb = c / 255;
      return sRgb <= 0.04045 ? sRgb / 12.92 : Math.pow((sRgb + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(this.#r) + 0.7152 * channel(this.#g) + 0.0722 * channel(this.#b);
  }

  /**
   * WCAG contrast ratio against another color.
   * Returns a value between 1 and 21.
   */
  contrastRatio(other: Color): number {
    const l1 = this.luminance();
    const l2 = other.luminance();
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    return Math.round(ratio * 100) / 100;
  }

  /**
   * WCAG conformance level against another color.
   *
   * - `'AAA'`: ratio ≥ 7:1 (or ≥ 4.5:1 for large text)
   * - `'AA'`: ratio ≥ 4.5:1 (or ≥ 3:1 for large text)
   * - `'fail'`: below AA threshold
   *
   * Uses the stricter 4.5:1 / 7:1 thresholds (normal text).
   */
  contrastLevel(other: Color): 'AAA' | 'AA' | 'fail' {
    const ratio = this.contrastRatio(other);
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'fail';
  }

  // ── Palette Generation ───────────────────────────────────

  /**
   * Generate a palette of related colors.
   *
   * @param type Palette type.
   * @param count Number of colors to return (for monochromatic only).
   */
  palette(type: PaletteType, count = 5): Color[] {
    switch (type) {
      case 'complementary':
        return [this, this.rotateHue(180)];
      case 'analogous':
        return [this.rotateHue(-30), this, this.rotateHue(30)];
      case 'triadic':
        return [this, this.rotateHue(120), this.rotateHue(240)];
      case 'split-complementary':
        return [this, this.rotateHue(150), this.rotateHue(210)];
      case 'monochromatic': {
        const result: Color[] = [];
        for (let i = 0; i < count; i++) {
          const factor = i / (count - 1 || 1);
          result.push(this.lighten(factor * 0.5).darken((1 - factor) * 0.5));
        }
        return result;
      }
      default:
        return [this];
    }
  }

  // ── Utilities ────────────────────────────────────────────

  /** Perceived brightness (0–255). Returns true if the color appears light. */
  isLight(): boolean {
    // HSP (Highly Sensitive Perceptual) brightness
    const brightness = Math.sqrt(
      0.299 * this.#r * this.#r + 0.587 * this.#g * this.#g + 0.114 * this.#b * this.#b,
    );
    return brightness > 127.5;
  }

  /** Perceived brightness — inverse of `isLight()`. */
  isDark(): boolean {
    return !this.isLight();
  }

  /** Value equality. */
  equals(other: Color): boolean {
    return (
      this.#r === other.#r && this.#g === other.#g && this.#b === other.#b && this.#a === other.#a
    );
  }

  toString(): string {
    return this.toHex();
  }

  // ── Private helpers ──────────────────────────────────────

  static #clampByte(v: number): number {
    return Math.max(0, Math.min(255, Math.round(v)));
  }

  static #clampAlpha(v: number): number {
    return Math.max(0, Math.min(1, Math.round(v * 1000) / 1000));
  }

  static #clampPercent(v: number): number {
    return Math.max(0, Math.min(100, v));
  }

  static #clampFactor(v: number): number {
    return Math.max(0, Math.min(1, v));
  }
}

/** Palette generation types. */
export type PaletteType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'monochromatic'
  | 'split-complementary';
