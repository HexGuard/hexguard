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

- **Tag pattern**: `dotnet-validationcontracts-v{version}` — shared tag with `@hexguard/angular-api-errors`.
- **Minor/major**: Coordinated bumps with the Angular package (contract shape must stay in lockstep).
- **Patches**: Independent of the Angular package (implementation fixes only).
- **NuGet**: Published as `HexGuard.ValidationContracts`.

The release pipeline is manual (`workflow_dispatch`). See the repository workflows for execution.

## Related Resources

- [Package README](../../dotnet/src/HexGuard.ValidationContracts/README.md)
- [Package Catalog](../README.md)
- [Sample API Endpoints](../../dotnet/samples/HexGuard.SampleApi/Packages/HexGuardValidationContracts/)
- [Source Code](../../dotnet/src/HexGuard.ValidationContracts/)
- [Angular Counterpart: `@hexguard/angular-api-errors`](./angular-api-errors.md)
- [Consumed by: `HexGuard.ProblemDetails`](./hexguard-problem-details.md)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational — no code has been changed.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                                   | Severity   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Public API Design         | Narrow, well-scoped surface — 7 types exposed. No internal helpers leaked. All types are immutable `sealed record` types with primary constructors.                                                                                       | praise     |
| Public API Design         | XML doc comments on ALL public APIs — every type, method, parameter, and return value documented.                                                                                                                                         | praise     |
| Public API Design         | Uses `IReadOnlyList<T>` for collection properties, `string?` nullable annotations, `ArgumentNullException.ThrowIfNull()` for guard clauses. Follows all documented .NET conventions.                                                      | praise     |
| Public API Design         | FluentValidation integration behind conditional compile flag (`#if HEXGUARD_HAS_FLUENTVALIDATION`) — no hard dependency.                                                                                                                  | praise     |
| Implementation Quality    | Immutable records (`ValidationError`, `ValidationResult`, `ValidationResultProblemDetails`) guarantee thread-safety by design.                                                                                                            | praise     |
| Implementation Quality    | `ValidationResultBuilder` uses internal `List<ValidationError>` with `.AsReadOnly()` at build time — correct allocation strategy.                                                                                                         | praise     |
| Implementation Quality    | `ValidationResult` helper methods (`FieldErrors`, `ModelErrors`, `ForField()`, `ForFieldPrefix()`) allocate new `List<T>` on every call — documented in deep-dive doc, acceptable for request-scoped use.                                 | suggestion |
| Documentation             | Comprehensive README with quickstart, feature table, links to deep-dive doc, Angular counterpart, NuGet, sample API.                                                                                                                      | praise     |
| Documentation             | Deep-dive doc covers full API map, configuration reference tables, internal behavior notes, sample endpoints, build/test commands, release contract.                                                                                      | praise     |
| Documentation             | **Critical: Tag pattern mismatch** — doc says `validation-contracts-v{version}` but `release-dotnet.yml` uses `dotnet-validationcontracts-v*` (missing `dotnet-` prefix, different casing).                                               | moderate   |
| Test Coverage             | ~40 test assertions across 6 test classes — unit tests for all types and full HTTP integration tests via `WebApplicationFactory<Program>`.                                                                                                | praise     |
| Test Coverage             | Integration tests verify: root info endpoint, error codes listing, valid payload, missing-name → 400, invalid-category → 400, null payload → 400, multiple errors.                                                                        | praise     |
| Test Coverage             | Minor gaps: `FieldPath.IndexChild` with root parent (`""`), `FieldPath.GetLeaf` with empty path, `ForFieldPrefix` with exact match, empty `ValidationResultBuilder.AddErrors()`, FluentValidation integration test (conditional compile). | minor      |
| Cross-package Consistency | Solution registered in `HexGuard.slnx`. CHANGELOG and LICENSE present. Catalog registered with full metadata. Site ecosystem linked.                                                                                                      | praise     |
| Cross-package Consistency | Angular counterpart (`@hexguard/angular-api-errors`) mirrors error codes and types exactly — code comments explicitly reference the .NET source.                                                                                          | praise     |
| Cross-package Consistency | No `InternalsVisibleTo` attribute in `.csproj` — not functionally needed since there are no `internal` types, but the instructions recommend adding it.                                                                                   | minor      |
| Cross-package Consistency | Release workflow included in `release-dotnet.yml` with tag pattern `dotnet-validationcontracts-v*` — but the deep-dive doc documents the wrong tag pattern.                                                                               | moderate   |

### Improvement & Extension Opportunities

| Area          | Suggestion                                                                                                                                       | Type        | Difficulty |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ---------- |
| Documentation | Fix tag pattern in deep-dive doc: change `validation-contracts-v{version}` to match the actual workflow pattern `dotnet-validationcontracts-v*`. | improvement | easy       |
| Tests         | Add `FieldPath.IndexChild("", 0, "name")` edge case test.                                                                                        | improvement | easy       |
| Tests         | Add `FieldPath.GetLeaf("")` edge case test.                                                                                                      | improvement | easy       |
| Tests         | Add `ForFieldPrefix` exact-match edge case test.                                                                                                 | improvement | easy       |
| Tests         | Add empty `AddErrors(IEnumerable<>)` test.                                                                                                       | improvement | easy       |
| Infra         | Add `InternalsVisibleTo` attribute to `.csproj` per workflow instructions (for test project access).                                             | improvement | easy       |
| Extension     | DataAnnotations mapping (currently Planned in feature matrix) — extension method for `ValidationResult` collection.                              | extension   | medium     |
