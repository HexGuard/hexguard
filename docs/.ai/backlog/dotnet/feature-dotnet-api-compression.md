---
id: feature-dotnet-api-compression
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.ApiCompression
---

# HexGuard.ApiCompression

## Summary

Configurable response compression middleware for ASP.NET Core — Brotli and GZip compression with MIME type filtering, minimum response size, and configurable compression level. ASP.NET Core's built-in `ResponseCompressionMiddleware` is basic; this package adds MIME-type-based selective compression, per-endpoint overrides, and compression-quality tuning.

**Competition check:** ASP.NET Core's built-in `AddResponseCompression()` covers basic scenarios. Additional packages exist but are unmaintained or overly complex. **HexGuard.ApiCompression provides opinionated defaults with simple configuration.**

## Why Wide Adoption

API response compression reduces bandwidth and latency for JSON-heavy responses. Brotli (generally preferred over GZip for text content) requires explicit configuration. Cloud providers (Cloudflare, AWS CloudFront) can compress at the edge, but on-prem, hybrid, or direct-to-client deployments need server-side compression.

## Goals

1. Provide `AddApiCompression()` — registers Brotli and GZip providers with configurable options.
2. Support MIME type filters — only compress JSON, XML, HTML, etc.
3. Support configurable minimum response size (skip compression for tiny responses).
4. Support per-endpoint compression opt-out via `[SkipCompression]` attribute or extension method.
5. Support compression-level configuration per provider.
6. Expose `ICompressionContext` for checking if the response was compressed.

## Non-Goals

- No pre-compression or static file compression (use `app.UseStaticFiles()` for that).
- No dynamic compression-level negotiation.

## Decisions

1. **Middleware-based**: Wraps ASP.NET Core's built-in compression infrastructure with opinionated defaults.
2. **Brotli preferred**: Brotli is the default provider at quality level 5 (good compression/speed tradeoff).
3. **MIME whitelist**: Only compress known text-based MIME types by default.

## Proposed Public API

```csharp
// ── Registration ──────────────────────────────────────────

public static class ApiCompressionExtensions
{
    public static IServiceCollection AddApiCompression(
        this IServiceCollection services,
        Action<ApiCompressionOptions>? configure = null);

    public static IApplicationBuilder UseApiCompression(
        this IApplicationBuilder app);
}

public sealed class ApiCompressionOptions
{
    public int MinimumResponseSize { get; set; } = 1024;  // bytes
    public CompressionLevel Level { get; set; } = CompressionLevel.Optimal;
    public string[] MimeTypes { get; set; } = [
        "application/json",
        "application/problem+json",
        "text/plain",
        "text/html",
        "text/xml",
        "application/xml"
    ];
    public bool EnableForHttps { get; set; } = true;
}

// ── Per-endpoint opt-out ──────────────────────────────────

public sealed class SkipCompressionAttribute : Attribute;

// Minimal API extension:
app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
   .SkipCompression();

// ── Context ───────────────────────────────────────────────

public interface ICompressionContext
{
    bool IsCompressed { get; }
    string? Provider { get; }      // "br", "gzip", null
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddApiCompression(options =>
{
    options.MinimumResponseSize = 2048;
    options.Level = CompressionLevel.Fastest;
    options.MimeTypes = ["application/json", "application/problem+json"];
});

app.UseApiCompression();
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ApiCompression/` with standard `.csproj`.
2. Implement `ApiCompressionOptions`.
3. Implement compression middleware wrapping ASP.NET Core's providers.
4. Implement `SkipCompression` extension for Minimal APIs and controllers.
5. Implement `ICompressionContext`.
6. Add `InternalsVisibleTo` for test project.
7. Create test project with xUnit + `WebApplicationFactory` integration tests.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet package `HexGuard.ApiCompression`.
