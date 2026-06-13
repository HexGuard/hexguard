# 0002 .NET Workspace Conventions

Status: Accepted  
Date: 2026-06-13

## Context

The repo now separates Angular and .NET into different spaces inside one strategy repo. After accepting that topology, the next missing piece is a concrete home for future .NET libraries, tests, and sample hosts.

Without a dedicated workspace area, .NET packages would either inherit Angular-oriented assumptions from `packages/` or scatter across ad hoc folders. That would make AI-assisted planning, root command conventions, and package discovery less reliable.

## Decision

Create a dedicated top-level `dotnet/` workspace area with one solution anchor and named subspaces.

- `dotnet/HexGuard.slnx` is the root solution for repo-managed .NET projects.
- `dotnet/src/` holds NuGet libraries and shared source projects.
- `dotnet/tests/` holds .NET test projects.
- `dotnet/samples/` holds sample apps or reference hosts used for package validation.
- Root command conventions are `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test`.

## Consequences

- Angular and .NET now have explicit top-level homes inside the same repo.
- Root developer workflow can stay lightweight by routing through native Angular and .NET CLIs rather than adding heavier orchestration.
- Future .NET packages should join `dotnet/HexGuard.slnx` immediately so restore, build, and test remain centralized.
- Cross-stack package families stay parked until both spaces need the same contract, instead of driving the workspace shape prematurely.

## Initial Follow-Through

1. Keep root docs and agent guidance pointing at the dedicated `dotnet/` space.
2. Ignore .NET build output in the root `.gitignore`.
3. Add the first .NET package under `dotnet/src/` and its tests under `dotnet/tests/` when a .NET-only package becomes active.
