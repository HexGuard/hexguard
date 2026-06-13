import type { Routes } from '@angular/router';

import {
  ANGULAR_URL_STATE_DASHBOARD_DEMO,
  ANGULAR_URL_STATE_ORDERS_DEMO,
  ANGULAR_URL_STATE_PACKAGE,
} from './demo-registry';
import { AngularUrlStateHomePageComponent } from './features/angular-url-state/pages/angular-url-state-home-page.component';
import { DashboardDemoPageComponent } from './features/angular-url-state/pages/dashboard-demo-page/dashboard-demo-page.component';
import { OrdersDemoPageComponent } from './features/angular-url-state/pages/orders-demo-page/orders-demo-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ANGULAR_URL_STATE_PACKAGE.route.slice(1),
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
    path: 'orders',
    redirectTo: ANGULAR_URL_STATE_ORDERS_DEMO.route.slice(1),
  },
  {
    path: 'dashboard',
    redirectTo: ANGULAR_URL_STATE_DASHBOARD_DEMO.route.slice(1),
  },
  {
    path: '**',
    redirectTo: ANGULAR_URL_STATE_PACKAGE.route.slice(1),
  },
];
