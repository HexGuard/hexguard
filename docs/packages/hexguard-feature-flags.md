# HexGuard.FeatureFlags

Feature flag evaluation, targeting rules, and sync endpoints for ASP.NET Core APIs. The .NET counterpart of `@hexguard/angular-feature-flags`.

## Public API

### Core Types

| Type                                                                                                                                                    | Description                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `FeatureFlag`                                                                                                                                           | Sealed record with Key, Enabled, Variant, RolloutPercentage, TargetingRules, Metadata |
| `FlagEvaluationContext`                                                                                                                                 | Evaluation context: UserId, TenantId, Groups, Attributes                              |
| `FeatureFlagCatalog`                                                                                                                                    | All flags keyed by string, plus EvaluatedAt and ContextHash                           |
| `EvaluationResult`                                                                                                                                      | Evaluation outcome: Key, Enabled, Variant, EvaluatedAt, MatchedRule                   |
| `TargetingRule` (abstract)                                                                                                                              | Base record for all rule types                                                        |
| `AlwaysRule`, `NeverRule`, `RolloutRule`, `UserInRule`, `UserNotInRule`, `GroupInRule`, `GroupNotInRule`, `AttributeMatchRule`, `AttributeNotMatchRule` | Concrete rule types                                                                   |

### Evaluation

```csharp
var result = FeatureFlagEvaluator.Evaluate(flag, context);
// result.Enabled, result.Variant, result.MatchedRule

var results = FeatureFlagEvaluator.EvaluateMany(catalog.Flags, context);
```

### Store

```csharp
public interface IFeatureFlagStore
{
    Task<FeatureFlagCatalog> GetCatalogAsync(CancellationToken ct = default);
    Task<FeatureFlag?> GetFlagAsync(string key, CancellationToken ct = default);
}
```

The `InMemoryFeatureFlagStore` is the default implementation, populated from `FeatureFlagOptions`.

### DI Registration

```csharp
builder.Services.AddHexGuardFeatureFlags(options =>
{
    options.Flags.AddRange(flags);
});
```

### Endpoints

```csharp
app.MapFeatureFlagEndpoints();  // registers /api/feature-flags/sync and /api/feature-flags/evaluate
```

## Demo Endpoints

The shared `HexGuard.SampleApi` exposes:

| Endpoint                                                                                 | Description                       |
| ---------------------------------------------------------------------------------------- | --------------------------------- |
| `GET /api/feature-flags/sync?contextHash={hash}`                                         | Returns flags or 304              |
| `GET /api/feature-flags/evaluate?key={key}&userId={userId}`                              | Evaluates a single flag           |
| `GET /api/feature-flags/personas`                                                        | Returns available demo personas   |
| `GET /api/feature-flags/evaluate-all?userId={userId}&groups={groups}&attributes={attrs}` | Evaluates all flags for a context |

## Targeting Rules

| Rule                                  | First-match behavior                                               |
| ------------------------------------- | ------------------------------------------------------------------ |
| `always`                              | Always matches — flag is enabled                                   |
| `never`                               | Always matches — flag is disabled                                  |
| `rollout`: percentage                 | Matches when `FNV-1a(userId) % 100 < percentage`                   |
| `userIn`: users                       | Matches when context UserId is in the list                         |
| `userNotIn`: users                    | Passes through (does not match) when context UserId is in the list |
| `groupIn`: groups                     | Matches when any context group is in the list                      |
| `groupNotIn`: groups                  | Passes through when any context group is in the list               |
| `attributeMatch`: attribute, value    | Matches when context attribute equals value                        |
| `attributeNotMatch`: attribute, value | Passes through when context attribute equals value                 |

## Cross-Stack Pairing

| Side    | Package                           |
| ------- | --------------------------------- |
| .NET    | `HexGuard.FeatureFlags`           |
| Angular | `@hexguard/angular-feature-flags` |

Both packages share:

- Identical flag contract shape (Key, Enabled, Variant, RolloutPercentage, TargetingRules)
- Same FNV-1a hash algorithm for deterministic rollout
- Same sync endpoint contract (`GET /api/feature-flags/sync` with `contextHash`)
- Same targeting rule semantics (first-match-wins, 8 rule types)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                               | Severity |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Well-designed evaluation engine with first-match-wins, 8 rule types, deterministic FNV-1a rollout hashing, 304 Not Modified sync via content hashing. | praise   |
| Implementation Quality    | `InMemoryFeatureFlagStore` with SHA-256 context hash for sync. Proper `InternalsVisibleTo`.                                                           | praise   |
| Cross-package Consistency | **No release workflow** — FeatureFlags is NOT in `release-dotnet.yml`.                                                                                | moderate |
| Cross-package Consistency | `ComputeContextHash` is `internal` — external store implementors cannot compute compatible hashes for 304 sync.                                       | minor    |
| Documentation             | Deep-dive doc exists. XML doc on public APIs.                                                                                                         | praise   |
