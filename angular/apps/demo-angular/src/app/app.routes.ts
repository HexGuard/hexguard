import type { Routes } from '@angular/router';

import { canActivatePermissions, canMatchPermissions } from '@hexguard/angular-permissions';

import {
  ANGULAR_ASYNC_STATE_ACTION_DEMO,
  ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO,
  ANGULAR_ASYNC_STATE_VALUE_DEMO,
  ANGULAR_OPTIMISTIC_STATE_BULK_DEMO,
  ANGULAR_OPTIMISTIC_STATE_INLINE_EDIT_DEMO,
  ANGULAR_OPTIMISTIC_STATE_TOGGLE_DEMO,
  ANGULAR_PERMISSIONS_ACTIONS_DEMO,
  ANGULAR_PERMISSIONS_ROUTING_DEMO,
  ANGULAR_QUERY_FORM_ORDERS_DEMO,
  ANGULAR_QUERY_FORM_RECOVERY_DEMO,
  ANGULAR_URL_STATE_DASHBOARD_DEMO,
  ANGULAR_URL_STATE_ORDERS_DEMO,
} from './demo-registry';
import { AngularAsyncStateHomePageComponent } from './features/angular-async-state/pages/angular-async-state-home-page.component';
import { AsyncStateActionDemoPageComponent } from './features/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component';
import { AsyncStateObservableDemoPageComponent } from './features/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component';
import { AsyncStateValueDemoPageComponent } from './features/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component';
import { AngularOptimisticStateHomePageComponent } from './features/angular-optimistic-state/pages/angular-optimistic-state-home-page.component';
import { OptimisticStateBulkDemoPageComponent } from './features/angular-optimistic-state/pages/optimistic-state-bulk-demo-page/optimistic-state-bulk-demo-page.component';
import { OptimisticStateInlineEditDemoPageComponent } from './features/angular-optimistic-state/pages/optimistic-state-inline-edit-demo-page/optimistic-state-inline-edit-demo-page.component';
import { OptimisticStateToggleDemoPageComponent } from './features/angular-optimistic-state/pages/optimistic-state-toggle-demo-page/optimistic-state-toggle-demo-page.component';
import {
  AUDIT_ROUTE_REQUIREMENT,
  FINANCE_ROUTE_REQUIREMENT,
} from './features/angular-permissions/data/permissions-demo.data';
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
import { SiteHomePageComponent } from './features/site-home/pages/site-home-page.component';
import { AngularUrlStateHomePageComponent } from './features/angular-url-state/pages/angular-url-state-home-page.component';
import { DashboardDemoPageComponent } from './features/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component';
import { OrdersDemoPageComponent } from './features/angular-url-state/pages/orders-demo-page/orders-demo-page.component';

export const routes: Routes = [
  {
    path: '',
    component: SiteHomePageComponent,
    title: 'HexGuard Demo Site',
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
