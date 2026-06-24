---
id: feature-blazor-media-query
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.MediaQuery
---

# HexGuard.Blazor.MediaQuery

## Summary

A generic CSS media query evaluation service for Blazor — evaluate any `window.matchMedia` query from C#, react to changes, and respond dynamically. Covers `prefers-color-scheme` (dark mode), `orientation` (portrait/landscape), `prefers-contrast`, `pointer` (fine/coarse), and any custom query.

**Competition check (NuGet):** Zero packages for generic media query evaluation. `BreakpointObserver` covers named breakpoints but not arbitrary queries. **Greenfield.**

## Why Wide Adoption

Blazor apps need to react to system-level CSS properties that can't be detected from Blazor alone: dark mode (`prefers-color-scheme: dark`), device orientation (`orientation: landscape`), touch vs mouse (`pointer: coarse`), and high contrast (`prefers-contrast: more`). Every responsive or theming-capable Blazor app needs this. Unlike `BreakpointObserver` (focused on named viewport thresholds), this is a general-purpose media query utility.

## Goals

1. Provide `MediaQueryService` with `Evaluate(query)` returning `bool` and `Observe(query, callback)` for reactive changes.
2. Support any valid CSS media query string.
3. Provide convenience properties: `IsDarkMode`, `IsLandscape`, `IsTouchDevice`.
4. Automatic cleanup on component disposal.
5. Single JS interop module shared with BreakpointObserver where possible.

## Non-Goals

- No theming engine — just media query evaluation.
- No breakpoint naming conventions — use BreakpointObserver for that.

## Proposed Public API

```csharp
public sealed class MediaQueryService : IAsyncDisposable
{
    public Task<bool> EvaluateAsync(string query);
    public Task ObserveAsync(string query, Action<bool> onChange);
    public Task UnobserveAsync(string query);

    // Convenience properties (updated reactively)
    public bool IsDarkMode { get; private set; }
    public bool IsLandscape { get; private set; }
    public bool IsTouchDevice { get; private set; }

    public event Action? OnChanged;
}

public static class MediaQueryExtensions
{
    public static IServiceCollection AddBlazorMediaQuery(this IServiceCollection services);
}
```

## Implementation Plan

1. Create Razor class library project.
2. Create `mediaQuery.js` module.
3. Implement `MediaQueryService`.
4. Test with bUnit.
