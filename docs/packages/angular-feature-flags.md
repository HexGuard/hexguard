# `@hexguard/angular-feature-flags`

Typed feature-flag evaluation for Angular with a pure evaluator, DI-backed facade, structural directive, route guards, and optional backend sync service.

## Current Contract

The `0.1.0` surface centers around these pieces:

- `evaluateFeatureFlag(flag, context)` — pure evaluation function
- `evaluateFeatureFlags(flags, context)` — batch evaluation
- `provideHexGuardFeatureFlags(catalog)` — DI provider
- `injectFeatureFlags()` — imperative facade with signal support
- `injectFeatureFlag(key, context)` — shorthand signal for a single flag
- `*hexguardFeatureFlag` — structural directive with optional variant and `else` fallback
- `canActivateFeatureFlag()` / `canMatchFeatureFlag()` — route guards with `redirectTo`
- `FeatureFlagSyncService` — optional HTTP sync with conditional 304

## Demo Routes

The repo demo app exposes:

- `/packages/angular-feature-flags` — package overview and demo catalog
- `/packages/angular-feature-flags/toggles` — persona-driven flag toggles with per-flag override controls, proving the evaluator, directive, and facade react consistently
- `/packages/angular-feature-flags/routing` — route gating demo with premium content guarded by `canActivateFeatureFlag` and redirect on denial
- `/packages/angular-feature-flags/premium` — the guarded premium content page (redirects to upgrade when flag is off)
- `/packages/angular-feature-flags/upgrade` — upgrade prompt shown when the premium route is denied

## Behavior Notes

### Shared evaluator across all adapters

The directive, route guards, and imperative facade all delegate to the same pure `evaluateFeatureFlag()` function. This avoids the usual drift where a route guard, a template `@if`, and an imperative check each encode flag logic differently.

### Deterministic rollout via FNV-1a hash

The rollout percentage uses a stable FNV-1a hash of the user ID. This produces the same result on both the Angular and .NET sides for the same user ID string, ensuring consistent cross-platform evaluation.

### Targeted evaluation context

The `FlagEvaluationContext` carries `userId`, optional `tenantId`, `groups`, and `attributes`. This allows both simple (userId-only) and rich (group + attribute) rule targeting without changing the evaluation interface.

### On-demand sync, opt-in polling

`FeatureFlagSyncService` syncs on demand via `sync()`. Polling is opt-in via `startPolling(intervalMs)`. The service uses the `contextHash` from the catalog for conditional 304 requests.

### Configurable sync endpoint path

The sync endpoint path defaults to `/api/feature-flags/sync` but can be customized
via `FeatureFlagSyncOptions.syncEndpointPath`. This lets consumers deploy the
Angular client against backends that expose the sync endpoint at a non-default
route (e.g. `/api/v2/feature-flags/sync` or `/flags/sync`).

### Custom HTTP fetch options

`FeatureFlagSyncOptions.fetchInit` accepts additional `RequestInit` properties
(headers, signal, credentials) that are merged into every sync HTTP request.
This enables authentication headers, CSRF tokens, and `AbortSignal` integration
without requiring a custom HTTP client wrapper.

### Demo persona + override model

The demo app provides a persona selector that changes the evaluation context (userId, groups, attributes). Additionally, per-flag override toggles bypass evaluation entirely, allowing manual flag on/off without a backend.

## Scope Boundaries

**Included** — pure evaluator, DI facade, directive, route guards, sync service, persona-driven demo with overrides, cross-stack pairing with HexGuard.FeatureFlags.

**Excluded** — EF Core / Redis store providers, advanced rules (date windows, gradual ramp), WebSocket push, flag admin UI, auth integration.

## Validation Surface

Validated through:

- Focused unit tests for the pure evaluator (27 tests covering all rule types, edge cases, first-match-wins ordering, rollout clamping, empty inputs)
- Angular TestBed tests for the facade
- Demo-app build coverage for package-home and live demo routes
- Cross-stack validation via .NET test suite (40 evaluator + store + endpoint tests, all passing)

## Related Resources

- [Package README](../../angular/packages/angular-feature-flags/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/dotnet/hexguard-feature-flags/)
- [Source Code](../../angular/packages/angular-feature-flags/src/)
- [.NET Counterpart: `HexGuard.FeatureFlags`](./hexguard-feature-flags.md)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                                      | Severity |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Most feature-rich package: pure evaluator, directive, route guards, sync service, 8 targeting rule types, FNV-1a hash for deterministic cross-platform rollout.                                                                              | praise   |
| Implementation Quality    | Pure evaluator well-designed with first-match-wins semantics, rollout clamping, empty input handling.                                                                                                                                        | praise   |
| Implementation Quality    | **Not registered in `angular/package.json` build or test scripts** — missing from `build:lib` chain, `test:lib` chain, and no individual `build:lib:feature-flags` / `test:lib:feature-flags` scripts. CI cannot build or test this package. | moderate |
| Test Coverage             | 27 pure evaluator tests covering all rule types, edge cases, first-match-wins, rollout clamping, empty inputs.                                                                                                                               | praise   |
| Test Coverage             | **No Angular TestBed tests** for `injectFeatureFlags()`, `*hexguardFeatureFlag` directive, `canActivateFeatureFlag`, `canMatchFeatureFlag`, or `injectFeatureFlag()` shorthand.                                                              | moderate |
| Demo Integration          | Demo pages exist with Playwright hooks.                                                                                                                                                                                                      | praise   |
| Cross-package Consistency | No `CHANGELOG.md` found (unlike other packages). .NET counterpart `HexGuard.FeatureFlags` exists with matching contract shapes.                                                                                                              | minor    |
