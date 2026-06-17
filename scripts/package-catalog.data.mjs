export const currentPackages = [
  {
    id: 'angular-url-state',
    packageName: '@hexguard/angular-url-state',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-url-state/README.md',
    deepDivePath: 'docs/packages/angular-url-state.md',
    repositoryPath: 'angular/packages/angular-url-state',
    summary: 'Type-safe, signal-first synchronization between Angular state and URL query params.',
    detail:
      'Designed for filters, dashboards, and shareable deep links where query params need stable decoding, compact keys, and browser-history-aware updates.',
    installCommand: 'pnpm add @hexguard/angular-url-state',
    featureHighlights: [
      'Deterministic query serialization and safe invalid-param fallback behavior.',
      'Signal-first state with typed codecs and compact query-key remapping.',
      'Docs-grade demos for filter screens and browser-history-friendly dashboards.',
    ],
    bestFitScenarios: [
      'Search pages where filters, pagination, and shareable links need one typed state contract.',
      'Operational dashboards that should replay tabs, toggles, and date ranges through browser history.',
      'Angular apps that need compact query keys without leaking those names into component code.',
    ],
    statusNoteParagraphs: [
      'This package is the most mature current HexGuard Angular surface and anchors the demo site around typed, deterministic URL state.',
      'It focuses on explicit query-param schemas, stable serialization, compact shared links, and invalid-param handling that fails safely instead of leaving pages half-hydrated.',
    ],
  },
  {
    id: 'angular-query-form',
    packageName: '@hexguard/angular-query-form',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-query-form/README.md',
    deepDivePath: 'docs/packages/angular-query-form.md',
    repositoryPath: 'angular/packages/angular-query-form',
    summary:
      'Reactive Forms binding for typed query params, reset-on-change rules, and malformed-link recovery.',
    detail:
      'Built for filter-heavy pages that need URL-owned state, partial form ownership, reset-on-change rules, and malformed-link cleanup without hand-written glue.',
    installCommand: 'pnpm add @hexguard/angular-query-form @hexguard/angular-url-state',
    featureHighlights: [
      'Manual apply mode for staged form commits on noisy filter surfaces.',
      'Managed key subsets so page and page size can stay URL-owned when needed.',
      'Recovery demos that prove invalid-link cleanup and coherent history replay.',
    ],
    bestFitScenarios: [
      'Filter screens that should stage edits in a form before committing them to the URL.',
      'Pages where some query keys stay router-owned while the rest bind to Reactive Forms controls.',
      'Recovery flows where malformed links should clean themselves up without breaking the form state.',
    ],
    statusNoteParagraphs: [
      'This package is available as a Reactive Forms companion to `@hexguard/angular-url-state` for filter-heavy Angular screens.',
      'It focuses on typed top-level form binding, dependent reset rules such as `search -> page`, malformed-link recovery, and a validated publish surface across docs, demos, and package artifacts.',
    ],
  },
  {
    id: 'angular-async-state',
    packageName: '@hexguard/angular-async-state',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-async-state/README.md',
    deepDivePath: 'docs/packages/angular-async-state.md',
    repositoryPath: 'angular/packages/angular-async-state',
    summary:
      'Signal-first async value, live observable, and async action lifecycle state with thin optional Angular outlet helpers.',
    detail:
      'Focused on explicit loading, success, stale-data, failure, and duplicate-run behavior for async reads, live streams, and submit-style actions.',
    installCommand: 'pnpm add @hexguard/angular-async-state rxjs',
    featureHighlights: [
      'Headless primitives for async value, observable state, and async action flows.',
      'Optional outlet helpers that keep lifecycle templates explicit instead of magical.',
      'Demos for stale-data reloads, reconnectable streams, and duplicate submit reuse.',
    ],
    bestFitScenarios: [
      'Screens that need one explicit state contract for first load, reload, stale value, and failure cases.',
      'Live observable streams where reconnect, completion, and retained last snapshots should stay visible.',
      'Submit flows that need duplicate-run reuse and explicit result state without hiding the action handle.',
    ],
    statusNoteParagraphs: [
      'This package is available as a signal-first async lifecycle companion for Angular value loads, live observable streams, and submit-style actions.',
      'It focuses on explicit value and action state, duplicate-run control, explicit subscription lifecycle for streams, thin outlet helpers, and a validated publish surface across docs, demos, and package artifacts.',
    ],
  },
  {
    id: 'angular-lookups',
    packageName: '@hexguard/angular-lookups',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-lookups/README.md',
    deepDivePath: 'docs/packages/angular-lookups.md',
    repositoryPath: 'angular/packages/angular-lookups',
    summary:
      'Typed lookup catalog caching and label resolution for Angular forms, filters, and display surfaces.',
    detail:
      'Designed for backend reference-data catalogs where one cached payload should feed select options, summary labels, live backend refresh, and missing-key handling without screen-local mapping code.',
    installCommand: 'pnpm add @hexguard/angular-lookups @hexguard/angular-async-state',
    featureHighlights: [
      'Loader-backed cache with explicit load, reload, validation, and invalidate behavior.',
      'Injected facade plus one thin template label pipe over the same catalog contract.',
      'Docs-grade demos for typed option lists, a live .NET-backed sample API flow, versioned label refresh, and explicit missing-key fallbacks.',
    ],
    bestFitScenarios: [
      'Forms that need typed option lists from one backend reference-data catalog.',
      'Detail and table views that should resolve stable display labels from shared keys.',
      'Angular apps that want explicit lookup lifecycle state instead of ad hoc select-option services.',
    ],
    statusNoteParagraphs: [
      'This package is available as the lookup-catalog companion for Angular screens that consume backend reference data.',
      'It focuses on one versioned catalog contract, explicit cache lifecycle, label resolution, thin template helpers, and a validated publish surface across docs, demos, package artifacts, and one shared demo API.',
    ],
  },
  {
    id: 'angular-optimistic-state',
    packageName: '@hexguard/angular-optimistic-state',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-optimistic-state/README.md',
    deepDivePath: 'docs/packages/angular-optimistic-state.md',
    repositoryPath: 'angular/packages/angular-optimistic-state',
    summary:
      'Signal-first optimistic mutation, rollback, and reconciliation state with configurable same-target conflict policies.',
    detail:
      'Focused on toggles, inline edits, and bulk actions where local overlays should feel immediate while rollback, queueing, and overwrite behavior stay explicit and inspectable.',
    installCommand: 'pnpm add @hexguard/angular-optimistic-state',
    featureHighlights: [
      'Headless optimistic-state primitive with explicit apply, rollback, and success reconciliation.',
      'Configurable same-target conflict policies with `reject`, `queue`, and `replace` behavior.',
      'Thin Angular outlet helper plus docs-grade demos for toggles, inline edits, and bulk publish flows.',
    ],
    bestFitScenarios: [
      'Fast toggles where a field should update immediately but still roll back cleanly on failure.',
      'Inline edit workflows that need queued or replaceable optimistic saves for one row at a time.',
      'Bulk actions where multiple rows should preview the local outcome before the server confirms it.',
    ],
    statusNoteParagraphs: [
      'This package is available as the optimistic-mutation companion for Angular screens that should feel immediate without turning rollback and overlap behavior into hidden cache magic.',
      'It focuses on explicit committed value versus optimistic overlay state, configurable same-target conflict policy, thin template helpers, and a validated publish surface across docs, demos, and package artifacts.',
    ],
  },
  {
    id: 'angular-api-errors',
    packageName: '@hexguard/angular-api-errors',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-api-errors/README.md',
    deepDivePath: 'docs/packages/angular-api-errors.md',
    repositoryPath: 'angular/packages/angular-api-errors',
    summary:
      'Normalizes backend validation, business-rule failures, and RFC 9457 problem-details payloads into a consistent Angular-facing error surface with field-level form binding and page-level error state.',
    detail:
      'Designed for Angular apps that need to map backend validation errors onto form controls, extract page-level messages, and maintain consistent error state through signals — without hand-written parsing glue.',
    installCommand: 'pnpm add @hexguard/angular-api-errors',
    featureHighlights: [
      'RFC 9457 Problem Details parsing with typed ApiValidationResult contracts and field-level error extraction.',
      'Reactive Forms integration that maps dot-separated field paths to FormControl.setErrors() with automatic touched marking.',
      'Signal-based page-level error state with hasFieldError, clear, and append support for toast and banner flows.',
    ],
    bestFitScenarios: [
      'Angular forms that need to map backend validation errors onto specific controls after a failed API submission.',
      'Screens that display page-level banners or toast alerts from model-level validation or business-rule failures.',
      'Angular apps that consume RFC 9457 Problem Details responses and need a typed, inspectable error surface.',
    ],
    statusNoteParagraphs: [
      'This package is currently in development and paired with HexGuard.ValidationContracts on the .NET side.',
      'It focuses on typed validation error contracts, field-level form binding, signal-based page error state, and a validated publish surface across docs, demos, and package artifacts.',
    ],
  },
  {
    id: 'angular-permissions',
    packageName: '@hexguard/angular-permissions',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-permissions/README.md',
    deepDivePath: 'docs/packages/angular-permissions.md',
    repositoryPath: 'angular/packages/angular-permissions',
    summary:
      'Headless capability and role evaluation for Angular routes, templates, and feature code.',
    detail:
      'Focused on a provider-agnostic permission context, one pure evaluator, and thin Angular adapters for guard helpers, template gating, and imperative checks.',
    installCommand: 'pnpm add @hexguard/angular-permissions',
    featureHighlights: [
      'Pure evaluator plus an injected facade for imperative checks in components and services.',
      'Thin `CanActivate` and `CanMatch` helpers plus one structural directive over the same evaluator.',
      'Persona-driven demos for disabled actions, hidden content, and redirected child routes.',
    ],
    bestFitScenarios: [
      'Angular apps that want one explicit contract for route gating, template visibility, and action enablement.',
      'Screens that already receive normalized capability and role data from an auth or profile layer.',
      'Teams that need permission behavior to stay inspectable through docs-grade demos instead of scattered boolean glue.',
    ],
    statusNoteParagraphs: [
      'This package is available as a headless permissions companion for Angular routes, templates, and feature code.',
      'It focuses on one provider-agnostic capability and role contract, a shared evaluator, thin Angular adapters, and a validated publish surface across docs, demos, and package artifacts.',
    ],
  },
  {
    id: 'hexguard-reference-data',
    packageName: 'HexGuard.ReferenceData',
    status: 'Available',
    scope: '.NET',
    readmePath: 'dotnet/src/HexGuard.ReferenceData/README.md',
    deepDivePath: 'docs/packages/hexguard-reference-data.md',
    repositoryPath: 'dotnet/src/HexGuard.ReferenceData',
    summary: 'Typed reference-data catalog contracts and validation helpers for .NET applications.',
    detail:
      'Provides ReferenceDataCatalog, ReferenceDataCollection, and ReferenceDataItem types plus a built-in validator that catches duplicate keys, missing metadata, and empty labels. Demonstrated through the shared HexGuard.SampleApi.',
    installCommand: 'dotnet add package HexGuard.ReferenceData',
    featureHighlights: [
      'Versioned catalog contract with metadata-driven cache invalidation.',
      'Built-in validator that catches duplicate collection keys, missing fields, and empty labels.',
      'IReferenceDataCatalogProvider interface and StaticReferenceDataCatalogProvider for in-memory or DI-backed usage.',
    ],
    bestFitScenarios: [
      'Backend services that need a typed reference-data contract instead of ad hoc key-value mappings.',
      'APIs that serve option lists, lookup tables, or versioned catalogs to frontend consumers.',
      'Teams that want validation guardrails before malformed catalogs reach downstream consumers.',
    ],
    statusNoteParagraphs: [
      'This package is the first .NET library in the HexGuard catalog and anchors the backend side of the reference-data story.',
      'It focuses on explicit catalog contracts, validation-on-construct patterns, and a shared SampleApi that proves end-to-end integration with the Angular lookups package.',
    ],
  },
];

