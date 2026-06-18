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
- [x] **Implement `HexGuard.ProblemDetails`** — RFC 9457 Problem Details types, builder, middleware, and Minimal API result extensions for .NET. Pairs with `@hexguard/angular-api-errors`.
- [x] **Implement `HexGuard.FeatureFlags + @hexguard/angular-feature-flags`** — cross-stack flag evaluation and sync pair.
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
- [ ] Keep `@hexguard/angular-seo` as a proposed SSR-safe SEO metadata package for Open Graph, Twitter Card, and JSON-LD structured data.
- [ ] Keep `@hexguard/angular-hydration` as a proposed hydration debugging and selective hydration directives package for Angular SSR.
- [ ] Keep `@hexguard/angular-sitemap` as a proposed dynamic XML sitemap generation package for Angular SSR apps.
- [ ] Keep `@hexguard/angular-inline-edit` as a proposed click-to-edit and inline-editing state package for data grids and detail views.
- [ ] Keep `HexGuard.ApiKeys + @hexguard/angular-api-keys` as a proposed cross-stack pair for API key generation, hashing, and permission scoping.
- [ ] Keep `@hexguard/angular-resource` as a proposed typed resource API helper package for Angular's built-in `resource()` and `httpResource()` APIs with caching and retry.
- [ ] Keep `@hexguard/angular-defer` as a proposed programmatic `@defer` block state management package with defer-phase signals and trigger control.
- [ ] Keep `@hexguard/angular-signal-utils` as a proposed signal utility collection package (computedFrom, memoized, cached, toggle, derived) extending Angular's signal primitives.
- [ ] Keep `@hexguard/angular-ssr-config` as a proposed SSR configuration management package with pre-rendering routes, hydration control, and typed TransferState helpers.
- [ ] Keep `HexGuard.OpenApi` as a proposed .NET OpenAPI documentation conventions package on top of `Microsoft.AspNetCore.OpenApi`.
- [ ] Keep `@hexguard/angular-effect-utils` as a proposed signal effect utilities package (debouncedEffect, batchEffects, effectWithCleanup, effectOnIdle).
- [ ] Keep `@hexguard/angular-form-arrays` as a proposed FormArray operations package with typed move/swap/insert/remove helpers and dirty-tracking signals.
- [ ] Keep `@hexguard/angular-router-signals` as a proposed signal-based router params, query params, and route data access package.
- [ ] Keep `HexGuard.Logging` as a proposed .NET structured logging conventions and enrichment helpers package.
- [ ] Keep `HexGuard.CircuitBreaker` as a proposed .NET circuit breaker pattern helpers for HttpClient resilience.
- [ ] Keep `@hexguard/angular-crud` as a proposed headless CRUD controller package combining list/detail/edit patterns with async-state, pagination, and caching.
- [ ] Keep `@hexguard/angular-testing` as a proposed signal testing utilities and component harness helpers package.
- [ ] Keep `@hexguard/angular-api-client` as a proposed declarative typed API client factory package using fetch with interceptors and retry.
- [ ] Keep `@hexguard/angular-initializer` as a proposed app initialization orchestration package with progress signals and dependency ordering.
- [ ] Keep `HexGuard.ApiDefaults` as a proposed zero-config ASP.NET Core API setup package with one-call defaults.
- [ ] Keep `@hexguard/angular-env` as a proposed typed runtime configuration package with environment-aware loading and signal-based access.
- [ ] Keep `@hexguard/angular-mock-api` as a proposed declarative API mocking framework for frontend development without backend dependency.
- [ ] Keep `@hexguard/angular-json-form` as a proposed dynamic form generation package from JSON schemas and data models.
- [ ] Keep `@hexguard/angular-schematics` as a proposed Angular CLI schematics collection for scaffolding features and components.
- [ ] Keep `HexGuard.ApiMocks` as a proposed configurable mock API host for .NET development and testing.
- [ ] Keep `@hexguard/angular-i18n` as a proposed runtime internationalization package with locale switching signals and ICU formatting.
- [ ] Keep `@hexguard/angular-offline-queue` as a proposed offline mutation queue package for queuing and replaying API actions when offline.
- [ ] Keep `@hexguard/angular-geolocation` as a proposed geolocation state package with position signals and permission tracking.
- [ ] Keep `@hexguard/angular-expiration` as a proposed session/state expiry management package with countdown signals and auto-logout.
- [ ] Keep `HexGuard.PushNotifications + @hexguard/angular-push-notifications` as a proposed cross-stack pair for Web Push notification sending and subscription management.
- [ ] Keep `@hexguard/angular-auth` as a proposed authentication state management package with token storage, refresh, and route guards.
- [ ] Keep `@hexguard/angular-error-reporter` as a proposed client-side error capture and reporting package.
- [ ] Keep `@hexguard/angular-audit-log-viewer` as a proposed audit log browsing UI state package paired with HexGuard.AuditTrail.
- [ ] Keep `HexGuard.HealthChecks` as a proposed .NET health check conventions package with standard response contracts.
- [ ] Keep `HexGuard.MultiTenancy` as a proposed .NET multi-tenancy data isolation package with tenant-aware query filters.

## Later

- [x] Execute the staged Angular workspace move into `angular/` and switch the repo root to wrapper-based Angular commands.
- [ ] Add changelog generation tied to package-scoped releases.
- [ ] Introduce smoke tests for published tarballs in a clean consumer fixture.
- [ ] Add package ownership metadata once the roadmap turns into multiple maintainers.
