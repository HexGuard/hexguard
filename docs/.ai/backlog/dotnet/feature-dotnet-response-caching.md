---
id: feature-dotnet-response-caching
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.ResponseCaching
---

# HexGuard.ResponseCaching

## Summary

Response caching middleware with ETag/If-None-Match support for ASP.NET Core — cache API responses on the server, generate ETags from response content, return `304 Not Modified` on conditional requests, and simplify `Cache-Control` header configuration. ASP.NET Core's built-in `ResponseCachingMiddleware` lacks ETag support and requires manual `[ResponseCache]` attribute wiring.

**Competition check:** ASP.NET Core's built-in `AddResponseCaching()` + `[ResponseCache]` covers basic server-side caching but does **not** support ETag generation or `If-None-Match`/`If-Modified-Since` conditional requests. `Hellang.Caching` targets output caching but is unmaintained. **HexGuard.ResponseCaching fills the ETag+304 gap** that ASP.NET Core left open.

## Why Wide Adoption

ETag-based conditional responses reduce bandwidth and server load: clients send `If-None-Match: "xyz"`, and the server returns `304 Not Modified` with an empty body when the resource hasn't changed. This is standard for API resources that are read often but change infrequently (reference data, configuration, user profiles).

## Goals

1. Provide `UseResponseCaching()` middleware with ETag auto-generation from response content hash.
2. Return `304 Not Modified` when `If-None-Match` matches the current ETag.
3. Provide `Cache()` endpoint extension for declarative caching configuration.
4. Support `VaryByHeader`, `VaryByQueryParam`, and `VaryByAccept` options.
5. Support `NoCache()` endpoint opt-out.
6. Support configurable `Cache-Control` header (public/private, max-age, s-maxage).

## Non-Goals

- No distributed cache back-end (uses ASP.NET Core's `IDistributedCache` if configured; otherwise in-memory).
- No cache invalidation API (consumer calls `HttpContext.Features.Get<IResponseCacheFeature>().Remove(key)` if needed).
- No response compression integration (compose with `HexGuard.ApiCompression` or middleware ordering).

## Proposed Public API

```csharp
// ── Options ───────────────────────────────────────────────

public sealed class ResponseCachingOptions
{
    public TimeSpan DefaultMaxAge { get; set; } = TimeSpan.FromMinutes(5);
    public bool UseETag { get; set; } = true;
    public string ETagAlgorithm { get; set; } = "SHA256";   // SHA256, MD5
    public string[] DefaultVaryByHeaders { get; set; } = [];
    public string[] DefaultVaryByQueryParams { get; set; } = [];
}

// ── Endpoint Extension ────────────────────────────────────

public static class ResponseCachingExtensions
{
    // Configure caching for an endpoint
    public static TBuilder Cache<TBuilder>(this TBuilder builder,
        string? ttl = null,                       // "00:10:00" or null for default
        bool useETag = true,
        string[]? varyByHeaders = null,
        string[]? varyByQueryParams = null,
        bool varyByAccept = false) where TBuilder : IEndpointConventionBuilder;

    // Opt-out
    public static TBuilder NoCache<TBuilder>(this TBuilder builder)
        where TBuilder : IEndpointConventionBuilder;
}

// ── Middleware ─────────────────────────────────────────────

public static class ResponseCachingAppExtensions
{
    public static IApplicationBuilder UseResponseCaching(
        this IApplicationBuilder app,
        Action<ResponseCachingOptions>? configure = null);

    public static IServiceCollection AddResponseCaching(
        this IServiceCollection services,
        Action<ResponseCachingOptions>? configure = null);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddResponseCaching(options => {
    options.DefaultMaxAge = TimeSpan.FromMinutes(10);
    options.UseETag = true;
});

app.UseResponseCaching();

// Endpoints
app.MapGet("/reference-data/countries", GetCountries)
   .Cache(ttl: "01:00:00", varyByAccept: true);

app.MapGet("/users/{id}", GetUser)
   .Cache(ttl: "00:01:00");     // Short TTL for user data

app.MapGet("/health", () => Results.Ok(new { status = "healthy" }))
   .NoCache();                   // Never cache health checks

// Returns: ETag: "sha256-abc123..."
// On re-request with If-None-Match: "sha256-abc123..." → 304 Not Modified
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.ResponseCaching/` with standard `.csproj`.
2. Implement `ResponseCachingOptions`.
3. Implement `ResponseCachingMiddleware` — content hashing, ETag generation, 304 handling.
4. Implement `Cache()`/`NoCache()` endpoint extensions.
5. Add `InternalsVisibleTo` for test project.
6. Create test project with xUnit + `WebApplicationFactory` integration tests (verify 304, vary-by, cache-control headers).
7. Register in `HexGuard.slnx`.
8. Publish as NuGet package `HexGuard.ResponseCaching`.
