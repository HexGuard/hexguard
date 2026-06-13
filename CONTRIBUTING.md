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
pnpm lint
pnpm start
```

## Pull Requests

- keep changes focused on one concern
- add or update tests when behavior changes
- keep public APIs small and intentional
- update README content when installation, usage, or behavior changes
- run `pnpm format:check`, `pnpm lint`, `pnpm test:ci`, and `pnpm build` before opening a PR

## Commit Scope

The repository is a monorepo. Prefer commits and PRs that clearly indicate the affected package or
app.

Examples:

- `angular-url-state: tighten invalid enum handling`
- `demo-angular: add dashboard push-history scenario`

## Release Expectations

This repository is building toward reusable public packages. Avoid adding package-local hacks that
would make future extraction or reuse harder.
