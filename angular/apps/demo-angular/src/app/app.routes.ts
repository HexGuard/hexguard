import type { Routes } from '@angular/router';

import {
  ANGULAR_ASYNC_STATE_ACTION_DEMO,
  ANGULAR_ASYNC_STATE_OBSERVABLE_DEMO,
  ANGULAR_ASYNC_STATE_VALUE_DEMO,
  ANGULAR_QUERY_FORM_ORDERS_DEMO,
  ANGULAR_QUERY_FORM_RECOVERY_DEMO,
  ANGULAR_URL_STATE_DASHBOARD_DEMO,
  ANGULAR_URL_STATE_ORDERS_DEMO,
} from './demo-registry';
import { AngularAsyncStateHomePageComponent } from './features/angular-async-state/pages/angular-async-state-home-page.component';
import { AsyncStateActionDemoPageComponent } from './features/angular-async-state/pages/async-state-action-demo-page/async-state-action-demo-page.component';
import { AsyncStateObservableDemoPageComponent } from './features/angular-async-state/pages/async-state-observable-demo-page/async-state-observable-demo-page.component';
import { AsyncStateValueDemoPageComponent } from './features/angular-async-state/pages/async-state-value-demo-page/async-state-value-demo-page.component';
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
    path: '**',
    redirectTo: '',
  },
];
