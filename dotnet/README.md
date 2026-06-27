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
pnpm dotnet:start:demo-api
```

Add new .NET projects to `HexGuard.slnx` as soon as they are scaffolded so restore, build, and test stay centralized.

## Shared Sample API

The first sample host is `dotnet/samples/HexGuard.SampleApi`. Treat it as one shared
demo API with folders per demoed package instead of spinning up many separate sample apps.

- `Packages/AngularLookups/`: backend catalog scenarios used by the Angular lookups frontend demo

Run it from the repo root with:

```bash
pnpm dotnet:start:demo-api
```

The current implementation serves `http://127.0.0.1:5074/api/angular-lookups/catalog` with base,
refreshed, and invalid scenarios so the Angular demo can show both successful frontend-backend
integration and explicit validation failures.

## Blazor Demo

A Blazor Web App demo showcasing HexGuard Blazor component libraries lives at `samples/HexGuard.Blazor.Demo`.

```bash
# Start the Blazor demo (serves at http://127.0.0.1:5075)
pnpm blazor:start:demo

# Run Blazor-specific tests
pnpm blazor:test
```

Blazor packages follow the `HexGuard.Blazor.{Name}` naming convention, use `Microsoft.NET.Sdk.Razor`, and target `net10.0`. Tests use xunit + bUnit for component rendering.

## Package READMEs

- [HexGuard.Blazor.DebouncedInput](src/HexGuard.Blazor.DebouncedInput/README.md) — headless debounced value primitive for Blazor
- [HexGuard.ReferenceData](src/HexGuard.ReferenceData/README.md) — typed reference-data catalog contracts and validation
- [HexGuard.ValidationContracts](src/HexGuard.ValidationContracts/README.md) — validation error contracts and RFC 9457 Problem Details
