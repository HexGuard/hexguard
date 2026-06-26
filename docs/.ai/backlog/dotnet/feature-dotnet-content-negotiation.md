---
id: feature-dotnet-content-negotiation
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.ContentNegotiation
---

# HexGuard.ContentNegotiation

## Summary

Standard content negotiation helpers for ASP.NET Core Minimal APIs — parse the `Accept` header, negotiate the response format (`json`, `xml`, `csv`, `yaml`, or custom), and provide endpoint-level format restrictions. ASP.NET Core's built-in content negotiation is tied to its `OutputFormatter` system, which requires formatter registration and doesn't work cleanly with Minimal API `Results.Ok()` patterns.

**Competition check:** ASP.NET Core's `AddNewtonsoftJson()` / `AddXmlSerializerFormatters()` cover content negotiation for controllers but not for Minimal APIs' `Results.Json()` pattern. No package provides lightweight `Accept` header negotiation as a Minimal API endpoint filter.

## Why Wide Adoption

APIs that serve multiple clients (web, mobile, CI tools, data importers) often need to return different formats. A single API may serve JSON for the Angular SPA, CSV for export, and XML for legacy integration. Clean content negotiation makes this declarative.

## Goals

1. Provide `NegotiateContent()` endpoint extension that auto-selects response format based on `Accept` header.
2. Support `json`, `xml`, `csv` formats out of the box.
3. Support custom format handlers via `IResponseFormatHandler` interface.
4. Provide `ProducesJson()`, `ProducesCsv()`, `ProducesXml()` endpoint restrictions.
5. Provide `ContentNegotiationFailed` — returns `406 Not Acceptable` when no matching format.
6. Pure middleware — no external dependencies beyond ASP.NET Core and `System.Text.Json`.

## Non-Goals

- No YAML support (add as a custom handler if needed).
- No formatter pipeline like ASP.NET Core's `OutputFormatter` — simpler per-format handler.
- No `Accept-Charset` or `Accept-Language` negotiation.

## Proposed Public API

```csharp
// ── Handler Interface ─────────────────────────────────────

public interface IResponseFormatHandler
{
    string ContentType { get; }                       // "application/json"
    string FormatName { get; }                        // "json"
    Task SerializeAsync<T>(Stream body, T value, CancellationToken ct);
}

// Built-in handlers: JsonFormatHandler, XmlFormatHandler, CsvFormatHandler

// ── Endpoint Extension ────────────────────────────────────

public static class ContentNegotiationExtensions
{
    // Enable content negotiation for an endpoint
    public static TBuilder NegotiateContent<TBuilder>(this TBuilder builder,
        Action<ContentNegotiationOptions>? configure = null)
        where TBuilder : IEndpointConventionBuilder;

    // Restrict formats
    public static TBuilder ProducesJson<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder;
    public static TBuilder ProducesCsv<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder;
    public static TBuilder ProducesXml<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder;
}

public sealed class ContentNegotiationOptions
{
    public string DefaultFormat { get; set; } = "json";
    public string[] SupportedFormats { get; set; } = ["json", "xml", "csv"];
    public bool Return406OnUnsupported { get; set; } = true;
}

// ── Registration ──────────────────────────────────────────

public static class ContentNegotiationServiceExtensions
{
    public static IServiceCollection AddContentNegotiation(
        this IServiceCollection services,
        Action<ContentNegotiationOptions>? configure = null);
}

// ── Formatters ────────────────────────────────────────────

// JsonFormatHandler (default, uses System.Text.Json)
public sealed class JsonFormatHandler : IResponseFormatHandler { ... }

// XmlFormatHandler (uses System.Text.Json serialization wrapped in XML, or opt-in to XmlSerializer)
public sealed class XmlFormatHandler : IResponseFormatHandler { ... }

// CsvFormatHandler (header row + data rows from IEnumerable<T>)
public sealed class CsvFormatHandler : IResponseFormatHandler { ... }

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddContentNegotiation(options => {
    options.SupportedFormats = ["json", "csv"];
});

app.MapGet("/items", GetItems)
   .NegotiateContent()
   .ProducesJson()       // Only json and csv
   .ProducesCsv();

app.MapGet("/users", GetUsers)
   .NegotiateContent();  // All configured formats

// Client-supplied Accept header determines format:
// Accept: application/json → JSON
// Accept: text/csv → CSV
// Accept: application/xml → 406 Not Acceptable (not in SupportedFormats)
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ContentNegotiation/` with standard `.csproj`.
2. Implement `IResponseFormatHandler` interface.
3. Implement `JsonFormatHandler`, `XmlFormatHandler`, `CsvFormatHandler`.
4. Implement content negotiation endpoint filter.
5. Implement `NegotiateContent()`, `ProducesJson()`, `ProducesCsv()`, `ProducesXml()` extensions.
6. Add `InternalsVisibleTo` for test project.
7. Create test project with xUnit + `WebApplicationFactory` integration tests.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet package `HexGuard.ContentNegotiation`.
