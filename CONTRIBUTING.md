# Contributing

## Prerequisites

- Node.js `22.22.3` or newer
- Corepack enabled so the pinned pnpm version can be used

## Setup

```bash
corepack enable
pnpm install
```

## Common Commands

```bash
pnpm build
pnpm test:ci
pnpm test:e2e
pnpm lint
pnpm start
```

## Pull Requests

- keep changes focused on one concern
- add or update tests when behavior changes
- keep public APIs small and intentional
- update README content when installation, usage, or behavior changes
- update `docs/` when package behavior, demo flows, or AI workflow conventions change
- run `pnpm format:check`, `pnpm lint`, `pnpm test:ci`, `pnpm test:e2e`, and `pnpm build` before opening a PR

## Commit Scope

The repository is a monorepo. Prefer commits and PRs that clearly indicate the affected package or
app.

Examples:

- `angular-url-state: tighten invalid enum handling`
- `demo-angular: add dashboard push-history scenario`

## Release Expectations

This repository is building toward reusable public packages. Avoid adding package-local hacks that
would make future extraction or reuse harder.

## Releasing `@hexguard/angular-url-state`

The package publish workflow lives in `.github/workflows/release-angular-url-state.yml`.

Requirements:

- GitHub Actions environment or repository secret `NPM_TOKEN` with publish access to npm
- package version updated in `angular/packages/angular-url-state/package.json`
- green CI on `main`

Default release path:

1. update `angular/packages/angular-url-state/package.json` to the target version
2. commit the change on `main`
3. create and push a tag in the format `angular-url-state-v<version>`
4. GitHub Actions will validate, build, publish to npm, and attach the tarball to a GitHub release

Example:

```bash
git tag angular-url-state-v0.1.1
git push origin angular-url-state-v0.1.1
```

The workflow can also be run manually with `workflow_dispatch` when you need a non-default npm
dist-tag such as `next`.

## Documentation and AI Workflow

- root package and roadmap navigation lives in `README.md`
- package, demo, and roadmap docs live in `docs/`
- repo-wide agent guidance lives in `AGENTS.md`
- file-specific agent instructions live in `.github/instructions/`
- planning and execution backlog for AI-assisted work lives in `docs/.ai/backlog.md`
