---
description: 'Audit an existing HexGuard package for production readiness. Check API design, test coverage, documentation, demo integration, package metadata, build output, and release workflow. Produces a structured improvement plan. Supports Angular, .NET, and Blazor packages.'
agent: 'agent'
argument-hint: "Package name (e.g. angular-url-state, angular-api-errors, HexGuard.ReferenceData, HexGuard.Blazor.DebouncedInput) or 'all' to audit every published package"
---

# Assess Package Readiness

Audit an existing HexGuard package and produce an improvement plan targeting production readiness, usability, and deployability to npm or NuGet.

## Phase A — Discovery

1. **Resolve the package** to its source path:
   - Angular: `angular/packages/{name}/`
   - .NET: `dotnet/src/HexGuard.{Name}/`
   - Blazor: `dotnet/src/HexGuard.Blazor.{Name}/`
2. **If input is `all`**: gather the list from `angular/packages/*/package.json` (Angular), `dotnet/src/HexGuard.*/*.csproj` (.NET), and `dotnet/src/HexGuard.Blazor.*/*.csproj` (Blazor), then audit each one independently
3. For each package, read:
   - `.csproj` (metadata, target framework, package references, framework references) — for .NET and Blazor packages check for `<FrameworkReference Include="Microsoft.AspNetCore.App" />`
   - `package.json` or `ng-package.json` (Angular build config)
   - `src/public-api.ts` (Angular export surface) or all `.cs` files under the project root (public types for .NET/Blazor)
   - All source files (implementation)
   - Test files (discover via `**/*.spec.ts` or `**/*Tests.cs`)
   - `README.md` (npm/NuGet-facing docs)
   - Matching `docs/packages/{name}.md` (deep-dive doc)
   - Demo integration:
     - **Angular**: search `angular/apps/demo-angular/src` for package references, check `demo-registry.ts` for `DemoPackageEntry`
     - **.NET**: check `demo-registry.ts` for `DotnetPackageEntry` with `stackId: undefined` (defaults to `'dotnet'`)
     - **Blazor**: check `demo-registry.ts` for `DotnetPackageEntry` with `stackId: 'blazor'`, check `dotnet/samples/HexGuard.Blazor.Demo/Components/Pages/` for an interactive Razor demo page, check `NavMenu.razor` for a nav link
   - Release workflow: for Angular search `.github/workflows/release-angular-{name}.yml`, for .NET/Blazor check `.github/workflows/release-dotnet.yml` for the package's tag pattern and workflow_dispatch option

## Phase B — Assessment

Rate each criterion ✅ (pass), ⚠️ (minor gap), or ❌ (needs work).

### 1. API Design

- Narrow `public-api.ts` — no implementation details leaked
- Clear, descriptive export names (no abbreviations)
- Backward-compatible shape (unless explicitly accepting a breaking change)
- JSDoc on every public export
- Types described the consumer contract clearly

### 2. Implementation Quality

- **Angular**: signal-first architecture. No direct browser globals — uses Angular abstractions where available.
- **.NET / Blazor**: pure C# where possible. Blazor packages minimize JavaScript interop (`IJSRuntime`).
- Deterministic behavior — same inputs produce same outputs.
- Lifecycle cleanup explicit (timers, subscriptions, effects, listeners, `IDisposable`).
- Pure parsing/serialization/mapping logic independently testable.
- Semantic `equals` hooks for arrays, dates, objects where needed.
- **Callback error handling**: fire-and-forget callbacks (`_ = SomethingAsync()`) must wrap in try/catch or provide an error handler — swallowed exceptions are a production risk.

### 3. Tests

- Pure helpers covered with focused unit tests including edge cases.
- Integration tests for DI, lifecycle, cleanup (Angular or .NET as applicable).
- **Blazor component tests**: use bUnit (`TestContext.RenderComponent<T>()`) for `.razor` components with rendering. Pure C# services only need xunit.
- Regression tests for every public bug fix.
- Default and non-default options tested when option semantics change.
- Commands pass: `pnpm test:lib:{name}` (Angular), `pnpm blazor:test` (Blazor), or `pnpm dotnet:test` (.NET).

### 4. Documentation

- JSDoc on every public export covering contract, params, return type
- `README.md` has install instructions, quickstart example, API reference table, status badge
- `docs/packages/{name}.md` has feature matrix, option resolution, internal behavior notes
- Package README and docs/pages are in sync with current code behavior
- npm/NuGet-facing README links are valid outside the monorepo (absolute GitHub URLs)

### 5. Demo Integration

