---
description: 'Audit an existing HexGuard package for production readiness. Check API design, test coverage, documentation, demo integration, package metadata, build output, and release workflow. Produces a structured improvement plan.'
agent: 'agent'
argument-hint: "Package name (e.g. angular-url-state, angular-api-errors, HexGuard.ReferenceData) or 'all' to audit every published package"
---

# Assess Package Readiness

Audit an existing HexGuard package and produce an improvement plan targeting production readiness, usability, and deployability to npm or NuGet.

## Phase A — Discovery

1. **Resolve the package** to its source path:
   - Angular: `angular/packages/{name}/`
   - .NET: `dotnet/src/HexGuard.{Name}/`
2. **If input is `all`**: gather the list from `angular/packages/*/package.json` (Angular) and `dotnet/src/*/*.csproj` (.NET), then audit each one independently
3. For each package, read:
   - `package.json` or `.csproj` (metadata, deps, publish config)
   - `ng-package.json` (Angular build config)
   - `src/public-api.ts` (Angular export surface) or the `.cs` namespace public types (.NET)
   - All source files under `src/lib/` or `src/` (implementation)
   - Test files (discover via `**/*.spec.ts` or `**/*Tests.cs`)
   - `README.md` (npm/NuGet-facing docs)
   - Matching `docs/packages/{name}.md` (deep-dive doc)
   - Demo integration: search `angular/apps/demo-angular/src` for package references (Angular only)
   - Release workflow: search `.github/workflows/release-{name}.yml`

## Phase B — Assessment

Rate each criterion ✅ (pass), ⚠️ (minor gap), or ❌ (needs work).

### 1. API Design

- Narrow `public-api.ts` — no implementation details leaked
- Clear, descriptive export names (no abbreviations)
- Backward-compatible shape (unless explicitly accepting a breaking change)
- JSDoc on every public export
- Types described the consumer contract clearly

### 2. Implementation Quality

- Signal-first architecture (Angular) / modern C# patterns (.NET)
- No direct browser globals (Angular) — uses Angular abstractions where available
- Deterministic behavior — same inputs produce same outputs
- Lifecycle cleanup explicit (timers, subscriptions, effects, listeners)
- Pure parsing/serialization/mapping logic independently testable
- Semantic `equals` hooks for arrays, dates, objects where needed

### 3. Tests

- Pure helpers covered with focused unit tests including edge cases
- Angular integration tests for DI, signals, lifecycle, cleanup
- Regression tests for every public bug fix
- Default and non-default options tested when option semantics change
- Commands pass: `pnpm test:lib:{name}` (Angular) or `pnpm dotnet:test` (.NET)

### 4. Documentation

- JSDoc on every public export covering contract, params, return type
- `README.md` has install instructions, quickstart example, API reference table, status badge
- `docs/packages/{name}.md` has feature matrix, option resolution, internal behavior notes
- Package README and docs/pages are in sync with current code behavior
- npm/NuGet-facing README links are valid outside the monorepo (absolute GitHub URLs)

### 5. Demo Integration (Angular only)

- Demo app routes render real usage of the package
- Interactive controls have stable `data-testid` attributes
- Playwright tests cover the demo flow
- Demo source snippets are generated (`pnpm demo:snippets`)

### 6. Package Metadata

- `name`, `version`, `description`, `keywords` — accurate and descriptive
- `repository`, `homepage`, `bugs` — correct URLs
- `license` — set (MIT)
- `publishConfig.access: "public"` (Angular npm packages)
- Peer dependencies aligned with supported framework version

### 7. Build Output

- `pnpm build:lib:{name}` succeeds
- `pnpm verify:package` succeeds (tarball contains README, LICENSE, ESM, type declarations)
- Build output is clean (no warnings, no missing files)

### 8. Release Workflow

- `.github/workflows/release-{name}.yml` exists and is functional
- Tag pattern matches convention (`{npm-package-name}-v{version}`)
- npm/NuGet publish configured correctly
- GitHub release creation configured

### 9. Performance

- No unnecessary allocations in hot paths
- Deterministic output stable for caching and equality checks
- Debounced writes where bursty input is expected

## Phase C — Improvement Plan

For each ❌ or ⚠️ item, produce a concrete actionable step:

1. **What file(s) to modify** (absolute paths)
2. **What the fix looks like** — description of the change (not code)
3. **Priority** — High/Medium/Low
4. **Validation command** — the narrowest `pnpm` or `dotnet` command that confirms the fix

## Output

Save the audit report to `docs/.ai/audits/{package-name}-readiness-{YYYY-MM-DD}.md`.

If `docs/.ai/audits/` does not exist, create it.

Structure:

```markdown
# Readiness Audit: @hexguard/angular-{name}

**Date**: {date}
**Version**: {version} (from package.json)

## Summary

Overall: {X}/9 criteria passed.
High priority: {N} items | Medium: {N} | Low: {N}

## Checklist

| Category               | Rating   | Key Issues |
| ---------------------- | -------- | ---------- |
| API Design             | ✅/⚠️/❌ | ...        |
| Implementation Quality | ✅/⚠️/❌ | ...        |
| Tests                  | ✅/⚠️/❌ | ...        |
| Documentation          | ✅/⚠️/❌ | ...        |
| Demo Integration       | ✅/⚠️/❌ | ...        |
| Package Metadata       | ✅/⚠️/❌ | ...        |
| Build Output           | ✅/⚠️/❌ | ...        |
| Release Workflow       | ✅/⚠️/❌ | ...        |
| Performance            | ✅/⚠️/❌ | ...        |

## Improvement Plan

### High Priority

1. **{issue}** → `{file path}` → description: ... → verify: `pnpm {command}`

### Medium Priority

...

### Low Priority

...
```
