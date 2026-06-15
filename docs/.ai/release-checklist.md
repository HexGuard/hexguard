# AI Release Checklist

Use this checklist before tagging any current Angular package release.

The current first release set remains at `0.1.0` for `@hexguard/angular-url-state`,
`@hexguard/angular-query-form`, and `@hexguard/angular-async-state` because no Angular package
release tags exist in the repository yet.

## Preflight

1. Confirm the package version in `package.json` matches the intended release and that the
   matching package tag does not already exist.
2. Confirm the package README and matching `docs/packages/` page describe the current behavior.
3. Confirm the root README still points to the correct package docs and demo instructions.
4. Confirm `docs/packages/README.md` and the demo package hub mark the package as `Available` if
   this release is expected to be public immediately.

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

For the current `0.1.0` Angular release set, tag each package explicitly:

```bash
git tag angular-url-state-v0.1.0
git push origin angular-url-state-v0.1.0

git tag angular-query-form-v0.1.0
git push origin angular-query-form-v0.1.0

git tag angular-async-state-v0.1.0
git push origin angular-async-state-v0.1.0
```

For future releases, the tag patterns are:

- `angular-url-state-v<version>`
- `angular-query-form-v<version>`
- `angular-async-state-v<version>`

Each push-tag workflow validates the workspace, publishes the package to npm, and creates a
GitHub release.

Manual `workflow_dispatch` runs are still available for publish-only cases such as a non-`latest`
dist-tag, but they should leave `create_github_release` disabled unless an explicit matching
`release_tag` is provided.