export const roadmapPackages = [
  {
    id: 'angular-submit-lock',
    anchorId: 'package-angular-submit-lock',
    packageName: '@hexguard/angular-submit-lock',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'May narrow into thin ergonomics for preventing duplicate submissions and exposing explicit in-flight state on top of a broader async action contract.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-upload-state',
    anchorId: 'package-angular-upload-state',
    packageName: '@hexguard/angular-upload-state',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize upload lifecycle state such as queueing, progress, retry, cancel, and completion without forcing one transport implementation.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-route-memory',
    anchorId: 'package-angular-route-memory',
    packageName: '@hexguard/angular-route-memory',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize repeated route-memory patterns such as return-to-list, restored filters, last tab, and route-scoped context recovery.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-navigation-pending',
    anchorId: 'package-angular-navigation-pending',
    packageName: '@hexguard/angular-navigation-pending',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize route transition busy state, page readiness, and app-level navigation pending indicators through a headless Angular contract.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-wizard-state',
    anchorId: 'package-angular-wizard-state',
    packageName: '@hexguard/angular-wizard-state',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize multi-step flow state, validation gates, resume behavior, and review or confirm steps for create, import, and onboarding experiences.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-undo',
    anchorId: 'package-angular-undo',
    packageName: '@hexguard/angular-undo',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize reversible action flows with undo windows, expiry, and commit-or-revert behavior for delete, archive, move, and status-change actions.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-form-drafts',
    anchorId: 'package-angular-form-drafts',
    packageName: '@hexguard/angular-form-drafts',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize draft persistence, restore, discard, and autosave ergonomics for Angular edit flows without forcing one storage or form model.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-selection-state',
    anchorId: 'package-angular-selection-state',
    packageName: '@hexguard/angular-selection-state',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize keyed selection, bulk-action enablement, and select-visible behavior for lists and tables through a headless state model.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-feature-flags',
    anchorId: 'package-angular-feature-flags',
    packageName: '@hexguard/angular-feature-flags',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize typed feature-flag checks across routes, templates, and service logic while remaining provider-agnostic.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-confirmation',
    anchorId: 'package-angular-confirmation',
    packageName: '@hexguard/angular-confirmation',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize confirm/cancel and confirm-and-run flows for destructive or high-impact actions through a headless API with optional dialog adapters.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-live-data',
    anchorId: 'package-angular-live-data',
    packageName: '@hexguard/angular-live-data',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize visibility-aware polling, stale indicators, and refresh ergonomics for dashboard-style and operational Angular screens.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-page-context',
    anchorId: 'package-angular-page-context',
    packageName: '@hexguard/angular-page-context',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize page titles, breadcrumbs, contextual actions, and route-scoped page chrome through a headless metadata contract.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-command-palette',
    anchorId: 'package-angular-command-palette',
    packageName: '@hexguard/angular-command-palette',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize command registration, keyboard shortcuts, and searchable command invocation, with optional palette UI layered over a headless command registry.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-query-signal-forms',
    anchorId: 'package-angular-query-signal-forms',
    packageName: '@hexguard/angular-query-signal-forms',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      "Would extend the URL-state story to Angular Signal Forms through a separate adapter package so the Reactive Forms contract in `@hexguard/angular-query-form` stays stable while Angular's signal-form surface continues to evolve.",
    showOnSiteHome: false,
  },
  {
    id: 'validation-contracts',
    anchorId: 'package-validation-contracts',
    packageName: 'HexGuard.ValidationContracts',
    scope: '.NET',
    status: 'Planned',
    summary:
      'Provides standardized validation error contracts (field path, error code, message) and RFC 9457 Problem Details helpers for .NET APIs, paired with @hexguard/angular-api-errors.',
    showOnSiteHome: true,
  },
  {
    id: 'angular-table-state',
    anchorId: 'package-angular-table-state',
    packageName: '@hexguard/angular-table-state',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Builds on URL state to coordinate sorting, paging, filters, and selection in reusable data-table workflows.',
    showOnSiteHome: true,
  },
  {
    id: 'angular-preferences',
    anchorId: 'package-angular-preferences',
    packageName: '@hexguard/angular-preferences',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Targets lightweight user preferences such as dashboard defaults, hidden columns, and saved views.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-tenant-context',
    anchorId: 'package-angular-tenant-context',
    packageName: '@hexguard/angular-tenant-context',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize active-tenant selection, route scoping, restore behavior, and tenant-aware client context for multi-tenant Angular apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-dirty-state',
    anchorId: 'package-angular-dirty-state',
    packageName: '@hexguard/angular-dirty-state',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Will provide consistent unsaved-change tracking and route-guard integration for Angular screens.',
    showOnSiteHome: true,
  },
  {
    id: 'angular-http-dedupe',
    anchorId: 'package-angular-http-dedupe',
    packageName: '@hexguard/angular-http-dedupe',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Designed to collapse duplicate HTTP work across concurrent consumers while keeping cancellation and cache semantics explicit.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-http-resource-debug',
    anchorId: 'package-angular-http-resource-debug',
    packageName: '@hexguard/angular-http-resource-debug',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Will add visibility into resource and request lifecycles for teams debugging stale caches, retries, and request churn.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-workflow-actions',
    anchorId: 'package-angular-workflow-actions',
    packageName: '@hexguard/angular-workflow-actions',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize status-driven action availability, transition reasons, and confirm-and-run flows for approval, ticket, and order workflows.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-edit-locks',
    anchorId: 'package-angular-edit-locks',
    packageName: '@hexguard/angular-edit-locks',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize editing lease state, keepalive, takeover, expiry, and conflict banners for collaborative Angular edit screens.',
    showOnSiteHome: false,
  },
  {
    id: 'problemdetails',
    anchorId: 'package-problemdetails',
    packageName: 'HexGuard.ProblemDetails',
    scope: '.NET',
    status: 'Planned',
    summary:
      'Will provide focused .NET helpers for creating and mapping RFC 9457 problem-details responses.',
    showOnSiteHome: true,
  },
  {
    id: 'webhooks',
    anchorId: 'package-webhooks',
    packageName: 'HexGuard.Webhooks',
    scope: '.NET',
    status: 'Planned',
    summary: 'Will provide webhook verification and event-processing primitives for .NET services.',
    showOnSiteHome: false,
  },
  {
    id: 'pagination',
    anchorId: 'package-pagination',
    packageName: 'HexGuard.Pagination',
    scope: '.NET',
    status: 'Planned',
    summary:
      'Will provide pagination contracts and response helpers for APIs that need a clear page model.',
    showOnSiteHome: false,
  },
  {
    id: 'outbox',
    anchorId: 'package-outbox',
    packageName: 'HexGuard.Outbox',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide reliable post-commit event publication and retry primitives for .NET services using the transactional outbox pattern.',
    showOnSiteHome: false,
  },
  {
    id: 'inbox',
    anchorId: 'package-inbox',
    packageName: 'HexGuard.Inbox',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide inbound event deduplication, replay safety, and poison-message handling for .NET webhook and event consumers.',
    showOnSiteHome: false,
  },
  {
    id: 'operation-status',
    anchorId: 'package-operation-status',
    packageName: 'HexGuard.OperationStatus',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend operation contracts with Angular lifecycle surfaces for long-running workflows such as exports, imports, and admin jobs.',
    showOnSiteHome: true,
  },
  {
    id: 'capabilities',
    anchorId: 'package-capabilities',
    packageName: 'HexGuard.Capabilities + @hexguard/angular-permissions',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend-issued capability contracts with Angular permission checks so action gating and authorization drift less across the stack.',
    showOnSiteHome: false,
  },
  {
    id: 'reference-data',
    anchorId: 'package-reference-data',
    packageName: 'HexGuard.ReferenceData + @hexguard/angular-lookups',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend reference-data catalogs with Angular lookup caching and label resolution so option lists stay typed, versioned, and reusable.',
    showOnSiteHome: false,
  },
  {
    id: 'tenant-context',
    anchorId: 'package-tenant-context',
    packageName: 'HexGuard.TenantContext + @hexguard/angular-tenant-context',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend tenant validation and routing contracts with Angular tenant selection, restore, and header propagation flows.',
    showOnSiteHome: false,
  },
  {
    id: 'workflow-transitions',
    anchorId: 'package-workflow-transitions',
    packageName: 'HexGuard.WorkflowTransitions + @hexguard/angular-workflow-actions',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend status-transition rules with Angular action availability and reason capture for approval, ticket, and order workflows.',
    showOnSiteHome: false,
  },
  {
    id: 'edit-locks',
    anchorId: 'package-edit-locks',
    packageName: 'HexGuard.EditLocks + @hexguard/angular-edit-locks',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend lease or lock contracts with Angular editing banners, keepalive, takeover, and expiry handling.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-notifications',
    anchorId: 'package-angular-notifications',
    packageName: '@hexguard/angular-notifications',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize headless notification queue, toast stacking, timeout, and dismissal semantics for Angular apps without forcing one UI library.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-debounce',
    anchorId: 'package-angular-debounce',
    packageName: '@hexguard/angular-debounce',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a reusable debounced value signal with configurable wait, leading/trailing, distinct-until-changed semantics, and pending state for search-as-you-type and auto-save workflows.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-breakpoint-observer',
    anchorId: 'package-angular-breakpoint-observer',
    packageName: '@hexguard/angular-breakpoint-observer',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize reactive TypeScript breakpoint detection with typed breakpoint contracts and signal-based active-breakpoint helpers so component logic can respond to viewport changes.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-clipboard',
    anchorId: 'package-angular-clipboard',
    packageName: '@hexguard/angular-clipboard',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a dependency-free async clipboard wrapper with fallback chain, copy feedback state, and optional directive for Angular apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-form-utils',
    anchorId: 'package-angular-form-utils',
    packageName: '@hexguard/angular-form-utils',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize cross-field validators, dirty-check helpers, unsaved-changes guards, and form-level dirty state tracking for Angular forms.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-recently-viewed',
    anchorId: 'package-angular-recently-viewed',
    packageName: '@hexguard/angular-recently-viewed',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize recently-viewed item tracking with configurable max, dedup, pluggable persistence, and optional route integration for navigation sidebar patterns.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-pagination',
    anchorId: 'package-angular-pagination',
    packageName: '@hexguard/angular-pagination',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide Angular pagination state signals, page-change helpers, and URL-compatible page state to pair with HexGuard.Pagination on the .NET side.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-downloads',
    anchorId: 'package-dotnet-downloads',
    packageName: 'HexGuard.Downloads',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide file download helpers for content-disposition, range requests, large-file streaming, and cache header conventions in ASP.NET Core APIs.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-cors',
    anchorId: 'package-dotnet-cors',
    packageName: 'HexGuard.Cors',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide preconfigured CORS policy builders for common scenarios (SPA, public API, internal) with pattern-based origin matching and explicit policy naming.',
    showOnSiteHome: false,
  },
  {
    id: 'bulk-operations',
    anchorId: 'package-bulk-operations',
    packageName: 'HexGuard.BulkOperations + @hexguard/angular-bulk-operations',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend bulk-operation contracts with Angular selection-state integration for multi-item actions such as delete, archive, approve, and reassign with partial-success (HTTP 207) reporting.',
    showOnSiteHome: false,
  },
  {
    id: 'exports',
    anchorId: 'package-exports',
    packageName: 'HexGuard.Exports + @hexguard/angular-exports',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend export-generation contracts (CSV, Excel, PDF) with Angular download progress, poll-for-ready helpers, and file-save behavior.',
    showOnSiteHome: false,
  },
  {
    id: 'change-tracking',
    anchorId: 'package-change-tracking',
    packageName: 'HexGuard.ChangeTracking + @hexguard/angular-change-tracking',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend field-level change tracking contracts with Angular change-set rendering helpers for PATCH responses, audit UIs, and field-level update feedback.',
    showOnSiteHome: false,
  },
  {
    id: 'imports',
    anchorId: 'package-imports',
    packageName: 'HexGuard.Imports + @hexguard/angular-imports',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend import-session contracts (column mapping, row validation, commit-or-discard) with Angular import preview and row-level error display for CSV and Excel import workflows.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-scroll-state',
    anchorId: 'package-angular-scroll-state',
    packageName: '@hexguard/angular-scroll-state',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize scroll position save and restore, scroll-to-top on navigation, infinite-scroll threshold detection, and scroll-spy active-section tracking through a signal-first Angular contract.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-storage',
    anchorId: 'package-angular-storage',
    packageName: '@hexguard/angular-storage',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide typed, signal-friendly wrappers around localStorage and sessionStorage with automatic serialization, versioning, cross-tab change detection, and optional expiry for Angular apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-network-status',
    anchorId: 'package-angular-network-status',
    packageName: '@hexguard/angular-network-status',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize online/offline connectivity state, connection-type changes, and debounced reconnection signals for Angular apps that need offline-aware UI behavior.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-visibility',
    anchorId: 'package-angular-visibility',
    packageName: '@hexguard/angular-visibility',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize document and element visibility tracking, tab-hidden detection, idle-timeout, and user-activity signals through a headless Angular contract composable with live-data and async-state.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-window-state',
    anchorId: 'package-angular-window-state',
    packageName: '@hexguard/angular-window-state',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide signal-based window dimension and resize tracking, viewport measurement, and element dimension observation for responsive Angular component logic.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-theme',
    anchorId: 'package-angular-theme',
    packageName: '@hexguard/angular-theme',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize theme and dark-mode state with system-preference detection, explicit toggle, persistence, and CSS class management through a headless Angular contract.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-timer',
    anchorId: 'package-angular-timer',
    packageName: '@hexguard/angular-timer',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide countdown and elapsed timer signals with start, pause, resume, reset, expiry callbacks, and configurable tick intervals for session timeouts, OTP expiry, and countdown UIs.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-activity-indicator',
    anchorId: 'package-angular-activity-indicator',
    packageName: '@hexguard/angular-activity-indicator',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize global and scoped busy-state indicators for navigation transitions, background saves, and async operations through a headless activity-stack contract with optional progress-bar adapters.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-caching',
    anchorId: 'package-dotnet-caching',
    packageName: 'HexGuard.Caching',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide cache-header helpers, response-caching middleware configuration, ETag and Last-Modified conventions, and cache-tag stampede protection for ASP.NET Core APIs.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-search',
    anchorId: 'package-dotnet-search',
    packageName: 'HexGuard.Search',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide search-query parsing helpers, full-text search contract models, paginated search response envelopes, and result-highlighting conventions for .NET search endpoints.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-webhooks',
    anchorId: 'package-angular-webhooks',
    packageName: '@hexguard/angular-webhooks',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide webhook registration UI state, delivery-log viewing helpers, and event-history browsing state to pair with HexGuard.Webhooks on the .NET side.',
    showOnSiteHome: false,
  },
  {
    id: 'search-cross-stack',
    anchorId: 'package-search-cross-stack',
    packageName: 'HexGuard.Search + @hexguard/angular-search',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend search-query contracts with Angular search-as-you-type debounce, result-highlight tokens, and typed autocomplete response models for consistent search and finder experiences.',
    showOnSiteHome: false,
  },
  {
    id: 'sse-cross-stack',
    anchorId: 'package-sse-cross-stack',
    packageName: 'HexGuard.Sse + @hexguard/angular-sse',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend Server-Sent Events message contracts with Angular SSE consumer helpers for typed event streams, automatic reconnection, and composable real-time data flows.',
    showOnSiteHome: false,
  },
  {
    id: 'caching-cross-stack',
    anchorId: 'package-caching-cross-stack',
    packageName: 'HexGuard.Caching + @hexguard/angular-caching',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend cache-invalidation contracts (cache tags, invalidation headers) with Angular cache-awareness signals so the client can observe invalidation events and trigger safe refetches.',
    showOnSiteHome: false,
  },
  {
    id: 'user-presence-cross-stack',
    anchorId: 'package-user-presence-cross-stack',
    packageName: 'HexGuard.UserPresence + @hexguard/angular-user-presence',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend user-presence contracts (online, away, last-seen) with Angular presence state, typing indicators, and collaborative awareness signals for real-time multi-user features.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-error-boundary',
    anchorId: 'package-angular-error-boundary',
    packageName: '@hexguard/angular-error-boundary',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a declarative error boundary component that catches Angular component render errors, displays fallback UI, and exposes retry and recovery state through signals.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-skeleton',
    anchorId: 'package-angular-skeleton',
    packageName: '@hexguard/angular-skeleton',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize skeleton and placeholder loading state with configurable shapes, shimmer animation, and headless composition with async-state value and action lifecycle signals.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-empty-state',
    anchorId: 'package-angular-empty-state',
    packageName: '@hexguard/angular-empty-state',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize empty-state display contracts for zero-result, no-data, and empty-collection screens with contextual messaging, action slots, and optional illustration integration.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-date-utils',
    anchorId: 'package-angular-date-utils',
    packageName: '@hexguard/angular-date-utils',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide date-range state models, relative-time formatting, locale-aware compact notation, and date-comparison helpers that go beyond Angular built-in DatePipe for date-heavy business apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-focus-trap',
    anchorId: 'package-angular-focus-trap',
    packageName: '@hexguard/angular-focus-trap',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize focus-trap and focus-restoration state for modals, dialogs, side panels, and flyout menus with configurable tab-order, escape handling, and return-focus semantics.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-tour',
    anchorId: 'package-angular-tour',
    packageName: '@hexguard/angular-tour',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize product tour and onboarding step state with configurable step progression, dismissal persistence, optional spotlight positioning, and composition with feature-flags for gated tours.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-drag-state',
    anchorId: 'package-angular-drag-state',
    packageName: '@hexguard/angular-drag-state',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize drag-and-drop interaction state (dragging, hover target, reorder model, cancel) separate from DOM rendering, composable with CDK DragDrop for sortable lists, kanban boards, and file reordering.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-feature-flags',
    anchorId: 'package-dotnet-feature-flags',
    packageName: 'HexGuard.FeatureFlags',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide server-side feature-flag evaluation, targeting-rule helpers, flag-configuration contracts, and optional sync-endpoint conventions to pair with @hexguard/angular-feature-flags.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-state-machine',
    anchorId: 'package-dotnet-state-machine',
    packageName: 'HexGuard.StateMachine',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide a lightweight state-machine contract for business workflows such as order status, document lifecycle, and approval-stage progression with explicit states, transitions, and guard clauses.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-soft-delete',
    anchorId: 'package-dotnet-soft-delete',
    packageName: 'HexGuard.SoftDelete',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would standardize soft-delete query filters, restore helpers, deleted-at/deleted-by conventions, and cascade-aware deletion behavior for EF Core and other .NET data access patterns.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-rate-limiting',
    anchorId: 'package-dotnet-rate-limiting',
    packageName: 'HexGuard.RateLimiting',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide standard rate-limit policy configuration helpers, rate-limit response header conventions (Retry-After, RateLimit-*), and client-friendly error payloads on top of ASP.NET Core rate limiting.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-data-seeding',
    anchorId: 'package-dotnet-data-seeding',
    packageName: 'HexGuard.DataSeeding',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would standardize idempotent data seeding, environment-aware seed sets, test-data factories, and seed-ordering conventions for .NET applications and integration test suites.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-notifications',
    anchorId: 'package-dotnet-notifications',
    packageName: 'HexGuard.Notifications',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide server-side notification-delivery contracts, delivery-channel abstraction (in-app, email), preference-filtering helpers, and templating conventions for .NET notification systems.',
    showOnSiteHome: false,
  },
  {
    id: 'feature-flags-cross-stack',
    anchorId: 'package-feature-flags-cross-stack',
    packageName: 'HexGuard.FeatureFlags + @hexguard/angular-feature-flags',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend feature-flag evaluation and targeting rules with Angular feature-flag client sync, cache, and fallback semantics for consistent flag behavior across the stack.',
    showOnSiteHome: false,
  },
  {
    id: 'notification-delivery-cross-stack',
    anchorId: 'package-notification-delivery-cross-stack',
    packageName: 'HexGuard.NotificationDelivery + @hexguard/angular-notification-inbox',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend notification-generation and delivery-preference contracts with Angular in-app notification feed state, read/unread tracking, deep-link routing, and real-time delivery signals.',
    showOnSiteHome: false,
  },
  {
    id: 'scheduling-cross-stack',
    anchorId: 'package-scheduling-cross-stack',
    packageName: 'HexGuard.Scheduling + @hexguard/angular-scheduling',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend time-slot availability and booking contracts with Angular calendar state, slot-selection signals, and scheduling workflow helpers for appointment and reservation systems.',
    showOnSiteHome: false,
  },
  {
    id: 'api-versioning-cross-stack',
    anchorId: 'package-api-versioning-cross-stack',
    packageName: 'HexGuard.ApiVersioning + @hexguard/angular-api-versioning',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend API version negotiation, Sunset and Deprecation header conventions with Angular endpoint-version awareness, deprecation warnings, and migration-path helpers.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-file-picker',
    anchorId: 'package-angular-file-picker',
    packageName: '@hexguard/angular-file-picker',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize file-selection state with type/size validation, preview, drag-and-drop zone state, and multi-file queue management for Angular apps before upload.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-resizable',
    anchorId: 'package-angular-resizable',
    packageName: '@hexguard/angular-resizable',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize resizable split-pane and draggable-edge state with configurable min/max constraints, snap thresholds, and optional position persistence for dashboard and admin-panel layouts.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-background-jobs',
    anchorId: 'package-dotnet-background-jobs',
    packageName: 'HexGuard.BackgroundJobs',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide background job scheduling contracts, recurring job definitions, job-status tracking, and configurable retry policies with persistence abstraction for .NET applications.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-export',
    anchorId: 'package-dotnet-export',
    packageName: 'HexGuard.Export',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide standardized CSV, Excel, and PDF export-generation helpers with consistent file-result contracts, content-disposition conventions, and background-export status tracking for ASP.NET Core APIs.',
    showOnSiteHome: false,
  },
  {
    id: 'signalr-cross-stack',
    anchorId: 'package-signalr-cross-stack',
    packageName: 'HexGuard.SignalR + @hexguard/angular-signalr',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend typed SignalR hub contracts with Angular SignalR connection state, reconnection strategy, channel lifecycle, and typed event-stream signals for real-time full-duplex communication.',
    showOnSiteHome: false,
  },
];
