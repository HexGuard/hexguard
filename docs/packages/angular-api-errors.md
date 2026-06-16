# @hexguard/angular-api-errors

**Status: In Development** — API surface may change before the first stable release.

## Purpose

Normalizes backend validation, business-rule failures, and RFC 9457 problem-details payloads into a consistent Angular-facing error surface with field-level form binding and page-level error state.

## Feature Matrix

| Capability                       | Status       | Notes                                                                      |
| -------------------------------- | ------------ | -------------------------------------------------------------------------- |
| RFC 9457 Problem Details parsing | ✅ Available | Extracts `errors` extension member, falls back to `title`/`detail`         |
| Simple validation error parsing  | ✅ Available | Parses `{ errors: ApiError[] }` envelopes                                  |
| Field-level error extraction     | ✅ Available | `extractFieldError()`, `errorsForField()`, `errorsForFieldPrefix()`        |
| Page-level error extraction      | ✅ Available | `extractPageErrors()` returns non-field errors                             |
| Reactive Forms error binding     | ✅ Available | `apiFormErrors()` — maps field paths to `FormGroup.setErrors()`            |
| Injectable form error helper     | ✅ Available | `injectApiFormErrors()` with configurable `markAsDirty`                    |
| Signal-based error state         | ✅ Available | `injectApiErrorState()` — errors, pageErrors, hasFieldError                |
| Error code constants             | ✅ Available | Mirrors .NET `ValidationErrorCode` constants                               |
| Field path helpers               | ✅ Available | Mirrors .NET `FieldPath` helpers (child, index, indexChild, parent, leaf)  |
| Optional async-state integration | 🚧 Planned   | Bind API errors into `@hexguard/angular-async-state` action error contexts |

## Public API Map

| Export                       | Kind               | Role                                                                    |
| ---------------------------- | ------------------ | ----------------------------------------------------------------------- |
| `ApiErrorParser`             | Injectable service | Parses Problem Details / validation payloads into `ApiValidationResult` |
| `provideHexGuardApiErrors()` | Provider function  | Configures optional `strictParsing` option                              |
| `apiFormErrors()`            | Pure function      | Maps `ApiValidationResult` onto a `FormGroup` control by control        |
| `ApiFormErrors`              | Injectable service | Configurable form error binding with `markAsDirty` option               |
| `injectApiFormErrors()`      | Injection function | Convenience wrapper for `inject(ApiFormErrors)`                         |
| `injectApiErrorState()`      | Injection function | Returns `ApiErrorState` signal-based container                          |
| `FieldPath`                  | Static class       | `child()`, `index()`, `indexChild()`, `getParent()`, `getLeaf()`        |
| `ApiErrorCode`               | Constant map       | `Required`, `InvalidFormat`, `OutOfRange`, `Duplicate`, etc.            |
| `ApiError`                   | Interface          | `{ field, code, message, isFieldError? }`                               |
| `ApiValidationResult`        | Interface          | `{ errors, traceId?, isValid }`                                         |
| `ApiErrorProblemDetails`     | Interface          | RFC 9457 envelope with `errors` extension                               |
| `HexGuardApiErrorsOptions`   | Interface          | `{ strictParsing?: boolean }`                                           |

## Option Resolution & Defaults

`provideHexGuardApiErrors()` accepts an optional `HexGuardApiErrorsOptions` object:

| Option          | Type      | Default                        | Description                                                                             |
| --------------- | --------- | ------------------------------ | --------------------------------------------------------------------------------------- |
| `strictParsing` | `boolean` | `true` in dev, `false` in prod | When `true`, `ApiErrorParser.parseProblemDetails()` logs warnings for unexpected shapes |

Options are consumed via `HEXGUARD_API_ERRORS_OPTIONS` injection token.

## Configuration Reference

### ApiErrorParser

| Method                                 | Returns               | Description                                           |
| -------------------------------------- | --------------------- | ----------------------------------------------------- |
| `parseProblemDetails(body)`            | `ApiValidationResult` | Parses RFC 9457 response; extracts `errors` extension |
| `parseValidationErrors(body)`          | `ApiValidationResult` | Parses `{ errors: ApiError[] }` response              |
| `extractFieldError(result, fieldPath)` | `ApiError \| null`    | First match for a field path                          |
| `extractPageErrors(result)`            | `readonly ApiError[]` | All model-level errors                                |
| `errorsForField(result, fieldPath)`    | `readonly ApiError[]` | All errors for a field                                |
| `errorsForFieldPrefix(result, prefix)` | `readonly ApiError[]` | All errors under a prefix                             |

### ApiFormErrors

| Method                      | Returns               | Description                                        |
| --------------------------- | --------------------- | -------------------------------------------------- |
| `applyToForm(form, result)` | `readonly ApiError[]` | Maps errors to controls, returns page-level errors |

### ApiErrorState (signal-based)

| Member                     | Type                          | Description                                 |
| -------------------------- | ----------------------------- | ------------------------------------------- |
| `errors`                   | `Signal<readonly ApiError[]>` | All current errors                          |
| `hasErrors`                | `Signal<boolean>`             | Whether any errors exist                    |
| `pageErrors`               | `Signal<readonly ApiError[]>` | Model-level errors only                     |
| `setErrors(result)`        | `void`                        | Replace all errors from a validation result |
| `addError(error)`          | `void`                        | Append a single error                       |
| `clear()`                  | `void`                        | Remove all errors                           |
| `hasFieldError(fieldPath)` | `Signal<boolean>`             | Whether a specific field has errors         |

## Internal Behavior Notes

- **Field path convention**: Dot-notation with numeric indices (`items.0.name`) matching the .NET `FieldPath` contract.
- **Error code alignment**: `ApiErrorCode` constants mirror `HexGuard.ValidationContracts.ValidationErrorCode` exactly.
- **Problem Details fallback**: When an RFC 9457 response has no `errors` extension, the `title`/`detail` fields are wrapped as a single model-level error with code `"ProblemDetails"`.
- **Form binding**: Unmatched field paths (controls not found in the form) are returned as page-level errors rather than silently dropped.
- **No hidden state**: `ApiErrorState` is a straightforward signal wrapper — no caching, debouncing, or side effects.

## Demo Routes

See [docs/demo/README.md](../demo/README.md) for the full demo runbook.

- `/packages/angular-api-errors` — Package overview
- `/packages/angular-api-errors/form-validation` — Form validation demo with simulated and live backend errors

## Validation Surface

```bash
# Library tests
pnpm test:lib:api-errors

# Library build
pnpm build:lib:api-errors

# Full gate
pnpm format:check && pnpm lint && pnpm test:ci && pnpm build
```

## Release Contract

- **Tag pattern**: `validation-contracts-v{version}` — shared tag with `HexGuard.ValidationContracts`.
- **Minor/major**: Coordinated bumps with the .NET package (contract shape must stay in lockstep).
- **Patches**: Independent of the .NET package (implementation fixes only).
- **npm**: Published as `@hexguard/angular-api-errors` with public access.

See `.github/workflows/release-angular-api-errors.yml` for the release pipeline.
