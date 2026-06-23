# `@hexguard/angular-permissions`

Headless capability and role evaluation for Angular routes, templates, and feature code.

The first implementation keeps the package intentionally narrow:

- a normalized permission context made of capabilities and roles
- one pure evaluator for imperative checks and route decisions
- thin Angular adapters for route guards and structural template gating

The package is provider-agnostic. It does not parse tokens or backend claim payloads for you. The
application owns that mapping and passes a normalized permission context into the library.

## Current Contract

The `0.1.0` surface centers around four pieces:

- `provideHexGuardPermissions(source)` for registering the current context in Angular DI
- `evaluatePermission(context, requirement)` for pure capability and role checks
- `injectPermissions()` for imperative checks and derived signals inside Angular code
- thin adapters: `canActivatePermissions()`, `canMatchPermissions()`, and `*hexguardCan`

The normalized `PermissionRequirement` shape intentionally stays shallow:

- `allCapabilities`
- `anyCapabilities`
- `noneCapabilities`
- `allRoles`
- `anyRoles`
- `noneRoles`

This keeps the permission model explicit and readable in route definitions, components, and tests.

## Demo Routes

The repo demo app exposes:

- `/packages/angular-permissions`: package overview and demo catalog
- `/packages/angular-permissions/actions`: persona-driven action gating with disabled buttons, hidden content, and fallback templates
- `/packages/angular-permissions/routing`: route gating with `CanActivate` and `CanMatch` helpers plus an explicit denied route

The action demo proves that disabled-button booleans and hidden surfaces can reuse the same shared
permission evaluator. The routing demo proves the same context and requirements can gate route
activation and route matching without introducing a separate route-only access model.

## Behavior Notes

### Shared evaluator, not parallel rule engines

The most important design choice is that route helpers, the directive, and imperative checks all
delegate to the same pure evaluator. That avoids the usual drift where a route guard, a button
disable rule, and a template `@if` each encode access slightly differently.

### Signal-backed current context

`provideHexGuardPermissions()` accepts either a static context or a signal-backed context. The demo
app uses a shared persona signal so route guards, components, and templates all react to the same
current access state.

### Redirects stay explicit

`canActivatePermissions()` and `canMatchPermissions()` return `false` by default when access is
denied. If `redirectTo` is supplied, they return a `UrlTree` instead. This keeps redirect behavior
visible in the route definition rather than hidden inside app-wide side effects.

## Scope Boundaries

Included in the current package:

- capabilities and roles
- imperative permission checks
- route guard helpers
- one structural directive
- docs-grade demo coverage

Excluded from the current package:

- token parsing and auth-provider integration
- backend authorization logic
- resource-aware predicates
- feature-flag composition
- menu builders and page-shell orchestration
- a broad policy DSL

Feature flags remain a separate package concern until both packages are mature enough to define a
clean integration boundary.

## Capability Sync (Cross-Stack Bridge)

The package provides a cross-stack bridge to `HexGuard.Capabilities` via `provideCapabilitySync()`.

### Configuration

```typescript
import { provideCapabilitySync } from '@hexguard/angular-permissions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideCapabilitySync({
      // A fetch function that returns a CapabilitySet from a .NET backend:
      fetch: () => fetch('/api/capabilities/user').then((r) => r.json()),
      // Optional: periodic refresh every 60 seconds:
      refreshIntervalMs: 60_000,
    }),
  ],
};
```

### How it works

1. On bootstrap, `provideCapabilitySync()` fires the `fetch` function and maps the returned `CapabilitySet` to a `PermissionContext`.
2. `CapabilitySet.Roles` → `PermissionContext.roles` (e.g. `["admin", "analyst"]`).
3. `CapabilitySet.Permissions` (resource → action list) → flattened `PermissionContext.capabilities` using `"resource.action"` format (e.g. `"orders.read"`, `"orders.create"`).
4. The context is signal-backed, so route guards, `*hexguardCan`, and `injectPermissions()` all reactively update when capabilities change.

### Manual updates

For persona switching or on-demand refresh, use `updateCapabilityContext()`:

```typescript
import { updateCapabilityContext } from '@hexguard/angular-permissions';

const data = await fetch(`/api/capabilities/user?persona=${persona}`).then((r) => r.json());
updateCapabilityContext(data);
```

> Note: the `/api/capabilities/user` endpoint is registered by calling
> `MapCapabilityEndpoints()` on the .NET side, which uses `ICapabilityService`
> internally. The SampleApi extends it with persona switching support.

### Pure mapper

The `toPermissionContext()` function is a pure mapper that converts `CapabilitySet` → `PermissionContext` without side effects, suitable for testing:

```typescript
import { toPermissionContext } from '@hexguard/angular-permissions';

const ctx = toPermissionContext({
  roles: ['admin'],
  permissions: { orders: ['read', 'write'] },
});
// → { roles: ['admin'], capabilities: ['orders.read', 'orders.write'] }
```

## Validation Surface

The current implementation is validated through:

- focused unit tests for the pure evaluator
- Angular tests for the injected facade, route guards, and directive
- demo-app build coverage for package-home and live permissions routes
- Playwright coverage for package overview, persona switching, and guarded child-route redirects

For repo-level validation commands, use the package README and the demo runbook together.

## Related Resources

- [Package README](../../angular/packages/angular-permissions/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-permissions/)
- [Source Code](../../angular/packages/angular-permissions/src/)
- [.NET Counterpart: `HexGuard.Capabilities`](./hexguard-capabilities.md)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                               | Severity |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Largest API in workspace: `evaluatePermission()` pure evaluator, `provide*()` + `inject*()`, route guards (`canActivatePermissions`, `canMatchPermissions`), `*hexguardCan` directive, `.NET` capability sync bridge. | praise   |
| Implementation Quality    | Single pure evaluator shared by all Angular adapters — prevents drift between facade, guards, and directive. Signal-backed context for reactive updates.                                                              | praise   |
| Implementation Quality    | Cross-stack .NET bridge via `CapabilitySync` — `CapabilitySet.Roles` → `PermissionContext.roles`, permissions flattened to `"resource.action"` capability strings.                                                    | praise   |
| Test Coverage             | Pure evaluator tests (all/any/none, roles/capabilities), facade (imperative checks, signal reactivity), guards (redirect, UrlTree, command arrays), directive (else template, context switching).                     | praise   |
| Test Coverage             | No test for `updateCapabilityContext()` imperative function (exported but untested). `EMPTY_PERMISSION_CONTEXT` frozen but default context token creates mutable signal.                                              | minor    |
| Demo Integration          | 3+ demo pages with persona switching, guarded routes, Playwright coverage.                                                                                                                                            | praise   |
| Cross-package Consistency | No `verify:package:permissions` standalone script in `angular/package.json`.                                                                                                                                          | minor    |
