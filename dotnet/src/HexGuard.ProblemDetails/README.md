# HexGuard.ProblemDetails

RFC 9457 Problem Details for HTTP APIs — types, builders, and ASP.NET Core integration for producing standard error responses. Pairs with `@hexguard/angular-api-errors`.

## Quick Start

```shell
dotnet add package HexGuard.ProblemDetails
```

### Build a Problem Details response

```csharp
using HexGuard.ProblemDetails;

var pd = new ProblemDetailsBuilder()
    .WithType(WellKnownProblemTypes.ValidationError)
    .WithTitle("Validation Error")
    .WithStatus(400)
    .WithDetail("The request contains invalid fields.")
    .WithExtension("errors", new[]
    {
        new { field = "name", code = "required", message = "Name is required." },
    })
    .Build();

return pd.ToProblemResult(); // Minimal API
```

### Register middleware

```csharp
app.UseMiddleware<ProblemDetailsMiddleware>();
```

## Related Packages

- **`HexGuard.ValidationContracts`** — extends Problem Details with validation-specific types (`ValidationResult`, `FieldPath`)
- **`@hexguard/angular-api-errors`** — Angular package that consumes RFC 9457 Problem Details payloads
- **`HexGuard.SampleApi`** — shared demo API providing live Problem Details endpoints

## License

MIT
