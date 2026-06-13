---
description: 'Use when editing HexGuard library packages under packages/**. Covers clear implementation, performance, testing, code documentation, public API docs, demo sync, packaging, and release readiness for publishable libraries.'
applyTo: 'packages/**'
---

# Library Development

## Core Principles

- Treat every package as a public product surface, even during `0.x` releases.
- Keep runtime behavior explicit, deterministic, and easy to reason about.
- Prefer small cohesive modules, pure helpers, and narrow public APIs over broad abstractions.
- Do not add runtime dependencies unless the dependency removes meaningful risk or complexity and is appropriate for a publishable package.
- Avoid unrelated refactors when changing library behavior. Keep edits scoped to the package contract being improved.

## API Design

- Preserve backward compatibility unless the task explicitly accepts a breaking change.
- Keep exported names intentional. Do not export implementation details only for test convenience.
- Public types should describe the consumer contract clearly and avoid leaking internal helper shapes.
- When adding options, define defaults, precedence, invalid input behavior, and expected lifecycle semantics.
- When changing serialization, parsing, equality, or lifecycle behavior, document whether existing URLs or consumers are affected.

## Implementation Quality

- Write clear TypeScript with descriptive names, explicit boundaries, and minimal hidden state.
- Prefer structured parsing and typed helper functions over ad hoc string manipulation.
- Keep side effects at integration boundaries. Pure parsing, serialization, mapping, and validation logic should remain independently testable.
- Make cleanup behavior explicit for timers, subscriptions, effects, router listeners, or browser/platform listeners.
- Add short comments only for non-obvious behavior, public contract details, or lifecycle subtleties that future maintainers could easily break.

## Performance

- Avoid unnecessary allocations, repeated parsing, redundant navigation, or repeated signal writes in hot paths.
- Provide semantic equality hooks when values are arrays, dates, objects, or other non-primitive structures.
- Keep deterministic output stable so consumers, tests, and docs can rely on predictable behavior.
- Avoid direct browser globals inside library code unless guarded and intentionally documented. Prefer Angular abstractions where available.

## Tests

- Cover pure helpers with focused unit tests, including invalid input and edge cases.
- Cover Angular integration behavior with component or router-level tests when DI, signals, navigation, cleanup, or lifecycle behavior changes.
- Add regression tests for every public bug fix.
- Test both default behavior and non-default options when option semantics change.
- Run `pnpm test:lib` and `pnpm build:lib` for library changes. Run `pnpm test:ci` and `pnpm build` for broader or cross-package changes.

## Documentation

- Add JSDoc for exported functions, exported types, public options, public errors, and behavior that consumers need to understand from API docs.
- Document internal behavior in code only when it protects a subtle invariant, cleanup rule, performance decision, or compatibility constraint.
- Keep the package README and matching `docs/packages/` page in sync with public API, option, behavior, install, or release changes.
- Update examples when the recommended usage pattern changes. Avoid examples that rely on private APIs or undocumented behavior.
- Keep npm-facing README links valid outside the monorepo. Use absolute GitHub links for docs that are not packaged with the library.

## Demo Sync

- Update the demo app when a public API change affects visible usage, recommended patterns, or user-facing behavior.
- Keep demo flows realistic and docs-grade. They should prove behavior through live state, URL changes, and stable `data-testid` hooks.
- If demo source snippets are affected, run `pnpm demo:snippets` and commit the regenerated snippet output.
- Run `pnpm test:e2e` when library behavior is demonstrated in the browser or Playwright assertions depend on the changed contract.

## Packaging And Release Readiness

- Keep package metadata accurate: `name`, `version`, `description`, `keywords`, `repository`, `homepage`, `bugs`, `license`, peer dependencies, and `publishConfig`.
- Ensure publish artifacts include expected consumer files such as README, license, package manifest, ESM output, and type declarations.
- Keep peer dependencies aligned with the supported framework/runtime versions.
- Run `pnpm verify:package` when package output, README packaging, `ng-package.json`, or release behavior changes.
- Before release-oriented changes finish, prefer the full gate: `pnpm format:check`, `pnpm lint`, `pnpm test:ci`, `pnpm test:e2e`, `pnpm build`, and `pnpm verify:package`.
