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
- [x] **Implement `@hexguard/angular-notifications`** — headless toast/notification queue. [Detailed plan](angular/feature-angular-notifications.md)
- [x] **Implement `@hexguard/angular-error-boundary`** — declarative component error boundary. [Detailed plan](angular/feature-angular-error-boundary.md)
- [x] **Implement `@hexguard/angular-debounce`** — debounced value signal primitive. [Detailed plan](angular/feature-angular-debounce.md)
- [ ] **Implement `HexGuard.FeatureFlags + @hexguard/angular-feature-flags`** — cross-stack flag evaluation and sync pair. [Detailed plan](cross-stack/feature-feature-flags-cross-stack.md)
- [ ] **Implement `HexGuard.BulkOperations + @hexguard/angular-bulk-operations`** — cross-stack bulk action contracts with HTTP 207 partial-success. [Detailed plan](cross-stack/feature-bulk-operations-cross-stack.md)
- [ ] **Implement `@hexguard/angular-network-status`** — connectivity-state and online/offline signals. [Detailed plan](angular/feature-angular-network-status.md)
- [ ] **Implement `@hexguard/angular-visibility`** — tab visibility, idle detection, and element-visibility signals. [Detailed plan](angular/feature-angular-visibility.md)
- [ ] **Implement `@hexguard/angular-scroll-state`** — scroll position, infinite-scroll, and scroll-spy primitives. [Detailed plan](angular/feature-angular-scroll-state.md)
- [ ] **Implement `HexGuard.SoftDelete`** — .NET soft-delete query filters and restore helpers. [Detailed plan](dotnet/feature-dotnet-soft-delete.md)
- [ ] **Implement `HexGuard.Concurrency`** — .NET ETag, version-based conflict detection, and If-Match middleware. [Detailed plan](dotnet/feature-dotnet-concurrency.md)
- [ ] **Implement `@hexguard/angular-storage`** — typed signal-wrapper for localStorage/sessionStorage with cross-tab sync. [Detailed plan](angular/feature-angular-storage.md)
- [ ] **Implement `@hexguard/angular-skeleton`** — skeleton loading state composable with async-state. [Detailed plan](angular/feature-angular-skeleton.md)
- [ ] **Implement `@hexguard/angular-empty-state`** — headless empty-state display contracts for zero-result screens. [Detailed plan](angular/feature-angular-empty-state.md)
- [ ] **Implement `@hexguard/angular-date-utils`** — pure date-utility functions and DateRange model. [Detailed plan](angular/feature-angular-date-utils.md)
- [ ] **Implement `HexGuard.RateLimiting`** — .NET rate-limit policy conventions and standard response headers. [Detailed plan](dotnet/feature-dotnet-rate-limiting.md)
- [ ] **Implement `@hexguard/angular-focus-trap`** — focus-trap state for modals and dialogs with tab-cycling and focus restoration. [Detailed plan](angular/feature-angular-focus-trap.md)
- [ ] **Implement `@hexguard/angular-breakpoint-observer`** — reactive TypeScript breakpoint detection with signal-based above/below helpers. [Detailed plan](angular/feature-angular-breakpoint-observer.md)
- [ ] **Implement `@hexguard/angular-pagination`** — pagination state signals with URL-sync adapter, paired with `HexGuard.Pagination`. [Detailed plan](angular/feature-angular-pagination.md)
- [ ] **Implement `HexGuard.DataSeeding`** — .NET idempotent data seeding, environment-aware seed sets, and test-data factories. [Detailed plan](dotnet/feature-dotnet-data-seeding.md)
- [ ] **Implement `HexGuard.Search + @hexguard/angular-search`** — cross-stack search-query and autocomplete contracts with debounced input and highlight tokens. [Detailed plan](cross-stack/feature-search-cross-stack.md)
- [ ] **Implement `@hexguard/angular-tour`** — product tour / onboarding step state with persistence and feature-flag gating. [Detailed plan](angular/feature-angular-tour.md)
- [ ] **Implement `@hexguard/angular-drag-state`** — drag-and-drop interaction state for kanban, sortable lists, and cross-zone reorder. [Detailed plan](angular/feature-angular-drag-state.md)
- [ ] **Implement `HexGuard.StateMachine`** — .NET lightweight state machine for business workflow transitions. [Detailed plan](dotnet/feature-dotnet-state-machine.md)
- [ ] **Implement `HexGuard.NotificationDelivery + @hexguard/angular-notification-inbox`** — cross-stack in-app notification feed with read/unread tracking and real-time delivery. [Detailed plan](cross-stack/feature-notification-delivery-cross-stack.md)
- [ ] **Implement `HexGuard.ApiVersioning + @hexguard/angular-api-versioning`** — cross-stack API deprecation headers and client-side deprecation awareness. [Detailed plan](cross-stack/feature-api-versioning-cross-stack.md)
- [ ] **Implement `@hexguard/angular-wizard-state`** — multi-step wizard flow state with validation gates and resume. [Detailed plan](angular/feature-angular-wizard-state.md)
- [ ] **Implement `@hexguard/angular-undo`** — reversible action undo stack with auto-expiry. [Detailed plan](angular/feature-angular-undo.md)
- [ ] **Implement `HexGuard.AuditTrail`** — .NET audit event capture and EF Core interceptor. [Detailed plan](dotnet/feature-dotnet-audit-trail.md)
- [ ] **Implement `HexGuard.EndpointConventions`** — .NET typed-result helpers for validation, pagination, ETags. [Detailed plan](dotnet/feature-dotnet-endpoint-conventions.md)
- [ ] **Implement `HexGuard.Filtering`** — .NET safe filter/sort/search query binding and expression builders. [Detailed plan](dotnet/feature-dotnet-filtering.md)
- [ ] **Implement `HexGuard.Idempotency`** — .NET idempotency-key middleware and response replay. [Detailed plan](dotnet/feature-dotnet-idempotency.md)
- [ ] **Implement `HexGuard.Scheduling + @hexguard/angular-scheduling`** — cross-stack time-slot availability and booking contracts. [Detailed plan](cross-stack/feature-scheduling-cross-stack.md)
- [ ] **Implement `HexGuard.Idempotency + @hexguard/angular-idempotency`** — cross-stack idempotency-key pair with key generation, replay-safe responses, and retry-aware action flows. [Detailed plan](cross-stack/feature-idempotency-cross-stack.md)
- [ ] **Implement `HexGuard.OperationStatus + @hexguard/angular-operation-status`** — cross-stack long-running operation status polling and progress tracking. [Detailed plan](cross-stack/feature-operation-status-cross-stack.md)
- [ ] **Implement `HexGuard.PreferenceSync + @hexguard/angular-preferences`** — cross-stack user preference sync with local-first storage and server sync. [Detailed plan](cross-stack/feature-preference-sync-cross-stack.md)
- [ ] **Implement `HexGuard.QueryContracts + @hexguard/angular-query-contracts`** — cross-stack query request/response contracts for search, filter, sort, and pagination. [Detailed plan](cross-stack/feature-query-contracts-cross-stack.md)
- [ ] **Implement `HexGuard.Uploads + @hexguard/angular-upload-state`** — cross-stack upload session contracts with progress, retry, and completion tracking. [Detailed plan](cross-stack/feature-uploads-cross-stack.md)
- [ ] **Implement `@hexguard/angular-selection-state`** — keyed selection state for tables, lists, and bulk actions. [Detailed plan](angular/feature-angular-selection-state.md)
- [ ] **Implement `@hexguard/angular-route-memory`** — route-scoped context save/restore for list-detail-edit flows. [Detailed plan](angular/feature-angular-route-memory.md)
- [ ] **Implement `@hexguard/angular-page-context`** — page titles, breadcrumbs, tabs, and contextual actions. [Detailed plan](angular/feature-angular-page-context.md)
- [ ] **Implement `@hexguard/angular-navigation-pending`** — route transition pending state and slow-navigation indicators. [Detailed plan](angular/feature-angular-navigation-pending.md)
- [ ] **Implement `@hexguard/angular-live-data`** — visibility-aware polling, stale indicators, and manual refresh controls. [Detailed plan](angular/feature-angular-live-data.md)
- [ ] **Implement `@hexguard/angular-form-drafts`** — draft persistence, autosave, restore, and discard for edit forms. [Detailed plan](angular/feature-angular-form-drafts.md)
- [ ] **Implement `@hexguard/angular-feature-flags`** — typed feature-flag evaluation with route guards and template helpers. [Detailed plan](angular/feature-angular-feature-flags.md)
- [ ] **Implement `@hexguard/angular-confirmation`** — headless confirm/cancel and confirm-and-run async action flows. [Detailed plan](angular/feature-angular-confirmation.md)
- [ ] **Implement `@hexguard/angular-command-palette`** — command registry, keyboard shortcuts, and searchable palette. [Detailed plan](angular/feature-angular-command-palette.md)
- [ ] **Implement `@hexguard/angular-upload-state`** — file upload queue with progress, cancel, and retry. [Detailed plan](angular/feature-angular-upload-state.md)
- [ ] **Implement `@hexguard/angular-query-signal-forms`** — Signal Forms adapter for URL state. [Detailed plan](angular/feature-angular-query-signal-forms.md)

