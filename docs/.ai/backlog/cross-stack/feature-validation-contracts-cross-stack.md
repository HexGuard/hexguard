---
id: feature-validation-contracts-cross-stack
type: feature
status: in-progress
created: 2026-06-13
updated: 2026-06-16
package: 'HexGuard.ValidationContracts + @hexguard/angular-api-errors'
branch: main
---

# Validation Contracts Cross-Stack Package Pair

## Summary

Implement a coordinated .NET + Angular package pair (`HexGuard.ValidationContracts` + `@hexguard/angular-api-errors`) that standardizes field-path, error-code, and machine-readable validation error payload contracts across the stack. The .NET side defines the contract and provides mapping helpers; the Angular side consumes API errors and provides field-level + page-level binding helpers.

## Package Catalog

- `@hexguard/angular-api-errors` — registered in `scripts/package-catalog.data.mjs` as `currentPackages` (status: In Development)
- `HexGuard.ValidationContracts` — registered in `scripts/package-catalog.data.mjs` as `roadmapPackages` (status: In Development)

## Goals

- Standardize field path, code, and validation payload conventions across client and server.
- Reduce repeated validation mapping logic in forms and page actions.
- Provide RFC 9457 Problem Details integration with `"errors"` extension member.
- Pair with a live .NET sample API endpoint for cross-stack validation demos.
- Keep the contract backend-agnostic enough for common .NET validation stacks (FluentValidation, DataAnnotations).

## Non-Goals

- Replacing all validation libraries.
- Owning localized error-message rendering.
- Solving business-rule workflows beyond error contract shape.

## Decisions

- **Release coupling**: Coordinated minor/major releases with a shared `validation-contracts-v` tag prefix. Minor/major version bumps stay in lockstep across both packages. Patch versions can diverge independently.
- **FluentValidation integration**: One static `AsValidationResult()` extension method in the core `HexGuard.ValidationContracts` package. No separate extension package.
- **Demo scope**: Both a simulated (Angular-only) demo path and a live .NET sample API endpoint (`/api/validation-contracts/validate`) for cross-stack integration.
- **Transport**: RFC 9457 Problem Details with `"errors"` extension field.
- **Field paths**: Dot-notation with numeric indices (`items.0.address.city`) — consistent with common .NET validation output.
- **Signal-first**: Angular helpers use signals where state is involved (`ApiErrorState`).
- **No hard runtime deps**: The Angular package uses `@angular/core`, `@angular/forms`, `tslib`. `@hexguard/angular-async-state` is optional.
- **Contract-first**: .NET types define the canonical shape; Angular types mirror them.
- Treat this as a cross-stack contract layer, not a UI package.
- Keep field-path and code semantics explicit.
- Compose with problem-details and Angular error packages.

## Implementation Plan

### Phase 0: Foundation

- [x] Define shared contract semantics (field paths, error codes, Problem Details envelope).
- [x] Register both packages in `scripts/package-catalog.data.mjs`.
- [x] Run `pnpm catalog:sync` to regenerate docs + TypeScript types.

### Phase 1: .NET — HexGuard.ValidationContracts

- [ ] Scaffold .NET project + test project following `HexGuard.ReferenceData` patterns.
- [ ] Core types: `ValidationError`, `ValidationResult`, `FieldPath`, `ValidationErrorCode`.
- [ ] Mapping helpers: `ValidationResultBuilder`, `AsValidationResult()` FluentValidation extension, `ValidationResultProblemDetails` (RFC 9457 adapter).
- [ ] Sample API endpoints in `Packages/HexGuardValidationContracts/` + `Program.cs` registration.
- [ ] Unit + integration tests via `WebApplicationFactory`.

### Phase 2: Angular — @hexguard/angular-api-errors

- [ ] Scaffold Angular library (package.json, ng-package, tsconfigs, `angular.json` registration).
- [ ] TypeScript types mirroring .NET contract (`ApiError`, `ApiValidationResult`, `ApiErrorProblemDetails`).
- [ ] `ApiErrorParser` — parses Problem Details / `HttpErrorResponse` into typed results.
- [ ] `injectApiFormErrors()` / `apiFormErrors()` — maps field-path errors to `FormGroup.setErrors()`.
- [ ] `ApiErrorState` — signal-based container for page-level errors.
- [ ] Unit + integration tests.

### Phase 3: Documentation & Integration

- [ ] Deep-dive docs: `docs/packages/angular-api-errors.md`, `docs/packages/validation-contracts.md`.
- [ ] Demo routes: home page + form validation demo (simulated + live .NET endpoint).
- [ ] CI/CD: `.github/workflows/release-angular-api-errors.yml`.
- [ ] Build scripts in `angular/package.json`.

## Validation

- Phase 1: `pnpm dotnet:restore && pnpm dotnet:build && pnpm dotnet:test`
- Phase 2: `pnpm test:lib:api-errors && pnpm build:lib`
- Phase 3: `pnpm test:app && pnpm test:e2e`
- Full gate: `pnpm format:check && pnpm lint && pnpm test:ci && pnpm test:e2e && pnpm build && pnpm verify:package`

## Follow-Ups

- Revisit nested collection-path conventions after first real consumers appear.
- Promote packages from roadmap to `currentPackages` in catalog after implementation completes.
