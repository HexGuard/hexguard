# .NET Workspace

This folder is the dedicated .NET space inside the HexGuard strategy repo.

## Layout

- `HexGuard.slnx`: solution anchor for all .NET projects in this repo
- `src/`: NuGet libraries and shared source projects
- `tests/`: unit, integration, or contract test projects
- `samples/`: sample apps or reference hosts that prove package behavior end to end

## Command Conventions

Run these from the repo root through `pnpm` so Angular and .NET workflows share one entry point:

```bash
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test
```

Add new .NET projects to `HexGuard.slnx` as soon as they are scaffolded so restore, build, and test stay centralized.

Until the first .NET project is added, these commands will succeed with an "Unable to find a project to restore" warning from the empty solution.
