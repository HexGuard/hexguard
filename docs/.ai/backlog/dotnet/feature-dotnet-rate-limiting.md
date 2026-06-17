---
id: feature-dotnet-rate-limiting
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.RateLimiting'
---

# .NET Rate Limiting Package

## Summary

Design `HexGuard.RateLimiting` as a .NET package for standardizing rate-limit policy configuration helpers, standard rate-limit response header conventions (Retry-After, RateLimit-*), and client-friendly error payloads on top of ASP.NET Core's built-in rate-limiting middleware.

The repeated problem is that ASP.NET Core 7+ ships a flexible rate-limiting middleware, but teams repeatedly implement the same conventions around rate-limit response headers (the `RateLimit-*` IETF draft headers), `Retry-After` formatting, consistent `429 Too Many Requests` problem-details payloads, and policy naming conventions. A thin conventions package on top of the built-in middleware would eliminate this boilerplate.

## Goals

- Provide prebuilt rate-limit policy factories for common scenarios: fixed window, sliding window, token bucket, and concurrency.
- Standardize rate-limit response headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` following the IETF draft standard.
- Provide `Retry-After` header formatting (both seconds and HTTP-date variants).
- Provide a consistent `429 Too Many Requests` Problem Details response body that includes the retry time and limit metadata.
- Provide convention helpers for policy naming, endpoint tagging, and policy composition (global default + per-endpoint overrides).
- Keep the package thin — it wraps and configures the built-in `Microsoft.AspNetCore.RateLimiting` middleware, not replacing it.

## Non-Goals

- Replacing or reimplementing ASP.NET Core's rate-limiting middleware.
- Distributed rate-limit store backends (Redis, etc.) — those belong in a separate companion.
- Client-tracking or authentication-specific rate-limit partitioning — the middleware already supports this.
- Rate-limit analytics dashboards or admin UIs.

## Decisions

- Build on top of `Microsoft.AspNetCore.RateLimiting` — the package configures and extends, not replaces.
- Use the IETF `RateLimit-*` draft header names (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).
- Use `SystemTimeProvider` for testable retry-after calculations.
- Keep policy factories as extension methods on `RateLimiterOptions` for fluent configuration.
- Provide an `AddHexGuardRateLimiting()` extension that registers default conventions and headers.

## Proposed Public API

```csharp
// Registration — Program.cs
builder.Services.AddHexGuardRateLimiting(options =>
{
    // Global default policy
    options.AddFixedWindowPolicy("default", cfg =>
    {
        cfg.PermitLimit = 100;
        cfg.Window = TimeSpan.FromMinutes(1);
        cfg.QueueLimit = 0;
    });

    // Auth-specific stricter policy
    options.AddTokenBucketPolicy("auth", cfg =>
    {
        cfg.TokenLimit = 20;
        cfg.TokensPerPeriod = 20;
        cfg.ReplenishmentPeriod = TimeSpan.FromMinutes(1);
    });
});

app.UseHexGuardRateLimiting();   // attaches headers and 429 body formatting

// Per-endpoint application
app.MapGet("/api/public", () => ...).RequireRateLimiting("default");
app.MapPost("/api/auth/login", () => ...).RequireRateLimiting("auth");

// Response headers added automatically:
//   RateLimit-Limit: 100
//   RateLimit-Remaining: 87
//   RateLimit-Reset: 1718643200

// 429 response body (Problem Details):
// {
//   "type": "https://tools.ietf.org/html/rfc6585#section-4",
//   "title": "Too Many Requests",
//   "status": 429,
//   "detail": "Rate limit exceeded. Retry after 42 seconds.",
//   "retryAfterSeconds": 42,
//   "rateLimitLimit": 100,
//   "rateLimitRemaining": 0
// }
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.RateLimiting/` and `dotnet/tests/HexGuard.RateLimiting.Tests/` following existing conventions.
2. Add project reference and solution file entries in `HexGuard.slnx`.

### Phase 1: Core Conventions

3. Implement `HexGuardRateLimitingOptions` — holds policy configuration delegates.
4. Implement `AddHexGuardRateLimiting()` DI extension method that registers default services.
5. Implement policy factory extensions: `AddFixedWindowPolicy()`, `AddSlidingWindowPolicy()`, `AddTokenBucketPolicy()`, `AddConcurrencyPolicy()` — thin wrappers over `RateLimiterOptions.AddFixedWindowLimiter()` etc.
6. Implement rate-limit header middleware that intercepts `OnRejected` and response-writing to attach `RateLimit-*` headers.
7. Implement `RetryAfterFormatter` — formats retry-after as both seconds integer and HTTP-date, depending on client preference.
8. Implement `RateLimitProblemDetails` — custom `429` Problem Details writer that includes retry seconds, limit, and remaining fields.
9. Add unit tests for: all policy factory registrations, header formatting, retry-after calculation, 429 Problem Details body shape, edge cases (limit=0, remaining=0, retry in past), and middleware pipeline behavior.

### Phase 2: Sample API & Docs

10. Add a `HexGuard.RateLimiting` endpoint group to the shared `HexGuard.SampleApi` demonstrating:
    - A public endpoint with 100/min fixed window
    - An auth endpoint with 20/min token bucket
    - Rapid-fire requests that trigger 429 with Problem Details
    - Headers visible in response
11. Add integration tests via `WebApplicationFactory`.
12. Write the deep-dive doc at `docs/packages/hexguard-rate-limiting.md`.
13. Update the NuGet-facing `README.md`.

### Phase 3: Release

14. Add build and test entries to root `package.json` scripts.
15. Add `.github/workflows/release-dotnet-rate-limiting.yml`.
16. Run `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test` for the full validation gate.

## Validation

- `pnpm dotnet:test` — unit and integration tests for policy registration, headers, 429 body, middleware.
- `pnpm dotnet:build` — package builds.
- Sample API endpoint manual verification via `pnpm dotnet:start:demo-api`.

## Follow-Ups

- Revisit distributed rate-limit store support (Redis, etc.) as a separate companion package.
- Evaluate whether an Angular `@hexguard/angular-rate-limit-awareness` package that reads `RateLimit-*` headers and exposes remaining-limit signals would be useful.
- Consider adding a rate-limit admin endpoint (`GET /api/rate-limit/status`) for operational visibility.
