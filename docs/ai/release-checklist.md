# AI Release Checklist

Use this checklist before tagging `@hexguard/angular-url-state` or any future package release.

## Preflight

1. Confirm the package version in `package.json` matches the intended release.
2. Confirm the package README and matching `docs/packages/` page describe the current behavior.
3. Confirm the root README still points to the correct package docs and demo instructions.

## Validation

```bash
pnpm format:check
pnpm lint
pnpm test:ci
pnpm test:e2e
pnpm build
pnpm verify:package
```

## Tagging

For `@hexguard/angular-url-state`:

```bash
git tag angular-url-state-v<version>
git push origin angular-url-state-v<version>
```

The publish workflow will validate the workspace, publish to npm, and create a GitHub release.
