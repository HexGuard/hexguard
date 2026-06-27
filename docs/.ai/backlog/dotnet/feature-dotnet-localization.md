---
id: feature-dotnet-localization
type: feature
status: proposed
created: 2026-06-27
package: 'HexGuard.Localization'
---

# HexGuard.Localization

## Summary

Request localization and i18n conventions for ASP.NET Core — culture detection, content negotiation by locale, and typed resource access. Standardizes localization across HexGuard APIs.

## Goals

- Culture detection from Accept-Language, query string, route, or cookie
- Culture negotiation with fallback chain
- Timezone detection per request
- Typed resource accessor for server-rendered content
- Number/date/currency formatting helpers per culture
- Right-to-left (RTL) culture detection
- Response header injection (Content-Language)

## Non-Goals

- No translation management or resource file generation
- No client-side i18n
- No machine translation

## Proposed Public API

```csharp
// Culture resolution
public interface ICultureResolver
{
    CultureInfo Resolve(HttpContext context);
    IReadOnlyList<CultureInfo> GetSupportedCultures();
}

// Timezone resolution
public interface ITimezoneResolver
{
    TimeZoneInfo Resolve(HttpContext context);
}

// Typed localizer
public interface ITypedLocalizer<T>
{
    string Get(string key, params object[] args);
    string Get(string key, CultureInfo culture, params object[] args);
}

// Registration
public static IServiceCollection AddHexGuardLocalization(this IServiceCollection services,
    Action<LocalizationOptions> configure);

public sealed class LocalizationOptions
{
    public IReadOnlyList<string> SupportedCultures { get; set; } = ["en"];
    public string DefaultCulture { get; set; } = "en";
    public CultureDetectionSource[] DetectionSources { get; set; }
}

public enum CultureDetectionSource { AcceptLanguageHeader, QueryString, Route, Cookie }
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Localization/` with `.csproj`.
2. Implement culture/Timezone detection and middleware.
3. Add typed localizer and formatting helpers.
4. Add xunit tests.
5. Register in `HexGuard.slnx`.
