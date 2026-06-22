# HexGuard.Capabilities

Persona-based capability and role evaluation for ASP.NET Core APIs. The .NET counterpart of `@hexguard/angular-permissions`.

## Public API

### Core Types

| Type                      | Description                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `CapabilitySet`           | Sealed record with `Roles` (`IReadOnlyList<string>`) and `Permissions` (`IReadOnlyDictionary<string, IReadOnlyList<string>>`) |
| `CapabilityCheckRequest`  | Request model with `Resource` and `Action`                                                                                    |
| `CapabilityCheckResponse` | Response model with `Allowed` boolean                                                                                         |
| `CapabilitiesOptions`     | Options class for configuring in-memory capability data per user                                                              |

### Service Interface

```csharp
public interface ICapabilityService
{
    Task<CapabilitySet> GetCapabilitiesAsync(CancellationToken ct = default);
    Task<bool> HasCapabilityAsync(string resource, string action, CancellationToken ct = default);
}
```

### Store Interface

```csharp
public interface ICapabilityStore
{
    Task<CapabilitySet?> GetCapabilitiesAsync(string userId, CancellationToken ct = default);
    Task SetCapabilitiesAsync(string userId, CapabilitySet capabilities, CancellationToken ct = default);
}
```

### Implementations

- `CapabilityService` — default `ICapabilityService` implementation using any `ICapabilityStore` with `SetCurrentUser()` for context
- `InMemoryCapabilityStore` — default store populated from `CapabilitiesOptions`

### DI Registration

```csharp
// In-memory store with inline data:
builder.Services.AddHexGuardCapabilities(options =>
{
    options.AddCapabilities("admin", new CapabilitySet
    {
        Roles = new[] { "admin", "analyst" },
        Permissions = new Dictionary<string, IReadOnlyList<string>>
        {
            ["orders"] = new[] { "create", "read", "update", "delete" },
            ["reports"] = new[] { "read" },
        },
    });
});

// Or with a custom store:
builder.Services.AddHexGuardCapabilities<MyCapabilityStore>();
```

### Endpoints

```csharp
app.MapGroup("/api/capabilities").MapCapabilityEndpoints();
// registers GET  /api/capabilities/user   — returns the full CapabilitySet for the current user
//       POST /api/capabilities/check  — checks a specific resource+action (returns { allowed })
```

## Demo Endpoints

The shared `HexGuard.SampleApi` extends the library endpoints with persona support:

| Endpoint                                       | Description                              |
| ---------------------------------------------- | ---------------------------------------- |
| `GET /api/capabilities/personas`               | Returns available demo personas          |
| `GET /api/capabilities/user?persona={persona}` | Returns the capability set for a persona |

## Personas

Four demo personas are available:

| Persona    | Roles                              | Capabilities                                                                                             |
| ---------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `guest`    | `["guest"]`                        | `orders: [read]`                                                                                         |
| `analyst`  | `["analyst"]`                      | `orders: [read], reports: [read]`                                                                        |
| `approver` | `["approver"]`                     | `orders: [read, update]`                                                                                 |
| `admin`    | `["admin", "analyst", "approver"]` | `orders: [create, read, update, delete], reports: [read, create], users: [read, create, update, delete]` |

## Cross-Stack Pairing

| Side    | Package                         |
| ------- | ------------------------------- |
| .NET    | `HexGuard.Capabilities`         |
| Angular | `@hexguard/angular-permissions` |

Both packages share:

- Same role/permission contract shape (`CapabilitySet` ↔ `PermissionContext`)
- Persona-based evaluation semantics
- Same SampleApi endpoints for end-to-end integration

### Angular Integration

On the Angular side, use `provideCapabilitySync()` to sync the server-side capability set into the Angular permission evaluator:

```typescript
import { provideCapabilitySync } from '@hexguard/angular-permissions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCapabilitySync({
      fetch: () => fetch('/api/capabilities/user').then((r) => r.json()),
      refreshIntervalMs: 60_000,
    }),
    // ... other providers
  ],
};
```

The `CapabilitySet.Roles` maps to `PermissionContext.roles` and each `Permissions[resource]` entry is flattened to `"resource.action"` capability strings consumed by `injectPermissions()`, `*hexguardCan`, and route guards.

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                            | Severity |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| Public API Design         | Clean separation: `ICapabilityService` vs `ICapabilityStore`. Register/check capability patterns.                  | praise   |
| Implementation Quality    | `InMemoryCapabilityStore` for dev/test. Proper `InternalsVisibleTo`.                                               | praise   |
| Cross-package Consistency | Release workflow included in `release-dotnet.yml`. Paired with `@hexguard/angular-permissions`.                    | praise   |
| Documentation             | **No `README.md` in package directory** — unlike all other .NET packages.                                          | moderate |
| Implementation Quality    | `SetCurrentUser()` relies on manual middleware — no built-in middleware to wire up `AsyncLocal` from HTTP context. | minor    |
