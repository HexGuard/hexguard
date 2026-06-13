# 0004 Root Shell and CI Shape for Split Workspaces

Status: Accepted  
Date: 2026-06-14

## Context

After moving Angular into `angular/`, the repository root should stop behaving like the Angular
workspace. It still needs to coordinate docs, governance files, cross-stack validation, and CI,
but it should not keep Angular CLI, Playwright, or TypeScript ownership at the top level.

The current workflows assume Angular lives at the root. The final shell shape needs to make the
separation explicit while keeping one predictable top-level entry point for development and CI.

## Proposal

Keep a thin root `package.json` that owns only repo-wide formatting and cross-stack wrapper
scripts. Let `angular/package.json` own Angular-specific dependencies and scripts, and let
`dotnet/` stay independent under native `dotnet` commands.

The current implementation keeps compatibility aliases such as `start`, `build`, `test`, `lint`,
and `verify:package` at the root so existing workflows can continue to call the same top-level
commands while routing into the `angular/` workspace.

## Proposed Root `package.json` Shape

```json
{
  "name": "hexguard-repo",
  "private": true,
  "packageManager": "pnpm@10.27.0",
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "angular:install": "pnpm --dir angular install",
    "angular:start": "pnpm --dir angular start",
    "angular:demo:snippets": "pnpm --dir angular demo:snippets",
    "angular:lint": "pnpm --dir angular lint",
    "angular:test:ci": "pnpm --dir angular test:ci",
    "angular:test:e2e": "pnpm --dir angular test:e2e",
    "angular:build": "pnpm --dir angular build",
    "angular:build:lib": "pnpm --dir angular build:lib",
    "angular:build:demo": "pnpm --dir angular build:demo",
    "angular:verify:package": "pnpm --dir angular verify:package",
    "angular:verify:package:url-state": "pnpm --dir angular verify:package:url-state",
    "angular:verify:package:query-form": "pnpm --dir angular verify:package:query-form",
    "dotnet:restore": "dotnet restore dotnet/HexGuard.slnx",
    "dotnet:build": "dotnet build dotnet/HexGuard.slnx --configuration Release",
    "dotnet:test": "dotnet test dotnet/HexGuard.slnx --configuration Release",
    "validate:angular": "pnpm angular:lint && pnpm angular:test:ci && pnpm angular:test:e2e && pnpm angular:build && pnpm angular:verify:package",
    "validate:dotnet": "pnpm dotnet:restore && pnpm dotnet:build && pnpm dotnet:test",
    "validate": "pnpm format:check && pnpm validate:angular && pnpm validate:dotnet"
  },
  "devDependencies": {
    "prettier": "^3.8.1"
  }
}
```

## Proposed CI Shape

Use separate jobs so the root shell, Angular workspace, and `.NET` workspace validate on their
own terms.

### Root Shell Job

- Check out the repository.
- Set up pnpm for the root shell.
- Install root dependencies with `pnpm install --frozen-lockfile`.
- Run `pnpm format:check` for repo-wide docs, workflow files, JSON, and shell surfaces.

### Angular Job

- Set up pnpm and Node with `cache-dependency-path: angular/pnpm-lock.yaml`.
- Run `pnpm angular:install --frozen-lockfile` or an equivalent `pnpm --dir angular install --frozen-lockfile` command.
- Install Playwright from the Angular workspace with `pnpm --dir angular exec playwright install --with-deps chromium`.
- Run `pnpm angular:lint`, `pnpm angular:test:ci`, `pnpm angular:test:e2e`, `pnpm angular:build`, and `pnpm angular:verify:package`.
- Upload Playwright artifacts from `angular/playwright-report` and `angular/test-results` on failure.

### .NET Job

- Set up the .NET SDK.
- Run `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test`.
- Keep this job independent of Angular Node dependencies.

## Release Workflow Adjustments

The Angular package release workflows should keep their current package-scoped tags, but they need
path updates once Angular moves under `angular/`.

- Cache Node dependencies with `cache-dependency-path: angular/pnpm-lock.yaml`.
- Install Angular dependencies from `angular/`.
- Build and verify packages through root wrappers or `pnpm --dir angular ...` commands.
- Resolve package metadata from `angular/packages/<package>/package.json` when running from the
  repository root.
- Expect packaged tarballs under `angular/.artifacts/` unless the Angular workspace scripts are
  changed to push artifacts back to the repository root.

## Consequences

- Root CI becomes faster to reason about because formatting, Angular validation, and `.NET`
  validation are split explicitly.
- Angular-specific tooling no longer leaks into the root shell.
- Release workflows stay package-scoped, but they become explicit about the Angular workspace path.
- The migration can happen without rethinking package names, tags, or release semantics.
- Temporary compatibility aliases at the root keep the migration low-friction while callers move
  over to explicit `angular:*` wrappers.
