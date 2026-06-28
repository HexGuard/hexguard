---
id: feature-blazor-csv
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Csv
---

# HexGuard.Blazor.Csv

## Summary

CSV parsing/generation for Blazor â€” parse CSV text to typed records, generate CSV from collections. Blazor counterpart to `@hexguard/angular-csv`.

**Competition check:** Zero Blazor CSV packages exist.


## Goals

- Provide reactive headless state for Blazor components
- SSR-safe with interactive server mode compatibility
- Minimal JavaScript interop, preferring native Blazor patterns


## Non-Goals

- No rendered UI components — headless state and services only
- No JavaScript library dependencies
- No server-side API integration (client-side state management only)

## Proposed Public API

```csharp
public static class CsvHelper
{
    public static IReadOnlyList<T> Parse<T>(string csv, CsvOptions? options = null)
        where T : new();
    public static string Generate<T>(IEnumerable<T> records, CsvOptions? options = null);
}

public sealed record CsvOptions
{
    public char Delimiter { get; init; } = ',';
    public bool HasHeader { get; init; } = true;
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Csv/` Razor class library.
2. Implement parse/generate.
3. Test with xUnit.
4. Publish as NuGet.
