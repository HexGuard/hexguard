# `@hexguard/angular-permissions`

Headless capability and role evaluation for Angular routes, templates, and feature code.

This package standardizes a repeated problem in Angular applications: route guards, component
booleans, and template conditionals often drift because they are implemented as separate ad hoc
checks. `@hexguard/angular-permissions` keeps those checks on one normalized permission contract.

Additional in-repo guides:

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-permissions.md)
- [Package demo routes](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md#permissions-demo-routes)
- [Demo runbook](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [Package catalog and roadmap context](https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md)

## Installation

```bash
pnpm add @hexguard/angular-permissions
```

## Quickstart

```ts
import {
  canActivatePermissions,
  HexguardCanDirective,
  injectPermissions,
  provideHexGuardPermissions,
  type PermissionContext,
} from '@hexguard/angular-permissions';
import { Component, signal } from '@angular/core';

const session = signal<PermissionContext>({
  capabilities: ['orders.view', 'orders.approve'],
  roles: ['approver'],
});

export const appProviders = [provideHexGuardPermissions(session)];

@Component({
  standalone: true,
  imports: [HexguardCanDirective],
  template: `
    <button type="button" [disabled]="!canApprove()">Approve</button>
    <section *hexguardCan="auditRequirement">Audit notes</section>
  `,
})
export class OrderActionsComponent {
  private readonly permissions = injectPermissions();
  readonly canApprove = this.permissions.canSignal({ allCapabilities: ['orders.approve'] });
  readonly auditRequirement = { anyRoles: ['admin', 'auditor'] } as const;
}

export const financeGuard = canActivatePermissions(
  { allCapabilities: ['finance.approve'] },
  { redirectTo: '/denied' },
);
```

## Feature Matrix

| Capability                                | Status      | Notes                                                                                   |
| ----------------------------------------- | ----------- | --------------------------------------------------------------------------------------- |
| Pure permission evaluator                 | Available   | Evaluates `all`, `any`, and `none` rules for capabilities and roles without Angular UI. |
| Signal-backed injected permissions facade | Available   | `injectPermissions()` exposes imperative checks plus derived decision signals.          |
| Environment provider for current context  | Available   | `provideHexGuardPermissions()` accepts a static context or a signal-backed one.         |
| `CanActivate` and `CanMatch` helpers      | Available   | Thin guard adapters delegate to the same evaluator and can redirect with `UrlTree`.     |
| Structural permission directive           | Available   | `*hexguardCan` supports primary content plus an optional `else` template.               |
| Resource-aware predicates or policy DSL   | Not planned | The first release intentionally stays at capabilities and roles only.                   |
| Auth/token parsing                        | Not planned | Applications map claims or backend payloads into a normalized permission context.       |
| Feature-flag composition                  | Deferred    | Feature flags remain a separate package concern until both contracts are mature.        |

## Demo Routes

This repository ships a package overview page plus two docs-grade demo routes for the public API.
Start the demo app from the repo root with `pnpm start`, then open:

- `/packages/angular-permissions`: package overview and demo catalog
- `/packages/angular-permissions/actions`: shared persona context driving disabled buttons, hidden surfaces, and fallback templates
- `/packages/angular-permissions/routing`: `CanActivate` and `CanMatch` route gating with redirect behavior and the same shared persona context

Route expectations and manual verification notes live in the [permissions demo runbook section](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md#permissions-demo-routes).

## What It Owns

- one normalized permission context contract made of capabilities and roles
- one pure evaluator that both imperative and Angular helpers reuse
- one injected facade for components and services
- thin route helpers for `CanActivate` and `CanMatch`
- one structural directive for show or hide behavior with optional fallback rendering

## What It Does Not Own

- authentication providers, claim parsing, or token storage
- backend authorization or policy enforcement on the server
- feature-flag composition, page-shell helpers, or menu builders
- resource-aware policy predicates or a broad declarative authorization DSL

## API Reference

### `provideHexGuardPermissions(source)`

Registers the current permission context for the active injector tree.

`source` may be either:

- a static `PermissionContext`
- a `Signal<PermissionContext>` when the current persona or tenant can change at runtime

`PermissionContext<TCapability, TRole>` fields:

| Field          | Required | Description                                              |
| -------------- | -------- | -------------------------------------------------------- |
| `capabilities` | yes      | Capability keys available to the current user or session |
| `roles`        | no       | Role keys available to the current user or session       |

```ts
const session = signal({
  capabilities: ['orders.view', 'orders.approve'],
  roles: ['approver'],
});

bootstrapApplication(AppComponent, {
  providers: [provideHexGuardPermissions(session)],
});
```

### `evaluatePermission(context, requirement)`

Evaluates a capability and role requirement without touching Angular DI or rendering.

`PermissionRequirement<TCapability, TRole>` fields:

| Field              | Description                                    |
| ------------------ | ---------------------------------------------- |
| `allCapabilities`  | Every listed capability must be present        |
| `anyCapabilities`  | At least one listed capability must be present |
| `noneCapabilities` | None of the listed capabilities may be present |
| `allRoles`         | Every listed role must be present              |
| `anyRoles`         | At least one listed role must be present       |
| `noneRoles`        | None of the listed roles may be present        |

The returned `PermissionDecision` exposes `allowed`, the original `context`, the original
`requirement`, and `failedRequirements` so callers can inspect why access was denied.

```ts
const decision = evaluatePermission(
  {
    capabilities: ['finance.approve'],
    roles: ['admin'],
  },
  {
    allCapabilities: ['finance.approve'],
    anyRoles: ['admin', 'auditor'],
  },
);
```

### `injectPermissions()`

Injects an imperative facade backed by the current permission context signal.

The facade exposes:

- `context`: the current permission context signal
- `can(requirement)`: boolean check for imperative flows
- `evaluate(requirement)`: full `PermissionDecision`
- `canSignal(requirement)`: derived signal for template-friendly booleans
- `decisionSignal(requirement)`: derived signal returning the full decision

```ts
const permissions = injectPermissions();

if (permissions.can({ allCapabilities: ['orders.approve'] })) {
  // trigger approval workflow
}
```

### `canActivatePermissions(requirement, options?)`

Creates a `CanActivateFn` backed by the shared evaluator. If access is denied and `redirectTo` is
provided, the guard returns a `UrlTree`; otherwise it returns `false`.

```ts
{
	path: 'finance',
	canActivate: [
		canActivatePermissions(
			{ allCapabilities: ['finance.approve'] },
			{ redirectTo: '/denied' },
		),
	],
}
```

### `canMatchPermissions(requirement, options?)`

Creates a `CanMatchFn` backed by the same evaluator. Use it when route matching itself should be
blocked before the child route is selected.

```ts
{
	path: 'audit',
	canMatch: [
		canMatchPermissions(
			{ anyRoles: ['auditor', 'admin'] },
			{ redirectTo: '/denied' },
		),
	],
}
```

### `*hexguardCan`

Structural directive that renders its primary template only when the requirement is allowed. Use
`hexguardCanElse` to render a fallback template when access is denied.

```html
<section *hexguardCan="{ allCapabilities: ['audit.view'] }; else deniedPanel">Audit panel</section>

<ng-template #deniedPanel> Access denied </ng-template>
```

## Validation

Before release-oriented changes finish, validate the package with:

```bash
pnpm test:lib:permissions
pnpm build:lib:permissions
pnpm verify:package:permissions
pnpm test:app
pnpm test:e2e
```

Then finish with the broader workspace gate described in the repo root.
