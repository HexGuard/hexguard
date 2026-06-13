import { provideBrowserGlobalErrorListeners, type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHexGuardUrlState } from '@hexguard/angular-url-state';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHexGuardUrlState(),
  ],
};
