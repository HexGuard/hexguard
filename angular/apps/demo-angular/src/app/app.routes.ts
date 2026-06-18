import { inject } from '@angular/core';
import type { Routes } from '@angular/router';

import { canActivateFeatureFlag } from '@hexguard/angular-feature-flags';
import { canActivatePermissions, canMatchPermissions } from '@hexguard/angular-permissions';

import { FeatureFlagsDemoSessionService } from './features/angular-feature-flags/data/feature-flags-demo.data';

import {
  ANGULAR_FEATURE_FLAGS_PACKAGE,
  ANGULAR_FEATURE_FLAGS_ROUTING_DEMO,
  ANGULAR_FEATURE_FLAGS_TOGGLES_DEMO,
  ANGULAR_API_ERRORS_BACKEND_DEMO,
  ANGULAR_ASYNC_STATE_ACTION_DEMO,
  ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO,
  ANGULAR_ASYNC_STATE_VALUE_DEMO,
  ANGULAR_DEBOUNCE_DEMO,
  ANGULAR_ERROR_BOUNDARY_DEMO,
  ANGULAR_LOOKUPS_BACKEND_DEMO,
  ANGULAR_LOOKUPS_EDITOR_DEMO,
  ANGULAR_LOOKUPS_SUMMARY_DEMO,
  ANGULAR_NOTIFICATIONS_DEMO,
  ANGULAR_OPTIMISTIC_STATE_BULK_DEMO,
  ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO,
  ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO,
  ANGULAR_PERMISSIONS_ACTIONS_DEMO,
  ANGULAR_PERMISSIONS_ROUTING_DEMO,
  ANGULAR_QUERY_FORM_ORDERS_DEMO,
  ANGULAR_QUERY_FORM_RECOVERY_DEMO,
  ANGULAR_URL_STATE_DASHBOARD_DEMO,
  ANGULAR_URL_STATE_ORDERS_DEMO,
  DOTNET_REFERENCE_DATA_HOME,
  DOTNET_SAMPLE_API_EXPLORER,
  FORM_VALIDATION_DEMO,
} from './demo-registry';
import { AngularAsyncStateHomePageComponent } from './features/angular-async-state/pages/angular-async-state-home-page.component';
import { AsyncStateActionDemoPageComponent } from './features/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component';
import { AsyncStateObservableDemoPageComponent } from './features/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component';
import { AsyncStateValueDemoPageComponent } from './features/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component';
import { LookupsBackendDemoPageComponent } from './features/angular-lookups/pages/lookups-backend-demo-page/lookups-backend-demo-page.component';
import { AngularLookupsHomePageComponent } from './features/angular-lookups/pages/angular-lookups-home-page.component';
import { LookupsEditorDemoPageComponent } from './features/angular-lookups/pages/lookups-editor-demo-page/lookups-editor-demo-page.component';
import { LookupsSummaryDemoPageComponent } from './features/angular-lookups/pages/lookups-summary-demo-page/lookups-summary-demo-page.component';
import { AngularOptimisticStateHomePageComponent } from './features/angular-optimistic-state/pages/angular-optimistic-state-home-page.component';
import { OptimisticStateBulkDemoPageComponent } from './features/angular-optimistic-state/pages/optimistic-state-bulk-demo-page/optimistic-state-bulk-demo-page.component';
import { OptimisticStateInlineEditDemoPageComponent } from './features/angular-optimistic-state/pages/optimistic-state-inline-edit-demo-page/optimistic-state-inline-edit-demo-page.component';
import { OptimisticStateToggleDemoPageComponent } from './features/angular-optimistic-state/pages/optimistic-state-toggle-demo-page/optimistic-state-toggle-demo-page.component';
import {
  AUDIT_ROUTE_REQUIREMENT,
  FINANCE_ROUTE_REQUIREMENT,
} from './features/angular-permissions/data/permissions-demo.data';
import { AngularFeatureFlagsHomePageComponent } from './features/angular-feature-flags/angular-feature-flags-home-page.component';
import { FeatureFlagTogglesDemoPageComponent } from './features/angular-feature-flags/pages/feature-flag-toggles-demo-page/feature-flag-toggles-demo-page.component';
import { FeatureFlagRoutingDemoPageComponent } from './features/angular-feature-flags/pages/feature-flag-routing-demo-page/feature-flag-routing-demo-page.component';
import { PremiumContentPageComponent } from './features/angular-feature-flags/pages/premium-content-page/premium-content-page.component';
import { UpgradePageComponent } from './features/angular-feature-flags/pages/upgrade-page/upgrade-page.component';
import { AngularPermissionsHomePageComponent } from './features/angular-permissions/pages/angular-permissions-home-page.component';
import { PermissionActionsDemoPageComponent } from './features/angular-permissions/pages/permission-actions-demo-page/permission-actions-demo-page.component';
import {
  PermissionRoutingAuditPanelComponent,
  PermissionRoutingDeniedPanelComponent,
  PermissionRoutingDemoPageComponent,
  PermissionRoutingFinancePanelComponent,
  PermissionRoutingOverviewPanelComponent,
} from './features/angular-permissions/pages/permission-routing-demo-page/permission-routing-demo-page.component';
import { AngularQueryFormHomePageComponent } from './features/angular-query-form/pages/angular-query-form-home-page.component';
import { OrdersQueryFormDemoPageComponent } from './features/angular-query-form/pages/orders-query-form-demo-page/orders-query-form-demo-page.component';
import { RecoveryQueryFormDemoPageComponent } from './features/angular-query-form/pages/recovery-query-form-demo-page/recovery-query-form-demo-page.component';
import { DotnetHomePageComponent } from './features/dotnet/pages/dotnet-home-page/dotnet-home-page.component';
import { ReferenceDataDemoPageComponent } from './features/dotnet/pages/reference-data-demo-page/reference-data-demo-page.component';
import { SampleApiExplorerPageComponent } from './features/dotnet/pages/sample-api-explorer-page/sample-api-explorer-page.component';
import { ValidationContractsDemoPageComponent } from './features/dotnet/pages/validation-contracts-demo-page/validation-contracts-demo-page.component';
import { SiteHomePageComponent } from './features/site-home/pages/site-home-page.component';
import { EcosystemPageComponent } from './features/ecosystems/pages/rfc-9457-ecosystem-page/ecosystem-page.component';
import { AngularUrlStateHomePageComponent } from './features/angular-url-state/pages/angular-url-state-home-page.component';
import { DashboardDemoPageComponent } from './features/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component';
import { OrdersDemoPageComponent } from './features/angular-url-state/pages/orders-demo-page/orders-demo-page.component';
import { AngularApiErrorsHomePageComponent } from './features/angular-api-errors/pages/angular-api-errors-home-page.component';
import { ApiErrorsBackendDemoPageComponent } from './features/angular-api-errors/pages/api-errors-backend-demo-page/api-errors-backend-demo-page.component';
import { FormValidationDemoPageComponent } from './features/angular-api-errors/pages/form-validation-demo-page/form-validation-demo-page.component';
import { AngularDebounceHomePageComponent } from './features/angular-debounce/pages/angular-debounce-home-page.component';
import { DebounceDemoPageComponent } from './features/angular-debounce/pages/debounce-demo-page/debounce-demo-page.component';
import { AngularErrorBoundaryHomePageComponent } from './features/angular-error-boundary/pages/angular-error-boundary-home-page.component';
import { ErrorBoundaryDemoPageComponent } from './features/angular-error-boundary/pages/error-boundary-demo-page/error-boundary-demo-page.component';
import { AngularHubPageComponent } from './features/angular-hub/pages/angular-hub-page.component';
import { AngularNotificationsHomePageComponent } from './features/angular-notifications/pages/angular-notifications-home-page.component';
import { NotificationsDemoPageComponent } from './features/angular-notifications/pages/notifications-demo-page/notifications-demo-page.component';
import { CrossStackHubPageComponent } from './features/cross-stack-hub/pages/cross-stack-hub-page.component';
import { DotnetReferenceDataHubPageComponent } from './features/dotnet/pages/dotnet-reference-data-hub-page/dotnet-reference-data-hub-page.component';
import { DotnetProblemDetailsHubPageComponent } from './features/dotnet/pages/dotnet-problem-details-hub-page/dotnet-problem-details-hub-page.component';
import { DotnetFeatureFlagsHubPageComponent } from './features/dotnet/pages/dotnet-feature-flags-hub-page/dotnet-feature-flags-hub-page.component';
import { ProblemDetailsDemoPageComponent } from './features/dotnet/pages/problem-details-demo-page/problem-details-demo-page.component';
import { FeatureFlagsDemoPageComponent } from './features/dotnet/pages/feature-flags-demo-page/feature-flags-demo-page.component';
import { DotnetValidationContractsHubPageComponent } from './features/dotnet/pages/dotnet-validation-contracts-hub-page/dotnet-validation-contracts-hub-page.component';

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
    path: 'dotnet/problem-details',
    component: ProblemDetailsDemoPageComponent,
    title: 'Problem Details Demo — RFC 9457 in Action',
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
  // ── .NET showcase routes ────────────────────────────────────────
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
    path: 'dotnet/sample-api',
    component: SampleApiExplorerPageComponent,
    title: 'SampleApi Explorer',
  },
  // ── Legacy redirects ────────────────────────────────────────────
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
