# HexGuard

HexGuard publishes small, production-grade guardrails for Angular and .NET applications. This
repository is the monorepo hub for published packages, demo apps, release automation, and the AI
workflow docs that keep future package work consistent.

## Package Discovery

The detailed package and roadmap catalog now lives in [docs/packages/README.md](docs/packages/README.md)
and is generated from the same source metadata that drives the Angular demo website.

Current public Angular package entry points are available here:

- [@hexguard/angular-url-state](angular/packages/angular-url-state/README.md)
- [@hexguard/angular-async-state](angular/packages/angular-async-state/README.md)
- [@hexguard/angular-optimistic-state](angular/packages/angular-optimistic-state/README.md)
- [@hexguard/angular-query-form](angular/packages/angular-query-form/README.md)
- [@hexguard/angular-permissions](angular/packages/angular-permissions/README.md)

## Documentation

- [Docs Index](docs/README.md)
- [Package Catalog](docs/packages/README.md)
- [Angular URL State Deep Dive](docs/packages/angular-url-state.md)
- [Angular Query Form Deep Dive](docs/packages/angular-query-form.md)
- [Angular Async State Deep Dive](docs/packages/angular-async-state.md)
- [Angular Optimistic State Deep Dive](docs/packages/angular-optimistic-state.md)
- [Angular Permissions Deep Dive](docs/packages/angular-permissions.md)
- [Run the Demo](docs/demo/README.md)
- [AI Workflow](docs/.ai/README.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)

## Local Development

```bash
pnpm install
pnpm angular:install
pnpm lint
pnpm test:ci
pnpm test:e2e
pnpm build
pnpm start
```

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
- `angular/apps/demo-angular`: docs-grade demo and Playwright target
- `docs/`: package guides, demo runbook, AI workflow docs
- `.github/workflows/`: CI and release automation

## License

MIT. See `LICENSE`.
