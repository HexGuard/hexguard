---
description: 'Mandatory workflow for creating new HexGuard packages (Angular, .NET, Blazor, or cross-stack pairs). Covers scaffolding, workspace registration, cross-package dependencies, demo integration, catalog registration, release artifacts, and the final assessment gate. Follow this checklist in order.'
applyTo: '**/*'
---

# New Package Development Workflow

This checklist must be followed **in order** when creating a new HexGuard package, whether Angular-only, .NET-only, or a cross-stack pair.

---

## Phase 0: Scaffold & Workspace Registration

### Angular Package

1. **Register in `angular/angular.json`**:
   - Add a new project entry under `"projects"` with `projectType: "library"`.
   - Use `@angular/build:ng-packagr` for build and `@angular/build:unit-test` for test.
   - Set `root` and `sourceRoot` to the package directory.
   - Set `prefix` to `"hexguard"`.
   - Create configurations for `production` (tsconfig.lib.prod.json) and `development` (tsconfig.lib.json).
   - Place the entry alphabetically among existing projects.

2. **Create package files**:
   - `package.json` — name as `@hexguard/angular-{name}`, version `0.1.0`, peerDeps aligned with Angular `^22.0.0`, `publishConfig.access: "public"`, `sideEffects: false`.
   - `ng-package.json` — entryFile `src/public-api.ts`, assets `["LICENSE"]`.
   - `tsconfig.lib.json` — extends `../../tsconfig.json`, outDir `../../out-tsc/lib`, declaration true.
   - `tsconfig.lib.prod.json` — extends `./tsconfig.lib.json`, `compilationMode: "partial"`.
   - `tsconfig.spec.json` — extends `../../tsconfig.json`, types `["vitest/globals"]`.
   - `CHANGELOG.md` — initial entry with `## 0.1.0` and `- Initial release.` bullet.
   - `LICENSE` — copy from an existing package.
   - `README.md` — include install, quickstart, features table, demo routes, scope boundaries.

3. **Register in `angular/tsconfig.json` path mappings**:
   - Add `"@hexguard/angular-{name}"` pointing to `"./packages/angular-{name}/src/public-api.ts"`.

4. **Add workspace dependency link** (only for packages that depend on other workspace packages):
   - In the dependent package's `package.json`, add the dependency as a `devDependency` with `"workspace:*"`.
   - Also list it under `peerDependencies` with the semver range (e.g. `"^0.1.0"`).
   - Run `pnpm install` in the `angular/` directory to create the symlink.

### .NET Package

1. **Create `.csproj`**:
   - `TargetFramework`: `net10.0`.
   - `ImplicitUsings`: `enable`, `Nullable`: `enable`.
   - `PackageId`, `Version`, `Description`, `GenerateDocumentationFile`.
   - Add `<FrameworkReference Include="Microsoft.AspNetCore.App" />` (for ASP.NET Core integration).
   - Add `InternalsVisibleTo` for the test project.

2. **Register in `dotnet/HexGuard.slnx`**:
   - Add the project under `<Folder Name="/src/">`.
   - Add the test project under `<Folder Name="/tests/">`.

3. **Create test project**:
   - `Microsoft.NET.Test.Sdk`, `xunit`, `xunit.runner.visualstudio`.
   - `Microsoft.AspNetCore.Mvc.Testing` (for integration tests via `WebApplicationFactory`).
   - Project references: the source project and the shared `HexGuard.SampleApi`.

### Blazor Package

1. **Create `.csproj`**:
   - Use `Microsoft.NET.Sdk.Razor` (required for Razor Class Libraries that may contain `.razor` components).
   - `TargetFramework`: `net10.0`.
   - `ImplicitUsings`: `enable`, `Nullable`: `enable`.
   - `PackageId`: `HexGuard.Blazor.{Name}`, `Version`: `0.1.0`.
   - `Description`, `GenerateDocumentationFile`.
   - Add `<FrameworkReference Include="Microsoft.AspNetCore.App" />`.
   - Add `InternalsVisibleTo` for the test project.

2. **Create package files**:
   - `CHANGELOG.md` — initial entry with `## 0.1.0` and `- Initial release.` bullet.
   - `LICENSE` — copy from an existing .NET package.
   - `README.md` — include install (`dotnet add package`), quickstart with Razor + C# examples, features table, API reference, scope boundaries.

