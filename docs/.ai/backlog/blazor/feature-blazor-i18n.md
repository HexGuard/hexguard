---
id: feature-blazor-i18n
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.I18n'
---

# HexGuard.Blazor.I18n

## Summary

Internationalization helpers for Blazor — runtime culture switching, resource-based translations, ICU message formatting, and RTL support. For multi-language Blazor apps.

## Goals

- Runtime culture switching without page reload
- Resource file (.resx) and JSON translation support
- `ITranslator` service with key-based lookup
- ICU MessageFormat for plural, select, gender
- Number/date/currency formatting per culture
- RTL detection with layout direction signal
- Culture persistence (cookie, localStorage, URL)
- Lazy-loaded translation assemblies

## Non-Goals

- No translation management UI
- No machine translation
- No rendered i18n components

## Proposed Public API

```csharp
public interface ITranslator
{
    string T(string key, params object?[] args);
    string T(string key, CultureInfo culture, params object?[] args);
    string Format(string message, Dictionary<string, object>? args = null);
    bool HasKey(string key);
}

public interface ICultureManager
{
    CultureInfo CurrentCulture { get; }
    CultureInfo CurrentUiCulture { get; }
    CultureDirection Direction { get; }
    IReadOnlyList<CultureInfo> SupportedCultures { get; }
    event Action<CultureInfo>? CultureChanged;
    Task SetCultureAsync(string culture);
}

public enum CultureDirection { Ltr, Rtl }

// Usage in component
@inject ITranslator T
@inject ICultureManager Culture

<p>@T.T("welcome", UserName)</p>
<p dir="@Culture.Direction.ToString().ToLower()">
    @T.Format("{count, plural, one {# item} other {# items}}", new() { ["count"] = 5 })
</p>
<select @bind="selectedCulture" @bind:after="ChangeCulture">
    @foreach (var c in Culture.SupportedCultures)
    {
        <option value="@c.Name">@c.NativeName</option>
    }
</select>

// Registration
builder.Services.AddBlazorI18n(options =>
{
    options.DefaultCulture = "en";
    options.SupportedCultures = ["en", "fr", "ar", "ja"];
    options.TranslationSource = TranslationSource.Resx;
    options.AutoDetectCulture = true; // from Accept-Language header
});
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.I18n/` with `.csproj` (RCL).
2. Implement culture switching, translation service, ICU formatting, RTL detection.
3. Add resource loading, culture persistence, auto-detection.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
