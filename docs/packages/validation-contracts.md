# HexGuard.ValidationContracts

**Status: In Development** — API surface may change before the first stable release.

## Purpose

Provides standardized validation error contracts (field path, error code, message) and RFC 9457
Problem Details helpers for .NET APIs. Paired with `@hexguard/angular-api-errors` for cross-stack
validation contract alignment.

## Feature Matrix

| Capability                                        | Status       | Notes                                                                                      |
| ------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `ValidationError` record                          | ✅ Available | Field path, error code, message, `IsFieldError` helper                                     |
| `ValidationResult` record                         | ✅ Available | `IsValid`, `FieldErrors`, `ModelErrors`, `ForField()`, `ForFieldPrefix()`                  |
| `FieldPath` helpers                               | ✅ Available | `Child()`, `Index()`, `IndexChild()`, `GetParent()`, `GetLeaf()`                           |
| `ValidationErrorCode` constants                   | ✅ Available | `Required`, `InvalidFormat`, `OutOfRange`, `Duplicate`, etc.                               |
| `ValidationResultBuilder`                         | ✅ Available | Fluent builder: `AddError()`, `AddModelError()`, `WithTraceId()`                           |
| `ValidationResultProblemDetails`                  | ✅ Available | RFC 9457 Problem Details adapter with `errors` extension                                   |
| `FluentValidationExtensions.AsValidationResult()` | ✅ Available | Conditional compile (`HEXGUARD_HAS_FLUENTVALIDATION`)                                      |
| Minimal API integration                           | ✅ Available | `ToProblemDetailsExtensions()` for `Results.Problem()`                                     |
| Sample API endpoints                              | ✅ Available | `/api/validation-contracts/validate` (POST), `/api/validation-contracts/error-codes` (GET) |
| DataAnnotations mapping                           | 🚧 Planned   | Extension method for `ValidationResult` collection                                         |

## Public API Map

| Type                             | Kind                   | Role                                                                                        |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------- |
| `ValidationError`                | `sealed record`        | Single validation error: `Field`, `Code`, `Message`, `IsFieldError`                         |
| `ValidationResult`               | `sealed record`        | Error aggregation: `Errors`, `TraceId`, `IsValid`, filter helpers                           |
| `FieldPath`                      | `static partial class` | Path construction: `Root`, `Child()`, `Index()`, `IndexChild()`, `GetParent()`, `GetLeaf()` |
| `ValidationErrorCode`            | `static partial class` | Error code constants: `Required`, `InvalidFormat`, `MaxLength`, etc.                        |
| `ValidationResultBuilder`        | `sealed class`         | Fluent builder: `AddError()`, `AddModelError()`, `WithTraceId()`, `Build()`                 |
| `ValidationResultProblemDetails` | `sealed record`        | RFC 9457 adapter: `FromResult()`, `ToProblemDetailsExtensions()`                            |
| `FluentValidationExtensions`     | `static class`         | `AsValidationResult()` — conditional on `HEXGUARD_HAS_FLUENTVALIDATION`                     |

## Option Resolution & Defaults

No configuration options — the types are plain data contracts with no DI or service registration.
Use the types directly:

```csharp
var result = new ValidationResultBuilder()
    .AddError("name", "Required", "Name is required.")
    .AddModelError("BusinessRule", "General failure.")
    .WithTraceId("trace-abc")
    .Build();
```

## Configuration Reference

### ValidationError

| Property       | Type             | Description                                            |
| -------------- | ---------------- | ------------------------------------------------------ |
| `Field`        | `string`         | Dot-separated field path, empty for model-level errors |
| `Code`         | `string`         | Machine-readable error code                            |
| `Message`      | `string`         | Human-readable error description                       |
| `IsFieldError` | `bool` (derived) | `true` when `Field.Length > 0`                         |

### ValidationResult

