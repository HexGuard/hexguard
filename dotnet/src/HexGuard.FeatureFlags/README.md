# HexGuard.FeatureFlags

**Feature flag evaluation, targeting rules, and sync endpoints for ASP.NET Core APIs.**

Part of the [HexGuard](https://github.com/HexGuard/hexguard) catalog.
Pairs with [`@hexguard/angular-feature-flags`](https://github.com/HexGuard/hexguard/tree/main/angular/packages/angular-feature-flags) on the Angular side.

## Install

```shell
dotnet add package HexGuard.FeatureFlags
```

Requires `net10.0` or later and a `FrameworkReference` to `Microsoft.AspNetCore.App`.

## Quick Start

```csharp
using HexGuard.FeatureFlags;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHexGuardFeatureFlags(options =>
{
    options.Flags.Add(new FeatureFlag(
        Key: "beta-search",
        Enabled: true,
        Variant: "search-v2",
        TargetingRules: new TargetingRule[]
        {
            new GroupInRule(new[] { "beta-testers" }),
            new RolloutRule(25),
        }));
});

var app = builder.Build();

// Map sync and evaluate endpoints
app.MapFeatureFlagEndpoints();

app.Run();
```

## API Surface

### Core Types

- `FeatureFlag` — flag record with key, enabled state, variant, rollout percentage, targeting rules, and metadata.
- `FlagEvaluationContext` — evaluation context with UserId, TenantId, Groups, and Attributes.
- `FeatureFlagCatalog` — snapshot of all flags with a content hash for conditional sync.
- `EvaluationResult` — evaluation outcome with enablement, variant, matched rule, and timestamp.

### Targeting Rules

| Rule                    | Description                                                   |
| ----------------------- | ------------------------------------------------------------- |
| `AlwaysRule`            | Enabled for all users                                         |
| `NeverRule`             | Disabled for all users                                        |
| `RolloutRule`           | Enabled for a percentage of users (deterministic FNV-1a hash) |
| `UserInRule`            | Enabled for specific user IDs                                 |
| `UserNotInRule`         | Disabled for specific user IDs                                |
| `GroupInRule`           | Enabled for users in specific groups                          |
| `GroupNotInRule`        | Disabled for users in specific groups                         |
| `AttributeMatchRule`    | Enabled when a context attribute matches                      |
| `AttributeNotMatchRule` | Disabled when a context attribute matches                     |

Rules are evaluated **first-match-wins** in the order they appear.

### Endpoints

When you call `app.MapFeatureFlagEndpoints()`, two endpoints are registered:

| Endpoint                                                              | Description                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `GET {prefix}/sync?contextHash={hash}`                                | Returns full flag catalog with new hash, or 304 if unchanged |
| `GET {prefix}/evaluate?key={key}&userId={userId}&tenantId={tenantId}` | Evaluates a single flag                                      |

The default prefix is `/api/feature-flags`. Customize it by passing a
`pathPrefix` argument:

```csharp
// Map under a custom prefix
app.MapFeatureFlagEndpoints(pathPrefix: "/api/v2/feature-flags");

// Or without a leading slash (it's added automatically)
app.MapFeatureFlagEndpoints(pathPrefix: "feature-flags");
```

### DI Registration

```csharp
// Register with inline flags
builder.Services.AddHexGuardFeatureFlags(options => { /* ... */ });

// The store is available for injection
public class MyService
{
    public MyService(IFeatureFlagStore store) { }
}
```

## Resources

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/hexguard-feature-flags.md)
- [@hexguard/angular-feature-flags (Angular counterpart)](https://github.com/HexGuard/hexguard/tree/main/angular/packages/angular-feature-flags)
- [Demo app](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