3. **Register in `dotnet/HexGuard.slnx`**:
   - Add the project under `<Folder Name="/src/">`.
   - Add the test project under `<Folder Name="/tests/">`.

4. **Create test project**:
   - Standard test `.csproj`: `net10.0`, `IsPackable: false`.
   - NuGet references: `Microsoft.NET.Test.Sdk`, `xunit`, `xunit.runner.visualstudio`, `Microsoft.AspNetCore.Mvc.Testing`.
   - Add `bunit` for Blazor component rendering tests (version `1.38.5` or latest stable).
   - Project references: the source project and `HexGuard.SampleApi`.
   - For pure C# services (no rendering), standard xunit suffices — bUnit only needed when testing `.razor` components.

5. **Add root scripts**:
   - Add `"blazor:start:demo"` and `"blazor:test"` convenience scripts in root `package.json`.
   - The existing `dotnet:restore`, `dotnet:build`, `dotnet:test` scripts automatically cover new projects via `HexGuard.slnx`.

6. **Add convenience script to `angular/package.json`**:
   - Add `"start:blazor-demo": "dotnet run --project ../dotnet/samples/HexGuard.Blazor.Demo/HexGuard.Blazor.Demo.csproj -- --urls http://127.0.0.1:5075"`.

---

## Phase 1: Implementation

### Angular — Tight public API

- Export **only** what consumers need from `src/public-api.ts`. Do not leak internal helpers.
- Prefer function-based APIs (like `injectSelectionState()`) over class-based services for simple state. Use classes only when DI lifecycle management is needed.
- Use `Signal<T>` and `WritableSignal<T>` for state, `computed()` for derived values.
- Add JSDoc `@example` tags showing both TypeScript and template usage patterns.
- For services using `provide*()` + `inject*()` pattern:
  - Return `{ token, providers }` from the provider factory when multiple instances may coexist.
  - Accept an optional `InjectionToken` parameter in the inject function for disambiguation.

### Angular — In-flight deduplication

For any service with an `execute()` or similar async method, guard against concurrent calls:

```typescript
private _pendingExecution: Promise<ResponseType> | null = null;

async execute(request: RequestType): Promise<ResponseType> {
  if (this._pendingExecution) {
    return this._pendingExecution; // deduplicate
  }
  const execution = this._doExecute(request).finally(() => {
    this._pendingExecution = null;
  });
  this._pendingExecution = execution;
  return execution;
}
```

### .NET — Modern C# patterns

- Use `sealed record` types for immutable contracts.
- Use primary constructors for simple records.
- Use nullable annotations (`string?`, `TResult?`).
- Prefer `IReadOnlyList<T>` and `IReadOnlyDictionary<K,V>` for collection properties.
- Use `ArgumentNullException.ThrowIfNull()` for guard clauses.
- Add XML doc (`/// <param>`, `<returns>`, `<typeparam>`) on all public APIs.

---

## Phase 2: Tests

### Angular

- Cover all operations (success, failure, empty, edge cases).
- Cover derived signals (computed values update correctly).
- For services with async execution: test in-flight deduplication, error handling, result clearing, retry logic.
- For cross-package composition helpers: mock the dependency's return type directly (signal, etc.) — do not import the dependency package in the test.
- Run: `pnpm test:lib:{name}`.

### .NET

- Unit tests for builder/aggregation logic: all-success, partial-failure, all-failure, empty, null validation.
- Integration tests via `WebApplicationFactory<Program>` for endpoint behavior: status codes, response bodies, error shapes.
- Run: `pnpm dotnet:test`.

---

## Phase 3: Build Scripts & CI Integration

### Angular: Update `angular/package.json`

Add scripts following the existing pattern:

```json
"build:lib:{name}": "pnpm build:lib:{dependency} && ng build angular-{name}",
"test:lib:{name}": "ng test angular-{name}",
"verify:package:{name}": "node -e \"require('node:fs').mkdirSync('.artifacts', { recursive: true });\" && pnpm --dir dist/angular-{name} pack --pack-destination ../../.artifacts"
```

Then integrate into the chain scripts:

- `build:lib` — append `&& ng build angular-{name}`.
- `test:lib` — append `&& pnpm test:lib:{name}`.
- `test:ci` — append `&& ng test angular-{name} --watch=false`.
- `verify:package` — append `&& pnpm verify:package:{name}`.
- `lint` — append the package source glob.

### Root: Update `package.json`

Add proxy scripts wrapping the angular scripts:

```json
"build:lib:{name}": "pnpm angular:build:lib:{name}",
"test:lib:{name}": "pnpm angular:test:lib:{name}",
"verify:package:{name}": "pnpm angular:verify:package:{name}"
```

---

## Phase 4: Demo App Integration

### Angular Package Demo

1. **Create feature folder** at `angular/apps/demo-angular/src/app/features/angular-{name}/`:
   - `angular-{name}-home-page.component.ts` at the **feature root** (not inside `pages/`) — use the shared `PackageHubPageComponent`.
   - `pages/{name}-demo-page/` — use `DemoPageLayoutComponent`, `DemoStatusStripComponent`, `DemoInspectorPanelComponent`.
   - `data/` — mock data and mock API functions.
   - External `.html` and `.css` files alongside the component (needed by snippet generation).

2. **Add demo registry entries** in `demo-registry.ts`:
   - Import `getGeneratedCurrentPackage('angular-{name}')` for catalog metadata.
   - Create `DemoPageEntry` and `DemoPackageEntry` constants.
   - Add to `DEMO_PACKAGES` array.

3. **Add routes** in `app.routes.ts`:
   - Import the demo components.
   - Add route for the home page and demo page.
   - Use the `packages/angular-{name}` path convention.

4. **Add snippet entry** in `scripts/generate-demo-snippets.mjs`:
   - Add an entry pointing to the demo page component `.ts` file.

### .NET Package Demo (Sample API)

1. **Create sample endpoint folder** at `dotnet/samples/HexGuard.SampleApi/Packages/HexGuard{Name}/`:
   - `{Name}SampleData.cs` — mock data records.
   - `{Name}SampleEndpoints.cs` — Minimal API extension class with `Map{Name}SampleEndpoints()`.

2. **Register in Sample API**:
   - Add `ProjectReference` in `HexGuard.SampleApi.csproj`.
   - Import and call `Map{Name}SampleEndpoints()` in `Program.cs`.
   - Add home endpoint entry.

3. **Add .NET demo page** (in Angular app):
   - Create `Dotnet{Name}HubPageComponent` using `DotnetPackageHubPageComponent`.
   - Add `DotnetDemoPageEntry` in `demo-registry.ts`.
   - Add to `DOTNET_PACKAGES` array.
   - Add route in `app.routes.ts`.

### Blazor Package Demo

1. **Add demo page to `HexGuard.Blazor.Demo`**:
   - Create a new Razor page under `Components/Pages/{Name}Demo.razor`.
   - Use `@rendermode RenderMode.InteractiveServer` for interactive components.
   - Include interactive examples, controls, and a code snippet panel showing usage.
   - Add `data-testid` attributes on interactive elements for future Playwright tests.
   - Inject or create the Blazor service being demonstrated.

2. **Add navigation**:
   - Add a `NavLink` entry in `Components/Layout/NavMenu.razor` with route `{name}`.
   - Add the package card to `Components/Pages/Home.razor` in the `package-grid` section.

3. **Add project reference**:
   - If not already present, add a `ProjectReference` to the Blazor library in `HexGuard.Blazor.Demo.csproj`.

4. **Add hub page** (in Angular demo app):
   - Create a hub page component under `features/packages/blazor/hexguard-blazor-{name}/` using `DotnetPackageHubPageComponent`.
   - Link to the live Blazor demo at `http://127.0.0.1:5075/{name}`.

5. **Add Angular demo entries**:
   - Add a `DotnetPackageEntry` to `DOTNET_PACKAGES` in `demo-registry.ts` with **`stackId: 'blazor'`** (required — this is what separates Blazor packages from .NET packages in the unified catalog).
   - Add route in `app.routes.ts` under `/blazor/{name}`.

6. **Cross-demo verification**:
   - The Angular demo site home page will automatically show the package under the "Blazor" filter chip (derived from `STACK_REGISTRY`).
   - The Blazor home page at `/blazor` auto-discovers Blazor packages via `stackId`.
   - Verify both demos list the package correctly: `http://127.0.0.1:4200/blazor` and `http://127.0.0.1:5075`.

---

## Phase 5: Package Catalog Registration

1. **Update `scripts/package-catalog.data.mjs`**:
   - Add the package to `currentPackages` with status `"Available"`.
   - Include all fields: `id`, `packageName`, `status`, `scope`, `category` (one of `'URL & Forms'`, `'Async State'`, `'Data & Reference'`, `'Permissions & Access'`, `'Validation & Errors'`, `'Utilities'`, `'UI Infrastructure'`, or `null` for .NET packages), `readmePath`, `deepDivePath`, `repositoryPath`, `summary`, `detail`, `installCommand`, `featureHighlights`, `bestFitScenarios`, `statusNoteParagraphs`.