| Property      | Type                                       | Description                     |
| ------------- | ------------------------------------------ | ------------------------------- |
| `Errors`      | `IReadOnlyList<ValidationError>`           | All validation errors           |
| `TraceId`     | `string?`                                  | Optional correlation identifier |
| `IsValid`     | `bool` (derived)                           | `true` when `Errors.Count == 0` |
| `FieldErrors` | `IReadOnlyList<ValidationError>` (derived) | Only field-level errors         |
| `ModelErrors` | `IReadOnlyList<ValidationError>` (derived) | Only model-level errors         |

| Method                          | Returns                          | Description                      |
| ------------------------------- | -------------------------------- | -------------------------------- |
| `ForField(string field)`        | `IReadOnlyList<ValidationError>` | Errors matching exact field path |
| `ForFieldPrefix(string prefix)` | `IReadOnlyList<ValidationError>` | Errors under a field prefix      |

### ValidationResultProblemDetails

| Property   | Type                             | Default                                     | Description                     |
| ---------- | -------------------------------- | ------------------------------------------- | ------------------------------- |
| `Type`     | `string`                         | `"about:blank"`                             | Error type URI                  |
| `Title`    | `string`                         | `"One or more validation errors occurred."` | Short summary                   |
| `Status`   | `int`                            | `400`                                       | HTTP status code                |
| `Detail`   | `string?`                        | `null`                                      | Specific explanation            |
| `Instance` | `string?`                        | `null`                                      | Occurrence URI                  |
| `TraceId`  | `string?`                        | `null`                                      | From `ValidationResult.TraceId` |
| `Errors`   | `IReadOnlyList<ValidationError>` | empty                                       | From `ValidationResult.Errors`  |

| Method                                                       | Returns                          | Description                            |
| ------------------------------------------------------------ | -------------------------------- | -------------------------------------- |
| `FromResult(ValidationResult, statusCode, detail, instance)` | `ValidationResultProblemDetails` | Factory                                |
| `ToProblemDetailsExtensions()`                               | `Dictionary<string, object?>`    | For `Results.Problem(extensions: ...)` |

## Internal Behavior Notes

- **Field path convention**: Dot-notation with numeric indices (`items.0.name`) for collection paths.
  Parent path `items` matches `items.0.name` via `ForFieldPrefix("items")`.
- **FluentValidation integration**: Behind `#if HEXGUARD_HAS_FLUENTVALIDATION` — consumers define the
  conditional symbol and add their own FluentValidation package reference. No hard dependency.
- **Problem Details serialization**: `ToProblemDetailsExtensions()` returns a dictionary with `"errors"`
  and `"traceId"` keys. The `errors` value is the raw `IReadOnlyList<ValidationError>`, which
  `System.Text.Json` serializes correctly by default.
- **Immutability**: `ValidationResult` and `ValidationError` are immutable records.
  `ValidationResult` helper methods (`FieldErrors`, `ForField()`) allocate new lists.
- **Thread safety**: All types are thread-safe by virtue of immutability.

## Sample API Endpoints

The shared .NET sample API (`HexGuard.SampleApi`) exposes:

| Endpoint                                | Method | Description                                                          |
| --------------------------------------- | ------ | -------------------------------------------------------------------- |
| `/api/validation-contracts/`            | GET    | Package overview with contract shape                                 |
| `/api/validation-contracts/validate`    | POST   | Validates a sample product payload, returns RFC 9457 Problem Details |
| `/api/validation-contracts/error-codes` | GET    | Lists all known error codes                                          |

Start the sample API:

```bash
pnpm dotnet:start:demo-api
```

## Validation Surface

```bash
# Restore, build, test
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test

# Individual test (from dotnet/)
dotnet test tests/HexGuard.ValidationContracts.Tests
```

## Release Contract

- **Tag pattern**: `validation-contracts-v{version}` — shared tag with `@hexguard/angular-api-errors`.
- **Minor/major**: Coordinated bumps with the Angular package (contract shape must stay in lockstep).
- **Patches**: Independent of the Angular package (implementation fixes only).
- **NuGet**: Published as `HexGuard.ValidationContracts`.

The release pipeline is manual (`workflow_dispatch`). See the repository workflows for execution.
