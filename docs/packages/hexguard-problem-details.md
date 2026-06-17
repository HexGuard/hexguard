# HexGuard.ProblemDetails

RFC 9457 Problem Details for HTTP APIs — types, builders, and ASP.NET Core integration for producing standard error responses. Pairs with `@hexguard/angular-api-errors` for end-to-end typed error pipelines across stacks.

---

## Feature Matrix

| Feature | Status |
|---------|--------|
| RFC 9457 `ProblemDetails` record | ✅ Available |
| `ProblemDetailsBuilder` (fluent builder) | ✅ Available |
| `WellKnownProblemTypes` constants | ✅ Available |
| `ProblemDetailsException` (throw-vs-return) | ✅ Available |
| `ProblemDetailsMiddleware` (catch-all) | ✅ Available |
| `ProblemDetailsResultExtensions` (Minimal API) | ✅ Available |
| `System.Text.Json` serialization (camelCase, null-ignoring) | ✅ Available |
| FluentValidation integration | 📋 Planned |

---

## Public API

### `ProblemDetails` record

The core RFC 9457 type:

| Member | Type | Description |
|--------|------|-------------|
| `TypeUri` | `string?` | A URI reference identifying the problem type |
| `Title` | `string?` | Short human-readable summary |
| `Status` | `int?` | HTTP status code |
| `Detail` | `string?` | Human-readable explanation |
| `Instance` | `string?` | URI identifying this occurrence |
| `Extensions` | `IReadOnlyDictionary<string, object?>?` | Additional extension members |

### `ProblemDetailsBuilder`

Fluent builder for constructing `ProblemDetails`:

```csharp
var pd = new ProblemDetailsBuilder()
    .WithType(WellKnownProblemTypes.ValidationError)
    .WithTitle("Validation Error")
    .WithStatus(400)
    .WithDetail("The request contains invalid fields.")
    .WithInstance("/api/products")
    .WithExtension("errors", validationErrors)
    .Build();
```

### `WellKnownProblemTypes`

Constants for standard type URIs:
- `AboutBlank` — `about:blank`
- `ValidationError` — `https://docs.hexguard.dev/problems/validation-error`
- `NotFound` — `https://docs.hexguard.dev/problems/not-found`
- `OutOfRange` — `https://docs.hexguard.dev/problems/out-of-range`
- `BadRequest` — `https://docs.hexguard.dev/problems/bad-request`
- `InternalServerError` — `https://docs.hexguard.dev/problems/internal-server-error`

### `ProblemDetailsException`

An exception carrying a `ProblemDetails` payload, usable with the middleware for throw-vs-return patterns:

```csharp
throw new ProblemDetailsException(new ProblemDetailsBuilder()
    .WithType(WellKnownProblemTypes.NotFound)
    .WithTitle("Resource Not Found")
    .WithStatus(404)
    .Build());
```

### `ProblemDetailsMiddleware`

ASP.NET Core middleware that catches exceptions and returns RFC 9457 JSON responses:

```csharp
app.UseMiddleware<ProblemDetailsMiddleware>(new ProblemDetailsMiddlewareOptions
{
    CatchAllExceptions = true,
    IncludeExceptionDetails = false,  // set true in dev
});
```

### `ProblemDetailsResultExtensions`

Minimal API `IResult` extension:

```csharp
app.MapGet("/api/error", () =>
{
    return new ProblemDetailsBuilder()
        .WithType(WellKnownProblemTypes.BadRequest)
        .WithTitle("Bad Request")
        .WithStatus(400)
        .Build()
        .ToProblemResult();
});
```

---

## Cross-Stack Coordination

```
Angular                                  .NET
─────────────────────────────────────────────────────────────
@hexguard/angular-api-errors       ──►   HexGuard.ProblemDetails         (core RFC 9457 types)
                                         HexGuard.ValidationContracts      (validates + extends)
```

- `@hexguard/angular-api-errors` consumes RFC 9457 Problem Details payloads
- `HexGuard.ProblemDetails` produces them (this package)
- `HexGuard.ValidationContracts` extends Problem Details with validation-specific types
- Both .NET packages share the `HexGuard.SampleApi` for live demos

The Angular `api-errors` package mirrors the same field-path convention (`items.0.name`) and error codes that both .NET packages share.

---

## Installation

```shell
dotnet add package HexGuard.ProblemDetails
```

Or via the `dotnet` CLI inside the monorepo:

```shell
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test
```
