import { provideHttpClient } from '@angular/common/http';
import { inject, provideBrowserGlobalErrorListeners, type ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HEXGUARD_PERMISSION_CONTEXT } from '@hexguard/angular-permissions';
import { provideHexGuardFeatureFlags } from '@hexguard/angular-feature-flags';
import { provideHexGuardUrlState } from '@hexguard/angular-url-state';
import { provideConsentManager, defaultConsentCategories } from '@hexguard/angular-consent-manager';

import { FEATURE_FLAG_DEMO_CATALOG } from './features/packages/angular/angular-feature-flags/data/feature-flags-demo.data';
import { PermissionsDemoSessionService } from './features/packages/angular/angular-permissions/data/permissions-demo.data';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideHexGuardUrlState(),
    provideHexGuardFeatureFlags(FEATURE_FLAG_DEMO_CATALOG),
    provideConsentManager({
      categories: defaultConsentCategories(),
      googleConsentMode: { enabled: false },
      consentExpiryDays: 365,
      tcfSupport: { cmpId: 999, cmpVersion: 1 },
    }),
    {
      provide: HEXGUARD_PERMISSION_CONTEXT,
      useFactory: () => inject(PermissionsDemoSessionService).context,
    },
  ],
};
