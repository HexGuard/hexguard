# @hexguard/angular-color — Deep Package Notes

Color manipulation utilities and headless color picker state for Angular: parse, convert, and manipulate colors across Hex, RGB, HSL, HSV color spaces with contrast calculation, palette generation, and signal-based color picker state.

## Problem

Every design tool, theming system, dashboard customizer, and chart configuration UI needs color manipulation: parsing hex input, converting to HSL for sliders, calculating contrast ratios for WCAG compliance, and generating harmonious palettes. Yet every team rebuilds the same color math from scratch — or pulls in heavy JavaScript color libraries that don't integrate with Angular's reactivity model.

**`@hexguard/angular-color`** provides a pure `Color` value object for all color math, plus `injectColorPicker()` for signal-based color picker state that integrates naturally with Angular's template bindings.

## API

### `Color` value object

Immutable class with:

| Category          | Members                                                                                                               |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Factories**     | `Color.fromHex()`, `Color.fromRgb()`, `Color.fromHsl()`, `Color.fromHsv()`                                            |
| **Conversions**   | `.toHex()`, `.toRgb()`, `.toHsl()`, `.toHsv()`                                                                        |
| **Manipulation**  | `.lighten(f)`, `.darken(f)`, `.saturate(f)`, `.desaturate(f)`, `.rotateHue(deg)`, `.alpha(v)`, `.blend(other, ratio)` |
| **Accessibility** | `.contrastRatio(other)`, `.contrastLevel(other)` → `'AAA'` / `'AA'` / `'fail'`, `.luminance()`                        |
| **Palettes**      | `.palette(type, count?)` — complementary, analogous, triadic, monochromatic, split-complementary                      |
| **Utilities**     | `.isLight()`, `.isDark()`, `.equals(other)`, `.toString()`                                                            |

### `injectColorPicker(config?)`

Per-call factory (not singleton — multiple pickers can coexist).

| Member             | Type                        | Description           |
| ------------------ | --------------------------- | --------------------- |
| `color`            | `Signal<Color>`             | Current color         |
| `hex`              | `Signal<string>`            | Hex representation    |
| `hue`              | `Signal<number>`            | Hue 0–360             |
| `saturation`       | `Signal<number>`            | HSL saturation 0–100  |
| `lightness`        | `Signal<number>`            | Lightness 0–100       |
| `alpha`            | `Signal<number>`            | Alpha 0–1             |
| `setColor(c)`      | `(string \| Color) => void` | Set from hex or Color |
| `setHue(v)`        | `(number) => void`          | Set hue               |
| `setSaturation(v)` | `(number) => void`          | Set saturation        |
| `setLightness(v)`  | `(number) => void`          | Set lightness         |
| `setAlpha(v)`      | `(number) => void`          | Set alpha             |
| `setHex(h)`        | `(string) => void`          | Set from hex          |

## Design Decisions

1. **`Color` is an immutable value object.** All manipulation methods return new instances. Internal storage is RGBA for precision — HSL conversion is only done on demand.

2. **`injectColorPicker` stores `Color` directly as source of truth**, not HSL channels. HSL channels are derived signals from the color. When channel setters are called, a new Color is built from HSL and set on the color signal. This avoids precision loss from hex→HSL→hex round-trips.

3. **No singleton — per-call factory.** Multiple color pickers can coexist independently (foreground/background pickers, etc.).

4. **WCAG contrast uses relative luminance** per WCAG 2.1 spec, not a simplified approximation.

5. **Palette generation is deterministic** — fixed angle rotations, no randomness.

## Assessment

| Area                   | Finding                                                                                                                                                                                                                                                               |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API Design             | Narrow `public-api.ts` — 2 classes/interfaces, 1 factory. JSDoc on all exports.                                                                                                                                                                                       |
| Implementation Quality | Signal-first, immutable value object, no browser globals, no side effects.                                                                                                                                                                                            |
| Tests                  | 80 tests: hex parsing (6/8-digit, shorthand, invalid, whitespace), RGB/HSL/HSV round-trips, manipulation edge cases (lighten(0), darken(1)), WCAG contrast (black/white=21, symmetry), palettes (all 5 types), picker channel consistency, multi-picker independence. |
| Demo                   | HSL sliders with live swatch, hex input, WCAG contrast checker (two colors), analogous palette display. All interactive elements have `data-testid` attributes.                                                                                                       |
| Build                  | `ng build` succeeds in partial compilation mode. Tarball contains LICENSE, README, ESM, type declarations.                                                                                                                                                            |

## Potential Improvements

| Area  | Suggestion                                                                          | Priority |
| ----- | ----------------------------------------------------------------------------------- | -------- |
| API   | Add `Color.parse(input)` that auto-detects format (hex, rgb(), hsl(), named colors) | Low      |
| API   | Add named CSS color parsing (147 W3C named colors)                                  | Low      |
| Tests | Add integration test with matchMedia mock for system preference detection           | Low      |

## Code Examples

### Parse and convert

```typescript
import { Color } from '@hexguard/angular-color';

const blue = Color.fromHex('#3b82f6');
const hsl = blue.toHsl(); // { h: 217, s: 71, l: 60, a: 1 }
const lighter = blue.lighten(0.2);
const complementary = blue.rotateHue(180);
```

### WCAG contrast check

```typescript
const ratio = Color.fromHex('#ef4444').contrastRatio(Color.fromHex('#ffffff'));
// 3.93 — fails WCAG AA for normal text
const level = Color.fromHex('#ef4444').contrastLevel(Color.fromHex('#ffffff'));
// 'fail'
```

### Headless color picker

```typescript
import { injectColorPicker } from '@hexguard/angular-color';

@Component({ ... })
class MyColorPicker {
  readonly picker = injectColorPicker({ initialColor: '#3b82f6' });
}
```

```html
<input
  type="range"
  min="0"
  max="360"
  [value]="picker.hue()"
  (input)="picker.setHue(+$any($event.target).value)"
/>
<div [style.background-color]="picker.hex()">{{ picker.hex() }}</div>
```

## Related Resources

- [Package README](../../angular/packages/angular-color/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-color/)
- [Source Code](../../angular/packages/angular-color/src/)
