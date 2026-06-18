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
  {
    id: 'angular-debounce',
    packageName: '@hexguard/angular-debounce',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-debounce/README.md',
    deepDivePath: 'docs/packages/angular-debounce.md',
    repositoryPath: 'angular/packages/angular-debounce',
    summary:
      'Debounced value signal primitive for Angular: wraps a source signal and produces a throttled output with configurable leading/trailing edge behavior.',
    detail:
      'Focused on form inputs, search-as-you-type, and any live-updating UI where rapid signal changes should be batched into quieter output without pulling in RxJS debounce.',
    installCommand: 'pnpm add @hexguard/angular-debounce',
    featureHighlights: [
      'Configurable leading-only, trailing-only, and both-edge debounce modes.',
      'isPending signal for tracking whether a trailing flush is scheduled.',
      'flush() and cancel() methods for imperative control over pending emissions.',
    ],
    bestFitScenarios: [
      'Search or autocomplete inputs where keystrokes should batch into one API call.',
      'Form inputs that need immediate leading-edge feedback but delayed trailing updates.',
      'Any signal-based UI where rapid changes need controlled emission timing without RxJS.',
    ],
    statusNoteParagraphs: [
      'This package is the simplest HexGuard Angular primitive: one factory function, two interfaces, zero dependencies beyond Angular and tslib.',
      'It focuses on predictable debounce semantics with explicit flush/cancel control and docs-grade demos showing all three edge modes.',
    ],
  },
  {
    id: 'angular-notifications',
    packageName: '@hexguard/angular-notifications',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-notifications/README.md',
    deepDivePath: 'docs/packages/angular-notifications.md',
    repositoryPath: 'angular/packages/angular-notifications',
    summary:
      'Headless toast/notification queue for Angular: signal-based notification management with auto-dismiss, typed notification types, and an optional outlet component.',
    detail:
      'Focused on a predictable notification queue contract where every toast has explicit lifecycle, dismiss control, and configurable duration — without coupling to a specific UI library.',
    installCommand: 'pnpm add @hexguard/angular-notifications',
    featureHighlights: [
      'Typed notification model with success, error, info, and warning types.',
      'Auto-dismiss with per-notification duration and persistent (no-dismiss) support.',
      'Optional standalone outlet component for rendering the notification stack.',
      'Convenience methods: success(), error(), info(), warning().',
    ],
    bestFitScenarios: [
      'Angular apps that need a lightweight notification queue without UI library coupling.',
      'Screens that show transient success/error/info toasts with auto-dismiss.',
      'Applications that want imperative notification control through one injected service.',
    ],
    statusNoteParagraphs: [
      'This package is available as a headless notification queue companion for Angular apps that need typed toast management without pulling in a UI kit.',
      'It focuses on explicit queue state, auto-dismiss with configurable durations, action support, and docs-grade demos showing all notification types.',
    ],
  },
  {
    id: 'angular-error-boundary',
    packageName: '@hexguard/angular-error-boundary',
    status: 'Available',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-error-boundary/README.md',
    deepDivePath: 'docs/packages/angular-error-boundary.md',
    repositoryPath: 'angular/packages/angular-error-boundary',
    summary:
      'Declarative component error boundary for Angular: catches render-time and async errors from projected content with configurable fallback and reset support.',
    detail:
      'Focused on graceful error containment where one component should not take down the whole page — with explicit fallback templates, error signals, and recovery control.',
    installCommand: 'pnpm add @hexguard/angular-error-boundary',
    featureHighlights: [
      'Catches render-time errors from projected child components.',
      'Catches async errors from child-component timers and promise callbacks.',
      'Custom fallback template support with typed error context.',
      'reset() method to clear error state and re-render content.',
      'hasError() and caughtError() signals for programmatic access.',
    ],
    bestFitScenarios: [
      'Dashboard tiles where one failing widget should not crash the entire page.',
      'Third-party component wrappers that may throw during render.',
      'Feature sections that should degrade gracefully with a retry option instead of a white screen.',
    ],
    statusNoteParagraphs: [
      'This package is available as a declarative error boundary for Angular apps that need per-component error isolation without global ErrorHandler gymnastics.',
      'It focuses on explicit fallback/recover semantics, dual render-time and async error capture, and docs-grade demos showing both default and custom fallback flows.',
    ],
  },
  {
    id: 'angular-feature-flags',
    packageName: '@hexguard/angular-feature-flags',
    status: 'Released',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-feature-flags/README.md',
    deepDivePath: 'docs/packages/angular-feature-flags.md',
    repositoryPath: 'angular/packages/angular-feature-flags',
    summary:
      'Typed feature-flag evaluation for Angular with DI-backed service, route guards, and template directive.',
    detail:
      'Designed for Angular apps that need typed feature-flag evaluation with a pure evaluator, DI facade, *hexguardFeatureFlag directive, route guards, and optional backend sync via conditional 304.',
    installCommand: 'pnpm add @hexguard/angular-feature-flags',
    featureHighlights: [
      'Pure evaluator with 8 targeting rule types (always, never, rollout, userIn/NotIn, groupIn/NotIn, attributeMatch/NotMatch).',
      'Angular DI facade, structural directive, and route guards over the same evaluator.',
      'Optional sync service for backend catalog fetching with context-hash-based 304 handling.',
    ],
    bestFitScenarios: [
      'Angular apps that need typed feature-flag evaluation with route gating, template visibility, and imperative checks.',
      'Screens that consume a backend feature-flag sync endpoint and want conditional 304 updates.',
      'Teams that need feature-flag behavior to stay inspectable through docs-grade demos and a shared evaluator.',
    ],
    statusNoteParagraphs: [
      'This package is available as a headless feature-flag companion for Angular routes, templates, and feature code.',
      'It focuses on one shared evaluator across directive, guards, and imperative API, with an optional sync service and a validated publish surface across docs, demos, and package artifacts.',
    ],
  },
  {
    id: 'angular-selection-state',
    packageName: '@hexguard/angular-selection-state',
    status: 'Released',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-selection-state/README.md',
    deepDivePath: 'docs/packages/angular-selection-state.md',
    repositoryPath: 'angular/packages/angular-selection-state',
    summary: 'Headless keyed selection state for Angular tables, lists, and bulk-action flows.',
    detail:
      'Provides injectSelectionState() with multi/single-selection, toggle, select-all, clear, replace, and derived signals for count, isEmpty, isAllSelected, and canAct. Composes with @hexguard/angular-bulk-operations.',
    installCommand: 'pnpm add @hexguard/angular-selection-state',
    featureHighlights: [
      'Signal-based injectSelectionState() with multi and single-selection modes.',
      'toggleAll and selectAll helpers for visible-row selection patterns.',
      'Derived signals: count, isEmpty, isAllSelected, first, canAct.',
    ],
    bestFitScenarios: [
      'Tables and lists that need checkbox selection with select-all header behavior.',
      'Bulk-action flows that compose selection state with operation execution.',
      'Angular apps that want explicit selection state without pulling in a UI library.',
    ],
    statusNoteParagraphs: [
      'This package provides the foundation for keyed selection that @hexguard/angular-bulk-operations consumes directly.',
      'It focuses on headless selection state with derived signals, explicit operations, and docs-grade demos showing table selection patterns.',
    ],
  },
  {
    id: 'angular-bulk-operations',
    packageName: '@hexguard/angular-bulk-operations',
    status: 'Released',
    scope: 'Angular',
    readmePath: 'angular/packages/angular-bulk-operations/README.md',
    deepDivePath: 'docs/packages/angular-bulk-operations.md',
    repositoryPath: 'angular/packages/angular-bulk-operations',
    summary:
      'Bulk-action service and facade for Angular with HTTP 207 partial-success support, progress tracking, and selection-state composition.',
    detail:
      'Provides BulkOperationService with result/summary/inProgress signals, injectBulkOperation() facade with multi-operation token support, and selectedItemsToBulkRequest() composition with @hexguard/angular-selection-state. Designed for bulk delete, approve, and status-change flows with per-item error display and retry.',
    installCommand: 'pnpm add @hexguard/angular-bulk-operations @hexguard/angular-selection-state',
    featureHighlights: [
      'Generic BulkOperationService with typed request/response contracts and in-flight deduplication.',
      'Signals for results, summary (total/succeeded/failed), inProgress, and error.',
      'selectedItemsToBulkRequest() helper for direct composition with selection-state.',
      'retryFailed() for re-executing only failed items from the last operation.',
      'Multi-operation support via unique InjectionToken per provideBulkOperation() call.',
    ],
    bestFitScenarios: [
      'Admin panels with bulk delete, approve, or status-change actions.',
      'Screens that need per-item error display and retry-failed-item flows.',
      'Angular apps using @hexguard/angular-selection-state for table selection.',
    ],
    statusNoteParagraphs: [
      'This package composes with @hexguard/angular-selection-state for the select → act → display-results flow.',
      'It focuses on explicit execution lifecycle, partial-success (HTTP 207) handling, and docs-grade demos showing delete and approve scenarios.',
    ],
  },
  {
    id: 'hexguard-bulk-operations',
    packageName: 'HexGuard.BulkOperations',
    status: 'Released',
    scope: '.NET',
    readmePath: 'dotnet/src/HexGuard.BulkOperations/README.md',
    deepDivePath: 'docs/packages/hexguard-bulk-operations.md',
    repositoryPath: 'dotnet/src/HexGuard.BulkOperations',
    summary:
      'Bulk action contracts, response builder, and ASP.NET Core endpoint helpers for HTTP 207 Multi-Status partial-success scenarios.',
    detail:
      'Provides BulkOperationRequest/Response/Result types, BulkOperationResultBuilder for aggregating per-item results, and IResult extensions for Minimal API endpoints. Pairs with @hexguard/angular-bulk-operations.',
    installCommand: 'dotnet add package HexGuard.BulkOperations',
    featureHighlights: [
      'Typed bulk operation contracts with generic item and result types.',
      'BulkOperationResultBuilder for automatic aggregate status and count computation.',
      'Results.Extensions.BulkOperation() IResult factory with HTTP 207 Multi-Status support.',
      'ToProblemDetails() extension for RFC 9457 error payloads on partial/full failure.',
    ],
    bestFitScenarios: [
      'ASP.NET Core APIs that need to serve bulk operation endpoints.',
      'Backend services that need partial-success reporting with per-item errors.',
      'Cross-stack pairing with @hexguard/angular-bulk-operations for end-to-end typed bulk actions.',
    ],
    statusNoteParagraphs: [
      'This package pairs with @hexguard/angular-bulk-operations through a shared contract shape and HTTP 207 Multi-Status transport.',
      'It focuses on deterministic result aggregation, Minimal API integration, and a validated publish surface.',
    ],
  },
  {
    id: 'hexguard-problem-details',
    packageName: 'HexGuard.ProblemDetails',
    status: 'Available',
    scope: '.NET',
    readmePath: 'dotnet/src/HexGuard.ProblemDetails/README.md',
    deepDivePath: 'docs/packages/hexguard-problem-details.md',
    repositoryPath: 'dotnet/src/HexGuard.ProblemDetails',
    summary: 'RFC 9457 Problem Details for HTTP APIs — types, builders, and ASP.NET Core integration for producing standard error responses.',
    detail: 'Provides the core ProblemDetails record, fluent builder, well-known problem type constants, catch-all middleware, and Minimal API result extensions. Pairs with @hexguard/angular-api-errors for end-to-end typed error pipelines across stacks.',
    installCommand: 'dotnet add package HexGuard.ProblemDetails',
    featureHighlights: [
      'RFC 9457–compliant ProblemDetails record with extension member support.',
      'Fluent ProblemDetailsBuilder for constructing responses.',
      'ProblemDetailsException for throw-vs-return middleware patterns.',
      'ASP.NET Core middleware for automatic error interception.',
      'Minimal API IResult extension methods.',
      'No external dependencies — pure net10.0.',
    ],
    bestFitScenarios: [
      'Standardizing HTTP error responses across ASP.NET Core APIs.',
      'End-to-end typed error pipelines with @hexguard/angular-api-errors.',
      'Replacing ad hoc error shapes with RFC 9457–compliant payloads.',
    ],
    statusNoteParagraphs: [
      'Initial release focuses on core types, builder, middleware, and Minimal API extensions.',
      'Complements HexGuard.ValidationContracts which extends Problem Details with validation-specific types.',
      'Angular @hexguard/angular-api-errors consumes the same RFC 9457 Problem Details contract.',
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
  {
    id: 'angular-seo',
    anchorId: 'package-angular-seo',
    packageName: '@hexguard/angular-seo',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize SSR-safe SEO metadata management with signal-based Open Graph, Twitter Card, and JSON-LD structured data helpers that initialize during server rendering and hydrate safely on the client.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-hydration',
    anchorId: 'package-angular-hydration',
    packageName: '@hexguard/angular-hydration',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide hydration mismatch debugging utilities, hydration-state signals, and selective hydration directives (hydrate on interaction, hydrate on viewport) for Angular SSR applications.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-sitemap',
    anchorId: 'package-angular-sitemap',
    packageName: '@hexguard/angular-sitemap',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize dynamic XML sitemap generation for Angular SSR apps with route-based configuration, lastmod extraction, priority/frequency settings, and automated sitemap index support.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-inline-edit',
    anchorId: 'package-angular-inline-edit',
    packageName: '@hexguard/angular-inline-edit',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize click-to-edit and inline-editing state management with edit/save/cancel transitions, keyboard navigation, validation hooks, and optimistic save composition for data grids and detail views.',
    showOnSiteHome: false,
  },
  {
    id: 'api-keys-cross-stack',
    anchorId: 'package-api-keys-cross-stack',
    packageName: 'HexGuard.ApiKeys + @hexguard/angular-api-keys',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend API key generation, hashing, masking, and permission scoping with Angular API key management UI state for create, list, revoke, and usage tracking in SaaS applications.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-resource',
    anchorId: 'package-angular-resource',
    packageName: '@hexguard/angular-resource',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide typed helpers, caching policies, and retry/refetch orchestration on top of Angular\'s built-in `resource()` and `httpResource()` APIs for consistent server-state fetching patterns.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-defer',
    anchorId: 'package-angular-defer',
    packageName: '@hexguard/angular-defer',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize programmatic `@defer` block state management with signals for defer phase, loading/error/complete state, trigger management, and deferred-load orchestration beyond template-only control.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-signal-utils',
    anchorId: 'package-angular-signal-utils',
    packageName: '@hexguard/angular-signal-utils',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a collection of reusable signal utility functions — computedFrom, memoized, cached, toggle, derived — that extend Angular\'s built-in signal primitives for common reactive data-flow patterns.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-ssr-config',
    anchorId: 'package-angular-ssr-config',
    packageName: '@hexguard/angular-ssr-config',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize SSR configuration management for Angular apps including pre-rendering route declarations, per-route hydration control, typed TransferState helpers, and sitemap integration.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-openapi',
    anchorId: 'package-dotnet-openapi',
    packageName: 'HexGuard.OpenApi',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide OpenAPI documentation conventions, operation-ID templates, response-type standardization, and schema-customization helpers on top of Microsoft.AspNetCore.OpenApi for consistent API documentation.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-effect-utils',
    anchorId: 'package-angular-effect-utils',
    packageName: '@hexguard/angular-effect-utils',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide signal effect utilities such as debouncedEffect, batchEffects, effectWithCleanup, and effectOnIdle that extend Angular\'s built-in effect() for common reactive side-effect patterns.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-form-arrays',
    anchorId: 'package-angular-form-arrays',
    packageName: '@hexguard/angular-form-arrays',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize Reactive Forms FormArray operations with typed move, swap, insert-at, remove-at-range helpers, dirty-tracking signals, and min/max items validation for editable collections.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-router-signals',
    anchorId: 'package-angular-router-signals',
    packageName: '@hexguard/angular-router-signals',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide signal-based wrappers for ActivatedRoute params, query params, route data, and fragment for ergonomic reactive access to router state beyond template-only observables.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-logging',
    anchorId: 'package-dotnet-logging',
    packageName: 'HexGuard.Logging',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide consistent structured logging conventions with standardized property names, enrichment helpers, ILogger extensions for common patterns, and integration with HexGuard.AuditTrail.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-circuit-breaker',
    anchorId: 'package-dotnet-circuit-breaker',
    packageName: 'HexGuard.CircuitBreaker',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide circuit breaker pattern helpers for HttpClient resilience with standard break policies, half-open state handling, health-check integration, and consistent telemetry on top of Microsoft.Extensions.Http.Resilience.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-crud',
    anchorId: 'package-angular-crud',
    packageName: '@hexguard/angular-crud',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide headless CRUD controllers (injectCrudList, injectCrudDetail, injectCrudEdit) that combine async-state, pagination, caching, error handling, and dirty tracking into one cohesive pattern for standard list/detail/edit feature flows.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-testing',
    anchorId: 'package-angular-testing',
    packageName: '@hexguard/angular-testing',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide signal testing utilities (fakeSignal, testEffect, advanceEffects, spyOnSignal), component harness helpers, and mock factories for testing signal-based Angular components and services.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-api-client',
    anchorId: 'package-angular-api-client',
    packageName: '@hexguard/angular-api-client',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a declarative typed API client factory using fetch with configurable interceptors, retry, caching, error normalization, and response parsing — reducing Angular HTTP service boilerplate.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-initializer',
    anchorId: 'package-angular-initializer',
    packageName: '@hexguard/angular-initializer',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize app initialization orchestration with signals for init progress, failure recovery, dependency ordering between initializers, and SSR-safe patterns as a typed replacement for APP_INITIALIZER.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-api-defaults',
    anchorId: 'package-dotnet-api-defaults',
    packageName: 'HexGuard.ApiDefaults',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide zero-config ASP.NET Core API setup with one AddHexGuardApiDefaults() call that configures JSON serialization, CORS, Problem Details, OpenAPI defaults, rate limiting policies, and health check endpoints.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-env',
    anchorId: 'package-angular-env',
    packageName: '@hexguard/angular-env',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize typed runtime configuration for Angular apps with environment-aware loading, config schema validation, secret injection markers, and signal-based access to runtime config values.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-mock-api',
    anchorId: 'package-angular-mock-api',
    packageName: '@hexguard/angular-mock-api',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a declarative API mocking framework for Angular development with per-endpoint mock handlers, configurable delays, error simulation, stateful CRUD backends, and scenario switching — no backend required to build UIs.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-json-form',
    anchorId: 'package-angular-json-form',
    packageName: '@hexguard/angular-json-form',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would generate typed Reactive Forms dynamically from JSON schemas or data models with automatic control creation, validation rule extraction, and nested object/array support for rapid CRUD form setup.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-schematics',
    anchorId: 'package-angular-schematics',
    packageName: '@hexguard/angular-schematics',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide Angular CLI schematics for scaffolding features, pages, components, services, and data-access layers following consistent HexGuard conventions — reducing setup time for new features.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-api-mocks',
    anchorId: 'package-dotnet-api-mocks',
    packageName: 'HexGuard.ApiMocks',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide a configurable mock API host for .NET that serves predefined mock data sets with configurable delays, error injection, and stateful endpoints for integration testing and frontend development without real backends.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-i18n',
    anchorId: 'package-angular-i18n',
    packageName: '@hexguard/angular-i18n',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide runtime internationalization utilities with locale switching signals, ICU message formatting helpers, translation loading state, and locale-aware number/date/currency formatting for dynamic locale switching in Angular apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-offline-queue',
    anchorId: 'package-angular-offline-queue',
    packageName: '@hexguard/angular-offline-queue',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize offline mutation queueing for Angular apps — queue POST/PUT/DELETE actions when offline, replay in order when connectivity returns, with conflict detection and retry composing with network-status and async-state.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-geolocation',
    anchorId: 'package-angular-geolocation',
    packageName: '@hexguard/angular-geolocation',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize geolocation state management with signal-based position tracking, permission state, watchPosition cleanup, and reverse geocoding helpers for location-aware Angular applications.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-expiration',
    anchorId: 'package-angular-expiration',
    packageName: '@hexguard/angular-expiration',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize session and state expiry management with countdown signals, warning thresholds, auto-logout or auto-refresh callbacks, and configurable idle-warning UX for financial, healthcare, and admin applications.',
    showOnSiteHome: false,
  },
  {
    id: 'push-notifications-cross-stack',
    anchorId: 'package-push-notifications-cross-stack',
    packageName: 'HexGuard.PushNotifications + @hexguard/angular-push-notifications',
    scope: 'Cross-stack',
    status: 'Proposed',
    summary:
      'Would pair backend Web Push notification sending with VAPID key management and subscription storage, paired with Angular push notification permission state, registration, and click-handling signals for progressive web apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-auth',
    anchorId: 'package-angular-auth',
    packageName: '@hexguard/angular-auth',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize authentication state management with login/logout flows, token storage and refresh, user profile signals, route guards, and HTTP interceptor patterns for Angular apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-error-reporter',
    anchorId: 'package-angular-error-reporter',
    packageName: '@hexguard/angular-error-reporter',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize client-side error capture and reporting with automatic unhandled-error, HTTP-error, and async-error collection, consistent formatting, and configurable delivery to a backend endpoint or logging service.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-audit-log-viewer',
    anchorId: 'package-angular-audit-log-viewer',
    packageName: '@hexguard/angular-audit-log-viewer',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide audit log browsing UI state with searchable/filterable event list, entity drill-down, date-range and actor filtering, and event-detail expansion — pairing with HexGuard.AuditTrail on the .NET side.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-health-checks',
    anchorId: 'package-dotnet-health-checks',
    packageName: 'HexGuard.HealthChecks',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide standardized health check response contracts, health report JSON shapes, endpoint registration helpers, and integration conventions on top of ASP.NET Core built-in health checks.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-multi-tenancy',
    anchorId: 'package-dotnet-multi-tenancy',
    packageName: 'HexGuard.MultiTenancy',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would standardize multi-tenancy data isolation with tenant ID resolution strategies, per-tenant connection strings, tenant-aware EF Core query filters, and tenant-context middleware for .NET APIs.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-cloud-auth',
    anchorId: 'package-angular-cloud-auth',
    packageName: '@hexguard/angular-cloud-auth',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a provider-agnostic authentication state abstraction with adapter interfaces for Firebase Auth, Auth0, Azure AD, and custom JWT backends — unified user signals, token management, and route guards regardless of auth provider.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-firebase-auth',
    anchorId: 'package-angular-firebase-auth',
    packageName: '@hexguard/angular-firebase-auth',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide Firebase Authentication state management with signal-based user profile, auth state changes, multi-provider login methods, token refresh, and route guard helpers wrapping @angular/fire/auth.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-cloud-functions',
    anchorId: 'package-dotnet-cloud-functions',
    packageName: 'HexGuard.CloudFunctions',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide serverless function conventions for .NET with HTTP trigger helpers, function middleware (auth, logging, validation), response contracts, and provider-agnostic abstractions with Azure Functions and AWS Lambda adapters.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-cloud-jobs',
    anchorId: 'package-dotnet-cloud-jobs',
    packageName: 'HexGuard.CloudJobs',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide cloud job scheduling conventions for .NET with recurring and one-shot job definitions, cron schedules, status tracking, retry policies, and provider-agnostic adapters for Azure, AWS, and Google Cloud.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-object-storage',
    anchorId: 'package-dotnet-object-storage',
    packageName: 'HexGuard.ObjectStorage',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide cloud object storage abstractions with upload/download helpers, signed URL generation, container/bucket management, and provider-agnostic adapters for Azure Blob, AWS S3, Google Cloud Storage, and Firebase Storage.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-analytics',
    anchorId: 'package-angular-analytics',
    packageName: '@hexguard/angular-analytics',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize privacy-respecting analytics event tracking with typed event contracts, page view auto-tracking, user action tracking, and adapter interfaces for Google Analytics 4, PostHog, Mixpanel, and custom backends.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-webauthn',
    anchorId: 'package-angular-webauthn',
    packageName: '@hexguard/angular-webauthn',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize WebAuthn and passkey authentication state with signal-based registration, authentication, conditional mediation, and credential management flows for passwordless login in Angular apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-payment',
    anchorId: 'package-angular-payment',
    packageName: '@hexguard/angular-payment',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize payment processing state with Stripe Elements integration signals, checkout session lifecycle, payment intent tracking, receipt display, and subscription management for Angular e-commerce and SaaS apps.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-email',
    anchorId: 'package-dotnet-email',
    packageName: 'HexGuard.Email',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide transactional email conventions with IEmailSender interface, Razor-based email template rendering, send abstractions, and adapter interfaces for SendGrid, SMTP, and Azure Communication Services.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-analytics',
    anchorId: 'package-dotnet-analytics',
    packageName: 'HexGuard.Analytics',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide server-side analytics event tracking with typed event contracts, event batching, and adapter interfaces for Application Insights, PostHog, and custom analytics sinks — pairing with @hexguard/angular-analytics.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-form-engine',
    anchorId: 'package-angular-form-engine',
    packageName: '@hexguard/angular-form-engine',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would provide a declarative dynamic form engine that renders Reactive Forms from typed JSON configurations — fields, validation rules, conditional visibility, calculated values, and section layouts — enabling form building without template code.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-comments',
    anchorId: 'package-angular-comments',
    packageName: '@hexguard/angular-comments',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize threaded comment state with reply threading, @mention autocomplete, emoji reactions, file attachments, edit/delete history, and real-time updates for collaborative business applications.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-bookmarks',
    anchorId: 'package-angular-bookmarks',
    packageName: '@hexguard/angular-bookmarks',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize bookmark and favorite state with signal-based toggle, collections and folders, import/export, and route integration for saving and organizing frequently accessed entities in business apps.',
    showOnSiteHome: false,
  },
  {
    id: 'angular-report-builder',
    anchorId: 'package-angular-report-builder',
    packageName: '@hexguard/angular-report-builder',
    scope: 'Angular',
    status: 'Proposed',
    summary:
      'Would standardize report and dashboard builder state with column/filter/sort/grouping configuration signals, live preview state, export-to-XLSX/PDF integration, and saved report management for business intelligence features.',
    showOnSiteHome: false,
  },
  {
    id: 'dotnet-headless-cms',
    anchorId: 'package-dotnet-headless-cms',
    packageName: 'HexGuard.HeadlessCms',
    scope: '.NET',
    status: 'Proposed',
    summary:
      'Would provide headless CMS content contracts with content type definitions, content entry management, versioning, publishing workflow states, and content delivery API conventions for building headless CMS backends on ASP.NET Core.',
    showOnSiteHome: false,
  },
];
