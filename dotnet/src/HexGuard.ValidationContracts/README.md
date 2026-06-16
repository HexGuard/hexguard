# HexGuard.ValidationContracts

Standard validation error contracts (field path, error code, message) and RFC 9457 Problem Details helpers for .NET APIs.

## Quick Start

```shell
dotnet add package HexGuard.ValidationContracts
```

## Usage

### Basic error construction

```csharp
using HexGuard.ValidationContracts;

var result = new ValidationResultBuilder()
    .AddError("name", "Required", "Product name is required.")
    .AddError("price", "OutOfRange", "Price must be greater than zero.")
    .AddModelError("BusinessRule", "Inventory validation failed.")
    .WithTraceId("trace-abc")
    .Build();

Console.WriteLine(result.IsValid);  // False
```

### RFC 9457 Problem Details mapping

```csharp
var problem = ValidationResultProblemDetails.FromResult(
    result,
    statusCode: 400,
    detail: "The request payload failed validation.",
    instance: "/api/products");

return Results.Problem(
    statusCode: problem.Status,
    title: problem.Title,
    detail: problem.Detail,
    instance: problem.Instance,
    extensions: problem.ToProblemDetailsExtensions());
```

### Field path helpers

```csharp
FieldPath.Child("address", "city");           // "address.city"
FieldPath.Index("items", 0);                  // "items.0"
FieldPath.IndexChild("items", 0, "name");     // "items.0.name"
FieldPath.GetParent("items.0.name");          // "items.0"
FieldPath.GetLeaf("address.city");            // "city"
```

### FluentValidation integration (conditional)

Define `HEXGUARD_HAS_FLUENTVALIDATION` in your project and add a FluentValidation reference:

```csharp
var fluentResult = await validator.ValidateAsync(product);
var validationResult = fluentResult.AsValidationResult(traceId: "trace-abc");
```

## Features

| Feature | Status |
|---------|--------|
| `ValidationError` record (Field, Code, Message, IsFieldError) | ✅ Available |
| `ValidationResult` record (IsValid, FieldErrors, ModelErrors, ForField, ForFieldPrefix) | ✅ Available |
| `FieldPath` helpers (Child, Index, IndexChild, GetParent, GetLeaf) | ✅ Available |
| `ValidationErrorCode` constants (Required, InvalidFormat, OutOfRange, etc.) | ✅ Available |
| `ValidationResultBuilder` fluent builder | ✅ Available |
| `ValidationResultProblemDetails` RFC 9457 adapter | ✅ Available |
| `FluentValidationExtensions.AsValidationResult()` | ✅ Available (conditional) |

## Links

- [Deep package notes](../../../docs/packages/validation-contracts.md)
- [Angular counterpart](../../../angular/packages/angular-api-errors)
- [Sample API](../../../dotnet/samples/HexGuard.SampleApi)
- [NuGet](https://www.nuget.org/packages/HexGuard.ValidationContracts)
