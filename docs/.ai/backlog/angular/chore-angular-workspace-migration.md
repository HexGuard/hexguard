---
id: chore-angular-workspace-migration
type: chore
status: done
created: 2026-06-14
owner: repo-structure
---

# Angular Workspace Migration

## Summary

Move the current Angular workspace into a dedicated top-level `angular/` area so Angular-specific
configuration, packages, apps, scripts, and frontend automation stop anchoring the repository
root.

This is a path-heavy repo-structure migration, so the move should happen as one coordinated
change set after release and documentation churn is low enough.

Outcome: completed by moving the Angular workspace into `angular/`, replacing the root shell with
wrapper commands, updating CI and release workflows, and validating lint, build, package,
Playwright, and `.NET` wrapper flows from the new layout.

## Goals

- Isolate Angular-specific code the same way `.NET` is isolated today.
- Keep the repository root as a thin cross-stack shell.
- Preserve current Angular package behavior, build outputs, and release flows.
- Make CI and release automation explicit about whether they are running root-shell, Angular, or
  `.NET` work.

## Non-Goals

- Implementing any new `.NET` packages.
- Activating parked cross-stack package families.
- Redesigning existing Angular library APIs during the move.

## Decisions

- Execute the migration in one branch and merge it only after the full repo validates.
- Move Angular files into `angular/` rather than trying to leave shared config split across the
  root and Angular workspace.
- Replace root Angular commands with wrapper scripts instead of keeping two competing Angular
  entry points.

## Exact File Moves

Move these root files into `angular/`:

- `angular.json` -> `angular/angular.json`
- `package.json` -> `angular/package.json`
- `pnpm-workspace.yaml` -> `angular/pnpm-workspace.yaml`
- `pnpm-lock.yaml` -> `angular/pnpm-lock.yaml`
- `tsconfig.json` -> `angular/tsconfig.json`
- `eslint.config.mjs` -> `angular/eslint.config.mjs`
- `playwright.config.ts` -> `angular/playwright.config.ts`

Move these root directories into `angular/`:

- `apps/` -> `angular/apps/`
- `packages/` -> `angular/packages/`
- `playwright/` -> `angular/playwright/`
- `scripts/` -> `angular/scripts/`

Leave these at the repository root:

- `docs/`
- `dotnet/`
- `.github/`
- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`
- `LICENSE`

## Wrapper Script Changes

Replace the current root Angular-owning scripts with thin wrappers that call into `angular/`.

Root wrappers should include at least:

- `angular:install` -> `pnpm --dir angular install`
- `angular:start` -> `pnpm --dir angular start`
- `angular:demo:snippets` -> `pnpm --dir angular demo:snippets`
- `angular:lint` -> `pnpm --dir angular lint`
- `angular:test:ci` -> `pnpm --dir angular test:ci`
- `angular:test:e2e` -> `pnpm --dir angular test:e2e`
- `angular:build` -> `pnpm --dir angular build`
- `angular:build:lib` -> `pnpm --dir angular build:lib`
- `angular:build:demo` -> `pnpm --dir angular build:demo`
- `angular:verify:package` -> `pnpm --dir angular verify:package`
- `angular:verify:package:url-state` -> `pnpm --dir angular verify:package:url-state`
- `angular:verify:package:query-form` -> `pnpm --dir angular verify:package:query-form`

Root combined wrappers should become:

- `build` -> cross-stack wrapper that runs Angular and `.NET` build entry points separately
- `test:ci` -> cross-stack wrapper that runs Angular and `.NET` CI tests separately
- `validate` -> repo-wide shell format check plus Angular and `.NET` validation wrappers

## Staged Migration Plan

1. Prepare the root shell.
   Add the final thin root `package.json`, keep only repo-wide tooling there, and make every
   Angular command route through `pnpm --dir angular ...`.
2. Move the Angular workspace files and folders.
   Move the exact files and directories listed above into `angular/` without changing Angular
   project names.
3. Update path-sensitive automation.
   Rewrite GitHub Actions workflows, artifact paths, Playwright output paths, and package metadata
   lookups so they target `angular/` explicitly.
4. Update docs and guidance.
   Rewrite repo docs, package links, agent guidance, and any path-based planning notes from
   `packages/...` and `apps/...` to `angular/packages/...` and `angular/apps/...`.
5. Remove the old root Angular surface.
   Delete any stale root Angular commands, path references, or assumptions so the repo has one
   Angular entry point, not two.

## Validation

- `pnpm format:check`
- `pnpm angular:install`
- `pnpm angular:lint`
- `pnpm angular:test:ci`
- `pnpm angular:test:e2e`
- `pnpm angular:build`
- `pnpm angular:verify:package`
- `pnpm dotnet:restore`
- `pnpm dotnet:build`
- `pnpm dotnet:test`

## Follow-Ups

- Revisit whether root needs any Node-based tooling beyond repo-wide formatting after the move.
- Add explicit release workflow notes once the Angular path migration is actually underway.
