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

## Validation Surface

The current implementation is validated through:

- focused unit tests for the pure evaluator
- Angular tests for the injected facade, route guards, and directive
- demo-app build coverage for package-home and live permissions routes
- Playwright coverage for package overview, persona switching, and guarded child-route redirects

For repo-level validation commands, use the package README and the demo runbook together.