- **Angular packages**: demo app routes render real usage. Interactive controls have stable `data-testid`. Playwright tests cover the demo flow. Demo source snippets generated (`pnpm demo:snippets`).
- **.NET packages**: hub page in Angular demo under `/dotnet/{name}` with `DotnetPackageEntry` and `stackId: undefined`. Linked to SampleApi endpoints.
- **Blazor packages**: hub page in Angular demo under `/blazor/{name}` with `DotnetPackageEntry` and `stackId: 'blazor'`. Interactive demo page in `HexGuard.Blazor.Demo/Components/Pages/` with `@rendermode RenderMode.InteractiveServer`, `data-testid` attributes, and code snippet panel. `NavLink` entry in `NavMenu.razor`. Package card on Blazor `Home.razor`.
- Cross-demo linking works: Angular Blazor hub page links to live Blazor demo; Blazor demo nav links back to Angular demo.

### 6. Package Metadata

- **Angular**: `name`, `version`, `description`, `keywords` — accurate and descriptive. `repository`, `homepage`, `bugs` — correct URLs. `license` — set (MIT). `publishConfig.access: "public"`. Peer dependencies aligned with supported framework version.
- **.NET / Blazor**: `PackageId`, `Version`, `Description` — set. `PackageTags` — relevant keywords for NuGet discovery. `RepositoryUrl` — link to GitHub repo. `PackageLicenseExpression` — `MIT`. `GenerateDocumentationFile` — `true`. `TargetFramework` — `net10.0`. `Nullable` — `enable`. `InternalsVisibleTo` — set for the test project.
- **Blazor-specific**: `.csproj` uses `Microsoft.NET.Sdk.Razor`. Has `<FrameworkReference Include="Microsoft.AspNetCore.App" />`.

### 7. Build Output

- **Angular**: `pnpm build:lib:{name}` succeeds. `pnpm verify:package:{name}` succeeds (tarball contains README, LICENSE, ESM, type declarations).
- **.NET / Blazor**: `pnpm dotnet:build` succeeds. `dotnet pack` produces a valid `.nupkg` containing the DLL, README, and LICENSE. (Note: centralized NuGet pack verification does not yet exist for .NET packages — this is a known gap.)

### 8. Release Workflow

- **Angular**: `.github/workflows/release-angular-{name}.yml` exists and is functional. Tag pattern: `angular-{name}-v*`. npm publish configured. GitHub release creation configured.
- **.NET / Blazor**: package added to `.github/workflows/release-dotnet.yml`. Tag pattern added to `on.push.tags` (e.g., `dotnet-bulkoperations-v*`, `dotnet-blazor-debouncedinput-v*`). Package ID added to `workflow_dispatch.inputs.package_id.options`. Case statement in the tag-matching `case` block maps tag to `PACKAGE_ID` and `PROJ_DIR`.

### 9. Performance

- No unnecessary allocations in hot paths
- Deterministic output stable for caching and equality checks
- Debounced writes where bursty input is expected

## Phase C — Improvement Plan

For each ❌ or ⚠️ item, produce a concrete actionable step:

1. **What file(s) to modify** (absolute paths)
2. **What the fix looks like** — description of the change (not code)
3. **Priority** — High/Medium/Low
4. **Validation command** — the narrowest `pnpm` or `dotnet` command that confirms the fix

## Output

Save the audit report to `docs/.ai/audits/{package-name}-readiness-{YYYY-MM-DD}.md`.

If `docs/.ai/audits/` does not exist, create it.

Structure:

```markdown
# Readiness Audit: {PackageName}

<!-- PackageName examples: @hexguard/angular-url-state, HexGuard.ReferenceData, HexGuard.Blazor.DebouncedInput -->

**Date**: {date}
**Version**: {version} (from package.json or .csproj)

## Summary

Overall: {X}/9 criteria passed.
High priority: {N} items | Medium: {N} | Low: {N}

## Checklist

| Category               | Rating   | Key Issues |
| ---------------------- | -------- | ---------- |
| API Design             | ✅/⚠️/❌ | ...        |
| Implementation Quality | ✅/⚠️/❌ | ...        |
| Tests                  | ✅/⚠️/❌ | ...        |
| Documentation          | ✅/⚠️/❌ | ...        |
| Demo Integration       | ✅/⚠️/❌ | ...        |
| Package Metadata       | ✅/⚠️/❌ | ...        |
| Build Output           | ✅/⚠️/❌ | ...        |
| Release Workflow       | ✅/⚠️/❌ | ...        |
| Performance            | ✅/⚠️/❌ | ...        |

## Improvement Plan

### High Priority

1. **{issue}** → `{file path}` → description: ... → verify: `pnpm {command}`

### Medium Priority

...

### Low Priority

...
```
