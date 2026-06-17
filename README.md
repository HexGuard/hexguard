# HexGuard

HexGuard publishes small, production-grade guardrails for Angular and .NET applications. This
repository is the monorepo hub for published packages, demo apps, release automation, and the AI
workflow docs that keep future package work consistent.

## Package Discovery

The detailed package and roadmap catalog now lives in [docs/packages/README.md](docs/packages/README.md)
and is generated from the same source metadata that drives the Angular demo website.

### Compatibility Matrix

| Package                              | Version | Angular | Peer dependencies                                                                                      | Status    |
| ------------------------------------ | ------- | ------- | ------------------------------------------------------------------------------------------------------ | --------- |
| `@hexguard/angular-url-state`        | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                  | Available |
| `@hexguard/angular-async-state`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `rxjs`                                                             | Available |
| `@hexguard/angular-query-form`       | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/router`, `@hexguard/angular-url-state` | Available |
| `@hexguard/angular-optimistic-state` | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `rxjs`                                                             | Available |
| `@hexguard/angular-permissions`      | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@angular/router`                                                  | Available |
| `@hexguard/angular-lookups`          | 0.1.0   | ^22.0.0 | `@angular/common`, `@angular/core`, `@hexguard/angular-async-state`                                    | Available |

All packages are licensed under MIT and published with `publishConfig: { access: "public" }`.

Current public Angular package entry points with README and changelog:

- [@hexguard/angular-url-state](angular/packages/angular-url-state/README.md) — [changelog](angular/packages/angular-url-state/CHANGELOG.md)
- [@hexguard/angular-async-state](angular/packages/angular-async-state/README.md) — [changelog](angular/packages/angular-async-state/CHANGELOG.md)
- [@hexguard/angular-lookups](angular/packages/angular-lookups/README.md) — [changelog](angular/packages/angular-lookups/CHANGELOG.md)
- [@hexguard/angular-optimistic-state](angular/packages/angular-optimistic-state/README.md) — [changelog](angular/packages/angular-optimistic-state/CHANGELOG.md)
- [@hexguard/angular-query-form](angular/packages/angular-query-form/README.md) — [changelog](angular/packages/angular-query-form/CHANGELOG.md)
- [@hexguard/angular-permissions](angular/packages/angular-permissions/README.md) — [changelog](angular/packages/angular-permissions/CHANGELOG.md)

## Documentation

- [Docs Index](docs/README.md)
- [Package Catalog](docs/packages/README.md)

### Angular Packages

- [`@hexguard/angular-url-state` Deep Dive](docs/packages/angular-url-state.md)
- [`@hexguard/angular-query-form` Deep Dive](docs/packages/angular-query-form.md)
- [`@hexguard/angular-async-state` Deep Dive](docs/packages/angular-async-state.md)
- [`@hexguard/angular-lookups` Deep Dive](docs/packages/angular-lookups.md)
- [`@hexguard/angular-optimistic-state` Deep Dive](docs/packages/angular-optimistic-state.md)
- [`@hexguard/angular-permissions` Deep Dive](docs/packages/angular-permissions.md)

### .NET Packages

- [`HexGuard.ReferenceData` Deep Dive](docs/packages/hexguard-reference-data.md)

### Workspace & Workflow

- [Run the Demo](docs/demo/README.md)
- [AI Workflow](docs/.ai/README.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## Local Development

```bash
pnpm install
pnpm angular:install
pnpm dotnet:restore
pnpm lint
pnpm test:ci
pnpm test:e2e
pnpm build
pnpm start
```

For live backend integration across Angular and .NET demos, run the shared sample API in a second
terminal:

```bash
pnpm dotnet:start:demo-api
```

The API serves five endpoint groups — angular-lookups, angular-async-state, angular-optimistic-state,
angular-permissions, and hexguard-reference-data — on `http://127.0.0.1:5074`. See the
[demo runbook](docs/demo/README.md) for the full route list.

When working in the dedicated .NET space:

```bash
pnpm dotnet:restore
pnpm dotnet:build
pnpm dotnet:test
```

Repository layout:

- `angular/`: Angular workspace for libraries, demo app, Playwright coverage, and Angular-specific tooling
- `angular/packages/`: publishable Angular libraries such as `angular-url-state`, `angular-async-state`, `angular-optimistic-state`, and `angular-query-form`
- `dotnet/`: dedicated .NET workspace for future libraries, tests, and sample hosts
- `dotnet/samples/`: one shared sample API with package-scoped folders and future cross-stack demos
- `angular/apps/demo-angular`: docs-grade demo and Playwright target
- `docs/`: package guides, demo runbook, AI workflow docs
- `.github/workflows/`: CI and release automation

## License

MIT. See `LICENSE`.
