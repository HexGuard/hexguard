# @hexguard/angular-color

**Color manipulation utilities and headless color picker state for Angular.** Parse, convert, and manipulate colors across Hex, RGB, HSL, HSV color spaces — with contrast calculation, palette generation, and signal-based color picker state.

**[Deep package notes](docs/packages/angular-color.md)** · **[Demo](/packages/angular-color/demo)**

---

## Problem

Every design tool, theming system, dashboard customizer, and chart configuration UI needs color manipulation: parsing hex input, converting to HSL for sliders, calculating contrast ratios for WCAG compliance, and generating harmonious palettes. Yet every team rebuilds the same color math from scratch — or pulls in heavy JavaScript color libraries that don't integrate with Angular's reactivity model.

**`@hexguard/angular-color`** provides a pure `Color` value object for all color math, plus `injectColorPicker()` for signal-based color picker state that integrates naturally with Angular's template bindings.

## Installation

```bash
pnpm add @hexguard/angular-color
```

## Quickstart

```typescript
import { Color, injectColorPicker } from '@hexguard/angular-color';

// ── Color value object ──────────────────────────
const red = Color.fromHex('#ef4444');
const lighter = red.lighten(0.2);
const hsl = lighter.toHsl(); // { h: 0, s: 71, l: 76, a: 1 }
const ratio = red.contrastRatio(Color.fromHex('#ffffff')); // 3.93
const level = red.contrastLevel(Color.fromHex('#ffffff')); // 'fail'

// ── Headless color picker state ─────────────────
const picker = injectColorPicker({ initialColor: '#3b82f6' });
// Signals that bind directly to template controls:
picker.hue(); // 217
picker.saturation(); // 71
picker.lightness(); // 60
picker.hex(); // '#3b82f6'
```

## API

### `Color` value object

| Member                            | Description                                            |
| --------------------------------- | ------------------------------------------------------ |
| `Color.fromHex(hex)`              | Parse from hex string (`#rgb`, `#rrggbb`, `#rrggbbaa`) |
| `Color.fromRgb(r, g, b, a?)`      | From RGB channels (0–255)                              |
| `Color.fromHsl(h, s, l, a?)`      | From HSL (h 0–360, s/l 0–100)                          |
| `Color.fromHsv(h, s, v, a?)`      | From HSV (h 0–360, s/v 0–100)                          |
| `.toHex()`                        | Hex string with alpha if not opaque                    |
| `.toRgb()`                        | `{ r, g, b, a }`                                       |
| `.toHsl()`                        | `{ h, s, l, a }`                                       |
| `.toHsv()`                        | `{ h, s, v, a }`                                       |
| `.lighten(f)` / `.darken(f)`      | Lighten/darken by factor 0–1                           |
| `.saturate(f)` / `.desaturate(f)` | Saturate/desaturate by factor 0–1                      |
| `.rotateHue(deg)`                 | Rotate hue by degrees                                  |
| `.alpha(v)`                       | Set alpha 0–1                                          |
| `.blend(other, ratio)`            | Blend with another color                               |
| `.contrastRatio(other)`           | WCAG contrast ratio (1–21)                             |
| `.contrastLevel(other)`           | `'AAA'` / `'AA'` / `'fail'`                            |
| `.palette(type)`                  | Generate complementary, analogous, triadic, etc.       |
| `.isLight()` / `.isDark()`        | Perceived brightness check                             |
| `.equals(other)`                  | Value equality                                         |

### `injectColorPicker(config?)`

| Member             | Type                        | Description                      |
| ------------------ | --------------------------- | -------------------------------- |
| `color`            | `Signal<Color>`             | Current color                    |
| `hex`              | `Signal<string>`            | Hex representation               |
| `hue`              | `Signal<number>`            | Hue 0–360                        |
| `saturation`       | `Signal<number>`            | HSL saturation 0–100             |
| `lightness`        | `Signal<number>`            | Lightness 0–100                  |
| `alpha`            | `Signal<number>`            | Alpha 0–1                        |
| `setColor(c)`      | `(string \| Color) => void` | Set color from hex or Color      |
| `setHue(v)`        | `(number) => void`          | Set hue, recompute color         |
| `setSaturation(v)` | `(number) => void`          | Set saturation                   |
| `setLightness(v)`  | `(number) => void`          | Set lightness                    |
| `setAlpha(v)`      | `(number) => void`          | Set alpha                        |
| `setHex(h)`        | `(string) => void`          | Set from hex, recompute channels |

## Scope Boundaries

| Concern                         | Status             |
| ------------------------------- | ------------------ |
| Hex, RGB, HSL, HSV conversion   | ✅                 |
| WCAG contrast ratio & level     | ✅                 |
| Palette generation (5 types)    | ✅                 |
| Signal-based color picker state | ✅                 |
| Alpha/opacity support           | ✅                 |
| Color blindness simulation      | ❌                 |
| Color picker UI component       | ❌ (headless only) |
| Image color extraction          | ❌                 |

## Demo

Visit `/packages/angular-color/demo` to test color conversions, contrast checking, palette generation, and the headless color picker.
