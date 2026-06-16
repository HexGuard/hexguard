# Changelog

## 0.1.0 — 2026-06-16

Initial release of `@hexguard/angular-permissions`.

### Features

- Pure `evaluatePermission()` — evaluates `all`, `any`, and `none` rules for capabilities and roles
- `PermissionDecision` with detailed `failedRequirements` for observability
- `provideHexGuardPermissions(source)` — static or signal-backed permission context registration
- `injectPermissions()` — imperative facade with `can()`, `evaluate()`, `canSignal()`, and `decisionSignal()`
- `canActivatePermissions()` — route activation guard with `UrlTree` redirect support
- `canMatchPermissions()` — route matching guard with `UrlTree` redirect support
- `*hexguardCan` structural directive — primary content with optional `else` fallback template
- `PermissionRequirementMissingError` — descriptive error when guards lack a requirement
- Generic `TCapability` and `TRole` type parameters for domain-specific permission key types

### Documentation

- Package README with feature matrix, quickstart, and API reference
- Deep package notes in `docs/packages/angular-permissions.md`
- Docs-grade demo app with actions and routing routes
- Playwright end-to-end coverage for persona-driven gating and route redirection
