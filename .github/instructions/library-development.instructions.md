---
description: 'Use when editing HexGuard library packages under angular/packages/**. Covers clear implementation, performance, testing, code documentation, public API docs, demo sync, packaging, and release readiness for publishable libraries.'
applyTo: 'angular/packages/**'
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

## Service vs Factory Pattern

When designing the public API for a package with an `inject*()` factory function, evaluate whether state should be managed by a singleton `@Injectable({ providedIn: 'root' })` service or by per-call factory state.

**Prefersingleton @Injectable service when:**
- The state is conceptually global (theme, network status, scroll position, clipboard, command registry, confirmation dialog, navigation state, page context).
- Multiple consumers would benefit from shared event listeners (single `visibilitychange`, `keydown`, `scroll`, `storage` listener instead of one per consumer).
- The factory creates duplicate browser API subscriptions or timers per call.
- The API already uses module-level mutable state (`let nextId`, `const MAP` at module scope).
- The factory function's return type exposes signals that should be consistent across components.

**Prefer per-call factory state (no singleton service) when:**
- State is inherently per-instance (pagination per list, undo stack per editor, form dirty state per form, wizard state per wizard).
- Each call requires unique configuration that cannot be shared (different `accept`/`multiple` for file pickers, different `key` for form drafts).
- The factory is a thin convenience wrapper around a pure helper or a different DI token.

**Recommended patterns for services:**
- **Full singleton** (`providedIn: 'root'`): The service owns all state signals and lifecycle. The `inject*()` function returns a facade wrapping the service's signals/methods. Use when the state is truly global and all consumers read/write the same values.
- **`createHandle()` / `createObserver()` pattern**: The service provides a factory method that returns per-call state. Use when the service provides utility methods and the per-call state is scoped to each consumer (e.g., `LiveDataService.createHandle()`, `BreakpointObserverService.createObserver()`).
- **Core delegation pattern**: The service owns stateless validation/logic methods. The factory owns per-call signals and DOM state but delegates computation to the service. Use when the state is per-call but the logic benefits from centralized testing (e.g., `FilePickerService.validateFile()`).

**Decision checklist** for every new or modified `inject*()`:
1. Is the state conceptually global or per-consumer?
2. Would duplicate event listeners/timers/subscriptions be wasteful?
3. Could the module benefit from a single point of lifecycle management?
4. Does the API's behavior already assume singleton semantics (reject concurrent calls, module-level mutable state)?

Add a service when the answer to any of these is "yes, globally" or "yes, to reduce duplication."

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
