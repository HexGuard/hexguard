import { provideHttpClient } from '@angular/common/http';
import { inject, provideBrowserGlobalErrorListeners, type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HEXGUARD_PERMISSION_CONTEXT } from '@hexguard/angular-permissions';
import { provideHexGuardFeatureFlags } from '@hexguard/angular-feature-flags';
import { provideHexGuardUrlState } from '@hexguard/angular-url-state';

import { FEATURE_FLAG_DEMO_CATALOG } from './features/angular-feature-flags/data/feature-flags-demo.data';
import { PermissionsDemoSessionService } from './features/angular-permissions/data/permissions-demo.data';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideHexGuardUrlState(),
    provideHexGuardFeatureFlags(FEATURE_FLAG_DEMO_CATALOG),
    {
      provide: HEXGUARD_PERMISSION_CONTEXT,
      useFactory: () => inject(PermissionsDemoSessionService).context,
    },
  ],
};
