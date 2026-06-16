# Changelog

## 0.1.0 — 2026-06-16

Initial release of `HexGuard.ValidationContracts`.

### Features

- `ValidationError` sealed record with `Field`, `Code`, `Message`, and `IsFieldError`
- `ValidationResult` sealed record with `IsValid`, `FieldErrors`, `ModelErrors`, `ForField()`, and `ForFieldPrefix()`
- `FieldPath` static helpers: `Child()`, `Index()`, `IndexChild()`, `GetParent()`, `GetLeaf()`
- `ValidationErrorCode` constants: `Required`, `InvalidFormat`, `OutOfRange`, `Duplicate`, `Mismatch`, `NotFound`, `Conflict`, `MaxLength`, `MinLength`, `ProhibitedValue`, `BusinessRule`
- `ValidationResultBuilder` fluent builder with `AddError()`, `AddModelError()`, `WithTraceId()`, `AddErrors()`, `Build()`
- `ValidationResultProblemDetails` RFC 9457 adapter with `FromResult()` and `ToProblemDetailsExtensions()`
- `FluentValidationExtensions.AsValidationResult()` (conditional, behind `HEXGUARD_HAS_FLUENTVALIDATION`)
- Sample API endpoints at `/api/validation-contracts/validate` (POST) and `/api/validation-contracts/error-codes` (GET)

### Documentation

- Package README with quickstart and usage examples
- Deep package notes in `docs/packages/validation-contracts.md`
- Cross-stack pairing docs with `@hexguard/angular-api-errors`
