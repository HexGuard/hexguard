# Public API Review & Improvements Identification — Overview

**Review date:** 2026-06-22  
**Scope:** All 33 packages (26 Angular + 7 .NET)  
**Methodology:** Full deep-dive per package — public API, implementation quality, documentation, test coverage, demo integration, cross-package consistency  
**Format:** Findings recorded in each package's `docs/packages/*.md` deep-dive doc under a new `## API Review Findings` section  
**Constraint:** No code changes — documentation-only observations

---

## Summary Statistics

| Metric                     | Count                                                           |
| -------------------------- | --------------------------------------------------------------- |
| Packages reviewed          | **33** (26 Angular + 7 .NET)                                    |
| Docs updated with findings | **32** (1 new doc created for missing `hexguard-pagination.md`) |
| Observations recorded      | **~350+** across all packages                                   |
| Praise findings            | **~120+**                                                       |
| Moderate findings          | **~45**                                                         |
| Minor findings             | **~80**                                                         |

---

## Top Cross-Package Issues

### 🔴 Critical (blocks CI or publishing)

| Issue                                                                                                                                           | Affected Packages                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Completely orphaned from CI/CD** — `angular-feature-flags` has no build/test/verify/lint chain integration, no release workflow, no CHANGELOG | `angular-feature-flags`                                                                          |
| **Missing release workflows** — no `.github/workflows/release-*.yml` file exists                                                                | `angular-date-utils`, `angular-feature-flags`, `angular-network-status`, `angular-storage`       |
| **Missing chain integration** — not integrated into `build:lib`, `test:lib`, `test:ci`, or `verify:package` chains                              | `angular-feature-flags` (all), `angular-network-status`, `angular-storage`, `angular-date-utils` |
| **Missing standalone test scripts** — `test:lib:*` standalone script doesn't exist despite being in the chain                                   | `angular-file-picker`, `angular-form-drafts`                                                     |
| **Missing deep-dive doc** — `docs/packages/hexguard-pagination.md` did not exist (created during review)                                        | `HexGuard.Pagination`                                                                            |
| **Missing .NET release workflow** — not registered in `release-dotnet.yml`                                                                      | `HexGuard.Pagination`, `HexGuard.FeatureFlags`                                                   |
| **Missing .NET README** — no `README.md` in package directory                                                                                   | `HexGuard.Capabilities`                                                                          |

### 🟡 Moderate (should address before next release)

| Issue                                                                                                                               | Affected Packages                                             |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| No Angular TestBed tests for facade/directive/guards (only pure evaluator tested)                                                   | `angular-feature-flags`                                       |
| No URL-sync adapter tests (`withPaginationUrlSync` untested)                                                                        | `angular-pagination`                                          |
| No in-flight deduplication guard — overlapping fetches possible                                                                     | `angular-live-data`                                           |
| Missing `DestroyRef` cleanup — dangling promises if component destroyed while dialog open                                           | `angular-confirmation`                                        |
| `refresh()` silently no-ops when paused                                                                                             | `angular-live-data`                                           |
| `strictParsing` option never read in `parseProblemDetails()` — dead code                                                            | `angular-api-errors`                                          |
| `inElementVisibility` effect lifecycle leak risk without injection context                                                          | `angular-visibility`                                          |
| No test for `change` event path (native file dialog) — only drag-and-drop tested                                                    | `angular-file-picker`                                         |
| No Playwright E2E tests for interactive demo controls                                                                               | `angular-debounce`, `angular-pagination`, `angular-live-data` |
| `undosForTypeCache` Map never purges entries — memory leak                                                                          | `angular-undo`                                                |
| Doc tag pattern mismatch — `release-dotnet.yml` uses `dotnet-validationcontracts-v*` but doc says `validation-contracts-v{version}` | `HexGuard.ValidationContracts`                                |

### 🟢 Minor (nice-to-have)

| Issue                                                               | Count                                                                            |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Missing JSDoc `@example` tags on some exports                       | ~8 packages                                                                      |
| Missing `verify:package:*` standalone script                        | 3 packages (`error-boundary`, `navigation-pending`, `permissions`, `api-errors`) |
| Missing proxy scripts in root `package.json`                        | `angular-debounce`                                                               |
| Duplicate catalog entry (appears as both "Released" and "Proposed") | `angular-form-drafts`                                                            |
| No SSR guard in source                                              | `angular-visibility`, `angular-breakpoint-observer`                              |
| No CHANGELOG.md                                                     | `angular-feature-flags`                                                          |
| Multiple catalog registration issues                                | `angular-date-utils` (missing from overview table)                               |

---

## Cross-Cutting Consistency Findings

### `provide*()` + `inject*()` Pattern

