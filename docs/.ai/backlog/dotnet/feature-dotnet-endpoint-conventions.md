---
id: feature-dotnet-endpoint-conventions
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.EndpointConventions'
---

# .NET Endpoint Conventions Package

## Summary

Design `HexGuard.EndpointConventions` as a .NET package for standardizing repetitive API endpoint patterns — validation-failure response shape, pagination metadata envelopes, common result wrappers, ETag attachment, and problem-details integration — for both minimal APIs and controllers.

The repeated problem is that ASP.NET Core projects repeatedly implement the same boilerplate: wrapping results in consistent envelopes, attaching pagination metadata, returning RFC 9457 problem details for validation failures, and attaching ETags to responses. These patterns are well-understood but every project reimplements them slightly differently.

## Goals

- Provide `TypedResults` helpers for common endpoint response patterns: validation failure, not found, conflict, created-with-location, paginated.
- Provide `PaginationMetadata` envelope helper that attaches page/pageSize/totalCount/totalPages to responses.
- Provide ETag response-header attachment helper (`WithETag<T>(result, etag)`).
- Provide validation-failure problem-details helper that integrates with `HexGuard.ValidationContracts`.
- Keep conventions composable via extension methods and filter-based registration.
- Compatible with both minimal APIs (`IResult` extensions) and controllers (`IActionResult` extensions).

## Non-Goals

- Replacing ASP.NET Core's built-in problem-details middleware.
- Code generation or endpoint scaffolding.
- API versioning or documentation conventions.

## Decisions

- Build on top of `Microsoft.AspNetCore.Http.HttpResults` for minimal-API compatibility.
- Use extension methods on `IResult` and `IActionResult` for discoverability.
- Integrate with `HexGuard.ValidationContracts` when available, fall back to a minimal validation envelope.
- Keep the package thin — each helper is a one-method extension, not a complex abstraction.

## Proposed Public API

```csharp
// Validation failure (pairs with HexGuard.ValidationContracts)
return TypedResults.ValidationFailure(validationResult);
// → 400 with Problem Details + errors extension

// Paginated response
return TypedResults.Paginated(items, totalCount, page, pageSize);
// → 200 with { items, pagination: { page, pageSize, totalCount, totalPages } }

// ETag attachment
return Results.Extensions.WithETag(result, "\"abc123\"");
// → 200 + ETag: "abc123" header

// Created with location
return TypedResults.CreatedAt("/api/orders/42", order);
// → 201 with Location header + body

// Not found with problem details
return TypedResults.NotFound("Order", "42");
// → 404 with Problem Details

// Registration
builder.Services.AddHexGuardEndpointConventions();
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold project + tests.
2. Add solution file entries.

### Phase 1: Core Helpers

3. Implement `TypedResults.ValidationFailure()` — wraps `ValidationResult` into RFC 9457 Problem Details.
4. Implement `TypedResults.Paginated()` — wraps items + pagination metadata into envelope.
5. Implement `WithETag()` extension for `IResult` and `IActionResult`.
6. Implement `TypedResults.NotFound(type, id)` — structured 404 with Problem Details.
7. Implement `AddHexGuardEndpointConventions()` DI registration.
8. Add unit tests for: each response helper, header attachment, envelope shape, edge cases (empty items, null ETag, missing validation errors).

### Phase 2: Sample API & Docs

9. Add sample endpoint group to `HexGuard.SampleApi`.
10. Add integration tests.
11. Document in appropriate `docs/packages/` folder.
12. Update README.

### Phase 3: Release

13. Add build/test entries.
14. Add release workflow.
15. Run `pnpm dotnet:test` and `pnpm dotnet:build`.

## Validation

- `pnpm dotnet:test`.
- `pnpm dotnet:build`.

## Follow-Ups

- Revisit deeper integration with `HexGuard.ProblemDetails` for consistent error payloads.
- Consider adding a `Results.Extensions.WithCacheHeaders()` helper in a future version.
- Evaluate response-envelope standardization (wrap all responses in `{ data, meta }`) as an optional mode.

