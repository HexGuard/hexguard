# HexGuard Agent Guidelines

## Repo Map

- `packages/angular-url-state`: publishable Angular library and public API surface
- `dotnet/`: dedicated .NET workspace for future libraries, tests, and sample hosts
- `apps/demo-angular`: docs-grade demo used by unit and Playwright coverage
- `docs/`: package guides, demo runbook, roadmap, and AI workflow docs
- `.github/workflows/`: CI, release, and publish automation

## Build and Test

- use Node `22.22.3` or newer and pnpm `10.27.0`
- install with `pnpm install`
- validate library work with `pnpm test:lib` and `pnpm build:lib`
- validate demo work with `pnpm test:app` and `pnpm test:e2e`
- validate .NET workspace work with `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test`
- before finishing broader changes, run `pnpm format:check`, `pnpm lint`, `pnpm test:ci`, and `pnpm build`

## Conventions

- keep `@hexguard/angular-url-state` dependency-free at runtime beyond Angular and `tslib`
- preserve deterministic query serialization and safe invalid URL fallback behavior
- add stable `data-testid` hooks for new interactive demo elements so Playwright tests stay robust
- update `docs/` and package READMEs when public APIs, demo flows, or release behavior changes

## References

- see `.github/instructions/library-development.instructions.md` for publishable package development rules
- see `docs/packages/angular-url-state.md` for library behavior notes
- see `docs/demo/README.md` for demo and Playwright workflow
- see `docs/.ai/README.md` and `docs/.ai/backlog.md` for the AI operating model
