---
description: 'Use when editing the demo Angular app in angular/apps/demo-angular/src. Covers docs-grade examples, stable Playwright selectors, and URL-state demonstration requirements.'
applyTo: 'angular/apps/demo-angular/src/**'
---

# Demo Angular App

- Treat the demo as product documentation and as an end-to-end test fixture.
- Prefer realistic workflows that show shareable URLs, snapshot state, and browser history behavior.
- Add or preserve `data-testid` attributes for interactive controls that Playwright depends on.
- When routes or interactive flows change, update `angular/playwright/tests/demo-angular.spec.ts` and `docs/demo/README.md`.
- Validate demo changes with `pnpm test:app`, `pnpm test:e2e`, and `pnpm build:demo`.

## Cross-Demo Package Listing

The Angular demo is the canonical hub for ALL HexGuard packages across stacks. When adding a new package:

- **Angular packages** — full interactive demo pages under `features/packages/angular/`.
- **.NET packages** — hub pages under `features/packages/dotnet/` using `DotnetPackageHubPageComponent`. Set `stackId: undefined` (defaults to `'dotnet'`).
- **Blazor packages** — hub pages under `features/packages/blazor/` using `DotnetPackageHubPageComponent`. Set `stackId: 'blazor'` in the `DotnetPackageEntry`. Link to the live Blazor demo at `http://127.0.0.1:5075`.

### Stack Registry

The `site-catalog.ts` `StackId` type and `STACK_REGISTRY` are the single source of truth for stack display. When adding a new stack:

1. Add the stack ID to `StackId` union type.
2. Add a `StackDefinition` entry to `STACK_REGISTRY`.
3. Add the ID to `STACK_ORDER` (controls filter chip order on the site home page).
4. The site home page filter chips and unified package cards adapt automatically.

### Blazor Hub Pages

Each Blazor package needs:
1. A hub page component under `features/packages/blazor/hexguard-blazor-{name}/` using `DotnetPackageHubPageComponent`.
2. A `DotnetPackageEntry` in `demo-registry.ts` with `stackId: 'blazor'`.
3. A route in `app.routes.ts` under `/blazor/{name}`.
4. The Blazor home page (`blazor-home-page.component.ts`) auto-discovers packages via `SITE_DOTNET_PACKAGES.filter(p => p.dotnetPackage.stackId === 'blazor')` — no manual update needed.

### Blazor Demo Companion

The Blazor Web App demo at `http://127.0.0.1:5075` is the interactive counterpart for Blazor packages. When adding a new Blazor package:
- Add an interactive demo page to `dotnet/samples/HexGuard.Blazor.Demo/Components/Pages/`.
- Add a `NavLink` entry to `Components/Layout/NavMenu.razor`.
- Add a `ProjectReference` to `HexGuard.Blazor.Demo.csproj`.
