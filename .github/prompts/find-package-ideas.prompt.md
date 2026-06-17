---
description: 'Propose new HexGuard package ideas. Research common frontend (Angular) and backend (.NET) development problems, identify gaps in the existing catalog, and produce structured package briefs under docs/.ai/backlog/.'
agent: 'agent'
argument-hint: "Optional constraints: stack (angular/dotnet/cross-stack), domain (validation/state/UI/data), or theme (e.g. 'packages related to form workflows')"
---

# Find Package Ideas

Research and propose new HexGuard package ideas.

## Before You Start

Read these references first:

1. **`AGENTS.md`** — repo structure, build commands, conventions
2. **`.github/instructions/library-development.instructions.md`** — quality criteria new packages must meet
3. **`docs/.ai/backlog.md`** — master backlog of existing proposed, planned, and in-progress packages
4. **`docs/.ai/backlog/`** — subfolder with detailed feature briefs by stack (angular/, dotnet/, cross-stack/)
5. **`docs/packages/README.md`** — current package catalog with statuses

## Study an Existing Package

Read one or two existing packages as structural templates, for example:

- `angular/packages/angular-api-errors/` (simpler package — good baseline)
  - `package.json`, `ng-package.json`, `tsconfig.lib.json`, `tsconfig.lib.prod.json`, `tsconfig.spec.json`
  - `src/public-api.ts` (narrow export whitelist)
  - `README.md` (npm-facing quickstart)
- `docs/packages/angular-api-errors.md` (deep-dive doc)

## Methodology

Identify gaps by scanning for common development problems where:

1. The problem is **generic** — not specific to one app's business logic
2. The problem is **repeated** — every team rebuilds something similar
3. A narrow, **headless** library would help without dictating UI
4. Angular packages should be **signal-first**, dependency-free beyond Angular + `tslib`
5. .NET packages should be **minimal NuGet dependencies**, focused on contracts or helpers
6. Cross-stack pairs (Angular + .NET) should define shared contracts in both ecosystems

Check for overlap:

- Existing packages under `angular/packages/*` and `dotnet/src/*`
- Existing planned items in `docs/.ai/backlog.md` (the "Next" section)
- Existing proposed briefs in `docs/.ai/backlog/` subfolders
- "Sidenotes" entries in the backlog — if one matches, promote it to a full brief instead of duplicating

## Output

For each viable new package idea, produce one file:

`docs/.ai/backlog/{stack}/feature-{slug}.md`

Using the template from `docs/.ai/backlog/README.md` (YAML frontmatter with `id`, `type: feature`, `status: proposed`, `created: YYYY-MM-DD`, `package: '@hexguard/{name}'`).

Each brief must include:

- **Summary** — what problem it solves and why it matters
- **Goals** — 3-5 concrete objectives
- **Non-Goals** — what is explicitly out of scope
- **Decisions** — key design choices
- **Proposed Public API** — types, functions, exports (use TypeScript signatures)
- **Implementation Plan** — phased approach

For high-confidence ideas, also append a summary entry to the "Next" section of `docs/.ai/backlog.md`.

## Quality Guardrails

- ❌ No overlap with existing packages or planned briefs
- ❌ No runtime dependencies beyond Angular + `tslib` (Angular) or minimal NuGet deps (.NET)
- ✅ Must fit HexGuard philosophy: headless, signal-first (Angular), deterministic, narrow public API
- ✅ Cross-stack ideas go in the `cross-stack/` backlog folder
- ✅ Prefer small cohesive packages over broad frameworks
