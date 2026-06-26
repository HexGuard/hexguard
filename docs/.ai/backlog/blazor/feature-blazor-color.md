---
id: feature-blazor-color
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.Color
---

# HexGuard.Blazor.Color

## Summary

Color manipulation utilities for Blazor — parse, convert, and manipulate colors across Hex, RGB, HSL, HSV color spaces with contrast calculation and palette generation. Every theming UI, dashboard customizer, and accessibility checker needs color manipulation, yet every team rebuilds the same color math.

**Angular counterpart:** `@hexguard/angular-color`

**Competition check (NuGet):** No Blazor color utility packages exist. .NET color libraries exist but are not Blazor-specific and lack the C#-friendly value-object design.

## Why Wide Adoption

Theming UIs (dark/light mode customizers), chart builders, dashboard personalization, and accessibility checkers all need color parsing, conversion, contrast calculation, and palette generation. These are pure math — no JS interop, no browser APIs.

## Goals

1. Provide `HexGuardColor` value object with parsing from hex/RGB/HSL/HSV and conversion between spaces.
2. Provide contrast ratio calculation (WCAG AA/AAA).
3. Provide palette generation (complementary, analogous, triadic).
4. Provide manipulation methods (lighten, darken, saturate, desaturate, rotateHue, blend).
5. Pure C# — no JS interop required.

## Proposed Public API

```csharp
public sealed record HexGuardColor
{
    public static HexGuardColor FromHex(string hex);
    public static HexGuardColor FromRgb(int r, int g, int b, double a = 1);
    public static HexGuardColor FromHsl(double h, double s, double l, double a = 1);
    public static HexGuardColor FromHsv(double h, double s, double v, double a = 1);

    public string ToHex();
    public (int R, int G, int B, double A) ToRgb();
    public (double H, double S, double L, double A) ToHsl();
    public (double H, double S, double V, double A) ToHsv();

    public HexGuardColor Lighten(double factor);       // 0–1
    public HexGuardColor Darken(double factor);        // 0–1
    public HexGuardColor Saturate(double factor);
    public HexGuardColor Desaturate(double factor);
    public HexGuardColor RotateHue(double degrees);
    public HexGuardColor WithAlpha(double alpha);
    public HexGuardColor Blend(HexGuardColor other, double ratio);

    public double ContrastRatio(HexGuardColor other);
    public WcagLevel ContrastLevel(HexGuardColor other);
    public bool IsLight();
    public bool IsDark();

    public HexGuardColor[] Palette(PaletteType type);
}

public enum WcagLevel { Fail, AA, AAA }
public enum PaletteType { Complementary, Analogous, Triadic, Monochromatic, SplitComplementary }
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Color/` Razor class library.
2. Implement `HexGuardColor` value object with all conversions and manipulations.
3. Implement contrast ratio and WCAG level calculation.
4. Implement palette generation.
5. Test with xUnit (pure math — no Blazor DI needed).
6. Publish as NuGet.