2. **Add ecosystem** in `angular/apps/demo-angular/src/app/site-catalog.ts`:
   - For cross-stack pairs: add to `SITE_ECOSYSTEMS`.
   - Add to `ANGULAR_TO_DOTNET_COUNTERPART` and `DOTNET_TO_ANGULAR_COUNTERPART` maps.

3. **Run catalog sync**: `pnpm catalog:sync`.

---

## Phase 6: Release Artifacts

1. **Create release workflow**:
   - For Angular: `.github/workflows/release-angular-{name}.yml` — model after `release-angular-debounce.yml`.
   - Tag pattern: `angular-{name}-v*`.
   - For .NET: add to the existing `release-dotnet.yml` — add tag pattern to triggers and package to workflow_dispatch options.

2. **Verify package**:
   - Run `pnpm verify:package:{name}` to confirm tarball contains README, LICENSE, ESM, type declarations.

---

## Phase 7: Assessment Gate (Final)

Run the `/assess-package-readiness` prompt or manually verify all 9 criteria:

| Category               | What to Check                                                                 |
| ---------------------- | ----------------------------------------------------------------------------- |
| API Design             | narrow `public-api.ts`, JSDoc on all exports, clear names                     |
| Implementation Quality | signal-first, no browser globals, deterministic, lifecycle cleanup            |
| Tests                  | pure helpers covered, integration tests, edge cases, CI passes                |
| Documentation          | README, deep-dive doc in `docs/packages/`, JSDoc examples                     |
| Demo Integration       | routes render, `data-testid` attributes, Playwright tests, snippet generation |
| Package Metadata       | name, version, description, keywords, license, publishConfig                  |
| Build Output           | `build:lib` succeeds, `verify:package` produces valid tarball                 |
| Release Workflow       | workflow file exists, tag pattern matches convention                          |
| Performance            | no unnecessary allocations, in-flight deduplication, stable derived signals   |

### Validation Command

```bash
pnpm format:check && pnpm lint && pnpm test:ci && pnpm test:e2e && pnpm build && pnpm verify:package && pnpm dotnet:restore && pnpm dotnet:build && pnpm dotnet:test
```

Save the audit report to `docs/.ai/audits/{package-name}-readiness-{YYYY-MM-DD}.md`.

---

## Key Patterns Reference

### Cross-package Dependency Resolution (Angular workspace)

When Package A depends on Package B within the same workspace:

1. Add path mapping for Package B in `angular/tsconfig.json` so TypeScript resolves during dev.
2. Add `"@hexguard/package-b": "workspace:*"` as a `devDependency` in Package A's `package.json`.
3. Add `"@hexguard/package-b": "^0.1.0"` as a `peerDependency` in Package A's `package.json`.
4. Run `pnpm install` in `angular/` to link.
5. **Build order**: the build script for Package A must build Package B first (e.g. `"build:lib:a": "pnpm build:lib:b && ng build angular-a"`).
6. **Tsconfig path mapping for build**: During `ng build`, if the path mapping causes rootDir errors (_.ngtypecheck.ts files outside rootDir_), remove the path mapping from tsconfig.json for the dependency and rely on the dist/ output instead. The build script already builds the dependency first.

### Provider + Inject Pattern (multi-instance services)

```typescript
// provider.ts
export function provideMyService<T>(config: MyConfig<T>): {
  readonly token: InjectionToken<MyService<T>>;
  readonly providers: Provider[];
} {
  const token = new InjectionToken<MyService<T>>(`MY_SERVICE_${++counter}`);
  return { token, providers: [{ provide: token, useFactory: () => new MyService(config) }] };
}

// inject.ts
export function injectMyService<T>(token?: InjectionToken<MyService<T>>): MyServiceFacade<T> {
  const service = token ? inject(token) : inject(MyService);
  return {
    /* facade wrapping service */
  };
}

// consumer.ts
const OP_A = provideMyService(configA);
const OP_B = provideMyService(configB);
@Component({ providers: [OP_A.providers, OP_B.providers] })
class MyComp {
  readonly a = injectMyService(OP_A.token);
  readonly b = injectMyService(OP_B.token);
}
```
