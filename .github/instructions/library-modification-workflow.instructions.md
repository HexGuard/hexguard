---
description: 'Mandatory workflow when modifying existing HexGuard libraries. Covers test coverage, documentation sync (README, deep-doc, CHANGELOG), demo updates, and full verification before commit.'
applyTo: 'angular/packages/**'
---

# Library Modification Workflow

When modifying an existing HexGuard library package, follow this checklist **in order** to ensure consistency, documentation parity, and release readiness.

---

## Phase 1: Implementation

1. **Make changes to source files** under `src/lib/`.
2. **Update `src/public-api.ts`** if adding new exports.
3. **Keep the public API narrow** — export only what consumers need. No internal helpers.

---

## Phase 2: Tests

1. **Add or update tests** in the corresponding `.spec.ts` file (same directory as source).
2. Cover:
   - New functionality (success and failure paths)
   - Edge cases (empty, null, undefined, boundary values)
   - Regression for any bug fixes
   - DI-dependent functions must be tested inside a `TestBed.createComponent` context
3. **Run tests** and confirm they pass:
   ```bash
   pnpm test:lib:{name}
   ```

---

## Phase 3: Documentation

Update ALL of the following documentation files. **Do not skip any** — they must remain in sync.

### 3a. Package `README.md`

- Update the API section with new exports
- Add code examples showing common usage patterns
- Update the Scope Boundaries table if concerns were added or changed

### 3b. Deep-doc (`docs/packages/{name}.md`)

- Add new API entries to the API list
- Update the Assessment table (mark completed items as ✅)
- Add or update code examples at the bottom

### 3c. Package `CHANGELOG.md`

- Add a new version entry (or update the working version entry)
- List each change as a bullet point: new APIs, bug fixes, breaking changes
- Follow the existing format (typically `## 0.x.0` with bullets)

### 3d. Package catalog (`scripts/package-catalog.data.mjs`)

- Update `featureHighlights` array with new capabilities
- Update `bestFitScenarios` array with new use cases
- Update `summary` and `detail` text if the package scope expanded

---

## Phase 4: Demo Integration

1. **Add demo sections** for new APIs in the corresponding demo page component:
   - Update the `.ts` file (import, component properties, methods)
   - Update the `.html` template (new fieldset sections with `data-testid` attributes)
   - Update the `.css` file if new styles are needed
2. **Import new pipes or directives** in the demo component's `imports` array.
3. **Verify the demo app builds**:
   ```bash
   npx ng build demo-angular
   ```

---

## Phase 5: Regenerate Generated Files

```bash
pnpm catalog:sync    # Sync package catalog
pnpm demo:snippets   # Regenerate demo source snippets
```

---

## Phase 6: Build & Verify

### Angular Library

```bash
pnpm build:lib:{name}           # Build the publishable library
pnpm verify:package:{name}      # Verify tarball contents (README, LICENSE, ESM, DTS)
```

### Demo App

```bash
npx ng build demo-angular       # Final demo build verification
```

---

## Phase 7: Assessment Gate

Run the `/assess-package-readiness` prompt or manually verify:

| Category | What to Check |
| -------- | ------------- |
| API Design | Narrow public API, JSDoc on all exports, clear names |
| Implementation Quality | Signal-first, no browser globals, lifecycle cleanup |
| Tests | New + existing pass, edge cases covered |
| Documentation | README, deep-doc, CHANGELOG all updated and in sync |
| Demo Integration | Routes render, stable `data-testid`, snippets generated |
| Package Metadata | name, version, description, publishConfig, sideEffects |
| Build Output | `build:lib` + `verify:package` succeed |
| Release Workflow | Workflow file exists or existing workflow updated |

Save the audit report to `docs/.ai/audits/{package-name}-readiness-{YYYY-MM-DD}.md`.

---

## Phase 8: Commit

```bash
git add -A
git commit -m "feat({scope}): {short description}

{detailed bullet list of changes}

Tests: {N}/{N} passing
Build: build:lib ✅ | verify:package ✅ | demo-angular ✅"
```
