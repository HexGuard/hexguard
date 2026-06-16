# AI Backlog

## Now

- [x] Prepare the first tag-driven `0.1.0` Angular release pass for `@hexguard/angular-url-state`, `@hexguard/angular-query-form`, and `@hexguard/angular-async-state`.
- [ ] Add versioning/release note automation for package changes beyond tag-based publishing.
- [x] Expand Playwright coverage to include invalid-query fallback cases in the demo.
- [ ] Add a docs site or static docs generation step once multiple packages are published.

## Next

- [x] Design the first API brief for `@hexguard/angular-query-form` on top of URL state.
- [ ] Tag, publish, and smoke-test the first `0.1.0` Angular release set (`@hexguard/angular-url-state`, `@hexguard/angular-query-form`, and `@hexguard/angular-async-state`).
- [x] Design the package brief for `@hexguard/angular-async-state` as a signal-first async value and async action utility with optional template helpers.
- [ ] Design the package brief for `@hexguard/angular-optimistic-state` as a reusable optimistic mutation and rollback utility.
- [ ] Decide whether `@hexguard/angular-query-form` should support local-only controls beyond URL-backed fields.
- [ ] Design the package brief for `@hexguard/angular-query-signal-forms` as a separate Signal Forms adapter on top of URL state.
- [ ] Decide whether `@hexguard/angular-submit-lock` stays a separate package or becomes thin ergonomics on top of `@hexguard/angular-async-state` action helpers.
- [x] Add a package decision record for how .NET packages will coexist with Angular packages in the monorepo.
- [x] Define the initial dedicated .NET workspace area and root command conventions.
- [x] Propose a dedicated `angular/` workspace target that isolates Angular-specific code from the repo root.
- [x] Write a staged Angular workspace migration plan with exact file moves and wrapper-script changes.
- [x] Propose the final thin root `package.json` and CI shape for split `angular/` and `dotnet/` workspaces.

## Sidenotes

- [ ] Keep `HexGuard.OperationStatus + @hexguard/angular-operation-status` as a parked paired package family until the Angular and .NET spaces both need it.
- [ ] Keep `HexGuard.Idempotency + @hexguard/angular-idempotency` as a parked paired package family until the Angular and .NET spaces both need it.
- [ ] Keep `@hexguard/angular-notifications` as a proposed headless notification queue and toast state package — high impact, small surface, unique in catalog.
- [ ] Keep `@hexguard/angular-debounce` as a proposed debounced value signal package for search-as-you-type and auto-save workflows.
- [ ] Keep `@hexguard/angular-breakpoint-observer` as a proposed reactive TypeScript breakpoint detection package.
- [ ] Keep `@hexguard/angular-form-utils` as a proposed cross-field validators and dirty-check helpers package.
- [ ] Keep `HexGuard.BulkOperations + @hexguard/angular-bulk-operations` as a parked cross-stack pair for multi-item actions with partial-success (HTTP 207) reporting.
- [ ] Keep `HexGuard.Exports + @hexguard/angular-exports` as a parked cross-stack pair for CSV/Excel/PDF export contracts and client-side download tracking.
- [ ] Keep `HexGuard.ChangeTracking + @hexguard/angular-change-tracking` as a parked cross-stack pair for field-level change set contracts and audit UI helpers.
- [ ] Keep `HexGuard.Imports + @hexguard/angular-imports` as a parked cross-stack pair for CSV/Excel import sessions with column mapping, preview, and row-level error display.

## Later

- [x] Execute the staged Angular workspace move into `angular/` and switch the repo root to wrapper-based Angular commands.
- [ ] Add changelog generation tied to package-scoped releases.
- [ ] Introduce smoke tests for published tarballs in a clean consumer fixture.
- [ ] Add package ownership metadata once the roadmap turns into multiple maintainers.
- [ ] Design the package brief for `@hexguard/angular-notifications` as a headless notification queue with configurable stacking, timeout, pause-on-hover, and accessibility semantics.
- [ ] Design the package brief for `@hexguard/angular-debounce` as a debounced value signal with configurable wait, leading/trailing, distinct-until-changed, and pending state.
- [ ] Design the package brief for `@hexguard/angular-pagination` as an Angular pagination state signals package to pair with `HexGuard.Pagination`.
- [ ] Design the package brief for `HexGuard.BulkOperations + @hexguard/angular-bulk-operations` as a cross-stack pair for bulk create/update/delete with per-item success/failure reporting.
