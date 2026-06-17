---
id: feature-feature-flags-cross-stack
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.FeatureFlags + @hexguard/angular-feature-flags'
---

# Feature Flags Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.FeatureFlags` + `@hexguard/angular-feature-flags`) for server-managed feature-flag evaluation, targeting rules, and client-side flag sync.

The repeated problem is that feature flags are often evaluated independently on the frontend (local config, environment variables) and backend (app settings, database), leading to drift where a flag is enabled for one API call but not the matching UI element. A shared evaluation and sync contract would make flag behavior consistent and inspectable across the stack.

The Angular-only `@hexguard/angular-feature-flags` proposal already exists for client-side flag evaluation. This brief extends it into a full cross-stack pair with the .NET `HexGuard.FeatureFlags` package providing server-side evaluation, targeting, and a sync endpoint that the Angular client consumes.

## Goals

- Define a shared feature-flag contract (flag key, boolean/enum/percentage value, targeting context).
- Provide a .NET package (`HexGuard.FeatureFlags`) for server-side flag evaluation, targeting-rule resolution, and a flag-sync API endpoint.
- Provide an Angular package (`@hexguard/angular-feature-flags`) for client-side flag evaluation with optional server-sync, caching, and fallback semantics.
- Support common flag types: boolean rollout, percentage-based rollout, and enum/multi-variant flags.
- Compose with Angular permissions and page-context for route gating and action visibility.
- Keep both packages independently useful — Angular can work with any flag source; .NET can work without the Angular consumer.

## Non-Goals

- Building a remote flag-management dashboard or admin UI.
- Shipping experimentation analytics or A/B test result tracking in the first version.
- Replacing role-based access control or permission contracts.
- Real-time flag push (SSE/WebSocket) in the first version — polling and fetch-on-load are sufficient.

## Decisions

- Treat the pair as a coordinated contract with independent minor versioning (major versions stay in lockstep, patches can diverge).
- Prefer a fetch-on-load + cache strategy for the Angular client over real-time push in v0.1.
- Use the same targeting-context model on both sides (user, tenant, environment, custom attributes).
- Keep the Angular flag evaluator headless — route guards, template directives, and service checks are all consumers of the same evaluator.

## Proposed Contracts

### Shared Flag Model

```csharp
// .NET
public record FeatureFlag(
    string Key,
    string Variant,        // "on", "off", or custom variant key
    double RolloutPercentage,
    IReadOnlyDictionary<string, string> Payload  // optional variant payload
);

public record FlagEvaluationContext(
    string UserId,
    string? TenantId,
    string Environment,
    Dictionary<string, string> Attributes
);
```

```ts
// Angular
interface FeatureFlag {
  key: string;
  variant: string;
  rolloutPercentage: number;
  payload?: Record<string, string>;
}

interface FlagEvaluationContext {
  userId: string;
  tenantId?: string;
  environment: string;
  attributes?: Record<string, string>;
}
```

### Sync Endpoint (proposed)

```
GET /api/feature-flags/sync?context={evaluated-context-hash}
→ 200 { flags: FeatureFlag[], evaluatedAt: string, contextHash: string }
→ 304 Not Modified (when context hash matches server state)
```

## Implementation Plan

### Phase 0: .NET — HexGuard.FeatureFlags

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.FeatureFlags/` and `dotnet/tests/HexGuard.FeatureFlags.Tests/`.
2. Define the core models: `FeatureFlag`, `FlagEvaluationContext`, `FlagVariant`, `FlagDefinition`.
3. Implement `IFeatureFlagProvider` interface and an `InMemoryFeatureFlagProvider` for development and testing.
4. Implement `FlagEvaluator` — evaluates targeting rules (user match, percentage rollout, tenant match, environment match) and resolves the effective variant.
5. Implement a minimal-API endpoint (`GET /api/feature-flags/sync`) with ETag-based `304 Not Modified` support.
6. Add unit and integration tests via `WebApplicationFactory`.

### Phase 1: Angular — @hexguard/angular-feature-flags

7. Scaffold the publishable Angular library under `angular/packages/angular-feature-flags/`.
8. Define the Angular TypeScript types mirroring the .NET contracts.
9. Implement `FlagEvaluator` service with `isEnabled(key)`, `getVariant(key)`, `getPayload(key)` methods returning signals.
10. Implement `FlagSyncService` — fetches flags from the .NET sync endpoint, caches with configurable TTL, handles 304 responses.
11. Implement `injectFlags()` facade that combines the evaluator and sync service.
12. Add Angular route guards (`canMatchFlags`, `canActivateFlags`) and a structural directive (`*hexguardFlag`).
13. Add unit tests for evaluation, targeting, caching, fallback, and 304 handling.

### Phase 2: Demo & Docs

14. Add a demo route at `/packages/angular-feature-flags` showing:
    - Toggle flags (on/off) with real-time UI gating
    - Percentage-rollout flags showing different outcomes per refresh
    - Enum/multi-variant flags with different UI per variant
    - Server-sync demo with the .NET sample API (`pnpm dotnet:start:demo-api`)
    - Fallback behavior when the API is unreachable
15. Add the .NET sync endpoint to the shared `HexGuard.SampleApi` under `Packages/HexGuardFeatureFlags/`.
16. Add Playwright coverage for the demo page.
17. Write deep-dive docs: `docs/packages/angular-feature-flags.md`, `docs/packages/hexguard-feature-flags.md`.
18. Update the npm-facing and NuGet READMEs.

### Phase 3: Release

19. Add build, test, and verify scripts for both packages.
20. Add `.github/workflows/release-angular-feature-flags.yml` and `.github/workflows/release-dotnet-feature-flags.yml`.
21. Run `pnpm test:ci`, `pnpm build`, `pnpm dotnet:test`, and `pnpm dotnet:build` for the full validation gate.

## Validation

- `pnpm dotnet:test` — .NET unit and integration tests for evaluation, targeting, sync endpoint.
- `pnpm test:lib:feature-flags` — Angular unit tests for evaluator, sync, caching, guards, directive.
- `pnpm build:lib` — Angular package builds.
- `pnpm test:app` — Demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm dotnet:build` — .NET package builds.

## Follow-Ups

- Revisit real-time flag push via SSE after the polling-based sync proves broadly useful.
- Evaluate whether a flag-audit-log (who saw which variant) belongs in a separate package or an optional extension.
- Compare overlap with server-provided capabilities/permissions once both contracts are clearer.
- Consider adding an Angular flag-override dev-tools panel for development and testing.
