---
id: feature-capabilities-cross-stack
type: feature
status: proposed
created: 2026-06-19
package: 'HexGuard.Capabilities + @hexguard/angular-permissions'
---

# Capabilities Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.Capabilities` + `@hexguard/angular-permissions`) that standardizes backend-issued capability contracts and wires them into Angular's existing permission-evaluation pipeline so action gating and authorization drift less across the stack.

The repeated problem is that Angular permission checks (`*hexguardCan`, `canActivatePermissions`) work with whatever permission data the app provides, but there's no standard contract for how the backend *issues* those permissions. Every API invents its own `{ roles: [], permissions: {} }` response shape, and the mapping layer between backend claims and frontend permission checks is rewritten in every project. `HexGuard.Capabilities` would close that gap by defining the server-side contract that feeds directly into `@hexguard/angular-permissions`.

## Goals

- Define a **shared capability contract** that the .NET API issues and the Angular permissions package consumes directly.
- Provide a .NET package (`HexGuard.Capabilities`) for defining, evaluating, and serving capability/role contracts via a standard endpoint.
- Extend `@hexguard/angular-permissions` (already published) with a **capability sync adapter** that fetches capabilities from the .NET endpoint and populates the permission context.
- Add a **cross-stack demo** with a permissions ecosystem page that shows the full flow: .NET backend issues capabilities → Angular fetches and evaluates them → UI gating responds accordingly.
- Add **Playwright coverage** for the full cross-stack scenario.
- Keep the Angular side fully backward-compatible — the capability sync adapter is optional; apps can still provide permissions manually.

## Non-Goals

- Replacing ASP.NET Core authorization policies or `[Authorize]` attributes — this is for frontend-facing capability contracts, not backend security enforcement.
- A full identity or authentication system — capabilities describe *what a user can do*, not *who they are*.
- Real-time permission push — polling or fetch-on-load is sufficient for the first version.

## Decisions

- The .NET package defines the canonical capability model; the Angular package already has matching types.
- The sync endpoint returns a `CapabilitySet` (`{ roles, permissions }`) that maps 1:1 to the Angular `PermissionContext`.
- The Angular adapter (`provideCapabilitySync`) fetches capabilities on app init or login and feeds them into `provideHexGuardPermissions`.
- Versioning: Coordinated minor/major releases; patches can diverge.
- Demo: Add an ecosystem/hub page at `/ecosystems/capabilities` that links to both the Angular demos and the .NET endpoint explorer.

## Proposed Contracts

### .NET — HexGuard.Capabilities

```csharp
// Core capability models
public record CapabilitySet(
    IReadOnlyList<string> Roles,
    IReadOnlyDictionary<string, IReadOnlyList<string>> Permissions  // resource → [action, action]
);

public record CapabilityRequest(
    string? UserId,
    string? TenantId
);

// Endpoints
// GET  /api/capabilities/current    → CapabilitySet  (for the current user)
// POST /api/capabilities/check      → { allowed: bool, missing: string[] }
// POST /api/capabilities/evaluate   → CapabilitySet  (for a specified user, admin-only)

// Service interface
public interface ICapabilityService
{
    Task<CapabilitySet> GetCapabilitiesAsync(string? userId = null);
    Task<bool> HasCapabilityAsync(string userId, string resource, string action);
}

// Registration
builder.Services.AddHexGuardCapabilities(options =>
{
    options.UseInMemoryStore();      // development default
    // or provide a custom ICapabilityStore
});
```

### Angular — @hexguard/angular-permissions (capability sync adapter)

```ts
import { provideCapabilitySync } from '@hexguard/angular-permissions';

// In app.config.ts
export const appProviders = [
  provideHexGuardPermissions(initialContext),
  provideCapabilitySync({
    url: '/api/capabilities/current',
    intervalMs: 300_000,                    // optional polling (default: 0 = no polling)
    onError: (err) => console.error(err),   // optional error handler
  }),
];

// The adapter fetches the CapabilitySet from the server, maps it to a
// PermissionContext, and feeds it into the existing injectPermissions() pipeline.
// All existing *hexguardCan, canActivatePermissions, etc. work unchanged.

// Types (already exist in angular-permissions, shown for reference)
interface CapabilitySet {
  roles: string[];
  permissions: Record<string, string[]>;
}
```

## Implementation Plan

### Phase 0: .NET — HexGuard.Capabilities

1. **Scaffold the .NET project**
   - Create `dotnet/src/HexGuard.Capabilities/` and `dotnet/tests/HexGuard.Capabilities.Tests/`
   - Add `HexGuard.Capabilities.csproj` with `TargetFramework: net10.0`, `ImplicitUsings: enable`, `Nullable: enable`
   - Add `InternalsVisibleTo` for the test project
   - Register in `dotnet/HexGuard.slnx` under `<Folder Name="/src/">` and `<Folder Name="/tests/">`

2. **Define core types**
   - `CapabilitySet` record with `Roles` and `Permissions`
   - `CapabilityRequest` record
   - `ICapabilityService` interface with `GetCapabilitiesAsync()` and `HasCapabilityAsync()`
   - `ICapabilityStore` interface for pluggable persistence

3. **Implement evaluation**
   - `CapabilityService` — resolves capabilities from the store, applies any overrides
   - `InMemoryCapabilityStore` — seeded via `AddHexGuardCapabilities(cfg => cfg.AddCapabilities(...))`
   - `CapabilityAuthorizationHandler` — integrates with ASP.NET Core authorization (optional)

4. **Implement endpoints**
   - `GET /api/capabilities/current` — returns the current user's capability set
   - `POST /api/capabilities/check` — checks a specific resource+action permission
   - `MapCapabilityEndpoints()` extension for minimal-API registration

