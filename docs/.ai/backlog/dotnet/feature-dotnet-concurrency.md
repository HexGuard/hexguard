---
id: feature-dotnet-concurrency
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.Concurrency'
---

# .NET Concurrency Package

## Summary

Design `HexGuard.Concurrency` as a .NET package for standardizing optimistic concurrency handling, ETag and version-number contracts, conflict detection, conflict-response shapes, and If-Match/If-None-Match middleware helpers.

The repeated problem is that REST APIs that support concurrent edits need concurrency control — ETags for HTTP-level checks, version numbers for database-level checks, and consistent conflict-response payloads. Every team builds its own ETag generation (from row versions, GUIDs, timestamps, or content hashes), its own If-Match middleware, and its own `409 Conflict` response shape. A standardized set of helpers would make concurrency handling consistent, testable, and composable across endpoints.

## Goals

- Define a clear concurrency-token contract (`IConcurrencyToken`) with ETag string generation and parsing.
- Provide built-in token strategies: row version (`byte[]`/`Timestamp`), content hash (SHA-256 of serialized payload), GUID-based, and custom.
- Provide `ConcurrencyResult` and `ConflictResponse` models for consistent `409 Conflict` payloads.
- Provide ASP.NET Core middleware for automatic `If-Match` / `If-None-Match` header validation.
- Provide endpoint helpers (`TypedResults.Conflict()`) for minimal-API and controller usage.
- Keep the package composable — consumers pick the token strategy that fits their data layer.
- Compose with `HexGuard.ValidationContracts` for consistent error payloads on conflict responses.

## Non-Goals

- Distributed locking or pessimistic concurrency.
- ORM-specific concurrency configuration (EF Core concurrency tokens, row versions) — those belong in the ORM layer.
- Database transaction management or retry logic.
- Merge or conflict-resolution strategies (that's the ConflictResolution pair in Additional Ideas Under Review).

## Decisions

- Prefer HTTP-friendly concurrency helpers over ORM-specific abstractions.
- Keep token strategies as pluggable implementations of `IConcurrencyTokenProvider`.
- Use RFC 9452 (ETag) format — strong ETags with double-quote formatting.
- Return `409 Conflict` with a Problem Details body that includes the expected and current token values.
- Release as a single NuGet package with optional ASP.NET Core middleware in a sub-namespace.

## Proposed Public API

```csharp
// Core concurrency token
public interface IConcurrencyToken
{
    string ETag { get; }                  // The current ETag value (e.g., "abc123")
    string? ResourceType { get; }         // Optional — for typed conflict responses
}

// Token provider strategies
public interface IConcurrencyTokenProvider<T>
{
    Task<IConcurrencyToken> GetCurrentTokenAsync(T entity);
    string GenerateETag(T entity);
}

// Built-in providers
public class RowVersionTokenProvider<T> : IConcurrencyTokenProvider<T>;
public class ContentHashTokenProvider<T> : IConcurrencyTokenProvider<T>;
public class GuidTokenProvider<T> : IConcurrencyTokenProvider<T>;

// Conflict response
public record ConcurrencyResult
{
    public static ConcurrencyResult<T> Conflict<T>(T entity, string expectedETag, string actualETag);
    public static ConcurrencyResult<T> Success<T>(T entity);
}

public record ConcurrencyResult<T> : ConcurrencyResult
{
    public T Entity { get; init; }
    public string? ExpectedETag { get; init; }
    public string? ActualETag { get; init; }
    public bool IsConflict { get; init; }
}

// Endpoint helpers
public static class ConcurrencyEndpointHelpers
{
    // Returns 409 with Problem Details body
    public static IResult Conflict<T>(ConcurrencyResult<T> result);

    // Validates If-Match header and returns 412 Precondition Failed if missing
    public static IResult PreconditionRequired();
}

// Middleware / filter
public class ConcurrencyMiddleware
{
    // Validates If-Match / If-None-Match on write endpoints
    // Adds ETag response header on read endpoints
}

// Registration
public static class ConcurrencyRegistration
{
    public static IServiceCollection AddHexGuardConcurrency(this IServiceCollection services);
    public static IApplicationBuilder UseHexGuardConcurrency(this IApplicationBuilder app);
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.Concurrency/` and `dotnet/tests/HexGuard.Concurrency.Tests/` following existing conventions.
2. Add project reference and solution file entries in `HexGuard.slnx`.

### Phase 1: Core Contracts & Token Strategies

3. Define `IConcurrencyToken` interface with `ETag` and `ResourceType`.
4. Implement `RowVersionTokenProvider<T>` — reads `byte[]` or `Timestamp` property via expression, converts to base64 ETag.
5. Implement `ContentHashTokenProvider<T>` — serializes entity to JSON, computes SHA-256, returns hex ETag.
6. Implement `GuidTokenProvider<T>` — reads a `Guid`/`string` property, returns as ETag.
7. Implement `ConcurrencyResult<T>` with `Conflict()` and `Success()` factory methods.
8. Add unit tests for: all token providers, ETag format compliance (RFC 9452), concurrent update detection, missing token handling, and custom provider support.

### Phase 2: ASP.NET Core Integration

9. Implement `ConcurrencyEndpointHelpers.Conflict()` — returns `409 Conflict` with RFC 9457 Problem Details body including expected/current ETag values.
10. Implement `ConcurrencyEndpointHelpers.PreconditionRequired()` — returns `428 Precondition Required`.
11. Implement `ConcurrencyMiddleware` — validates `If-Match` on write endpoints, adds `ETag` header on read endpoints.
12. Implement `ConcurrencyRegistration` DI extension methods.
13. Add integration tests via `WebApplicationFactory` for: If-Match validation, If-None-Match validation, 409/412 responses, ETag header generation, and middleware behavior.

### Phase 3: Sample API & Docs

14. Add a `HexGuard.Concurrency` endpoint group to the shared `HexGuard.SampleApi` demonstrating:
    - A `Documents` resource with optimistic concurrency
    - GET with ETag response header
    - PUT with If-Match validation
    - Conflict response with expected/current tokens
    - Precondition-required response when If-Match is missing
15. Write the deep-dive doc at `docs/packages/hexguard-concurrency.md`.
16. Update the NuGet-facing `README.md` with quickstart and API reference.

### Phase 4: Release

17. Add build and test entries to root `package.json` scripts.
18. Add `.github/workflows/release-dotnet-concurrency.yml`.
19. Run `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test` for the full validation gate.

## Validation

- `pnpm dotnet:test` — .NET unit and integration tests for token providers, middleware, conflict responses.
- `pnpm dotnet:build` — package builds.
- Sample API endpoint manual check via `pnpm dotnet:start:demo-api`.
- Integration tests for 409/412/428/200 scenarios.

## Follow-Ups

- Revisit the cross-stack pairing with an Angular `@hexguard/angular-concurrency` helper that reads `ETag` headers and attaches `If-Match` on mutation requests.
- Evaluate whether a stale-while-revalidate cache helper belongs in the same package or the Caching package.
- Consider adding `PreconditionFailed` (412) helpers for the If-None-Match→304 read-caching use case in a future version.
