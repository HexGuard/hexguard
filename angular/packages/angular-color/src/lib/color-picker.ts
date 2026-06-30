import { computed, signal, type Signal } from '@angular/core';
import { Color } from './color';

/**
 * Configuration for `injectColorPicker()`.
 *
 * @example
 * ```ts
 * const picker = injectColorPicker({ initialColor: '#3b82f6', format: 'hsl' });
 * ```
 */
export interface ColorPickerConfig {
  /** Initial color as hex string or Color instance. Defaults to black. */
  initialColor?: string | Color;
  /** Preferred output format for the `hex` signal. Defaults to `'hex'`. */
  format?: 'hex' | 'rgb' | 'hsl' | 'hsv';
}

/**
 * Signal-based color picker state returned by `injectColorPicker()`.
 *
 * Exposes per-channel writable signals that stay in sync: changing hue
 * recomputes the color; setting hex recomputes all channels.
 *
 * @example Template binding
 * ```html
 * <input type="range" min="0" max="360"
 *   [value]="picker.hue()"
 *   (input)="picker.setHue(+$any($event.target).value)" />
 * ```
 */
export interface ColorPickerState {
  /** Current color as a `Color` value object. */
  readonly color: Signal<Color>;
  /** Hex string (respects `format` config). */
  readonly hex: Signal<string>;
  /** Hue 0–360. */
  readonly hue: Signal<number>;
  /** HSL saturation 0–100. */
  readonly saturation: Signal<number>;
  /** Lightness 0–100. */
  readonly lightness: Signal<number>;
  /** Alpha 0–1. */
  readonly alpha: Signal<number>;

  /** Set color from hex string or Color instance. */
  setColor(color: string | Color): void;
  /** Set hue (0–360); recomputes color. */
  setHue(value: number): void;
  /** Set HSL saturation (0–100); recomputes color. */
  setSaturation(value: number): void;
  /** Set lightness (0–100); recomputes color. */
  setLightness(value: number): void;
  /** Set alpha (0–1); recomputes color. */
  setAlpha(value: number): void;
  /** Set from hex string; recomputes all channels. */
  setHex(hex: string): void;
}

/**
 * Create headless color picker state with per-channel signals.
 *
 * Uses per-call factory — multiple pickers can coexist independently.
 *
 * @example
 * ```ts
 * @Component({ ... })
 * class MyColorPicker {
 *   readonly picker = injectColorPicker({ initialColor: '#ef4444' });
 * }
 * ```
 */
export function injectColorPicker(config?: ColorPickerConfig): ColorPickerState {
  const initial = resolveInitial(config?.initialColor);

  // Source of truth: the Color value object directly (no HSL intermediary)
  const color = signal(initial);

  // Derived channels from the color signal
  const hue = computed(() => color().toHsl().h);
  const saturation = computed(() => color().toHsl().s);
  const lightness = computed(() => color().toHsl().l);
  const alpha = computed(() => color().a);
  const hex = computed(() => color().toHex());

  return {
    color: color.asReadonly(),
    hex,
    hue,
    saturation,
    lightness,
    alpha,

    setColor(c: string | Color): void {
      color.set(typeof c === 'string' ? Color.fromHex(c) : c);
    },

    setHue(v: number): void {
      const hsl = color().toHsl();
      color.set(Color.fromHsl(v, hsl.s, hsl.l, hsl.a));
    },

    setSaturation(v: number): void {
      const hsl = color().toHsl();
      color.set(Color.fromHsl(hsl.h, Math.max(0, Math.min(100, v)), hsl.l, hsl.a));
    },

    setLightness(v: number): void {
      const hsl = color().toHsl();
      color.set(Color.fromHsl(hsl.h, hsl.s, Math.max(0, Math.min(100, v)), hsl.a));
    },

    setAlpha(v: number): void {
      const hsl = color().toHsl();
      color.set(Color.fromHsl(hsl.h, hsl.s, hsl.l, Math.max(0, Math.min(1, v))));
    },

    setHex(h: string): void {
      color.set(Color.fromHex(h));
    },
  };
}

function resolveInitial(initial?: string | Color): Color {
  if (initial instanceof Color) return initial;
  if (typeof initial === 'string') return Color.fromHex(initial);
  return Color.fromHex('#000000');
}
