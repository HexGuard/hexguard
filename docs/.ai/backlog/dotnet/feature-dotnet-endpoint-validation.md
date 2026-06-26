---
id: feature-dotnet-endpoint-validation
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.EndpointValidation
---

# HexGuard.EndpointValidation

## Summary

Auto-validation middleware and helpers for ASP.NET Core Minimal APIs and controllers — validates incoming request bodies against `IValidatableObject`, `DataAnnotations`, or `FluentValidation` validators, and returns standardized RFC 9457 ProblemDetails responses on validation failure. Builds on top of `HexGuard.ValidationContracts` for the error contract shape.

**Builds on:** `HexGuard.ValidationContracts` (released) — uses `ValidationError` (field path, error code, message) as the standard error contract.

**Competition check:** `FluentValidation.AspNetCore` (60M+ downloads) is the dominant package but is tightly coupled to FluentValidation. ASP.NET Core's built-in validation (`[ApiController]`, `InvalidModelStateResponseFactory`) returns a different error shape. **HexGuard.EndpointValidation bridges the gap** — it works with any validation source and returns a consistent ProblemDetails+ValidationErrors shape that pairs with `@hexguard/angular-api-errors`.

## Why Wide Adoption

Every API endpoint with a request body needs validation. Without a standardized approach, every service returns a different error shape. This package provides a consistent, RFC 9457-compliant validation error surface that the Angular `api-errors` package can consume uniformly.

## Goals

1. Provide `AddEndpointValidation()` — registers validation pipeline that runs before the handler.
2. Return `ProblemDetails` with `invalid-params` extension (RFC 9457) on validation failure.
3. Support multiple validation sources: `DataAnnotations`, `IValidatableObject`, and `FluentValidation` (optional adapter).
4. Serialize validation errors as `HexGuard.ValidationContracts.ValidationError[]` for Angular `api-errors` consumption.
5. Provide `ValidationProblem` helper — static factory for `Results.Problem` with validation errors.
6. Support custom error code mapping (e.g., `NotEmptyValidator` → `"required"`).

## Non-Goals

- No replacement for FluentValidation (consumers still register validators as usual).
- No client-side validation generation.
- No validation of query/route parameters (focus on body validation).

## Decisions

1. **Middleware + filter**: Provides both a Minimal API filter (`IEndpointFilter`) and a controller filter.
2. **ValidationContracts-based**: Reuses `HexGuard.ValidationContracts.ValidationError` for error shape.
3. **Pluggable validators**: Built-in `DataAnnotations` support; `FluentValidation` via optional adapter package or extension method.

## Proposed Public API

```csharp
// ── Registration ──────────────────────────────────────────

public static class EndpointValidationExtensions
{
    public static IServiceCollection AddEndpointValidation(
        this IServiceCollection services,
        Action<EndpointValidationOptions>? configure = null);
}

public sealed class EndpointValidationOptions
{
    public bool ReturnProblemDetails { get; set; } = true;
    public bool IncludeErrorCodes { get; set; } = true;
    public Func<ValidationFailure, string> ErrorCodeMapper { get; set; }
        = static f => f.ErrorCode ?? "validation_error";
}

// ── Minimal API Filter ────────────────────────────────────

// Register globally:
app.UseEndpointValidation();

// Or per-endpoint:
app.MapPost("/items", async (Item body, YourService service) =>
{
    // Handler only runs if validation passes
})
.AddEndpointValidation<Item>();

// ── Validation Problem Helper ─────────────────────────────

public static class ValidationProblem
{
    public static IResult Create(
        IReadOnlyList<ValidationError> errors,
        string? title = null,
        int statusCode = 400,
        string? instance = null);

    public static IResult FromModelState(
        ModelStateDictionary modelState);
}

// ── Usage ─────────────────────────────────────────────────

// Program.cs
builder.Services.AddEndpointValidation(options =>
{
    options.ErrorCodeMapper = failure => failure.ErrorCode switch
    {
        "NotEmptyValidator" => "required",
        "GreaterThanValidator" => "min_value",
        _ => "validation_error"
    };
});

// Endpoint
app.MapPost("/items", async (CreateItemRequest request, Database db) =>
{
    var item = await db.CreateAsync(request);
    return Results.Created($"/items/{item.Id}", item);
});
// Auto-validates CreateItemRequest via DataAnnotations/IValidatableObject
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.EndpointValidation/` with standard `.csproj`.
2. Add project reference to `HexGuard.ValidationContracts`.
3. Implement `EndpointValidationOptions`.
4. Implement `EndpointValidationFilter` (Minimal API `IEndpointFilter`).
5. Implement `ValidationProblem` helper.
6. Add FluentValidation adapter (optional package or extension).
7. Add `InternalsVisibleTo` for test project.
8. Create test project with xUnit + `WebApplicationFactory` integration tests.
9. Register in `HexGuard.slnx`.
10. Publish as NuGet package `HexGuard.EndpointValidation`.
