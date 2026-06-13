import type { Routes } from '@angular/router';

import { DashboardPageComponent } from './dashboard-page.component';
import { OrdersPageComponent } from './orders-page.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'orders',
  },
  {
    path: 'orders',
    component: OrdersPageComponent,
    title: 'Orders Search Demo',
  },
  {
    path: 'dashboard',
    component: DashboardPageComponent,
    title: 'Dashboard Filters Demo',
  },
  {
    path: '**',
    redirectTo: 'orders',
  },
];