## Sidenotes

- [ ] Keep `@hexguard/angular-file-picker` as a proposed file-selection state package with validation, preview, and drag-and-drop zone state.
- [ ] Keep `@hexguard/angular-resizable` as a proposed resizable split-pane state package with min/max constraints and persistence.
- [ ] Keep `HexGuard.BackgroundJobs` as a proposed .NET background job scheduling and retry policy contracts package.
- [ ] Keep `HexGuard.Export` as a proposed .NET CSV/Excel/PDF export generation helpers package.
- [ ] Keep `HexGuard.SignalR + @hexguard/angular-signalr` as a proposed cross-stack pair for typed SignalR hub contracts and Angular connection state.
- [ ] Keep `@hexguard/angular-file-picker` as a proposed file-selection state package with validation, preview, and drag-and-drop zone state.
- [ ] Keep `@hexguard/angular-resizable` as a proposed resizable split-pane state package with min/max constraints and persistence.
- [ ] Keep `HexGuard.BackgroundJobs` as a proposed .NET background job scheduling and retry policy contracts package.
- [ ] Keep `HexGuard.Export` as a proposed .NET CSV/Excel/PDF export generation helpers package.
- [ ] Keep `HexGuard.SignalR + @hexguard/angular-signalr` as a proposed cross-stack pair for typed SignalR hub contracts and Angular connection state.

## Later

- [x] Execute the staged Angular workspace move into `angular/` and switch the repo root to wrapper-based Angular commands.
- [ ] Add changelog generation tied to package-scoped releases.
- [ ] Introduce smoke tests for published tarballs in a clean consumer fixture.
- [ ] Add package ownership metadata once the roadmap turns into multiple maintainers.
