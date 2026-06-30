/**
 * Public API for `@hexguard/angular-color`.
 *
 * Provides a headless `Color` value object for parsing, converting, and
 * manipulating colors across Hex, RGB, HSL, and HSV color spaces — plus
 * `injectColorPicker()` for signal-based color picker state.
 */
export { Color } from './lib/color';
export type { PaletteType } from './lib/color';
export { injectColorPicker } from './lib/color-picker';
export type { ColorPickerConfig, ColorPickerState } from './lib/color-picker';
