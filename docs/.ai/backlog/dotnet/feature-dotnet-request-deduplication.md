---
id: feature-dotnet-request-deduplication
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.RequestDeduplication
---

# HexGuard.RequestDeduplication

## Summary

Middleware that deduplicates identical concurrent requests to ASP.NET Core endpoints. When multiple clients send the same request simultaneously (same HTTP method, path, and body), the first request executes and subsequent identical requests wait for and return the first result. This reduces database and compute load during traffic spikes, cache-busting events, and release rollouts.

**Competition check:** No standalone ASP.NET Core request deduplication middleware exists. Some API gateways (Kong, Envoy) provide this at the edge, but on-prem/hybrid APIs need server-side deduplication. Application-level deduplication (like idempotency) solves a different problem — preventing duplicate side effects, not reducing concurrent identical reads.

## Why Wide Adoption

Every production API behind a load balancer or CDN sees duplicate requests — 100 clients refresh simultaneously after a deployment, retry logic fires multiple identical requests, WebSocket reconnections trigger the same initial fetch. Without deduplication, each request hits the database independently. With deduplication, one request executes and the rest piggyback.

## Goals

1. Provide `UseRequestDeduplication()` middleware that captures concurrent identical requests.
2. Use configurable key generation (method + path + body hash by default).
3. Support configurable deduplication window — how long a result is cached for piggybacking.
4. Support exclude paths (skip for mutation endpoints, idempotency-managed endpoints).
5. Return the cached result to piggybacking requests — no re-execution.
6. Pure middleware — no external dependencies.

## Non-Goals

- No distributed deduplication across multiple server instances (use Redis-backed `IDistributedCache` if needed).
- Noidempotency — this is for **read-heavy** and compute-heavy GET requests, not for preventing duplicate side effects.
- No response streaming support — deduplication buffers the response body.

## Proposed Public API

```csharp
// ── Options ───────────────────────────────────────────────

public sealed class RequestDeduplicationOptions
{
    public Func<HttpContext, string> KeyGenerator { get; set; }
        = DefaultKeyGenerator;
    public TimeSpan DeduplicateDuration { get; set; } = TimeSpan.FromSeconds(5);
    public string[] ExcludePaths { get; set; } = [];
    public bool ExcludeMutationMethods { get; set; } = true;  // POST, PUT, PATCH, DELETE
}

// ── Middleware ─────────────────────────────────────────────

public static class RequestDeduplicationExtensions
{
    public static IApplicationBuilder UseRequestDeduplication(
        this IApplicationBuilder app,
        Action<RequestDeduplicationOptions>? configure = null);

    public static IServiceCollection AddRequestDeduplication(
        this IServiceCollection services,
        Action<RequestDeduplicationOptions>? configure = null);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddRequestDeduplication(options => {
    options.DeduplicateDuration = TimeSpan.FromSeconds(3);
    options.ExcludePaths = ["/health", "/metrics"];
});

app.UseRequestDeduplication();

// Without deduplication: 100 concurrent GET /api/products → 100 DB queries
// With deduplication:    100 concurrent GET /api/products → 1 DB query, 99 piggyback
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.RequestDeduplication/` with standard `.csproj`.
2. Implement `RequestDeduplicationOptions` with default key generator (method + path + SHA256 body hash).
3. Implement `RequestDeduplicationMiddleware` — uses `ConcurrentDictionary` + `TaskCompletionSource` to coordinate concurrent requests.
4. Add response buffering to capture and replay the response.
5. Add `InternalsVisibleTo` for test project.
6. Create test project with xUnit + `WebApplicationFactory` integration tests (verify deduplication, expiration, exclusion).
7. Register in `HexGuard.slnx`.
8. Publish as NuGet package `HexGuard.RequestDeduplication`.
