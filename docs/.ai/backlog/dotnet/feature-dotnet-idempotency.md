---
id: feature-dotnet-idempotency
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.Idempotency'
---

# .NET Idempotency Package

## Summary

Design `HexGuard.Idempotency` as a .NET package for standardizing idempotency-key handling, duplicate-request prevention, replay-safe response caching, and consistent `409 Conflict` / `200 OK (replayed)` response contracts for command-style POST, PUT, PATCH, and DELETE endpoints.

The repeated problem is that POST endpoints for creating or commanding resources are vulnerable to duplicate execution under network retries, double-clicks, or automated retry middleware. The idempotency-key pattern (client sends a unique key, server deduplicates) is well-established but every team implements the key generation, storage, expiry, replay-detection, and response-replay logic differently.

## Goals

- Define a clear idempotency key model (`IdempotencyKey`, `IdempotentRequest`) with creation timestamp and expiry.
- Provide `IIdempotencyStore` abstraction with built-in in-memory and configurable persistence backends.
- Provide middleware that intercepts requests with `Idempotency-Key` headers, detects duplicates, and replays cached responses.
- Provide response-cache helpers that store and replay the original response for duplicate requests.
- Support configurable key expiry (TTL) and automatic cleanup of expired keys.
- Provide endpoint helpers for opt-in idempotency per route.
- Keep the package composable — apps pick the storage backend and key naming strategy.

## Non-Goals

- Distributed transaction guarantees across multiple services.
- Automatic idempotency for GET requests (GET is already idempotent by HTTP spec).
- Client-side idempotency key generation — that's the cross-stack `@hexguard/angular-idempotency` companion.
- Replacing full request-retry infrastructure.

## Decisions

- Use the `Idempotency-Key` request header as the standard carrier.
- Replay the original HTTP status code, headers, and body for duplicate requests — not just `200 OK`.
- Default in-memory store with TTL (24h). Pluggable via `IIdempotencyStore` for Redis, DB, etc.
- Middleware is opt-in per endpoint — no global idempotency by default.
- Release as a single NuGet package with `AddHexGuardIdempotency()` / `UseHexGuardIdempotency()` extensions.

## Proposed Public API

```csharp
// Registration
builder.Services.AddHexGuardIdempotency(options =>
{
    options.DefaultTtl = TimeSpan.FromHours(24);
    options.Store = new InMemoryIdempotencyStore();
    options.KeyPrefix = "idemp-";
});

app.UseHexGuardIdempotency();   // adds middleware

// Per-endpoint
app.MapPost("/api/orders", CreateOrder).RequireIdempotency();

// Store interface
public interface IIdempotencyStore
{
    Task<IdempotentResponse?> GetAsync(string key, CancellationToken ct);
    Task SetAsync(string key, IdempotentResponse response, TimeSpan ttl, CancellationToken ct);
    Task CleanupExpiredAsync(CancellationToken ct);
}

// Response model
public record IdempotentResponse(
    int StatusCode,
    IReadOnlyDictionary<string, string> Headers,
    byte[] Body
);

// Extension for endpoints
public static TBuilder RequireIdempotency<TBuilder>(this TBuilder builder);
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.Idempotency/` and `dotnet/tests/HexGuard.Idempotency.Tests/`.
2. Add solution file entries in `HexGuard.slnx`.

### Phase 1: Core Contracts

3. Define `IdempotentResponse` record and `IIdempotencyStore` interface.
4. Implement `InMemoryIdempotencyStore` with concurrent dictionary, TTL, and background expiry cleanup.
5. Implement `IdempotencyMiddleware` — reads `Idempotency-Key` header, checks store, caches responses on first request, replays on duplicates.
6. Implement `RequireIdempotency()` endpoint extension.
7. Implement `AddHexGuardIdempotency()` / `UseHexGuardIdempotency()` DI extensions.
8. Add unit tests for: first-request caching, duplicate-request replay, TTL expiry, missing key handling (no-op), response header preservation, concurrent duplicate requests, store cleanup.

### Phase 2: Sample API & Docs

9. Add a `HexGuard.Idempotency` endpoint group to `HexGuard.SampleApi` demonstrating order creation with idempotency key.
10. Add integration tests via `WebApplicationFactory`.
11. Write the deep-dive doc at `docs/packages/hexguard-idempotency.md`.
12. Update the NuGet-facing `README.md`.

### Phase 3: Release

13. Add build/test entries.
14. Add release workflow.
15. Run `pnpm dotnet:restore`, `pnpm dotnet:build`, `pnpm dotnet:test`.

## Validation

- `pnpm dotnet:test` — unit and integration tests.
- `pnpm dotnet:build` — builds.
- Sample API manual check.

## Follow-Ups

- Revisit Redis/DB store implementations as companion packages.
- Evaluate idempotency-key generation on the client side in the cross-stack `@hexguard/angular-idempotency` package.
- Consider idempotency for async/background operations if demand grows.

