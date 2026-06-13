# AI Backlog

## Now

- [ ] Add versioning/release note automation for package changes beyond tag-based publishing.
- [x] Expand Playwright coverage to include invalid-query fallback cases in the demo.
- [ ] Add a docs site or static docs generation step once multiple packages are published.

## Next

- [x] Design the first API brief for `@hexguard/angular-query-form` on top of URL state.
- [ ] Publish and smoke-test the first `@hexguard/angular-query-form` release candidate.
- [ ] Design the package brief for `@hexguard/angular-async-state` as a signal-first async value and async action utility with optional template helpers.
- [ ] Design the package brief for `@hexguard/angular-optimistic-state` as a reusable optimistic mutation and rollback utility.
- [ ] Decide whether `@hexguard/angular-query-form` should support local-only controls beyond URL-backed fields.
- [ ] Design the package brief for `@hexguard/angular-query-signal-forms` as a separate Signal Forms adapter on top of URL state.
- [ ] Decide whether `@hexguard/angular-submit-lock` stays a separate package or becomes thin ergonomics on top of `@hexguard/angular-async-state` action helpers.
- [x] Add a package decision record for how .NET packages will coexist with Angular packages in the monorepo.
- [x] Define the initial dedicated .NET workspace area and root command conventions.
- [x] Propose a dedicated `angular/` workspace target that isolates Angular-specific code from the repo root.

## Sidenotes

- [ ] Keep `HexGuard.OperationStatus + @hexguard/angular-operation-status` as a parked paired package family until the Angular and .NET spaces both need it.
- [ ] Keep `HexGuard.Idempotency + @hexguard/angular-idempotency` as a parked paired package family until the Angular and .NET spaces both need it.

## Later

- [ ] Migrate the current Angular workspace into a top-level `angular/` area once release and documentation churn is low enough to absorb the move.
- [ ] Add changelog generation tied to package-scoped releases.
- [ ] Introduce smoke tests for published tarballs in a clean consumer fixture.
- [ ] Add package ownership metadata once the roadmap turns into multiple maintainers.