| Pattern                                                | Count | Packages                                                                                                                                                                                                                  |
| ------------------------------------------------------ | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Both** `provide*()` + `inject*()` (multi-instance)   | 6     | `api-errors`, `bulk-operations`, `feature-flags`, `lookups`, `permissions`, `url-state`                                                                                                                                   |
| **Only** `inject*()` (singleton, `providedIn: 'root'`) | 14    | `breakpoint-observer`, `click-outside`, `confirmation`, `date-utils`, `file-picker`, `form-drafts`, `live-data`, `navigation-pending`, `network-status`, `pagination`, `selection-state`, `storage`, `undo`, `visibility` |
| **Signal factory** (no DI needed)                      | 5     | `async-state`, `debounce`, `error-boundary`, `optimistic-state`, `query-form`                                                                                                                                             |
| **Anomalous**                                          | 2     | `notifications` (has `provide*()` but class-based inject), `url-state` (has `provide*()` but signal factory)                                                                                                              |

### Directive/Outlet Naming

All selectors consistently use the `hexguard` prefix. No naming issues found. ✅

### Error Naming

All error classes consistently use the `*Error` suffix. No naming issues found. ✅

### Signal Factory Naming

Consistent `camelCase` style. `debouncedSignal()` uses `Signal` suffix while async-state/optimistic-state/url-state use `State` — this is by design (wraps single value vs. lifecycle).

---

## Per-Category Improvement Themes

| Category                          | Top Improvement Theme                                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------- |
| **URL & Forms** (5 pkgs)          | Add `@example` JSDoc tags; improve test coverage for edge cases                               |
| **Async State** (3 pkgs)          | Extract shared helpers; add concurrent operation tests                                        |
| **Data & Reference** (3 pkgs)     | Well established — minor test gaps only                                                       |
| **UI Infrastructure** (8 pkgs)    | Plugin architecture for outlet customization                                                  |
| **Permissions & Access** (2 pkgs) | Complete Angular TestBed tests; add missing verify scripts                                    |
| **Validation & Errors** (1 pkg)   | Remove dead `strictParsing` option                                                            |
| **Utilities** (4 pkgs)            | Add release workflows; integrate into CI chains                                               |
| **.NET** (7 pkgs)                 | Fix release workflow gaps; add missing docs; improve cross-package ProblemDetails consistency |

---

## Ecosystem Health Summary

### Angular Packages (26/26 reviewed)

```
✅ 22 packages fully CI-integrated (build + test + lint + verify chains)
⚠️ 4 packages missing CI chain integration (network-status, storage, date-utils, feature-flags)
✅ 22 packages have release workflows
⚠️ 4 packages missing release workflows (date-utils, feature-flags, network-status, storage)
✅ 25 packages have CHANGELOGs
⚠️ 1 package missing CHANGELOG (feature-flags)
✅ 26 packages have angular.json registration
✅ 26 packages have tsconfig.json path mappings
```

### .NET Packages (7/7 reviewed)

```
✅ 7 packages registered in HexGuard.slnx
✅ 5 packages have release workflow integration in release-dotnet.yml
⚠️ 2 packages missing release workflow (Pagination, FeatureFlags)
✅ 6 packages have README.md
⚠️ 1 package missing README (Capabilities)
⚠️ 1 package missing deep-dive doc (Pagination — created during review)
```

---

## How to Navigate the Findings

Each package's detailed findings live in its `docs/packages/*.md` file under the `## API Review Findings` section:

| Category              | Docs to Check                                                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| URL & Forms           | `angular-url-state.md`, `angular-query-form.md`, `angular-pagination.md`, `angular-form-drafts.md`, `angular-debounce.md`                                                                                                            |
| Async State           | `angular-async-state.md`, `angular-optimistic-state.md`, `angular-live-data.md`                                                                                                                                                      |
| Data & Reference      | `angular-lookups.md`, `angular-selection-state.md`, `angular-bulk-operations.md`                                                                                                                                                     |
| UI Infrastructure     | `angular-notifications.md`, `angular-error-boundary.md`, `angular-confirmation.md`, `angular-click-outside.md`, `angular-visibility.md`, `angular-breakpoint-observer.md`, `angular-navigation-pending.md`, `angular-file-picker.md` |
| Permissions & Access  | `angular-permissions.md`, `angular-feature-flags.md`                                                                                                                                                                                 |
| Validation & Errors   | `angular-api-errors.md`                                                                                                                                                                                                              |
| In-Progress/Utilities | `angular-network-status.md`, `angular-storage.md`, `angular-date-utils.md`, `angular-undo.md`                                                                                                                                        |
| .NET                  | `validation-contracts.md`, `hexguard-bulk-operations.md`, `hexguard-capabilities.md`, `hexguard-feature-flags.md`, `hexguard-pagination.md`, `hexguard-problem-details.md`, `hexguard-reference-data.md`                             |
