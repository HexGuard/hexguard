import { inject, provideBrowserGlobalErrorListeners, type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HEXGUARD_PERMISSION_CONTEXT } from '@hexguard/angular-permissions';
import { provideHexGuardUrlState } from '@hexguard/angular-url-state';

import { PermissionsDemoSessionService } from './features/angular-permissions/data/permissions-demo.data';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHexGuardUrlState(),
    {
      provide: HEXGUARD_PERMISSION_CONTEXT,
      useFactory: () => inject(PermissionsDemoSessionService).context,
    },
  ],
};
