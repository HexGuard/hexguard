# 0003 Angular Workspace Isolation Target

Status: Proposed  
Date: 2026-06-13

## Context

The repo now has a dedicated top-level `dotnet/` space, but Angular-specific files still anchor the
repository root. The current root includes Angular workspace configuration, Angular packages, the
demo app, Angular-only scripts, and frontend test configuration.

That makes the root do two jobs at once: repository-level orchestration and Angular workspace
ownership. It works today, but it is not symmetric with the new `.NET` layout and it keeps
Angular-specific concerns mixed into the same surface as cross-stack docs, release automation, and
repo governance.

## Proposal

Move Angular-specific code and tooling into a dedicated top-level `angular/` space, while keeping
the repository root as a thin cross-stack shell.

## Target Structure

```text
hexguard/
  angular/
    angular.json
    package.json
    pnpm-workspace.yaml
    tsconfig.json
    eslint.config.mjs
    playwright.config.ts
    scripts/
    apps/
      demo-angular/
    packages/
      angular-url-state/
      angular-query-form/
  dotnet/
    HexGuard.slnx
    src/
    tests/
    samples/
  docs/
    .ai/
    demo/
    packages/
  .github/
  package.json
  pnpm-workspace.yaml
```

## Root Responsibilities After the Move

- Keep root docs, repo policies, CI, and security files at the top level.
- Keep a thin root `package.json` only for cross-stack wrapper commands such as combined build,
  validation, and release entry points.
- Keep the root `pnpm-workspace.yaml` limited to delegating into the Angular workspace rather than
  acting as the Angular workspace itself.

## Angular Responsibilities After the Move

- `angular/angular.json` owns Angular CLI project registration.
- `angular/package.json` owns Angular development scripts and frontend package management.
- `angular/packages/` holds Angular libraries.
- `angular/apps/` holds Angular applications and demo surfaces.
- `angular/scripts/` holds Angular-only helper automation such as demo snippet generation.
- Angular-specific lint, TypeScript, and Playwright configuration move under `angular/`.

## Consequences

- Angular and .NET become symmetric top-level workspaces.
- The repo root becomes easier to reason about as a cross-stack coordination layer instead of an
  Angular workspace with extra folders attached.
- Future package families can be classified more cleanly as Angular-only, .NET-only, or parked
  cross-stack work.
- The migration should be staged carefully because it will touch import paths, workspace commands,
  CI, and documentation links.

## Deferred Implementation Notes

1. Do not move Angular files until current release and documentation churn is low enough to absorb
   a path-heavy migration safely.
2. When the move starts, migrate root scripts into thin wrappers that call into `angular/` and
   `dotnet/` separately.
3. Update CI, Playwright paths, docs links, and backlog references in the same change set as the
   actual move so the repo never has two competing Angular roots.
