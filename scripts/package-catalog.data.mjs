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
    id: 'angular-api-errors',
    anchorId: 'package-angular-api-errors',
    packageName: '@hexguard/angular-api-errors',
    scope: 'Angular',
    status: 'Planned',
    summary:
      'Will normalize backend validation, business-rule failures, and problem-details payloads into a consistent Angular-facing error surface.',
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
];