5. **Unit and integration tests**
   - `WebApplicationFactory` tests for endpoint behavior
   - Unit tests for service evaluation, store operations, edge cases (empty, unknown user)

6. **Register in HexGuard.SampleApi**
   - Add `HexGuard.Capabilities` project reference
   - Add `Packages/HexGuardCapabilities/CapabilitiesSampleData.cs` with persona-based data
   - Add `Packages/HexGuardCapabilities/CapabilitiesSampleEndpoints.cs` with demo endpoints
   - Register in `Program.cs`

### Phase 1: Angular — @hexguard/angular-permissions (capability sync adapter)

7. **Add capability sync to the existing package**
   - Add `capability-sync.ts` to `angular/packages/angular-permissions/src/lib/`
   - Implement `provideCapabilitySync()` provider function
   - Implement `CapabilitySyncService` that fetches from the endpoint, parses `CapabilitySet`, and calls `provideHexGuardPermissions()`
   - Add optional polling with configurable interval
   - Export from `public-api.ts`

8. **Add a `PermissionContext` factory**
   - `CapabilitySet.toPermissionContext()` — static method converting the API response to the internal context format
   - Keeps the existing `evaluatePermission()` pipeline unchanged

9. **Unit tests**
   - `capability-sync.service.spec.ts` — fetch success, fetch failure, polling, cleanup
   - `capability-set-to-context.spec.ts` — mapping correctness, edge cases

### Phase 2: Demo — Permissions Ecosystem Page

10. **Create the ecosystem hub page**
    - Add `angular/apps/demo-angular/src/app/features/ecosystems/pages/capabilities-ecosystem-page/`
    - Use `DotnetPackageHubPageComponent` layout (similar to existing ecosystem pages)
    - Sections: overview, Angular demos, .NET API explorer, live integration demo

11. **Add a live integration demo within the ecosystem page**
    - A component that calls the .NET SampleApi `/api/capabilities/current` endpoint
    - Displays the raw capability JSON response
    - Shows the evaluated permission context
    - Demonstrates `*hexguardCan` directive gating based on live server data

12. **Enhance existing permission-actions demo**
    - Add a toggle between "mock permissions" and "live API permissions"
    - When "live" is selected, fetch from `GET /api/permissions/user?persona=...`
    - Wire the response into `injectPermissions()`

13. **Add demo registry entries**
    - `CAPABILITIES_ECOSYSTEM` entry in `demo-registry.ts`
    - Route for `/ecosystems/capabilities`
    - Route for `/packages/angular-permissions/live-api` (new demo variant)

14. **Generate demo snippets**
    - Add entry in `scripts/generate-demo-snippets.mjs`

15. **Add Playwright tests**
    - Test the ecosystem page renders all sections
    - Test live API fetch displays capability data
    - Test permission gating responds to different personas
    - Test error state when API is unavailable

### Phase 3: Documentation

16. **Write .NET deep-dive doc**
    - `docs/packages/hexguard-capabilities.md`
    - Quickstart, API reference, persona-based evaluation, store configuration

17. **Update Angular permissions deep-dive**
    - `docs/packages/angular-permissions.md` — add capability sync section
    - New quickstart showing `provideCapabilitySync()` alongside `provideHexGuardPermissions()`

18. **Write cross-stack integration guide**
    - `docs/packages/capabilities-cross-stack.md`
    - End-to-end walkthrough: define capabilities on the server, sync to the client, gate UI

19. **Update package READMEs**
    - Add capability sync documentation to `angular/packages/angular-permissions/README.md`
    - Add quickstart to `dotnet/src/HexGuard.Capabilities/README.md`

### Phase 4: Package Metadata & Release

20. **Register in catalog**
    - Move `capabilities` from `roadmapPackages` to `currentPackages` in `scripts/package-catalog.data.mjs`
    - Run `pnpm catalog:sync`

21. **Add build/scripts**
    - `angular/package.json`: already has `build:lib:permissions` and `test:lib:permissions`
    - `dotnet`: add to `pnpm dotnet:build` and `pnpm dotnet:test`

22. **Add release workflows**
    - `.github/workflows/release-angular-permissions.yml` — update to publish the updated package
    - `.github/workflows/release-dotnet-capabilities.yml` — new workflow for the NuGet package
    - Tag pattern: `capabilities-v*`

23. **Run validation gate**
    - `pnpm format:check && pnpm lint && pnpm test:ci && pnpm test:e2e && pnpm build && pnpm verify:package && pnpm dotnet:restore && pnpm dotnet:build && pnpm dotnet:test`

## Validation

- `pnpm dotnet:test` — .NET unit + integration tests for `CapabilityService`, endpoints, store
- `pnpm test:lib:permissions` — Angular unit tests for capability sync, context mapping
- `pnpm test:app` — demo app compiles
- `pnpm test:e2e` — Playwright coverage for ecosystem page and live API demo
- `pnpm build:lib` — Angular package builds
- `pnpm dotnet:build` — .NET package builds
- `pnpm verify:package` — tarball smoke test
- Manual: start `pnpm start` + `pnpm dotnet:start:demo-api`, navigate to `/ecosystems/capabilities`

## Follow-Ups

- Revisit real-time permission updates via SSE or SignalR for apps that need instant revocation.
- Evaluate a `HexGuard.Capabilities` ASP.NET Core authorization policy adapter that bridges `ICapabilityService` to `[Authorize]` attributes.
- Consider adding a `CapabilityAdminController` for managing capabilities at runtime (admin UI).
