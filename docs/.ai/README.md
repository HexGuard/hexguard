# AI Workflow

This repository is set up so coding agents can work against real constraints instead of broad,
context-heavy prompts.

## Workflow Files

- `AGENTS.md`: repo-wide working agreement for any agent that understands the open standard
- `.github/instructions/angular-url-state.instructions.md`: focused guidance for the library
- `.github/instructions/demo-angular.instructions.md`: focused guidance for the demo app
- `.github/instructions/docs.instructions.md`: focused guidance for docs work
- `docs/.ai/backlog.md`: prioritized task queue for future AI-assisted work
- `docs/.ai/backlog/README.md`: detailed execution backlog split into Angular, .NET, and cross-stack spaces
- `docs/.ai/decisions/README.md`: accepted repo and workflow decisions that affect package planning
- `docs/.ai/release-checklist.md`: release-specific execution checklist

## Recommended Task Loop

1. Start from the narrowest concrete anchor: file, symbol, failing test, route, or package.
2. Read the relevant instruction file before editing broad surfaces.
3. Make the smallest realistic change that proves or disproves the current hypothesis.
4. Run the narrowest validation command available for the touched surface.
5. Update the matching docs when public behavior or developer workflow changes.

## Default Validation Matrix

- library change: `pnpm test:lib`, `pnpm build:lib`
- demo change: `pnpm test:app`, `pnpm test:e2e`, `pnpm build:demo`
- repo-wide change: `pnpm format:check`, `pnpm lint`, `pnpm test:ci`, `pnpm build`

## Task Prompts

Invocable slash-command prompts and custom agents for package lifecycle workflows.

| Invocation                                    | File                                                  | Purpose                                                                                                                 |
| --------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/find-package-ideas`                         | `.github/prompts/find-package-ideas.prompt.md`        | Research gaps in the package catalog, produce structured package briefs under `docs/.ai/backlog/`                       |
| `/assess-package-readiness`                   | `.github/prompts/assess-package-readiness.prompt.md`  | Audit an existing package against 9 production-readiness criteria, produce an improvement plan under `docs/.ai/audits/` |
| `/plan-package-development`                   | `.github/prompts/plan-package-development.prompt.md`  | Shortcut — delegates to the Package Development Planner custom agent                                                    |
| Agent picker: **Package Development Planner** | `.github/agents/package-development-planner.agent.md` | Full end-to-end planning: API design → phases → tests → docs → demo → release                                           |

### When to Use Each

- **Find new package ideas**: You have a broad domain or technology area and want to discover what packages HexGuard is missing.
- **Assess package readiness**: You are considering a release, a public announcement, or a refactoring pass and need to know exactly what needs improvement.
- **Plan package development**: You have a concrete package concept and need a detailed implementation plan that a coding agent can follow.

## When to Update the Backlog

Add or reprioritize backlog items when:

- a repeated manual step should become automation
- a package brief graduates into a concrete design task
- tests reveal a missing documentation or release step

Use the detailed backlog spaces in `docs/.ai/backlog/` like this:

- `angular/` for Angular-only packages and demo-facing work
- `dotnet/` for .NET-only packages and backend-facing work
- `cross-stack/` for paired Angular + .NET package families and shared contracts
