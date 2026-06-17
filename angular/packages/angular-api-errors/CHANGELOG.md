# Changelog

## 0.1.0 — 2026-06-16

Initial release of `@hexguard/angular-api-errors`.

### Features

- RFC 9457 Problem Details parsing via `ApiErrorParser` with typed `ApiValidationResult` contracts
- Field-level error extraction (`extractFieldError`, `errorsForField`, `errorsForFieldPrefix`)
- Model-level (page) error extraction (`extractPageErrors`)
- Reactive Forms error binding through `apiFormErrors()` pure function and injectable `ApiFormErrors` service with configurable `markAsDirty`
- Signal-based page-level error state via `injectApiErrorState()` — `errors`, `pageErrors`, `hasErrors`, `hasFieldError`, `setErrors`, `addError`, `clear`
- `FieldPath` static helpers (`child`, `index`, `indexChild`, `getParent`, `getLeaf`) mirroring .NET contracts
- `ApiErrorCode` constant map (`Required`, `InvalidFormat`, `OutOfRange`, `Duplicate`, etc.) mirroring .NET contracts
- `provideHexGuardApiErrors()` provider function for optional configuration

### Documentation

- Package README with quickstart and public API overview
- Deep package notes in `docs/packages/angular-api-errors.md`
- Docs-grade demo with form validation route
- Playwright end-to-end coverage for form validation flow
- Cross-stack pairing docs with `HexGuard.ValidationContracts`
