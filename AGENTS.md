# HexGuard Agent Guidelines

## Repo Map

- `angular/`: Angular workspace for libraries, demo app, Playwright coverage, and Angular-specific tooling
- `angular/packages/angular-url-state`: publishable Angular library and public API surface
- `dotnet/`: dedicated .NET workspace for future libraries, tests, and sample hosts
- `angular/apps/demo-angular`: docs-grade demo used by unit and Playwright coverage
- `docs/`: package guides, demo runbook, roadmap, and AI workflow docs
- `.github/workflows/`: CI, release, and publish automation

## Build and Test

- use Node `22.22.3` or newer and pnpm `10.27.0`
- install root-shell tooling with `pnpm install`
- install Angular workspace dependencies with `pnpm angular:install`
- validate library work with `pnpm test:lib` and `pnpm build:lib`
- validate demo work with `pnpm test:app` and `pnpm test:e2e`
- validate .NET workspace work with `pnpm dotnet:restore`, `pnpm dotnet:build`, and `pnpm dotnet:test`
- before finishing broader changes, run `pnpm format:check`, `pnpm lint`, `pnpm test:ci`, and `pnpm build`

## Conventions

- keep `@hexguard/angular-url-state` dependency-free at runtime beyond Angular and `tslib`
- preserve deterministic query serialization and safe invalid URL fallback behavior
- add stable `data-testid` hooks for new interactive demo elements so Playwright tests stay robust
- update `docs/` and package READMEs when public APIs, demo flows, or release behavior changes

## Custom Prompts & Agents

These invocable prompts and custom agents cover the HexGuard package lifecycle:

| File                                                  | Type                        | Invocation                                                   | Use When                                                                        |
| ----------------------------------------------------- | --------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `.github/prompts/find-package-ideas.prompt.md`        | Prompt (slash command)      | `/find-package-ideas`                                        | Discovering new package concepts, researching gaps in the catalog               |
| `.github/prompts/assess-package-readiness.prompt.md`  | Prompt (slash command)      | `/assess-package-readiness`                                  | Auditing an existing package for production readiness, usability, deployability |
| `.github/prompts/plan-package-development.prompt.md`  | Prompt (slash command)      | `/plan-package-development`                                  | Shortcut to invoke the Package Development Planner                              |
| `.github/agents/package-development-planner.agent.md` | Custom Agent (agent picker) | Select **Package Development Planner** from the agent picker | Comprehensive end-to-end package planning from concept through release          |

### Workflow

1. **Find** new ideas → `/find-package-ideas` → produces `docs/.ai/backlog/` briefs
2. **Plan** a selected idea → `/plan-package-development` or use the Package Development Planner agent → produces detailed implementation plan in `docs/.ai/backlog/`
3. **Assess** existing packages → `/assess-package-readiness` → produces audit report in `docs/.ai/audits/`

## References

- see `.github/instructions/library-development.instructions.md` for publishable package development rules
- see `docs/packages/angular-url-state.md` for library behavior notes
- see `docs/demo/README.md` for demo and Playwright workflow
- see `docs/.ai/README.md` and `docs/.ai/backlog.md` for the AI operating model
