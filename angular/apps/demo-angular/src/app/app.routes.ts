import { inject } from '@angular/core';
import type { Routes } from '@angular/router';

import { canActivateFeatureFlag } from '@hexguard/angular-feature-flags';
import { canActivatePermissions, canMatchPermissions } from '@hexguard/angular-permissions';

import { FeatureFlagsDemoSessionService } from './features/packages/angular/angular-feature-flags/data/feature-flags-demo.data';

import {
  ANGULAR_API_ERRORS_BACKEND_DEMO,
  ANGULAR_ASYNC_STATE_ACTION_DEMO,
  ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO,
  ANGULAR_ASYNC_STATE_VALUE_DEMO,
  ANGULAR_LOOKUPS_BACKEND_DEMO,
  ANGULAR_LOOKUPS_EDITOR_DEMO,
  ANGULAR_LOOKUPS_SUMMARY_DEMO,
  ANGULAR_OPTIMISTIC_STATE_BULK_DEMO,
  ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO,
  ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO,
  ANGULAR_PERMISSIONS_ACTIONS_DEMO,
  ANGULAR_PERMISSIONS_ROUTING_DEMO,
  ANGULAR_QUERY_FORM_ORDERS_DEMO,
  ANGULAR_QUERY_FORM_RECOVERY_DEMO,
  ANGULAR_URL_STATE_DASHBOARD_DEMO,
  ANGULAR_URL_STATE_ORDERS_DEMO,
  FORM_VALIDATION_DEMO,
} from './demo-registry';
import { AngularAsyncStateHomePageComponent } from './features/packages/angular/angular-async-state/angular-async-state-home-page.component';
import { AsyncStateActionDemoPageComponent } from './features/packages/angular/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component';
import { AsyncStateObservableDemoPageComponent } from './features/packages/angular/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component';
import { AsyncStateValueDemoPageComponent } from './features/packages/angular/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component';
import { LookupsBackendDemoPageComponent } from './features/packages/angular/angular-lookups/pages/lookups-backend-demo-page/lookups-backend-demo-page.component';
import { AngularLookupsHomePageComponent } from './features/packages/angular/angular-lookups/angular-lookups-home-page.component';
import { LookupsEditorDemoPageComponent } from './features/packages/angular/angular-lookups/pages/lookups-editor-demo-page/lookups-editor-demo-page.component';
import { LookupsSummaryDemoPageComponent } from './features/packages/angular/angular-lookups/pages/lookups-summary-demo-page/lookups-summary-demo-page.component';
import { AngularOptimisticStateHomePageComponent } from './features/packages/angular/angular-optimistic-state/angular-optimistic-state-home-page.component';
import { OptimisticStateBulkDemoPageComponent } from './features/packages/angular/angular-optimistic-state/pages/optimistic-state-bulk-demo-page/optimistic-state-bulk-demo-page.component';
import { OptimisticStateInlineEditDemoPageComponent } from './features/packages/angular/angular-optimistic-state/pages/optimistic-state-inline-edit-demo-page/optimistic-state-inline-edit-demo-page.component';
import { OptimisticStateToggleDemoPageComponent } from './features/packages/angular/angular-optimistic-state/pages/optimistic-state-toggle-demo-page/optimistic-state-toggle-demo-page.component';
import {
  AUDIT_ROUTE_REQUIREMENT,
  FINANCE_ROUTE_REQUIREMENT,
} from './features/packages/angular/angular-permissions/data/permissions-demo.data';
import { AngularFeatureFlagsHomePageComponent } from './features/packages/angular/angular-feature-flags/angular-feature-flags-home-page.component';
import { FeatureFlagTogglesDemoPageComponent } from './features/packages/angular/angular-feature-flags/pages/feature-flag-toggles-demo-page/feature-flag-toggles-demo-page.component';
import { FeatureFlagRoutingDemoPageComponent } from './features/packages/angular/angular-feature-flags/pages/feature-flag-routing-demo-page/feature-flag-routing-demo-page.component';
import { PremiumContentPageComponent } from './features/packages/angular/angular-feature-flags/pages/premium-content-page/premium-content-page.component';
import { UpgradePageComponent } from './features/packages/angular/angular-feature-flags/pages/upgrade-page/upgrade-page.component';
import { AngularSelectionStateHomePageComponent } from './features/packages/angular/angular-selection-state/angular-selection-state-home-page.component';
import { SelectionStateDemoPageComponent } from './features/packages/angular/angular-selection-state/pages/selection-state-demo-page/selection-state-demo-page.component';
import { AngularDateUtilsHomePageComponent } from './features/packages/angular/angular-date-utils/angular-date-utils-home-page.component';
import { DateUtilsDemoPageComponent } from './features/packages/angular/angular-date-utils/pages/date-utils-demo-page/date-utils-demo-page.component';
import { AngularNetworkStatusHomePageComponent } from './features/packages/angular/angular-network-status/angular-network-status-home-page.component';
import { NetworkStatusDemoPageComponent } from './features/packages/angular/angular-network-status/pages/network-status-demo-page/network-status-demo-page.component';
import { AngularStorageHomePageComponent } from './features/packages/angular/angular-storage/angular-storage-home-page.component';
import { StorageDemoPageComponent } from './features/packages/angular/angular-storage/pages/storage-demo-page/storage-demo-page.component';
import { AngularCommandPaletteHomePageComponent } from './features/packages/angular/angular-command-palette/angular-command-palette-home-page.component';
import { AngularThemeHomePageComponent } from './features/packages/angular/angular-theme/angular-theme-home-page.component';
import { ThemeDemoPageComponent } from './features/packages/angular/angular-theme/pages/theme-demo-page/theme-demo-page.component';
import { CommandPaletteDemoPageComponent } from './features/packages/angular/angular-command-palette/pages/command-palette-demo-page/command-palette-demo-page.component';
import { AngularPageContextHomePageComponent } from './features/packages/angular/angular-page-context/angular-page-context-home-page.component';
import { PageContextDemoPageComponent } from './features/packages/angular/angular-page-context/pages/page-context-demo-page/page-context-demo-page.component';
import { AngularRouteMemoryHomePageComponent } from './features/packages/angular/angular-route-memory/angular-route-memory-home-page.component';
import { RouteMemoryDemoPageComponent } from './features/packages/angular/angular-route-memory/pages/route-memory-demo-page/route-memory-demo-page.component';
import { AngularScrollStateHomePageComponent } from './features/packages/angular/angular-scroll-state/angular-scroll-state-home-page.component';
import { ScrollStateDemoPageComponent } from './features/packages/angular/angular-scroll-state/pages/scroll-state-demo-page/scroll-state-demo-page.component';
import { AngularWizardStateHomePageComponent } from './features/packages/angular/angular-wizard-state/angular-wizard-state-home-page.component';
import { WizardStateDemoPageComponent } from './features/packages/angular/angular-wizard-state/pages/wizard-state-demo-page/wizard-state-demo-page.component';
import { AngularBulkOperationsHomePageComponent } from './features/packages/angular/angular-bulk-operations/angular-bulk-operations-home-page.component';
import { BulkOperationsDemoPageComponent } from './features/packages/angular/angular-bulk-operations/pages/bulk-operations-demo-page/bulk-operations-demo-page.component';
import { BulkOperationsApiDemoPageComponent } from './features/packages/angular/angular-bulk-operations/pages/bulk-operations-api-demo-page/bulk-operations-api-demo-page.component';
import { BulkOperationsLibraryDemoPageComponent } from './features/packages/angular/angular-bulk-operations/pages/bulk-operations-library-demo-page/bulk-operations-library-demo-page.component';
import { AngularPermissionsHomePageComponent } from './features/packages/angular/angular-permissions/angular-permissions-home-page.component';
import { PermissionActionsDemoPageComponent } from './features/packages/angular/angular-permissions/pages/permission-actions-demo-page/permission-actions-demo-page.component';
import {
  PermissionRoutingAuditPanelComponent,
  PermissionRoutingDeniedPanelComponent,
  PermissionRoutingDemoPageComponent,
  PermissionRoutingFinancePanelComponent,
  PermissionRoutingOverviewPanelComponent,
} from './features/packages/angular/angular-permissions/pages/permission-routing-demo-page/permission-routing-demo-page.component';
import { AngularQueryFormHomePageComponent } from './features/packages/angular/angular-query-form/angular-query-form-home-page.component';
import { OrdersQueryFormDemoPageComponent } from './features/packages/angular/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component';
import { RecoveryQueryFormDemoPageComponent } from './features/packages/angular/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component';
import { DotnetHomePageComponent } from './features/packages/dotnet/dotnet-home/dotnet-home-page.component';
import { ReferenceDataDemoPageComponent } from './features/packages/dotnet/hexguard-reference-data/pages/reference-data-demo-page.component';
import { SampleApiExplorerPageComponent } from './features/packages/dotnet/hexguard-sample-api/pages/sample-api-explorer-page.component';
import { ValidationContractsDemoPageComponent } from './features/packages/dotnet/hexguard-validation-contracts/pages/validation-contracts-demo-page.component';
import { SiteHomePageComponent } from './features/site-home/site-home-page.component';
import { EcosystemPageComponent } from './features/packages/cross-stack/ecosystems/ecosystem-page.component';
import { AngularUrlStateHomePageComponent } from './features/packages/angular/angular-url-state/angular-url-state-home-page.component';
import { DashboardDemoPageComponent } from './features/packages/angular/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component';
import { OrdersDemoPageComponent } from './features/packages/angular/angular-url-state/pages/orders-demo-page/orders-demo-page.component';
import { AngularApiErrorsHomePageComponent } from './features/packages/angular/angular-api-errors/angular-api-errors-home-page.component';
import { ApiErrorsBackendDemoPageComponent } from './features/packages/angular/angular-api-errors/pages/api-errors-backend-demo-page/api-errors-backend-demo-page.component';
import { FormValidationDemoPageComponent } from './features/packages/angular/angular-api-errors/pages/form-validation-demo-page/form-validation-demo-page.component';
import { AngularDebounceHomePageComponent } from './features/packages/angular/angular-debounce/angular-debounce-home-page.component';
import { DebounceDemoPageComponent } from './features/packages/angular/angular-debounce/pages/debounce-demo-page/debounce-demo-page.component';
import { AngularBreakpointObserverHomePageComponent } from './features/packages/angular/angular-breakpoint-observer/angular-breakpoint-observer-home-page.component';
import { BreakpointObserverDemoPageComponent } from './features/packages/angular/angular-breakpoint-observer/pages/breakpoint-observer-demo-page/breakpoint-observer-demo-page.component';
import { AngularVisibilityHomePageComponent } from './features/packages/angular/angular-visibility/angular-visibility-home-page.component';
import { VisibilityDemoPageComponent } from './features/packages/angular/angular-visibility/pages/visibility-demo-page/visibility-demo-page.component';
import { AngularNavigationPendingHomePageComponent } from './features/packages/angular/angular-navigation-pending/angular-navigation-pending-home-page.component';
import { NavigationPendingDemoPageComponent } from './features/packages/angular/angular-navigation-pending/pages/navigation-pending-demo-page/navigation-pending-demo-page.component';
import { slowDeactivateGuard } from './features/packages/angular/angular-navigation-pending/data/navigation-pending-demo.resolver';
import { AngularClickOutsideHomePageComponent } from './features/packages/angular/angular-click-outside/angular-click-outside-home-page.component';
import { ClickOutsideDemoPageComponent } from './features/packages/angular/angular-click-outside/pages/click-outside-demo-page/click-outside-demo-page.component';
import { AngularResourceHomePageComponent } from './features/packages/angular/angular-resource/angular-resource-home-page.component';
import { ResourceDemoPageComponent } from './features/packages/angular/angular-resource/pages/resource-demo-page/resource-demo-page.component';
import { AngularUploadStateHomePageComponent } from './features/packages/angular/angular-upload-state/angular-upload-state-home-page.component';
import { UploadStateDemoPageComponent } from './features/packages/angular/angular-upload-state/pages/upload-state-demo-page/upload-state-demo-page.component';
import { AngularUndoHomePageComponent } from './features/packages/angular/angular-undo/angular-undo-home-page.component';
import { UndoDemoPageComponent } from './features/packages/angular/angular-undo/pages/undo-demo-page/undo-demo-page.component';
import { AngularPaginationHomePageComponent } from './features/packages/angular/angular-pagination/angular-pagination-home-page.component';
import { PaginationDemoPageComponent } from './features/packages/angular/angular-pagination/pages/pagination-demo-page/pagination-demo-page.component';
import { AngularFilePickerHomePageComponent } from './features/packages/angular/angular-file-picker/angular-file-picker-home-page.component';
import { FilePickerDemoPageComponent } from './features/packages/angular/angular-file-picker/pages/file-picker-demo-page/file-picker-demo-page.component';
import { AngularFormDraftsHomePageComponent } from './features/packages/angular/angular-form-drafts/angular-form-drafts-home-page.component';
import { FormDraftsDemoPageComponent } from './features/packages/angular/angular-form-drafts/pages/form-drafts-demo-page/form-drafts-demo-page.component';
import { PaginationCrossStackDemoPageComponent } from './features/packages/angular/angular-pagination/pages/pagination-cross-stack-demo-page/pagination-cross-stack-demo-page.component';
import { AngularLiveDataHomePageComponent } from './features/packages/angular/angular-live-data/angular-live-data-home-page.component';
import { LiveDataDemoPageComponent } from './features/packages/angular/angular-live-data/pages/live-data-demo-page/live-data-demo-page.component';
import { AngularConfirmationHomePageComponent } from './features/packages/angular/angular-confirmation/angular-confirmation-home-page.component';
import { ConfirmationDemoPageComponent } from './features/packages/angular/angular-confirmation/pages/confirmation-demo-page/confirmation-demo-page.component';
import { AngularErrorBoundaryHomePageComponent } from './features/packages/angular/angular-error-boundary/angular-error-boundary-home-page.component';
import { ErrorBoundaryDemoPageComponent } from './features/packages/angular/angular-error-boundary/pages/error-boundary-demo-page/error-boundary-demo-page.component';
import { AngularHubPageComponent } from './features/packages/angular/angular-hub/angular-hub-page.component';
import { AngularNotificationsHomePageComponent } from './features/packages/angular/angular-notifications/angular-notifications-home-page.component';
import { NotificationsDemoPageComponent } from './features/packages/angular/angular-notifications/pages/notifications-demo-page/notifications-demo-page.component';
import { CrossStackHubPageComponent } from './features/packages/cross-stack/cross-stack-hub/cross-stack-hub-page.component';
import { DotnetReferenceDataHubPageComponent } from './features/packages/dotnet/hexguard-reference-data/dotnet-reference-data-hub-page.component';
import { DotnetProblemDetailsHubPageComponent } from './features/packages/dotnet/hexguard-problem-details/dotnet-problem-details-hub-page.component';
import { DotnetFeatureFlagsHubPageComponent } from './features/packages/dotnet/hexguard-feature-flags/dotnet-feature-flags-hub-page.component';
import { DotnetBulkOperationsHubPageComponent } from './features/packages/dotnet/hexguard-bulk-operations/dotnet-bulk-operations-hub-page.component';
import { ProblemDetailsDemoPageComponent } from './features/packages/dotnet/hexguard-problem-details/pages/problem-details-demo-page.component';
import { FeatureFlagsDemoPageComponent } from './features/packages/dotnet/hexguard-feature-flags/pages/feature-flags-demo-page.component';
import { DotnetBulkOperationsDemoPageComponent } from './features/packages/dotnet/hexguard-bulk-operations/pages/bulk-operations-demo-page.component';
import { DotnetValidationContractsHubPageComponent } from './features/packages/dotnet/hexguard-validation-contracts/dotnet-validation-contracts-hub-page.component';
import { DotnetCapabilitiesHubPageComponent } from './features/packages/dotnet/hexguard-capabilities/dotnet-capabilities-hub-page.component';
import { DotnetPaginationHubPageComponent } from './features/packages/dotnet/hexguard-pagination/dotnet-hexguard-pagination-hub-page.component';
import { DotnetPaginationDemoPageComponent } from './features/packages/dotnet/hexguard-pagination/pages/pagination-demo-page.component';
import { BlazorDebouncedInputHubPageComponent } from './features/packages/blazor/hexguard-blazor-debounced-input/blazor-debounced-input-hub-page.component';
import { BlazorHomePageComponent } from './features/packages/blazor/blazor-home/blazor-home-page.component';
import { AngularClipboardHomePageComponent } from './features/packages/angular/angular-clipboard/angular-clipboard-home-page.component';
import { ClipboardDemoPageComponent } from './features/packages/angular/angular-clipboard/pages/clipboard-demo-page/clipboard-demo-page.component';
import { AngularColorHomePageComponent } from './features/packages/angular/angular-color/angular-color-home-page.component';
import { ColorDemoPageComponent } from './features/packages/angular/angular-color/pages/color-demo-page/color-demo-page.component';
import { AngularDirtyStateHomePageComponent } from './features/packages/angular/angular-dirty-state/angular-dirty-state-home-page.component';
import { DirtyStateDemoPageComponent } from './features/packages/angular/angular-dirty-state/pages/dirty-state-demo-page/dirty-state-demo-page.component';
import { AngularTableStateHomePageComponent } from './features/packages/angular/angular-table-state/angular-table-state-home-page.component';
import { TableStateDemoPageComponent } from './features/packages/angular/angular-table-state/pages/table-state-demo-page/table-state-demo-page.component';
import { AngularSignalPersistHomePageComponent } from './features/packages/angular/angular-signal-persist/angular-signal-persist-home-page.component';
import { SignalPersistDemoPageComponent } from './features/packages/angular/angular-signal-persist/pages/signal-persist-demo-page/signal-persist-demo-page.component';
import { AngularSignalUtilsHomePageComponent } from './features/packages/angular/angular-signal-utils/angular-signal-utils-home-page.component';
import { SignalUtilsDemoPageComponent } from './features/packages/angular/angular-signal-utils/pages/signal-utils-demo-page/signal-utils-demo-page.component';
import { AngularPreferencesHomePageComponent } from './features/packages/angular/angular-preferences/angular-preferences-home-page.component';
import { PreferencesDemoPageComponent } from './features/packages/angular/angular-preferences/pages/preferences-demo-page/preferences-demo-page.component';
import { AngularHttpDedupeHomePageComponent } from './features/packages/angular/angular-http-dedupe/angular-http-dedupe-home-page.component';
import { HttpDedupeDemoPageComponent } from './features/packages/angular/angular-http-dedupe/pages/http-dedupe-demo-page/http-dedupe-demo-page.component';
import { AngularRecentlyViewedHomePageComponent } from './features/packages/angular/angular-recently-viewed/angular-recently-viewed-home-page.component';
import { RecentlyViewedDemoPageComponent } from './features/packages/angular/angular-recently-viewed/pages/recently-viewed-demo-page/recently-viewed-demo-page.component';
import { AngularFormUtilsHomePageComponent } from './features/packages/angular/angular-form-utils/angular-form-utils-home-page.component';
import { FormUtilsDemoPageComponent } from './features/packages/angular/angular-form-utils/pages/form-utils-demo-page/form-utils-demo-page.component';
import { AngularQuerySignalFormsHomePageComponent } from './features/packages/angular/angular-query-signal-forms/angular-query-signal-forms-home-page.component';
import { QuerySignalFormsDemoPageComponent } from './features/packages/angular/angular-query-signal-forms/pages/query-signal-forms-demo-page/query-signal-forms-demo-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SiteHomePageComponent,
    title: 'HexGuard Demo Site',
  },
  {
    path: 'angular',
    component: AngularHubPageComponent,
    title: 'Angular Packages',
  },
  {
    path: 'cross-stack',
    component: CrossStackHubPageComponent,
    title: 'Cross-Stack Packages',
  },
  {
    path: 'ecosystems/:id',
    component: EcosystemPageComponent,
    title: 'Package Ecosystem',
  },
  {
    path: 'dotnet/hexguard-problem-details',
    component: DotnetProblemDetailsHubPageComponent,
    title: 'HexGuard.ProblemDetails Package Hub',
  },
  {
    path: 'dotnet/hexguard-feature-flags',
    component: DotnetFeatureFlagsHubPageComponent,
    title: 'HexGuard.FeatureFlags Package Hub',
  },
  {
    path: 'dotnet/hexguard-bulk-operations',
    component: DotnetBulkOperationsHubPageComponent,
    title: 'HexGuard.BulkOperations Package Hub',
  },
  {
    path: 'dotnet/hexguard-capabilities',
    component: DotnetCapabilitiesHubPageComponent,
    title: 'HexGuard.Capabilities Package Hub',
  },
  {
    path: 'dotnet/problem-details',
    component: ProblemDetailsDemoPageComponent,
    title: 'Problem Details Demo â€” RFC 9457 in Action',
  },
  {
    path: 'dotnet/hexguard-reference-data',
    component: DotnetReferenceDataHubPageComponent,
    title: 'HexGuard.ReferenceData Package Hub',
  },
  {
    path: 'dotnet/hexguard-validation-contracts',
    component: DotnetValidationContractsHubPageComponent,
    title: 'HexGuard.ValidationContracts Package Hub',
  },
  {
    path: 'packages/angular-url-state',
    component: AngularUrlStateHomePageComponent,
    title: 'Angular URL State Demos',
  },
  {
    path: 'packages/angular-url-state/orders',
    component: OrdersDemoPageComponent,
    title: 'Orders Search Demo',
  },
  {
    path: 'packages/angular-url-state/dashboard',
    component: DashboardDemoPageComponent,
    title: 'Dashboard Filters Demo',
  },
  {
    path: 'packages/angular-query-form',
    component: AngularQueryFormHomePageComponent,
    title: 'Angular Query Form Demos',
  },
  {
    path: 'packages/angular-query-form/orders',
    component: OrdersQueryFormDemoPageComponent,
    title: 'Orders Query Form Demo',
  },
  {
    path: 'packages/angular-query-form/recovery',
    component: RecoveryQueryFormDemoPageComponent,
    title: 'Recovery Query Form Demo',
  },
  {
    path: 'packages/angular-async-state',
    component: AngularAsyncStateHomePageComponent,
    title: 'Angular Async State Demos',
  },
  {
    path: 'packages/angular-async-state/value',
    component: AsyncStateValueDemoPageComponent,
    title: 'Async Value Lifecycle Demo',
  },
  {
    path: 'packages/angular-async-state/observable',
    component: AsyncStateObservableDemoPageComponent,
    title: 'Observable State Demo',
  },
  {
    path: 'packages/angular-async-state/action',
    component: AsyncStateActionDemoPageComponent,
    title: 'Async Action Lifecycle Demo',
  },
  {
    path: 'packages/angular-lookups',
    component: AngularLookupsHomePageComponent,
    title: 'Angular Lookups Demos',
  },
  {
    path: 'packages/angular-lookups/editor',
    component: LookupsEditorDemoPageComponent,
    title: 'Lookup Editor Demo',
  },
  {
    path: 'packages/angular-lookups/summary',
    component: LookupsSummaryDemoPageComponent,
    title: 'Lookup Summary Demo',
  },
  {
    path: 'packages/angular-lookups/backend',
    component: LookupsBackendDemoPageComponent,
    title: 'Lookup Backend Integration Demo',
  },
  {
    path: 'packages/angular-optimistic-state',
    component: AngularOptimisticStateHomePageComponent,
    title: 'Angular Optimistic State Demos',
  },
  {
    path: 'packages/angular-optimistic-state/toggle',
    component: OptimisticStateToggleDemoPageComponent,
    title: 'Optimistic Toggle Demo',
  },
  {
    path: 'packages/angular-optimistic-state/inline-edit',
    component: OptimisticStateInlineEditDemoPageComponent,
    title: 'Optimistic Inline Edit Demo',
  },
  {
    path: 'packages/angular-optimistic-state/bulk',
    component: OptimisticStateBulkDemoPageComponent,
    title: 'Optimistic Bulk Demo',
  },
  {
    path: 'packages/angular-permissions',
    component: AngularPermissionsHomePageComponent,
    title: 'Angular Permissions Demos',
  },
  {
    path: 'packages/angular-permissions/actions',
    component: PermissionActionsDemoPageComponent,
    title: 'Permissions Action Gating Demo',
  },
  {
    path: 'packages/angular-permissions/routing',
    component: PermissionRoutingDemoPageComponent,
    title: 'Permissions Route Gating Demo',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview',
      },
      {
        path: 'overview',
        component: PermissionRoutingOverviewPanelComponent,
        title: 'Permissions Routing Overview',
      },
      {
        path: 'finance',
        component: PermissionRoutingFinancePanelComponent,
        title: 'Permissions Finance Route',
        canActivate: [
          canActivatePermissions(FINANCE_ROUTE_REQUIREMENT, {
            redirectTo: `${ANGULAR_PERMISSIONS_ROUTING_DEMO.route}/denied`,
          }),
        ],
      },
      {
        path: 'audit',
        component: PermissionRoutingAuditPanelComponent,
        title: 'Permissions Audit Route',
        canMatch: [
          canMatchPermissions(AUDIT_ROUTE_REQUIREMENT, {
            redirectTo: `${ANGULAR_PERMISSIONS_ROUTING_DEMO.route}/denied`,
          }),
        ],
      },
      {
        path: 'denied',
        component: PermissionRoutingDeniedPanelComponent,
        title: 'Permissions Denied Route',
      },
    ],
  },
  {
    path: 'packages/angular-api-errors',
    component: AngularApiErrorsHomePageComponent,
    title: 'Angular API Errors Demos',
  },
  {
    path: 'packages/angular-api-errors/form-validation',
    component: FormValidationDemoPageComponent,
    title: 'Form Validation Demo',
  },
  {
    path: 'packages/angular-api-errors/backend',
    component: ApiErrorsBackendDemoPageComponent,
    title: 'Backend Validation Demo',
  },
  {
    path: 'packages/angular-debounce',
    component: AngularDebounceHomePageComponent,
    title: 'Angular Debounce Demos',
  },
  {
    path: 'packages/angular-debounce/demo',
    component: DebounceDemoPageComponent,
    title: 'Debounce Demo',
  },
  {
    path: 'packages/angular-breakpoint-observer',
    component: AngularBreakpointObserverHomePageComponent,
    title: 'Angular Breakpoint Observer Demos',
  },
  {
    path: 'packages/angular-breakpoint-observer/demo',
    component: BreakpointObserverDemoPageComponent,
    title: 'Breakpoint Observer Demo',
  },
  {
    path: 'packages/angular-visibility',
    component: AngularVisibilityHomePageComponent,
    title: 'Angular Visibility Demos',
  },
  {
    path: 'packages/angular-visibility/demo',
    component: VisibilityDemoPageComponent,
    title: 'Visibility Demo',
  },
  {
    path: 'packages/angular-navigation-pending',
    component: AngularNavigationPendingHomePageComponent,
    title: 'Angular Navigation Pending Demos',
  },
  {
    path: 'packages/angular-navigation-pending/demo',
    component: NavigationPendingDemoPageComponent,
    title: 'Navigation Pending Demo',
    canDeactivate: [slowDeactivateGuard(2500)],
  },  {
    path: 'packages/angular-click-outside',
    component: AngularClickOutsideHomePageComponent,
    title: 'Angular Click Outside Demos',
  },
  {
    path: 'packages/angular-click-outside/demo',
    component: ClickOutsideDemoPageComponent,
    title: 'Click Outside Demo',
  },
  {
    path: 'packages/angular-resource',
    component: AngularResourceHomePageComponent,
    title: 'Angular Resource Demos',
  },
  {
    path: 'packages/angular-resource/demo',
    component: ResourceDemoPageComponent,
    title: 'Resource Demo',
  },
  {
    path: 'packages/angular-upload-state',
    component: AngularUploadStateHomePageComponent,
    title: 'Angular Upload State Demos',
  },
  {
    path: 'packages/angular-upload-state/demo',
    component: UploadStateDemoPageComponent,
    title: 'Upload State Demo',
  },
  {
    path: 'packages/angular-resource',
    component: AngularResourceHomePageComponent,
    title: 'Angular Resource Demos',
  },
  {
    path: 'packages/angular-resource/demo',
    component: ResourceDemoPageComponent,
    title: 'Resource Demo',
  },
  {
    path: 'packages/angular-upload-state',
    component: AngularUploadStateHomePageComponent,
    title: 'Angular Upload State Demos',
  },
  {
    path: 'packages/angular-upload-state/demo',
    component: UploadStateDemoPageComponent,
    title: 'Upload State Demo',
  },
  {
    path: 'packages/angular-undo',
    component: AngularUndoHomePageComponent,
    title: 'Angular Undo Demos',
  },
  {
    path: 'packages/angular-undo/demo',
    component: UndoDemoPageComponent,
    title: 'Undo Demo',
  },
  {
    path: 'packages/angular-pagination',
    component: AngularPaginationHomePageComponent,
    title: 'Angular Pagination Demos',
  },
  {
    path: 'packages/angular-pagination/demo',
    component: PaginationDemoPageComponent,
    title: 'Pagination Demo',
  },
  {
    path: 'packages/angular-pagination/cross-stack-demo',
    component: PaginationCrossStackDemoPageComponent,
    title: 'Pagination Cross-stack Demo',
  },
  {
    path: 'packages/angular-file-picker',
    component: AngularFilePickerHomePageComponent,
    title: 'Angular File Picker Demos',
  },
  {
    path: 'packages/angular-file-picker/demo',
    component: FilePickerDemoPageComponent,
    title: 'File Picker Demo',
  },
  {
    path: 'packages/angular-form-drafts',
    component: AngularFormDraftsHomePageComponent,
    title: 'Angular Form Drafts Demos',
  },
  {
    path: 'packages/angular-form-drafts/demo',
    component: FormDraftsDemoPageComponent,
    title: 'Form Drafts Demo',
  },
  // â”€â”€ Form Utils â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-form-utils',
    component: AngularFormUtilsHomePageComponent,
    title: 'Angular Form Utils Demos',
  },
  {
    path: 'packages/angular-form-utils/demo',
    component: FormUtilsDemoPageComponent,
    title: 'Form Utils Demo',
  },
  {
    path: 'packages/angular-live-data',
    component: AngularLiveDataHomePageComponent,
    title: 'Angular Live Data Demos',
  },
  {
    path: 'packages/angular-live-data/demo',
    component: LiveDataDemoPageComponent,
    title: 'Live Data Demo',
  },
  {
    path: 'packages/angular-confirmation',
    component: AngularConfirmationHomePageComponent,
    title: 'Angular Confirmation Demos',
  },
  {
    path: 'packages/angular-confirmation/demo',
    component: ConfirmationDemoPageComponent,
    title: 'Confirmation Demo',
  },
  {
    path: 'packages/angular-notifications',
    component: AngularNotificationsHomePageComponent,
    title: 'Angular Notifications Demos',
  },
  {
    path: 'packages/angular-notifications/demo',
    component: NotificationsDemoPageComponent,
    title: 'Notifications Demo',
  },
  {
    path: 'packages/angular-feature-flags',
    component: AngularFeatureFlagsHomePageComponent,
    title: 'Angular Feature Flags Demos',
  },
  {
    path: 'packages/angular-feature-flags/toggles',
    component: FeatureFlagTogglesDemoPageComponent,
    title: 'Feature Flag Toggles Demo',
  },
  {
    path: 'packages/angular-feature-flags/routing',
    component: FeatureFlagRoutingDemoPageComponent,
    title: 'Feature Flag Routing Demo',
  },
  {
    path: 'packages/angular-feature-flags/premium',
    component: PremiumContentPageComponent,
    canActivate: [
      canActivateFeatureFlag({
        flagKey: 'premium-feature-x',
        context: () => inject(FeatureFlagsDemoSessionService).context(),
        redirectTo: '/packages/angular-feature-flags/upgrade',
      }),
    ],
    title: 'Premium Content (Feature Flag Guarded)',
  },
  {
    path: 'packages/angular-feature-flags/upgrade',
    component: UpgradePageComponent,
    title: 'Upgrade Required',
  },
  {
    path: 'packages/angular-error-boundary',
    component: AngularErrorBoundaryHomePageComponent,
    title: 'Angular Error Boundary Demos',
  },
  {
    path: 'packages/angular-error-boundary/demo',
    component: ErrorBoundaryDemoPageComponent,
    title: 'Error Boundary Demo',
  },
  // â”€â”€ Selection state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-selection-state',
    component: AngularSelectionStateHomePageComponent,
    title: 'Angular Selection State Demos',
  },
  {
    path: 'packages/angular-selection-state/demo',
    component: SelectionStateDemoPageComponent,
    title: 'Selection State Demo',
  },
  // â”€â”€ Bulk operations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-bulk-operations',
    component: AngularBulkOperationsHomePageComponent,
    title: 'Angular Bulk Operations Demos',
  },
  {
    path: 'packages/angular-bulk-operations/demo',
    component: BulkOperationsDemoPageComponent,
    title: 'Bulk Operations Demo',
  },
  {
    path: 'packages/angular-bulk-operations/api-demo',
    component: BulkOperationsApiDemoPageComponent,
    title: 'Bulk Operations Live API Demo',
  },
  {
    path: 'packages/angular-bulk-operations/library-demo',
    component: BulkOperationsLibraryDemoPageComponent,
    title: 'Bulk Operations Library API Workflow',
  },
  // â”€â”€ Date Utils â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-date-utils',
    component: AngularDateUtilsHomePageComponent,
    title: 'Angular Date Utils Demos',
  },
  {
    path: 'packages/angular-date-utils/demo',
    component: DateUtilsDemoPageComponent,
    title: 'Date Utils Demo',
  },
  // â”€â”€ Network Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-network-status',
    component: AngularNetworkStatusHomePageComponent,
    title: 'Angular Network Status Demos',
  },
  {
    path: 'packages/angular-network-status/demo',
    component: NetworkStatusDemoPageComponent,
    title: 'Network Status Demo',
  },
  // â”€â”€ Storage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-storage',
    component: AngularStorageHomePageComponent,
    title: 'Angular Storage Demos',
  },
  {
    path: 'packages/angular-storage/demo',
    component: StorageDemoPageComponent,
    title: 'Storage Demo',
  },
  // â”€â”€ Clipboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-clipboard',
    component: AngularClipboardHomePageComponent,
    title: 'Angular Clipboard Demos',
  },
  {
    path: 'packages/angular-clipboard/demo',
    component: ClipboardDemoPageComponent,
    title: 'Clipboard Demo',
  },
  // â”€â”€ Command Palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-command-palette',
    component: AngularCommandPaletteHomePageComponent,
    title: 'Angular Command Palette Demos',
  },
  {
    path: 'packages/angular-command-palette/demo',
    component: CommandPaletteDemoPageComponent,
    title: 'Command Palette Demo',
  },
  // â”€â”€ Page Context â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-page-context',
    component: AngularPageContextHomePageComponent,
    title: 'Angular Page Context Demos',
  },
  {
    path: 'packages/angular-page-context/demo',
    component: PageContextDemoPageComponent,
    title: 'Page Context Demo',
  },
  // â”€â”€ Route Memory â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-route-memory',
    component: AngularRouteMemoryHomePageComponent,
    title: 'Angular Route Memory Demos',
  },
  {
    path: 'packages/angular-route-memory/demo',
    component: RouteMemoryDemoPageComponent,
    title: 'Route Memory Demo',
  },
  // â”€â”€ Scroll State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-scroll-state',
    component: AngularScrollStateHomePageComponent,
    title: 'Angular Scroll State Demos',
  },
  {
    path: 'packages/angular-scroll-state/demo',
    component: ScrollStateDemoPageComponent,
    title: 'Scroll State Demo',
  },
  // â”€â”€ Color â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-color',
    component: AngularColorHomePageComponent,
    title: 'Angular Color Demos',
  },
  {
    path: 'packages/angular-color/demo',
    component: ColorDemoPageComponent,
    title: 'Color Demo',
  },
  // â”€â”€ Theme â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-theme',
    component: AngularThemeHomePageComponent,
    title: 'Angular Theme Demos',
  },
  {
    path: 'packages/angular-theme/demo',
    component: ThemeDemoPageComponent,
    title: 'Theme Demo',
  },
  // â”€â”€ Dirty State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-dirty-state',
    component: AngularDirtyStateHomePageComponent,
    title: 'Angular Dirty State Demos',
  },
  {
    path: 'packages/angular-dirty-state/demo',
    component: DirtyStateDemoPageComponent,
    title: 'Dirty State Demo',
  },
  // â”€â”€ Table State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-table-state',
    component: AngularTableStateHomePageComponent,
    title: 'Angular Table State Demos',
  },
  {
    path: 'packages/angular-table-state/demo',
    component: TableStateDemoPageComponent,
    title: 'Table State Demo',
  },
  // â”€â”€ Signal Persist â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-signal-persist',
    component: AngularSignalPersistHomePageComponent,
    title: 'Angular Signal Persist Demos',
  },
  {
    path: 'packages/angular-signal-persist/demo',
    component: SignalPersistDemoPageComponent,
    title: 'Signal Persist Demo',
  },
  // â”€â”€ Signal Utils â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-signal-utils',
    component: AngularSignalUtilsHomePageComponent,
    title: 'Angular Signal Utils Demos',
  },
  {
    path: 'packages/angular-signal-utils/demo',
    component: SignalUtilsDemoPageComponent,
    title: 'Signal Utils Demo',
  },
  // â”€â”€ Preferences â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-preferences',
    component: AngularPreferencesHomePageComponent,
    title: 'Angular Preferences Demos',
  },
  {
    path: 'packages/angular-preferences/demo',
    component: PreferencesDemoPageComponent,
    title: 'Preferences Demo',
  },
  // â”€â”€ HTTP Dedupe â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-http-dedupe',
    component: AngularHttpDedupeHomePageComponent,
    title: 'Angular HTTP Dedupe Demos',
  },
  {
    path: 'packages/angular-http-dedupe/demo',
    component: HttpDedupeDemoPageComponent,
    title: 'HTTP Dedupe Demo',
  },
  // â”€â”€ Query Signal Forms â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-query-signal-forms',
    component: AngularQuerySignalFormsHomePageComponent,
    title: 'Angular Query Signal Forms Demos',
  },
  {
    path: 'packages/angular-query-signal-forms/demo',
    component: QuerySignalFormsDemoPageComponent,
    title: 'Query Signal Forms Demo',
  },
  // â”€â”€ Recently Viewed â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-recently-viewed',
    component: AngularRecentlyViewedHomePageComponent,
    title: 'Angular Recently Viewed Demos',
  },
  {
    path: 'packages/angular-recently-viewed/demo',
    component: RecentlyViewedDemoPageComponent,
    title: 'Recently Viewed Demo',
  },
  // â”€â”€ Wizard State â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'packages/angular-wizard-state',
    component: AngularWizardStateHomePageComponent,
    title: 'Angular Wizard State Demos',
  },
  {
    path: 'packages/angular-wizard-state/demo',
    component: WizardStateDemoPageComponent,
    title: 'Wizard State Demo',
  },
  // â”€â”€ .NET showcase routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'dotnet',
    component: DotnetHomePageComponent,
    title: 'HexGuard .NET Packages',
  },
  {
    path: 'dotnet/reference-data',
    component: ReferenceDataDemoPageComponent,
    title: 'ReferenceData Library Demo',
  },
  {
    path: 'dotnet/validation-contracts',
    component: ValidationContractsDemoPageComponent,
    title: 'ValidationContracts Library Demo',
  },
  {
    path: 'dotnet/feature-flags',
    component: FeatureFlagsDemoPageComponent,
    title: 'FeatureFlags Library Demo',
  },
  {
    path: 'dotnet/bulk-operations',
    component: DotnetBulkOperationsDemoPageComponent,
    title: 'Bulk Operations Library Demo',
  },
  {
    path: 'dotnet/hexguard-pagination',
    component: DotnetPaginationHubPageComponent,
    title: 'HexGuard.Pagination',
  },
  {
    path: 'dotnet/pagination',
    component: DotnetPaginationDemoPageComponent,
    title: 'Pagination (.NET) Demo',
  },
  {
    path: 'dotnet/capabilities',
    component: DotnetCapabilitiesHubPageComponent,
    title: 'HexGuard.Capabilities Demo',
  },
  {
    path: 'dotnet/sample-api',
    component: SampleApiExplorerPageComponent,
    title: 'SampleApi Explorer',
  },
  // â”€â”€ Blazor showcase routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'blazor',
    component: BlazorHomePageComponent,
    title: 'HexGuard Blazor Packages',
  },
  {
    path: 'blazor/debounced-input',
    component: BlazorDebouncedInputHubPageComponent,
    title: 'HexGuard.Blazor.DebouncedInput',
  },
  // â”€â”€ Legacy redirects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    path: 'orders',
    redirectTo: ANGULAR_URL_STATE_ORDERS_DEMO.route.slice(1),
  },
  {
    path: 'dashboard',
    redirectTo: ANGULAR_URL_STATE_DASHBOARD_DEMO.route.slice(1),
  },
  {
    path: 'query-form-orders',
    redirectTo: ANGULAR_QUERY_FORM_ORDERS_DEMO.route.slice(1),
  },
  {
    path: 'query-form-recovery',
    redirectTo: ANGULAR_QUERY_FORM_RECOVERY_DEMO.route.slice(1),
  },
  {
    path: 'async-state-value',
    redirectTo: ANGULAR_ASYNC_STATE_VALUE_DEMO.route.slice(1),
  },
  {
    path: 'async-state-observable',
    redirectTo: ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO.route.slice(1),
  },
  {
    path: 'async-state-action',
    redirectTo: ANGULAR_ASYNC_STATE_ACTION_DEMO.route.slice(1),
  },
  {
    path: 'api-errors-form-validation',
    redirectTo: FORM_VALIDATION_DEMO.route.slice(1),
  },
  {
    path: 'api-errors-backend',
    redirectTo: ANGULAR_API_ERRORS_BACKEND_DEMO.route.slice(1),
  },
  {
    path: 'lookups-editor',
    redirectTo: ANGULAR_LOOKUPS_EDITOR_DEMO.route.slice(1),
  },
  {
    path: 'lookups-summary',
    redirectTo: ANGULAR_LOOKUPS_SUMMARY_DEMO.route.slice(1),
  },
  {
    path: 'lookups-backend',
    redirectTo: ANGULAR_LOOKUPS_BACKEND_DEMO.route.slice(1),
  },
  {
    path: 'optimistic-toggle',
    redirectTo: ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO.route.slice(1),
  },
  {
    path: 'optimistic-inline-edit',
    redirectTo: ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO.route.slice(1),
  },
  {
    path: 'optimistic-bulk',
    redirectTo: ANGULAR_OPTIMISTIC_STATE_BULK_DEMO.route.slice(1),
  },
  {
    path: 'permissions-actions',
    redirectTo: ANGULAR_PERMISSIONS_ACTIONS_DEMO.route.slice(1),
  },
  {
    path: 'permissions-routing',
    redirectTo: ANGULAR_PERMISSIONS_ROUTING_DEMO.route.slice(1),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

