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
- [ ] **Implement `@hexguard/angular-notifications`** — headless toast/notification queue. [Detailed plan](angular/feature-angular-notifications.md)
- [ ] **Implement `@hexguard/angular-error-boundary`** — declarative component error boundary. [Detailed plan](angular/feature-angular-error-boundary.md)
- [ ] **Implement `@hexguard/angular-debounce`** — debounced value signal primitive. [Detailed plan](angular/feature-angular-debounce.md)
- [ ] **Implement `HexGuard.FeatureFlags + @hexguard/angular-feature-flags`** — cross-stack flag evaluation and sync pair. [Detailed plan](cross-stack/feature-feature-flags-cross-stack.md)
- [ ] **Implement `HexGuard.BulkOperations + @hexguard/angular-bulk-operations`** — cross-stack bulk action contracts with HTTP 207 partial-success. [Detailed plan](cross-stack/feature-bulk-operations-cross-stack.md)
- [ ] **Implement `@hexguard/angular-network-status`** — connectivity-state and online/offline signals. [Detailed plan](angular/feature-angular-network-status.md)
- [ ] **Implement `@hexguard/angular-visibility`** — tab visibility, idle detection, and element-visibility signals. [Detailed plan](angular/feature-angular-visibility.md)
- [ ] **Implement `@hexguard/angular-scroll-state`** — scroll position, infinite-scroll, and scroll-spy primitives. [Detailed plan](angular/feature-angular-scroll-state.md)
- [ ] **Implement `HexGuard.SoftDelete`** — .NET soft-delete query filters and restore helpers. [Detailed plan](dotnet/feature-dotnet-soft-delete.md)
- [ ] **Implement `HexGuard.Concurrency`** — .NET ETag, version-based conflict detection, and If-Match middleware. [Detailed plan](dotnet/feature-dotnet-concurrency.md)

## Sidenotes

- [ ] Keep `HexGuard.OperationStatus + @hexguard/angular-operation-status` as a parked paired package family until the Angular and .NET spaces both need it.
- [ ] Keep `HexGuard.Idempotency + @hexguard/angular-idempotency` as a parked paired package family until the Angular and .NET spaces both need it.
- [ ] Keep `@hexguard/angular-breakpoint-observer` as a proposed reactive TypeScript breakpoint detection package.
- [ ] Keep `@hexguard/angular-form-utils` as a proposed cross-field validators and dirty-check helpers package.
- [ ] Keep `HexGuard.Exports + @hexguard/angular-exports` as a parked cross-stack pair for CSV/Excel/PDF export contracts and client-side download tracking.
- [ ] Keep `HexGuard.ChangeTracking + @hexguard/angular-change-tracking` as a parked cross-stack pair for field-level change set contracts and audit UI helpers.
- [ ] Keep `HexGuard.Imports + @hexguard/angular-imports` as a parked cross-stack pair for CSV/Excel import sessions with column mapping, preview, and row-level error display.
- [ ] Keep `@hexguard/angular-scroll-state` as a proposed scroll-position management and infinite-scroll detection package.
- [ ] Keep `@hexguard/angular-window-state` as a proposed signal-based resize and dimension tracking package.
- [ ] Keep `@hexguard/angular-theme` as a proposed dark-mode and theme-state package with system-preference detection.
- [ ] Keep `@hexguard/angular-timer` as a proposed countdown and elapsed-timer signals package.
- [ ] Keep `@hexguard/angular-activity-indicator` as a proposed global busy-state indicator package.
- [ ] Keep `HexGuard.Caching + @hexguard/angular-caching` as a parked cross-stack pair for cache-header helpers, invalidation contracts, and client-side cache-awareness signals.
- [ ] Keep `HexGuard.Sse + @hexguard/angular-sse` as a parked cross-stack pair for Server-Sent Events message contracts and typed Angular real-time event consumers.
- [ ] Keep `HexGuard.UserPresence + @hexguard/angular-user-presence` as a parked cross-stack pair for user online/away/last-seen state and collaborative awareness signals.
- [ ] Keep `@hexguard/angular-skeleton` as a proposed skeleton/placeholder loading state package composable with async-state.
- [ ] Keep `@hexguard/angular-empty-state` as a proposed empty-state display contracts package for zero-result and no-data screens.
- [ ] Keep `@hexguard/angular-date-utils` as a proposed date-range, relative-time, and locale-aware formatting utilities package.
- [ ] Keep `@hexguard/angular-focus-trap` as a proposed focus-trap and focus-restoration state package for modals and dialogs.
- [ ] Keep `@hexguard/angular-tour` as a proposed product-tour and onboarding step state package.
- [ ] Keep `@hexguard/angular-drag-state` as a proposed drag-and-drop interaction state package composable with CDK DragDrop.
- [ ] Keep `HexGuard.NotificationDelivery + @hexguard/angular-notification-inbox` as a parked cross-stack pair for server-pushed notification feeds with read-state and deep-link routing.
- [ ] Keep `HexGuard.Scheduling + @hexguard/angular-scheduling` as a parked cross-stack pair for time-slot availability and booking contracts.
- [ ] Keep `HexGuard.ApiVersioning + @hexguard/angular-api-versioning` as a parked cross-stack pair for API version negotiation and deprecation-header conventions.
- [ ] Keep `HexGuard.StateMachine` as a proposed .NET lightweight state-machine package for business workflow progression.
- [ ] Keep `HexGuard.RateLimiting` as a proposed .NET rate-limit policy configuration and response header helpers package.
- [ ] Keep `HexGuard.DataSeeding` as a proposed .NET idempotent data seeding and test-data factories package.

## Later

- [x] Execute the staged Angular workspace move into `angular/` and switch the repo root to wrapper-based Angular commands.
- [ ] Add changelog generation tied to package-scoped releases.
- [ ] Introduce smoke tests for published tarballs in a clean consumer fixture.
- [ ] Add package ownership metadata once the roadmap turns into multiple maintainers.
- [ ] Design the package brief for `@hexguard/angular-pagination` as an Angular pagination state signals package to pair with `HexGuard.Pagination`.
- [ ] Design the package brief for `@hexguard/angular-scroll-state` as a headless scroll-position management package with save/restore, infinite-scroll threshold, and scroll-spy tracking.
- [ ] Design the package brief for `@hexguard/angular-storage` as a typed signal-wrapper package for localStorage and sessionStorage with serialization and cross-tab sync.
- [ ] Design the package brief for `@hexguard/angular-network-status` as a connectivity-state signals package for offline-aware Angular UI behavior.
- [ ] Design the package brief for `HexGuard.Sse + @hexguard/angular-sse` as a cross-stack pair for Server-Sent Events contracts and typed Angular real-time consumers.
- [ ] Design the package brief for `HexGuard.Search + @hexguard/angular-search` as a cross-stack pair for search-query contracts, autocomplete response models, and Angular debounced search-as-you-type helpers.
- [ ] Design the package brief for `@hexguard/angular-skeleton` as a skeleton loading-state package with configurable shapes and async-state composition.
- [ ] Design the package brief for `@hexguard/angular-empty-state` as an empty-state display contracts package for zero-result screens.
- [ ] Design the package brief for `@hexguard/angular-date-utils` as a date-range state and formatting utilities package.
- [ ] Design the package brief for `HexGuard.StateMachine` as a lightweight .NET state-machine package for business workflow transitions.
